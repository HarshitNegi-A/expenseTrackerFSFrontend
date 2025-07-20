import { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

const ExpenseForm = ({ setUser }) => {
  const [expenses, setExpenses] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [cashfree, setCashfree] = useState(null);
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
    const initializeApp = async () => {
      try {
        const cf = await load({ mode: "sandbox" });
        setCashfree(cf);

        const expenseRes = await axios.get("http://localhost:3000/expenses", config);
        setExpenses(expenseRes.data);

        const premiumRes = await axios.get("http://localhost:3000/premium/status", config);
        const premiumUser = premiumRes.data.user;
        setIsPremium(premiumUser?.isPremium || false);

        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get("order_id");

        if (orderId) {
          const verifyRes = await axios.get(
            `http://localhost:3000/premium/verify?order_id=${orderId}`,
            config
          );

          const status = verifyRes.data.status;
          if (status === "PAID") {
            alert("✅ Transaction Successful");

            const updatedUserRes = await axios.get("http://localhost:3000/premium/status", config);
            const updatedUser = updatedUserRes.data.user;

            setIsPremium(true);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            if (setUser) setUser(updatedUser);
          } else if (status === "FAILED") {
            alert("❌ Transaction Failed");
          } else {
            alert(`⚠️ Transaction Status: ${status}`);
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };

    initializeApp();
  }, [setUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handlePremiumButton = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/premium/create-order",
        {},
        config
      );

      const sessionId = res.data.payment_session_id;

      if (!sessionId) {
        alert("❌ Payment session ID not received.");
        return;
      }

      if (!cashfree) {
        alert("❌ Cashfree SDK not loaded. Please refresh the page.");
        return;
      }

      cashfree.checkout(
        {
          paymentSessionId: sessionId,
          redirectTarget: "_self",
        },
        (event) => {
          console.log("💳 Payment event:", event);
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

      {!isPremium ? (
        <button onClick={handlePremiumButton}>BUY PREMIUM MEMBERSHIP</button>
      ) : (
        <p>🌟 You are a premium user!</p>
      )}

      <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
    </>
  );
};

export default ExpenseForm;
