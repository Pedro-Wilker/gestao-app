import { Request, Response } from 'express';
import * as categoryService from '../services/categories';

interface CreateCategoryInput {
  name: string;
  type: string;
}

export async function createCategory(req: Request, res: Response) {
  const data = req.body as CreateCategoryInput;
  try {
    const category = await categoryService.createCategory(data);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getCategoryById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const category = await categoryService.getCategoryById(parseInt(id));
    res.json(category);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body as Partial<CreateCategoryInput>;
  try {
    const category = await categoryService.updateCategory(parseInt(id), data);
    res.json(category);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await categoryService.deleteCategory(parseInt(id));
    res.status(204).send();
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}