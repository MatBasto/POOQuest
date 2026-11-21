import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { buildBehaviorCheckSource, normalizeJavaOutput, VERIFIED_MARKER } from "@/lib/java-grader";

export const runtime = "nodejs";

type Judge0Response = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status?: { id?: number; description?: string };
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function executeJava(sourceCode: string, url: string, headers: Record<string, string>): Promise<Judge0Response> {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      source_code: sourceCode,
      language_id: Number(process.env.JUDGE0_JAVA_LANGUAGE_ID || 62),
      cpu_time_limit: 3,
      wall_time_limit: 8,
      memory_limit: 131072,
    }),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("El servicio de ejecución no está disponible en este momento.");
  return (await response.json()) as Judge0Response;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return jsonError("Inicia sesión antes de ejecutar Java.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("El formato de la solicitud no es válido.", 400);
  }

  if (!body || typeof body !== "object") return jsonError("Solicitud inválida.", 400);
  const { challengeId, sourceCode } = body as { challengeId?: unknown; sourceCode?: unknown };
  const id = Number(challengeId);
  if (!Number.isSafeInteger(id) || id < 1 || typeof sourceCode !== "string" || sourceCode.trim().length < 5) {
    return jsonError("Selecciona un reto y escribe una solución Java.", 400);
  }
  if (sourceCode.length > 20000) return jsonError("El código supera el límite de 20.000 caracteres.", 400);

  const { data: challenge } = await supabase
    .from("programming_challenges")
    .select("id,level_id,expected_output")
    .eq("id", id)
    .single();
  if (!challenge) return jsonError("No se encontró el reto solicitado.", 404);

  const [{ data: level }, { data: profile }, { data: requiredActivities }, { data: passedActivities }] = await Promise.all([
    supabase.from("levels").select("id,slug,required_xp").eq("id", challenge.level_id).single(),
    supabase.from("profiles").select("xp").eq("id", user.id).single(),
    supabase.from("activities").select("id").eq("level_id", challenge.level_id),
    supabase.from("activity_attempts").select("activity_id").eq("is_correct", true).eq("user_id", user.id),
  ]);

  if (!level || !profile || profile.xp < level.required_xp) return jsonError("El nivel aún está bloqueado.", 403);
  const completed = new Set((passedActivities || []).map((a) => a.activity_id));
  if ((requiredActivities || []).some((a) => !completed.has(a.id))) {
    return jsonError("Completa primero la misión interactiva para desbloquear el Jefe Java.", 403);
  }

  // El resultado aprobado solo puede registrarlo la ruta del servidor;
  // esta clave no se envía al navegador.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !supabaseUrl) {
    console.error("Faltan las variables SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_URL.");
    return jsonError("El evaluador está temporalmente sin configurar.", 503);
  }

  const { data: allowed, error: quotaError } = await supabase.rpc("reserve_java_execution");
  if (quotaError) {
    console.error("No está aplicada la migración v6_01_predeploy:", quotaError.message);
    return jsonError("El evaluador todavía no está habilitado.", 503);
  }
  if (!allowed) return jsonError("Alcanzaste el límite de ejecuciones. Inténtalo más tarde.", 429);

  const base = process.env.JUDGE0_URL;
  if (!base) return jsonError("El servicio Java no está configurado.", 503);

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.JUDGE0_RAPIDAPI_KEY) headers["X-RapidAPI-Key"] = process.env.JUDGE0_RAPIDAPI_KEY;
  if (process.env.JUDGE0_RAPIDAPI_HOST) headers["X-RapidAPI-Host"] = process.env.JUDGE0_RAPIDAPI_HOST;
  const endpoint = base.replace(/\/$/, "") + "/submissions?base64_encoded=false&wait=true";

  try {
    const first = await executeJava(sourceCode, endpoint, headers);
    let output = String(first.stdout ?? first.compile_output ?? first.stderr ?? first.message ?? "");
    let statusId = Number(first.status?.id || 0);
    let status = String(first.status?.description || "Procesado");
    let passed = statusId === 3 && normalizeJavaOutput(first.stdout) === normalizeJavaOutput(challenge.expected_output);
    let feedback: string | undefined;
    const behaviorSource = buildBehaviorCheckSource(level.slug, sourceCode);

    // La salida correcta es condición necesaria pero no suficiente.
    // Si el caso se compila sin el contrato de clases y métodos, nunca se aprueba.
    if (passed) {
      if (!behaviorSource) {
        passed = false;
        feedback = "Necesitas una clase Main y las clases del ejercicio para completar el reto.";
      } else {
        const checked = await executeJava(behaviorSource, endpoint, headers);
        passed = checked.status?.id === 3 && normalizeJavaOutput(checked.stdout) === VERIFIED_MARKER;
        if (!passed) {
          const raw = normalizeJavaOutput(checked.stdout ?? checked.compile_output ?? checked.stderr ?? checked.message);
          feedback = raw.includes("POOQUEST_TESTS_FAILED:")
            ? raw.split("POOQUEST_TESTS_FAILED:")[1]?.slice(0, 220).trim()
            : "La salida es correcta, pero las clases, los métodos o sus comportamientos no superaron las pruebas del reto.";
          status = "Pruebas de POO incompletas";
          // Deja la consola del programa visible; el mensaje de ayuda explica la diferencia.
        }
      }
    }

    const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error: saveError } = await admin.rpc("record_code_result_verified", {
      p_user_id: user.id,
      p_challenge_id: id,
      p_code: sourceCode,
      p_output: output.slice(0, 20000),
      p_status: status,
      p_passed: passed,
    });
    if (saveError) {
      console.error("No se pudo registrar la ejecución validada:", saveError.message);
      return jsonError("El programa se ejecutó, pero no se pudo guardar el resultado. Intenta de nuevo.", 503);
    }

    return NextResponse.json({ output, status, statusId, passed, feedback });
  } catch (error) {
    console.error("Fallo controlado al ejecutar Judge0:", error instanceof Error ? error.name : "unknown");
    return jsonError("No se pudo completar la ejecución Java. Tu código sigue disponible en el editor.", 502);
  }
}
