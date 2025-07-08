import { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";
import axios from "axios";

const ExpenseForm=()=>{
    const [expenses,setExpenses]=useState([])
    const [formData,setFormData]=useState({
        amount:'',
        description:'',
        category:''
    })

    useEffect(() => {

      axios.get('http://localhost:3000/expenses')
        .then(res => setExpenses(res.data))
        .catch(err => console.error("Failed to fetch expenses", err));
    
  }, []);

    const handleChange=(e)=>{
        const {name,value}=e.target
        setFormData(prev=>({...prev,[name]:value}))
    }

   const handleAddExpense = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/expenses', {amout:formData.amount,description:formData.description,category:formData.category});
      
      const res = await axios.get('http://localhost:3000/expenses');
      setExpenses(res.data);
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

    return (
        <>
        <form onSubmit={handleAddExpense}>
            <label>Money Spent:</label>
            <input type="number" name='amount' placeholder='Amount Spent' value={formData.amount} onChange={handleChange} required />
            <label>Description:</label>
            <input  type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required />
            <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Petrol">Petrol</option>
        <option value="Salary">Salary</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Travel">Travel</option>
      </select>
      <button >Add Expense</button>
        </form>
        <ExpenseList expenses={expenses}/>
        </>
    )
}

export default ExpenseForm;