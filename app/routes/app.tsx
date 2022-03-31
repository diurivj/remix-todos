import { Todo } from "@prisma/client";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { createTodo, getTodos, updateTodo } from "~/models/todo.server";
import { getUserId } from "~/session.server";
import checked from "~/assets/circle-check-solid.svg";
import unchecked from "~/assets/circle-regular.svg";

type LoaderData = {
  todos: Todo[];
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);

  const formData = await request.formData();
  const action = formData.get("action");
  const todoName = formData.get("todo-name");
  const todoId = formData.get("todo-id");
  const todoCompleted = formData.get("todo-completed");

  if (typeof action !== "string") {
    return json({ msg: "Invalid data" }, { status: 400 });
  }

  if (action === "create") {
    if (typeof todoName !== "string" || typeof userId !== "string") {
      return json({ msg: "Invalid data" }, { status: 400 });
    }

    await createTodo({ name: todoName, userId });
    return null;
  }

  if (action === "update") {
    if (typeof todoId !== "string" || typeof todoCompleted !== "string") {
      return json({ msg: "Invalid data" }, { status: 400 });
    }
    const newStatus = todoCompleted === "true" ? false : true;
    await updateTodo(todoId, newStatus);
    return null;
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");

  const todos = await getTodos(userId);
  const data: LoaderData = {
    todos,
  };
  return json(data, { status: 200 });
};

export default function App() {
  const { todos } = useLoaderData<LoaderData>();

  return (
    <main className="flex h-full flex-col items-start space-y-4 bg-amber-100 p-8">
      <h1 className="text-4xl font-bold">My Todos</h1>
      <div className="w-full">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex w-full items-center space-x-2 p-4 shadow-md"
          >
            <button
              type="submit"
              form={`update-todo-${todo.id}`}
              name="action"
              value="update"
            >
              <img
                className="h-5 w-5"
                src={todo.completed ? checked : unchecked}
                alt="todo-status"
              />
            </button>
            <p className="text-lg">{todo.name}</p>

            <Form
              id={`update-todo-${todo.id}`}
              method="post"
              className="sr-only"
            >
              <input
                type="text"
                name="todo-id"
                readOnly
                hidden
                className="sr-only"
                value={todo.id}
              />
              <input
                type="text"
                name="todo-completed"
                readOnly
                hidden
                className="sr-only"
                value={String(todo.completed)}
              />
            </Form>
          </div>
        ))}
      </div>

      <Form
        id="add-todo"
        method="post"
        className="absolute bottom-0 right-0 left-0 flex justify-between bg-black p-4 text-white"
      >
        <input type="text" name="todo-name" className="p-2 text-black" />
        <button
          type="submit"
          className="bg-white p-4 text-black"
          name="action"
          value="create"
        >
          Agregar
        </button>
      </Form>
    </main>
  );
}
