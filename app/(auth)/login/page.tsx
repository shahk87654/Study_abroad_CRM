import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectedFrom?: string };
}) {
  return <LoginForm redirectTo={searchParams.redirectedFrom ?? "/crm"} />;
}
