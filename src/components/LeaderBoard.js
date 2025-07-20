import { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:3000/premium/leaderboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setLeaders(res.data))
    .catch(err => console.error("Leaderboard fetch error:", err));
  }, []);

  return (
    <div>
      <h2>🏆 Premium Leaderboard</h2>
      <ul>
        {leaders.map((user, index) => (
          <li key={user.id}>
            #{index + 1} — {user.name} (₹{user.totalExpenses})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
