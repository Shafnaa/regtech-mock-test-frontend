import type { Route } from "./+types/login";

import { LoginForm } from "@/components/login-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function Login() {
  return <LoginForm />;
}

export default Login;
