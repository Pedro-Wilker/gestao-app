import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateCategoryInput {
  name: string;
  type: string;
}

interface CategoryError extends Error {
  status?: number;
}

export async function createCategory(data: CreateCategoryInput): Promise<Category> {
  try {
    const category = await prisma.category.create({
      data: { name: data.name, type: data.type }
    });
    return category;
  } catch (error: any) {
    if (error.code === 'P2002') {
      const err: CategoryError = new Error('Nome da categoria já existe');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    include: { transactions: true }
  });
}

export async function getCategoryById(id: number): Promise<Category> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { transactions: true }
  });
  if (!category) {
    const error: CategoryError = new Error('Categoria não encontrada');
    error.status = 404;
    throw error;
  }
  return category;
}

export async function updateCategory(id: number, data: Partial<CreateCategoryInput>): Promise<Category> {
  try {
    const category = await prisma.category.update({
      where: { id },
      data
    });
    return category;
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: CategoryError = new Error('Categoria não encontrada');
      err.status = 404;
      throw err;
    } else if (error.code === 'P2002') {
      const err: CategoryError = new Error('Nome da categoria já existe');
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    await prisma.category.delete({
      where: { id }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err: CategoryError = new Error('Categoria não encontrada');
      err.status = 404;
      throw err;
    }
    throw error;
  }
}