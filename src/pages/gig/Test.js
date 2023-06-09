import React, { useState, useEffect } from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import CalendarPicker from "../../components/calendar/Calendar";
import Supa from "../../components/calendar/Supa";
import CalendarPickerTwo from "../../components/newCalendar/CalendarTwo";
import Pay from "../pay/Pay";

function Gig() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [dataUserUsername, setDataUserUsername] = useState(null);
  const [dataUserEmail, setDataUserEmail] = useState(null);
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [businessHours, setBusinessHours] = useState([]);

  const [userId, setUserId] = useState(null); // Moved userId state initialization after the data retrieval

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        console.log(res.data.email);
        setDataUserUsername(res.data.username);
        setDataUserEmail(res.data.email);
        return res.data;
      }),
    enabled: !!userId,
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
    // enabled: userId !== null,
  });

  useEffect(() => {
    if (data) {
      setUserId(data.userId);
      setBusinessHours(data?.businessHours || []);
    }
  }, [data]);

  
console.log(dataUserEmail);
  const handleContinueClick = async (date, start, end) => {
    const res = await newRequest.get(`/api/google`)
  
    const appointment = {
      gig_id: id,
      seller_id: userId,
      buyer_id: currentUser,
      selected_date: date,
      selected_start_time: start,
      selected_end_time: end,
      // add any other relevant properties to the order object here
    };
    console.log('appointment:', appointment);
    // pass the order object to the next step in the ordering process here
    return <Pay appointment={appointment} />;
  };

  console.log(data.businessHours[0].day);
  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="left">
            <span className="breadcrumbs">
              <Link to="/"> Home </Link> {">"} 
            </span>
            <h1>{data.title}</h1>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser.img || "https://res.cloudinary.com/dk2a01h3i/image/upload/v1682801127/profilePic2_u842zn.jpg"}
                  alt=""
                />
                <span>{dataUser.username}</span>
                <div className="stars">
                  {(!isNaN(data.totalStars / data.starNumber)) && Array(Math.round(data.totalStars / data.starNumber))
                    .fill()
                    .map((item, i) => (
                      <img src="https://res.cloudinary.com/dk2a01h3i/image/upload/v1683309745/goldStar_jvta9f.png" alt="" key={i} />
                  ))}
                  {(!isNaN(data.totalStars / data.starNumber)) && <span>{Math.round(data.totalStars / data.starNumber)}</span>}
                </div>
              </div>
            )}
            <Slider slidesToShow={1} arrowsScroll={1} className="slider">
              {data.images.map((img) => {
                console.log(img);
                return <img key={img} src={img} alt="" />;
              })}
            </Slider>
            <h2>About This Gig</h2>
            <p>{data.desc}</p>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={dataUser.img || "https://res.cloudinary.com/dk2a01h3i/image/upload/v1682801127/profilePic2_u842zn.jpg"} alt="" />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((item, i) => (
                            <img src="/img/star.png" alt="" key={i} />
                          ))}
                        <span>
                          {Math.round(data.totalStars / data.starNumber)}
                        </span>
                      </div>
                    )}
                    <button>Contact Me</button>
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">Aug 2022</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Last delivery</span>
                      <span className="desc">1 day</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}
            <Reviews gigId={id} />
          </div>
          <div className="right">
              <h3>{data.shortTitle}</h3>
              <div className="box">
            <div className="items">
              <div className="item">
                <span className="title">Price</span>
                <span className="desc">${data.price.toFixed(2)}</span>
              </div>
              <div className="item">
                <span className="title">Service Fee</span>
                <span className="desc">${(data.price * 0.15).toFixed(2)}</span>
              </div>
              <div className="item">
                <span className="title">Tax</span>
                <span className="desc">${(data.price * 0.029).toFixed(2)}</span>
              </div>
            </div>
            <div className="total">
              <span className="title">Total Price</span>
              <span className="desc">
                ${(data.price * 1.15 * 1.029).toFixed(2)}
              </span>
            </div>
          </div>
            <p>{data.shortDesc}</p>
            <div className="details">
            </div>
            <div className="features">
              {data.features.map((feature) => (
                <div className="item" key={feature}>
                  <img src="https://res.cloudinary.com/dk2a01h3i/image/upload/v1682875369/greenCheck_quubq1.png" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="business-hours">
              <h2>Business Hours</h2>
              <ul>
                {businessHours.map((hour) => (
                  <li key={hour._id}>
                    {hour.day}: {hour.hours}
                  </li>
                ))}
              </ul>
            </div>
            <Supa dataUserEmail={dataUserEmail} dataUserUsername={dataUserUsername} />
            <Link to={`/pay/${id}`}>
            <button>Continue</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;