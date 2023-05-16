import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51N2EDuJWQA97TH8Q5ic34ps4yvgmrEoxICL4DhImkDQs0Isk8vuRH9hSzR2nwlopwD9jZpyBQRfRjeNyGj5wCdaB00hx1GCFOq"
);

const Pay = ({ dataUsername, appointment }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const getGigs = async () => {
      let sellerId;
      try {
        const response = await newRequest.get(`/gigs/single/${id}`);
        sellerId = response.data.userId;
        console.log("sellerId", sellerId);
      } catch (err) {
        console.log(err);
      }
      try {
        const response = await newRequest.get(`/users/${sellerId}`);
        const sellerEmail = response.data.email;
        console.log("sellerEmail", sellerEmail);
      } catch (err) {
        console.log(err);
      }
    };
    getGigs();
  }, [id]);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const totalPrice = urlParams.get("totalPrice");
        setTotalPrice(totalPrice);
        const res = await newRequest.post(`/orders/create-payment-intent/${id}?totalPrice=${totalPrice}`);
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  }, [appointment, id]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="pay">
      <h4>Payments handled by</h4>
      <img src="https://res.cloudinary.com/dk2a01h3i/image/upload/v1684266292/stripelogo_pid8uw.png" alt="stripe payments" />
      <br/>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
      <h4>Total Price: ${totalPrice}</h4>
    </div>
  );
};

export default Pay;
