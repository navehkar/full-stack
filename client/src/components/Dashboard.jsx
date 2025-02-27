import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import '../styles/Dashboard.css'
import { getTotalExpenses } from '../api/expense';
import { CURRENCY_SYMBOLS } from '../constants';
import { LineChart } from './charts';
import {BarChart} from './charts'
import { getTotalIncomes } from '../api/income';
export const Dashboard = () => {
  const {user} = useAuth();
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncomes, setTotalIncomes] = useState(0);
  useEffect(() => {
    const fetchTotalExpenses = async () => {
      try {
        const data = await getTotalExpenses(user.id);
        setTotalExpenses(data.total);
        console.log(data.total);
      } catch (error) {
        console.error('Error fetching total expenses:', error);
      }
    };
    const fetchTotalIncomes = async () => {
      try {
        const data = await getTotalIncomes(user.id);
        setTotalIncomes(data.total);
        console.log(data.total);
      } catch (error) {
        console.error('Error fetching total expenses:', error);
      }
    };
    fetchTotalIncomes();
    fetchTotalExpenses();
  }, []);

  return (
    <div className='dashboard'>
      <header className='dashboard-header'>
        <h1>Welcome {user.fullName}</h1>
      </header>

      <div className='summary'>
        <div className='card income'>
          <h2>Total Incomes</h2>
          <p>{CURRENCY_SYMBOLS['ILS']}{totalIncomes}</p>
        </div>

        <div className='card expenses'>
          <h2>Total Expenses</h2>
          <p>{CURRENCY_SYMBOLS['ILS']}{totalExpenses}</p>
        </div>

        <div className='card balance'>
          <h2>Total Balance</h2>
          <p>{CURRENCY_SYMBOLS['ILS']}{totalIncomes - totalExpenses}</p>
        </div>
      </div>
      <div className='charts'>
        <LineChart/>
        <BarChart/>
      </div>
    </div>
  );
};
