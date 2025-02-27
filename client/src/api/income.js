import api from './api';

export const createIncome = async (payload) => {
    try {
        const { userId, ...incomeData } = payload;
        const { data } = await api.post(`/add-income/${userId}`, incomeData);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while creating the income. Please try again.';
        throw new Error(message);
    } 
}

export const getIncomes = async (userId) => {
    try {
        const { data } = await api.get(`/get-incomes/${userId}`);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while fetching incomes. Please try again.';
        throw new Error(message);
    }
} 
export const getTotalIncomes = async (userId) => {
    try {
        const { data } = await api.get(`/get-total-incomes/${userId}`);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while fetching total incomes. Please try again.';
        throw new Error(message);
    }
}
export const deleteIncome = async (userId, incomeId) => {
    try {
        const { data } = await api.delete(`/delete-income/${userId}/${incomeId}`);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while deleting the income. Please try again.';
        throw new Error(message);
    }
}
export const updateIncome = async (incomeId, payload) => {
    try {
        const { data } = await api.patch(`/update-income/${payload.userId}/${incomeId}`, payload);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while updating the income. Please try again.';
        throw new Error(message);
    }
}