import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import zxcvbn from 'zxcvbn';
import Terms from "./Terms";


function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'password') {
      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);
    }
  
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setPasswordError(true);
      return;
    }

     // Phone number validation
  const phoneNumberRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  if (!phoneNumberRegex.test(user.phone)) {
    setPhoneNumberError(true);
    return;
  }

    const url = await upload(file);
    try {
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="">Username</label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={handleChange}
          />
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label htmlFor="">Password</label>
          <input name="password" type="password" onChange={handleChange} />
          <div className="password-strength">
            {/* <label>Password Strength</label> */}
            <meter
              value={passwordStrength}
              max="4"
              className={`strength-${passwordStrength}`}
            />
          </div>
          <label htmlFor="">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            onChange={handleChange}
          />
          {passwordError && (
            <p className="error">Passwords do not match.</p>
          )}
          <label htmlFor="">Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="">Country</label>
          <input
            name="country"
            type="text"
            placeholder="e.g USA"
            onChange={handleChange}
          />
        </div>
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label htmlFor="">Activate the seller account</label>
            <label className="switch">
              <input
                type="checkbox"
                onChange={handleSeller}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="e.g 234 567 89"
            onChange={handleChange}
          />
          {phoneNumberError && (
            <p className="error">Invalid phone number format.</p>
          )}
          <label htmlFor="">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
          {/* <div className="terms-of-service">
            <input type="checkbox" />
            <label htmlFor="" onClick={handleOpenModal}>
              I agree to the Terms of Service
            </label>
          </div>
        <Terms isOpen={showModal} onClose={handleCloseModal} /> */}
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
