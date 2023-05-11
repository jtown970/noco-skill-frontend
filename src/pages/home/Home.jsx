import React, { useState } from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import Slideshow from "./Slideshow";

const slides = [
  {
    image: "https://res.cloudinary.com/dk2a01h3i/image/upload/v1683645857/nocoSkills/uxrnlhf0ynfiwhslxt6z.png",
    title: "How it Works",
    description: {
      one: <span><strong className="less-strong">Discover and Improve:</strong> Find and enhance your skills with Noco Skills.</span>,
      two: <span><strong className="less-strong">Search:</strong> Search or click "All Skills" to explore options.</span>,
      three: <span><strong className="less-strong">Details:</strong> Click on skill of interest for more information.</span>,
      four: <span><strong className="less-strong">Booking:</strong> Use the slider to select hours.</span>,
      five: <span><strong className="less-strong">Request and Confirm:</strong> Send a calendar request after checking availability.</span>,
      six: <span><strong className="less-strong">Payments:</strong> Make secure payment by clicking "Continue."</span>,
      seven: <span><strong className="less-strong">Stay Connected:</strong> Communicate with teachers and clarify details in your orders.</span>,
      eight: <span><strong className="less-strong">Safety:</strong> In your Calendar event, you'll find a link for a Google Meet call. Take the opportunity to connect virtually, get to know each other, and establish a level of comfort before meeting in person.</span>,
    },
  },
  {
    image: "https://res.cloudinary.com/dk2a01h3i/image/upload/v1683747419/cooking_nkkahu.jpg",
    title: "Cooking",
    description: "For example, why not embark on a skill that the whole family can appreciate, like the art of cooking? Start to explore the culinary world and discover the joy of preparing delicious meals that will bring smiles to everyone's faces.",
  },
  {
    image: "https://res.cloudinary.com/dk2a01h3i/image/upload/v1683745203/map-noco-fade_lekv0d.jpg",
    title: "Location",
    description: "While we're primarily focused on expanding in northern Colorado, we welcome everyone to sign up and join us! let's learning, building, and improving our skills!",
  },
];

function Home() {
  const [selectedFAQ, setSelectedFAQ] = useState(""); // State to keep track of selected FAQ

  const handleFAQSelect = (event) => {
    setSelectedFAQ(event.target.value); // Update selected FAQ on dropdown change
  };

  return (
    <div>
      <Featured />
      <div>
        <Slideshow slides={slides} />
      </div>
      <div className="about-section">
        <div className="about-left">
          <h2>About</h2>
          <p>Noco Skills helps people find the perfect skill to learn. <br/> Our goal it to make finding private teacher easy.  There are so many talented people in the craft that we can learn from in our community </p>
          <div className="faq-dropdown">
            <h3>FAQs</h3>
            <select value={selectedFAQ} onChange={handleFAQSelect}>
              <option value="">Select FAQ</option>
              <option value="faq1">FAQ 1</option>
              <option value="faq2">FAQ 2</option>
              <option value="faq3">FAQ 3</option>
            </select>
            <div className="faq-content">
              {selectedFAQ === "faq1" && (
                <div className="faq">
                  <h4>FAQ 1</h4>
                  <p>Answer to FAQ 1 goes here</p>
                </div>
              )}
              {selectedFAQ === "faq2" && (
                <div className="faq">
                  <h4>FAQ 2</h4>
                  <p>Answer to FAQ 2 goes here</p>
                </div>
              )}
              {selectedFAQ === "faq3" && (
                <div className="faq">
                  <h4>FAQ 3</h4>
                  <p>Answer to FAQ 3 goes here</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="about-right">
          <img
            src="https://res.cloudinary.com/dk2a01h3i/image/upload/v1683303941/noco-skills-logo_kfihe7.png"
            alt="Logo"
          />
        </div>
      </div>
      
    </div>
  );
}

export default Home;
