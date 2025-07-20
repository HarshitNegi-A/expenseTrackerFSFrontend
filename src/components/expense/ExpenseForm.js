import { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

let cashfree;

const ExpenseForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
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

  useEffect(() => {
    (async () => {
      try {
        cashfree = await load({ mode: "sandbox" });

        // Fetch expenses
        const expenseRes = await axios.get("http://localhost:3000/expenses", config);
        setExpenses(expenseRes.data);

        // Fetch premium status
        const premiumRes = await axios.get("http://localhost:3000/premium/status", config);
        setIsPremium(premiumRes.data.isPremium);

        // Handle payment verification if redirected from Cashfree
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get("order_id");

        if (orderId) {
          const verifyRes = await axios.get(
            `http://localhost:3000/premium/verify?order_id=${orderId}`,
            config
          );
          if (verifyRes.data.status === "PAID") {
            alert("✅ Transaction Successful");
            setIsPremium(true);
          } else if (verifyRes.data.status === "FAILED") {
            alert("❌ Transaction Failed");
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/expenses", formData, config);
      const res = await axios.get("http://localhost:3000/expenses", config);
      setExpenses(res.data);
      setFormData({ amount: "", description: "", category: "" });
    } catch (error) {
      console.error("Failed to add expense", error);
      alert("Something went wrong while adding.");
    }
  };

  const handlePremiumButton = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/premium/create-order",
        {},
        config
      );

      const sessionId = res.data.payment_session_id;

      if (!sessionId) {
        alert("Payment session ID not received.");
        return;
      }

      if (!cashfree) {
        alert("Cashfree SDK not loaded.");
        return;
      }

      cashfree.checkout(
        {
          paymentSessionId: sessionId,
          redirectTarget: "_self",
        },
        (event) => {
          console.log("Payment event:", event);
        }
      );
    } catch (err) {
      console.error("Buy premium error:", err);
      alert("Something went wrong while starting payment.");
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

      {!isPremium && (
        <button onClick={handlePremiumButton}>BUY PREMIUM MEMBERSHIP</button>
      )}

      {isPremium && <p>🌟 You are a premium user!</p>}

      <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
    </>
  );
};

export default ExpenseForm;
