import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import '../styles/Income.css'
import { createIncome, deleteIncome, getIncomes, updateIncome } from '../api/income';
import { toast } from 'react-toastify';
import { CURRENCY_SYMBOLS } from '../constants'
import IncomeFilters from './IncomeFilters';
import { Filters } from './Filters';


export const Income = () => {
  const [isPending, setIsPending] = useState(false)
  const [incomes, setIncomes] = useState([])
  const [inputSearch, setInputSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const { user } = useAuth();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const tagRef = useRef(null);
  const currencyRef = useRef(null);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [isDeleting, setIsDeleting] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const maxAmount = incomes.length ?Math.max(...incomes.map(income => income.amount), 0):0;
  const resetFields = () => {
    titleRef.current.value = "";
    descriptionRef.current.value = "";
    amountRef.current.value = "";
    tagRef.current.value = "";
    currencyRef.current.value = "";
  }

  const fetchIncomes = async () => {
    try {
      const data = await getIncomes(user.id);
      setIncomes(data.incomes);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchIncomes();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current?.value;
    const tag = tagRef.current.value;
    const amount = amountRef.current.value;
    const currency = currencyRef.current.value;
    const payload = {
      userId: user.id,
      title,
      description,
      tag,
      amount: Number(amount),
      currency
    };

    try {
      setIsPending(true);
      let data;
      if (currentIncome) {
        data = await updateIncome(currentIncome._id, payload);
        setIncomes((prevIncomes) =>
          prevIncomes.map((income) =>
            income._id === currentIncome._id ? data.income : income
          )
        );
        toast.success(data.message);
      } else {
        data = await createIncome(payload);
        setIncomes((prevIncomes) => [...prevIncomes, data.income]);
        toast.success(data.message);
      }
      resetFields();
      
      setCurrentIncome(null);
    } catch (error) {
      toast.error("Failed to submit expense.");
    } finally {
      setIsPending(false);
    }
  };
    const handleDelete = async (incomeId) => {
      try {
        setIsDeleting(prev => ({ ...prev, [incomeId]: true }));
        await deleteIncome(user.id, incomeId);
        setIncomes((prevIncomes) => prevIncomes.filter(income => income._id !== incomeId));
        toast.success("income deleted successfully");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsDeleting(prev => ({ ...prev, [incomeId]: false }));
      }
    };
  
    const handleEditClick = (income) => {
      try {
        setIsEditing(prev => ({ ...prev, [income._id]: true }));
        setCurrentIncome(income);
        titleRef.current.value = income.title;
        descriptionRef.current.value = income.description || '';
        amountRef.current.value = income.amount;
        tagRef.current.value = income.tag;
        currencyRef.current.value = income.currency || 'ILS';
        
      } catch (error) {
        console.error("Error in handleEditClick:", error);
        toast.error("Failed to load expense for editing.");
      }finally {
        setIsEditing(prev => ({ ...prev, [income._id]: false }));
      }
    };

  // Filter incomes based on the search input and selected filter
  const filteredIncomes = incomes.filter(income => {
    const matchSearch = income.title.toLowerCase().includes(inputSearch.toLowerCase());
    if (selectedFilter && selectedFilter.type === 'amount') {
      return matchSearch && income.amount >= selectedFilter.min && income.amount <= selectedFilter.max;
    }
    return matchSearch;
  });

  return (
    <main className='income-container'>
      <h1>Incomes</h1>
 
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title'>Title</label>
          <input type='text' ref={titleRef} id='title' placeholder='Enter the title' required />
        </div>
        <div>
          <label htmlFor='description'>Description</label>
          <input type='text' ref={descriptionRef} id='description' placeholder='Enter the description' />
        </div>
        <div>
          <label htmlFor='amount'>Amount</label>
          <input type='number' ref={amountRef} inputMode='numeric' id='amount' placeholder='Enter the amount' required />
        </div>
        <div>
          <label htmlFor='tag'>Tag</label>
          <select id="tag" ref={tagRef} required>
            <option value="salary">Salary</option>
            <option value="bonus">Bonus</option>
            <option value="gift">Gift</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor='currency'>Currency</label>
          <select id="currency" ref={currencyRef} required>
            <option value="ILS">ILS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <button type='submit' className='income-button' disabled={isPending}>{currentIncome ? 'Edit Expense' : 'Add Expense'}</button>
      </form>
      <Filters inputSearch={inputSearch} setInputSearch={setInputSearch} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} maxAmount={maxAmount}/>
      {filteredIncomes.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Tag</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        
          {filteredIncomes.length > 0 ? (
            filteredIncomes.map((income) => (
              <tr key={income._id}>
                <td>{income.title}</td>
                <td>{income.description}</td>
                <td>{income.amount} {CURRENCY_SYMBOLS[income.currency]}</td>
                <td>{income.tag}</td>
                <td>
                  <div className='action-buttons'>
                    <button className='edit-button' onClick={() => handleEditClick(income)} disabled={isEditing[income._id] || isDeleting[income._id]}>Edit</button>
                    <button className='delete-button' onClick={() => handleDelete(income._id)} disabled={isDeleting[income._id] || isEditing[income._id]}>Delete</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No matching incomes found.</td>
            </tr>
          )}
        </tbody>
      </table> ) : inputSearch ? (
        <div className='no-expenses-message'>
          No matching incomes found for "{inputSearch}".
        </div>
      ):(
        <div className='no-expenses-message'>
          No incomes found.
        </div>
      )}
    </main>
  );
}