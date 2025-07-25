import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ExpenseForm from "./components/expense/ExpenseForm";
import SignUpForm from "./components/SignUpForm";
import PremiumStatus from "./components/PremiumStatus";
import VerifyRedirect from "./components/VerifyRedirect";
import Leaderboard from "./components/LeaderBoard";
import axios from "axios";
import ForgotPasswordForm from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";

// import Login from "./Login";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
   const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  setIsLoggedIn(!!token);

  if (token) {
    axios
      .get("http://localhost:3000/premium/status", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const userData = res.data.user; // your backend should return: { user: {...} }
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // optional: store for later use
      })
      .catch(err => {
        console.error("User fetch failed:", err);
        setUser(null); // clear user on error
      });
  } else {
    setUser(null);
  }
}, []);

  
  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user}  />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/expense"
          element={isLoggedIn ? <ExpenseForm setUser={setUser}  /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<SignUpForm setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
        />
        <Route path="/premium-status" element={isLoggedIn ? <PremiumStatus setUser={setUser}/> : <Navigate to="/login" />} />
        <Route path="/verify" element={<VerifyRedirect />} />
        <Route path="/leaderboard" element={isLoggedIn ? <Leaderboard /> : <Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
         <Route path="/password/resetpassword/:id" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
