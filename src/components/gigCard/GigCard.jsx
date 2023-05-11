import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });

  const MAX_LENGTH = 80; // maximum characters to show in the description

  const description =
    item.desc && item.desc.length > MAX_LENGTH
      ? `${item.desc.substring(0, MAX_LENGTH)}...`
      : item.desc;

  const showReadMore =
    item.desc && item.desc.length > MAX_LENGTH && item.desc.trim() !== description.trim();

  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        <img src={item.cover} alt="" />
        <div className="info">
          {isLoading ? (
            "loading"
          ) : error ? (
            "Something went wrong!"
          ) : (
            <div className="user">
              <img
                src={
                  data.img ||
                  "https://res.cloudinary.com/dk2a01h3i/image/upload/v1682801127/profilePic2_u842zn.jpg"
                }
                alt=""
              />
              <span>{data.username}</span>
              <span>{item.title}</span>
            </div>
          )}
          <p>{description}</p>
          {showReadMore && (
            <Link to={`/gig/${item._id}`} className="read-more-btn">
              Read More
            </Link>
          )}
          <div className="star">
            {!isNaN(item.totalStars / item.starNumber) && (
              <>
                <img src="https://res.cloudinary.com/dk2a01h3i/image/upload/v1683309745/goldStar_jvta9f.png" alt="" />
                <span>{Math.round(item.totalStars / item.starNumber)}</span>
              </>
            )}
          </div>
        </div>
        <hr />
        <div className="detail">
        <div>{item.location}</div>
          <img src="./img/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>$ {item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
