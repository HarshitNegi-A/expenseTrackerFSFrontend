import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyRedirect = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");

    if (!orderId) {
      navigate("/premium-status?success=false&message=Missing+Order+ID");
      return;
    }

    // ✅ Send token for authentication
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:3000/premium/verify?order_id=${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // ✅ Redirect to premium status page after success
        localStorage.setItem("user", JSON.stringify(res.data.updatedUser));
        navigate(`/premium-status?success=true&order_id=${orderId}`);
      })
      .catch((err) => {
        // ❌ Redirect to premium status page with error message
        navigate(`/premium-status?success=false&message=Verification+failed`);
      });
  }, [location, navigate]);

  return <p>Verifying payment...</p>;
};

export default VerifyRedirect;
