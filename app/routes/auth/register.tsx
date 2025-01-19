import type { Route } from "./+types/register";

import { RegisterForm } from "@/components/register-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function RegisterPage() {
  return <RegisterForm />;
}

export default RegisterPage;
