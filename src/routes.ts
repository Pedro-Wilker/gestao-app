import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from './controllers/users';
import { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } from './controllers/transactions';

const router = Router();

// Rotas de Usuários
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Rotas de Transações
router.post('/transactions', createTransaction);
router.get('/transactions', getTransactions);
router.get('/transactions/:id', getTransactionById);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;