import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNoTeachers, setShowNoTeachers] = useState(false); // New state to track the "No teachers found" message
  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        }),
  });
  console.log(data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setSearchQuery(input);
    navigate(`/gigs?search=${input}`);
  };
  

  useEffect(() => {
    if (searchQuery) {
      window.location.reload();
    }
  }, [searchQuery]);
  
  useEffect(() => {
    if (data?.length === 0) {
      setShowNoTeachers(true);
      const timer = setTimeout(() => {
        setShowNoTeachers(false);
        navigate(`/gigs?search=`);
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [data, navigate]);

  return (
    <div className="gigs">
      <div className="container">
        <Link className="link" to="/">
          Home
        </Link>
        <h1>Skills</h1>
        {/* <p>Learn a new skill</p> */}
        <div for="search" className="search">
          <div className="searchInput">
            <img
              src="https://res.cloudinary.com/dk2a01h3i/image/upload/v1682801868/search_hsl6pq.png"
              alt=""
            />
            <input
              type="text"
              placeholder="ex: Cooking"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              id="search"
              onKeyPress={handleKeyPress}
            />
          </div>
          <button onClick={handleSubmit}>Search</button>
        </div>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy" onClick={() => setOpen(!open)}>Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="https://res.cloudinary.com/dk2a01h3i/image/upload/v1682807271/downarrow_no8lp3.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                  )}
                  {/* <span onClick={() => reSort("sales")}>Popular</span> */}
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading ? (
            "loading"
          ) : error ? (
            "Something went wrong!"
          ) : (data ?? []).length === 0 ? (
            <div>
              {showNoTeachers && (
                <div className="noTeachers">
                 <h2>Sorry, no teachers found - Redirecting...</h2>
                </div>
              )}
            </div>
          ) : (
            data.map((gig) => <GigCard key={gig._id} item={gig} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default Gigs;