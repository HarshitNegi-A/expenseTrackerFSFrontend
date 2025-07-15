import { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";
import axios from "axios";

const ExpenseForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
  });

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch expenses on load
  useEffect(() => {
    axios
      .get("http://localhost:3000/expenses", config)
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error("Failed to fetch expenses", err));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/expenses/${id}`, config);

      const res = await axios.get("http://localhost:3000/expenses", config);
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to delete expense", err);
      alert("Something went wrong while deleting.");
    }
  };

  // Add new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/expenses", formData, config);

      const res = await axios.get("http://localhost:3000/expenses", config);
      setExpenses(res.data);

      // Reset form
      setFormData({
        amount: "",
        description: "",
        category: "",
      });
    } catch (error) {
      console.error("Failed to add expense", error);
      alert("Something went wrong while adding.");
    }
  };

  return (
    <>
      <form onSubmit={handleAddExpense}>
        <label>Money Spent:</label>
        <input
          type="number"
          name="amount"
          placeholder="Amount Spent"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <label>Description:</label>
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
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
        <button type="submit">Add Expense</button>
      </form>

      <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
    </>
  );
};

export default ExpenseForm;
