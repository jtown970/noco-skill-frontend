import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Success.scss";

const Success = () => {
  const [paymentIntent, setPaymentIntent] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment_intent = params.get("payment_intent");

    const makeRequest = async () => {
      try {
        await newRequest.put("/orders", { payment_intent });
        setPaymentIntent(payment_intent);
      } catch (err) {
        console.log(err);
      }
    };

    if (payment_intent) {
      makeRequest();
    }
  }, [location.search, navigate, paymentIntent]);

  useEffect(() => {
    if (paymentIntent) {
      const timer = setTimeout(() => {
        navigate("/orders");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [navigate, paymentIntent]);

  return (
    <div className="success">
      {paymentIntent ? (
        <div className="message">
          Payment successful! <br />
          You are being redirected to the orders page. <br />
          Please do not close the page
        </div>
      ) : (
        <div className="message">Processing payment...</div>
      )}
    </div>
  );
};

export default Success;
