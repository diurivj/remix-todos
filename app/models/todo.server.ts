import { Todo, User } from "@prisma/client";
import { prisma } from "~/db.server";

export const getTodos = async (userId: User["id"]) => {
  return prisma.todo.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

type CreateTodoPayload = {
  name: string;
  userId: User["id"];
};

export const createTodo = async ({ name, userId }: CreateTodoPayload) => {
  return prisma.todo.create({
    data: {
      name,
      completed: false,
      userId,
    },
  });
};

export const updateTodo = async (id: Todo["id"], newStatus: boolean) => {
  return prisma.todo.update({
    where: { id },
    data: {
      completed: newStatus,
    },
  });
};
