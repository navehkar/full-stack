import { Route, Routes } from 'react-router';
import {ToastContainer} from 'react-toastify'
import {  Dashboard, Navbar, useAuth,AuthForm ,Expenses, Income,Loading} from './components';
import { LoaderCircle } from 'lucide-react';
import './styles/App.css'
 function App() {
    const {isLoggedIn, user, isPending} = useAuth()

    if(isPending){
      return ( <Loading/>)
    }

    
    return (
        <>
        {isLoggedIn? <Navbar/>:null}
        <Routes>
            <Route path="/auth" element={<AuthForm/>}/>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/add-expenses" element={<Expenses/>}/>
            <Route path="/add-income" element={<Income/>}/>
        </Routes>
          <ToastContainer position='top-right' theme='colored' autoClose={5000}/>
         
        </>
      )
}
export default App;
