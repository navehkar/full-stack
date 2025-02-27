const { addExpense, getExpenses, deleteExpense, updateExpense ,getTotalExpenses } = require('../controllers/expense');
const router = require('express').Router();


router.post('/add-expense/:userId', addExpense);
router.get('/get-expenses/:userId', getExpenses);
router.delete('/delete-expense/:userId/:expenseId', deleteExpense);
router.get("/get-total-expenses/:userId", getTotalExpenses);
router.patch('/update-expense/:userId/:expenseId', updateExpense);
module.exports = router;