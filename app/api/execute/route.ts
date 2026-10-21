import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
function normalize(s:string){return s.replace(/\r\n/g,"\n").trim();}
export async function POST(request:Request){
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)return NextResponse.json({error:"Sesión requerida"},{status:401});
  const {challengeId,sourceCode}=await request.json(); if(!challengeId||typeof sourceCode!=="string"||sourceCode.length<5)return NextResponse.json({error:"Solicitud inválida"},{status:400});
  if(sourceCode.length>20000)return NextResponse.json({error:"El código supera el límite permitido"},{status:400});
  const {data:challenge}=await supabase.from("programming_challenges").select("id,expected_output").eq("id",Number(challengeId)).single(); if(!challenge)return NextResponse.json({error:"Reto no encontrado"},{status:404});
  const base=process.env.JUDGE0_URL; if(!base)return NextResponse.json({error:"Configura JUDGE0_URL en .env.local"},{status:503});
  const headers:Record<string,string>={"Content-Type":"application/json"}; if(process.env.JUDGE0_RAPIDAPI_KEY)headers["X-RapidAPI-Key"]=process.env.JUDGE0_RAPIDAPI_KEY; if(process.env.JUDGE0_RAPIDAPI_HOST)headers["X-RapidAPI-Host"]=process.env.JUDGE0_RAPIDAPI_HOST;
  try{
    const response=await fetch(`${base.replace(/\/$/,"")}/submissions?base64_encoded=false&wait=true`,{method:"POST",headers,body:JSON.stringify({source_code:sourceCode,language_id:Number(process.env.JUDGE0_JAVA_LANGUAGE_ID||62)})});
    const j=await response.json(); if(!response.ok)throw new Error(j?.message||"Judge0 rechazó la solicitud"); const output=String(j.stdout||j.compile_output||j.stderr||j.message||""); const status=String(j.status?.description||"Procesado"); const passed=j.status?.id===3&&normalize(output)===normalize(challenge.expected_output);
    const {error}=await supabase.rpc("record_code_result",{p_challenge_id:Number(challengeId),p_code:sourceCode,p_output:output,p_status:status,p_passed:passed}); if(error)console.error(error);
    return NextResponse.json({output,status,passed});
  }catch(e:any){return NextResponse.json({error:`No fue posible ejecutar Java: ${e.message}`},{status:502});}
}
