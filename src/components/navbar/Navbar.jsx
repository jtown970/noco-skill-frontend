import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(true);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleAllSkillsClick = () => {
    if (pathname === "/gigs") {
      navigate("/gigs?search=");
      window.location.reload();
    } else {
      navigate("/gigs");
    }
  };

  return (
    <div className={active ? "navbar active" : "navbar"}>
      <div className="navbar">
        <div className="container">
          <div className="logo">
            <Link to="/" className="link">
              <img
                className="noco-logo"
                src="https://res.cloudinary.com/dk2a01h3i/image/upload/v1683305864/noco-skills-high-resolution-logo-white-on-transparent-background-sm_wghwec.png"
                alt=""
              />
            </Link>
          </div>
          <div className="links">
          <Link
              className="links"
              to="/gigs?search="
              onClick={handleAllSkillsClick}
            >
              <span>All Skills</span>
            </Link>
            {currentUser ? (
              <div className="user" onClick={() => setOpen(!open)}>
                <img
                  src={
                    currentUser.img ||
                    "https://res.cloudinary.com/dk2a01h3i/image/upload/v1682801127/profilePic2_u842zn.jpg"
                  }
                  alt="profile pic"
                />
                <span>{currentUser?.username}</span>
                {open && (
                  <div className="options">
                    {currentUser?.isSeller && (
                      <>
                        <Link className="link" to="/mygigs">
                          Gigs
                        </Link>
                        <Link className="link" to="/add">
                          Add New Gig
                        </Link>
                      </>
                    )}
                    <Link className="link" to="/orders">
                      Orders
                    </Link>
                    <Link className="link" to="/messages">
                      Messages
                    </Link>
                    <Link className="link" onClick={handleLogout}>
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="link">
                  Sign in
                </Link>
                <Link className="link" to="/register">
                  <button className="join">Join</button>
                </Link>
              </>
            )}
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}

export default Navbar;
