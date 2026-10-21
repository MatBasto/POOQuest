import { AuthForm } from "@/components/auth/AuthForm";
export default function LoginPage() {
  return <div className="auth-page"><section className="auth-art"><div className="kicker">Aprende jugando</div><h1 className="title">POO<span style={{color:"#6aaeff"}}>Quest</span></h1><p className="subtitle">Domina abstracción, encapsulamiento, herencia y polimorfismo con niveles, retos Java, retroalimentación y recompensas.</p></section><section className="auth-form-wrap"><AuthForm/></section></div>;
}
