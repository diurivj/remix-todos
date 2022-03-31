import { Link } from "remix";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();

  return (
    <main className="flex h-full flex-col items-start space-y-4 bg-amber-100 p-8">
      <h1 className="text-4xl font-bold">Remix Todos</h1>
      <Link className="bg-white px-4 py-2 shadow-md" to="/app">
        {user ? "Entrar al app" : "Inicia sesion"}
      </Link>
    </main>
  );
}
