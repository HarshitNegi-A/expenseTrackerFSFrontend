import { useEffect, useState } from "react";
import axios from "axios";

const PremiumStatus = ({ setUser }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:3000/premium/status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const updatedUser = res.data.user;
        setStatus(updatedUser.isPremium);

        // ✅ Update localStorage and App-level user state
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Status fetch error:", err);
        setError("Failed to fetch premium status.");
        setLoading(false);
      });
  }, [setUser]);

  if (loading) return <p>Loading your premium status...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Premium Status</h2>
      {status ? (
        <p>🎉 You are a Premium User</p>
      ) : (
        <p>🔒 You are not a Premium User</p>
      )}
    </div>
  );
};

export default PremiumStatus;
