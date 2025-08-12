import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateUserInput {
  email: string;
  name?: string;
}

interface UserError extends Error {
  status?: number;
}

export async function createUser(data: CreateUserInput): Promise<User> {
  if (!data.email) {
    const error: UserError = new Error('Email é obrigatório');
    error.status = 400;
    throw error;
  }
  try {
    const user = await prisma.user.create({
      data: { email: data.email, name: data.name }
    });
    return user;
  } catch (error: any) {
    if (error.code === 'P2002') {
      const err: UserError = new Error('Email já existe');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany({
    include: { transactions: true }
  });
}

export async function getUserById(id: number): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { transactions: true }
  });
  if (!user) {
    const error: UserError = new Error('Usuário não encontrado');
    error.status = 404;
    throw error;
  }
  return user;
}

export async function updateUser(id: number, data: CreateUserInput): Promise<User> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { email: data.email, name: data.name }
    });
    return user;
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: UserError = new Error('Usuário não encontrado');
      err.status = 404;
      throw err;
    } else if (error.code === 'P2002') {
      const err: UserError = new Error('Email já existe');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: UserError = new Error('Usuário não encontrado');
      err.status = 404;
      throw err;
    }
    throw error;
  }
}