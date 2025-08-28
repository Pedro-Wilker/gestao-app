import { Router } from 'express';
   import { authMiddleware } from './middleware/auth';
   import { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser } from './controllers/users/users';
   import { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } from './controllers/transactions/transactions';
   import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "./controllers/categories/categories"
   import { createAccount, getAccounts, getAccountById, updateAccount, deleteAccount } from './controllers/accounts/accounts';
   import { createIncomeSource, getIncomeSources, getIncomeSourceById, updateIncomeSource, deleteIncomeSource } from "./controllers/income-sources/income-sources";

   const router = Router();

   // Rotas públicas (registro e login)
   router.post('/users', createUser); // Registro
   router.post('/login', loginUser); // Login

   // Rotas protegidas (aplique middleware)
   router.use(authMiddleware); // Protege todas abaixo

   // Usuários protegidos
   router.get('/users', getUsers);
   router.get('/users/:id', getUserById);
   router.put('/users/:id', updateUser);
   router.delete('/users/:id', deleteUser);

   // Transações
   router.post('/transactions', createTransaction);
   router.get('/transactions', getTransactions);
   router.get('/transactions/:id', getTransactionById);
   router.put('/transactions/:id', updateTransaction);
   router.delete('/transactions/:id', deleteTransaction);

   // Categorias
   router.post('/categories', createCategory);
   router.get('/categories', getCategories);
   router.get('/categories/:id', getCategoryById);
   router.put('/categories/:id', updateCategory);
   router.delete('/categories/:id', deleteCategory);

   // Contas
   router.post('/accounts', createAccount);
   router.get('/accounts', getAccounts);
   router.get('/accounts/:id', getAccountById);
   router.put('/accounts/:id', updateAccount);
   router.delete('/accounts/:id', deleteAccount);

   // Fontes de Renda
   router.post('/income-sources', createIncomeSource);
   router.get('/income-sources', getIncomeSources);
   router.get('/income-sources/:id', getIncomeSourceById);
   router.put('/income-sources/:id', updateIncomeSource);
   router.delete('/income-sources/:id', deleteIncomeSource);

   export default router;