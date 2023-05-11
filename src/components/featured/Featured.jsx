import React, { useState } from "react";
import "./Featured.scss";
import { Link, useNavigate } from "react-router-dom";

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>Skill</span> to learn or improve!
          </h1>
          <div for="search" className="search">
            <div className="searchInput">
              <img src="https://res.cloudinary.com/dk2a01h3i/image/upload/v1682801868/search_hsl6pq.png" alt="" />
              <input
                type="text"
                placeholder='ex: Cooking'
                onChange={(e) => setInput(e.target.value)}
                id="search"
                onKeyPress={handleKeyPress}
              />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <Link to="/gigs?search=golf">
            <button>Golf</button>
            </Link>
            <Link to="/gigs?search=cooking">
            <button>Cooking</button>
            </Link>
            <Link to="/gigs?search=snowboarding">
            <button>Snowboarding</button>
            </Link>
          </div>
        </div>
        <div className="right">
          <img src="../skillImg2.jpg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
