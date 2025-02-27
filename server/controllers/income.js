const { z } = require('zod');
const User = require('../models/user');
const { userIdValidation} = require('../lib/validation/user');
const { incomeSchema, incomeIdValidation } = require('../lib/validation/income');
const Income = require('../models/income');
const income = require('../models/income');

const addIncome = async (req, res) =>{
    try {
        if(!req.user._id.equals(req.params.userId)){
            return res.status(403).json({message: 'Forbidden'});
        }
        const userId = userIdValidation.parse( req.params.userId);
        const {title, description, amount, tag, currency} = incomeSchema.parse( req.body);



        const userExists = await User.findById(userId);
        if(!userExists){
            return res.status(404).json({message: 'User not found'})
        }
        const BASE_CURRENCY ='ILS';
        let exchangedAmount;
        if(currency !== BASE_CURRENCY){
            const response = await fetch(
                `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${currency}/${BASE_CURRENCY}/${amount}`
                );
                if(!response.ok){
                    return res.status(400).json({message: 'Failed to exchange'})
                }
                const data = await response.json();
                exchangedAmount = data.conversion_result;
        }else{
            exchangedAmount=amount; 
        }
        const income = new Income({
            title,
            description,
            amount,
            tag,
            currency,
            exchangedAmount,
        })
        await income.save();

        userExists.incomes.push(income._id);
        
        await userExists.save();

        return res.status(201).json({message:'Income added successfully', income});
    }
    catch (error) {
        console.log(error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'internal server error' });
    }
}
const getIncomes = async (req, res) => {
    try {
        const userId = userIdValidation.parse(req.params.userId);
        const userExists = await User.findById(userId);
        if(!userExists){
            return res.status(404).json({message: 'User not found'})
        }
        const incomes = await Income.find({_id: {$in: userExists.incomes}});
        return res.status(200).json({incomes});
    }
    catch (error) {
        console.log(error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'internal server error' });
    }
}
const deleteIncome = async (req, res) => {
    try {
        // אימות תקפות של מזהה המשתמש ומזהה ההוצאה מהבקשה
        const userId = userIdValidation.parse(req.params.userId);
        const incomeId = incomeIdValidation.parse(req.params.incomeId);

        // בדיקה אם המשתמש קיים
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" }); // החזרת הודעה אם המשתמש לא נמצא
        }

        // בדיקה אם ההוצאה קיימת ברשימת המשתמש
        if (!userExists.incomes.includes(incomeId)) {
            return res.status(404).json({ message: "Income not found" }); // החזרת הודעה אם ההוצאה לא נמצאה
        }

        // מחיקת ההוצאה ממסד הנתונים
        const deletedIncome = await Income.findByIdAndDelete(incomeId);

        if (!deletedIncome) {
            return res.status(404).json({ message: "Income not deleted" }); // החזרת הודעה אם ההוצאה לא נמחקה
        }

        return res.status(200).json({ message: "Income deleted successfully" }); // החזרת הודעת הצלחה
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message }); // טיפול בשגיאות אימות
        }
        return res.status(500).json({ message: "Internal server error" }); // טיפול בשגיאות שרת כלליות
    }
}
const updateIncome = async (req, res) => {
    try {
        const userId = userIdValidation.parse(req.params.userId);
        const incomeId = incomeIdValidation.parse(req.params.incomeId);
        const { title, description, amount, tag, currency } = incomeSchema.parse(req.body);
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }
        const incomeExists = await Income.findOne({ _id: incomeId });

        if (!incomeExists) {
            return res.status(404).json({ message: 'Income not found' });
        }
        if (!userExists.incomes.includes(incomeId)) {
            return res.status(404).json({ message: "Income not found" });
        }

        let exchangedAmount = amount;
        const BASE_CURRENCY = 'ILS';
        if (incomeExists.amount !== amount || incomeExists.currency !== currency) {
        if (currency !== BASE_CURRENCY) {
            try {
                const response = await fetch(
                    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${currency}/${BASE_CURRENCY}/${amount}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch exchange rate');
                }
                const data = await response.json();
                exchangedAmount = data.conversion_result;
            } catch (error) {
                console.error("Exchange rate error:", error);
                return res.status(500).json({ message: "Failed to convert currency" });
            }
        }}

        const updatedIncome = await Income.findByIdAndUpdate(
            incomeId,
            {
                title,
                description,
                amount,
                tag,
                currency,
                exchangedAmount
            },
            { new: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({ message: "Income not found" });
        }

        return res.status(200).json({ 
            message: "Income updated successfully",
            income: updatedIncome 
        });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: "Internal server error" });
    } 
}
const getTotalIncomes = async (req, res) => {
    try {
        const userId = userIdValidation.parse(req.params.userId);
        
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const incomes = await Income.find({ _id: { $in: userExists.incomes } });
        
        // Calculate total using exchangedAmount
        const totalIncomes = incomes.reduce((total, income) => {
            return total + income.exchangedAmount;
        }, 0);

        return res.status(200).json({ 
            total: totalIncomes,
            currency: 'ILS'
        });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports={
    addIncome,
    getIncomes,
    deleteIncome,
    updateIncome,
    getTotalIncomes,
}