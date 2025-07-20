// PremiumStatus.js
import { useEffect, useState } from "react";
import axios from "axios";

const PremiumStatus = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/premium/status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStatus(res.data.isPremium))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Premium Status</h2>
      {console.log(status)}
      {status  ? (
        <p>🎉 You are a Premium User</p>
      ) : (
        <p>🔒 You are not a Premium User</p>
      )}
    </div>
  );
};

export default PremiumStatus;
