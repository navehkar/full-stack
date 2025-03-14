import api from './api'

export const signUp =async (payload)=>{
    try {
        const {data} = await api.post('/sign-up', payload);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while signing up. Please try again.';
        throw new Error(message);
    } 
}
export const signIn =async (payload)=>{
    try {
        const {data} = await api.post('/sign-in', payload);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while signing in. Please try again.';
        throw new Error(message);
    } 
}
export const logOut =async ()=>{
    try {
       await api.post('/sign-out');
       window.location.href = '/auth'
        
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while signing out. Please try again.';
        throw new Error(message);
    } 
}
export const me =async ()=>{
    try {
        const {data} = await api.get('/me');
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while fetching user date. Please try again.';
        throw new Error(message);
    } 
}