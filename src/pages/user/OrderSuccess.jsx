import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/orders");
    }, 3000);
  }, []);

  return (
    <div className="success-container">
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Redirecting to your orders...</p>
    </div>
  );
}
