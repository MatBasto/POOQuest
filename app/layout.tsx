import type { Metadata } from "next";
import "./globals.css";
import "./v7.css";

export const metadata: Metadata = {
  title: "POOQuest",
  description: "Aprende Programación Orientada a Objetos de forma interactiva"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
