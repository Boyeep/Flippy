import { AuthFormShell } from "@/features/auth/components/auth-form-shell";

export default function SignUpPage() {
  return (
    <AuthFormShell
      title="Create your account"
      description="Daftar untuk mulai belajar dengan alur yang lebih ringan, cepat, dan menyenangkan."
      submitLabel="Sign up"
      footerText="Sudah punya akun?"
      footerLinkLabel="Login"
      footerLinkHref="/login"
      fields={[
        { id: "username", label: "Username", type: "text", placeholder: "Enter your username" },
        { id: "email", label: "Email", type: "email", placeholder: "Enter your email" },
        { id: "password", label: "Password", type: "password", placeholder: "Enter your password" },
      ]}
    />
  );
}
