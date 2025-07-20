import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ExpenseTracker from "./components/expense/ExpenseForm";
import SignUpForm from "./components/SignUpForm";
import PremiumStatus from "./components/PremiumStatus";
import VerifyRedirect from "./components/VerifyRedirect";
// import Login from "./Login";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/expense"
          element={isLoggedIn ? <ExpenseTracker setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<SignUpForm setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/premium-status" element={isLoggedIn ? <PremiumStatus/> : <Navigate to="/login" />} />
        <Route path="/verify" element={<VerifyRedirect/>} />

      </Routes>
    </Router>
  );
};

export default App;
