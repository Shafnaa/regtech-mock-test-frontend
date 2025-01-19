import type { Route } from "./+types/profile";

import { Welcome } from "@/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Profile() {
  return <Welcome />;
}
