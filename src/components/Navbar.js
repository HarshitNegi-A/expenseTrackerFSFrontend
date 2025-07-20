import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#eee" }}>
      <div>
        <Link to="/">Home</Link> | <Link to="/expense">Expense Tracker</Link> | <Link to="/premium-status">Premium</Link>

      </div>
      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login / Signup</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
