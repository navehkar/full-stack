const { addIncome, getIncomes, deleteIncome, updateIncome, getTotalIncomes } = require('../controllers/income');

const router = require('express').Router();

router.post('/add-income/:userId', addIncome);
router.get('/get-incomes/:userId', getIncomes);
router.delete('/delete-income/:userId/:incomeId', deleteIncome);
router.patch('/update-income/:userId/:incomeId', updateIncome);
router.get('/get-total-incomes/:userId', getTotalIncomes)
module.exports = router;