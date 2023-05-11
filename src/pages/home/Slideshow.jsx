import React, { useState } from "react";
import "./Slideshow.scss";

const Slideshow = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const handlePreviousSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="slideshow">
      <div className="slider">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className={index === currentSlide ? "active" : ""}
          />
        ))}
        <button className="prev" onClick={handlePreviousSlide}>
          &lt;
        </button>
        <button className="next" onClick={handleNextSlide}>
          &gt;
        </button>
      </div>
      <div className="text">
        <h3>{slides[currentSlide].title}</h3>
        <ol className="disc-list">
          {/* <li className="disc-item">{slides[currentSlide].description.one}</li> */}
          <li className="disc-item">{slides[currentSlide].description.two}</li>
          <li className="disc-item">{slides[currentSlide].description.three}</li>
          <li className="disc-item">{slides[currentSlide].description.four}</li>
          <li className="disc-item">{slides[currentSlide].description.five}</li>
          <li className="disc-item">{slides[currentSlide].description.six}</li>
          <li className="disc-item">{slides[currentSlide].description.seven}</li>
          <li className="disc-item">{slides[currentSlide].description.eight}</li>
        </ol>
      </div>
    </div>
  );
};

export default Slideshow;
