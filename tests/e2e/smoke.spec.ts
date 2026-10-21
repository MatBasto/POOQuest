import { test, expect } from "@playwright/test";
test("muestra pantalla de acceso", async ({page})=>{ await page.goto("/login"); await expect(page.getByText("POOQuest",{exact:false}).first()).toBeVisible(); await expect(page.getByRole("button",{name:"Entrar a POOQuest"})).toBeVisible(); });
test("ruta privada redirige sin sesión", async ({page})=>{ await page.goto("/dashboard"); await expect(page).toHaveURL(/\/login/); });
