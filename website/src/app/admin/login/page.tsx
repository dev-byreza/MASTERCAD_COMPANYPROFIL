import Link from "next/link";
import { LoginForm } from "@/components/login-form";
export const metadata = {
  title: "Login Admin",
  robots: { index: false, follow: false },
};
export default function Login() {
  return (
    <main className="login-page">
      <div className="login-box">
        <Link href="/">
          <img
            className="login-logo"
            src="/assets/logo-horizontal-black.png"
            alt="MasterCAD"
            width="160"
            height="53"
          />
        </Link>
        <h1>Content workspace.</h1>
        <p>
          Kelola konten website dan tindak lanjuti konsultasi dari satu tempat.
        </p>
        <LoginForm />
        <Link className="text-link" href="/">
          Kembali ke website
        </Link>
      </div>
    </main>
  );
}
