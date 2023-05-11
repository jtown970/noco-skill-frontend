import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import OrderForm from "./OrderForm"
import AvailabilitySelector from './AvailabilitySelector';


const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [availability, setAvailability] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [currentUserEmail, setCurrentUserEmail] = useState(undefined);


  console.log(currentUser.email);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleAvailabilityChange = (newAvailability) => {
    setAvailability(newAvailability);
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const selectedDays = Object.entries(availability)
      .filter(([day, selected]) => selected)
      .map(([day]) => day);
  
    mutation.mutate({
      ...state,
      availability: selectedDays,
    });
    navigate("/mygigs");
  };

  const isGmail = (email) => {
    return email && email.includes('gmail.com');
  }
  
  const handleEmailChange = (e) => {
    const { value } = e.target;
    if (isGmail(value)) {
      setCurrentUserEmail(value);
    } else {
      setCurrentUserEmail('');
    }
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <div className="email">
              <label htmlFor="">Google email</label>
              <div className="question-icon" >
                <div alt="Question" />
              </div>
            </div>
            <input
              type="text"
              name="username"
              onChange={handleEmailChange}
              value={isGmail(currentUser.email) ? currentUser.email : ''}
              placeholder="Enter your Gmail account"
              className="usernameHideMe"
            />
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="">none</option>
              <option value="tech">Health</option>
              <option value="music">Music</option>
              <option value="outdoor">Outdoor</option>
              <option value="sports">Sports</option>
              <option value="tech">Tech</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <br/>
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <form onSubmit={handleSubmit}>
              <h2>Days you Work</h2>
              <AvailabilitySelector
                availability={availability}
                onChange={handleAvailabilityChange}
              />
              {/* <button type="submit">Place Order</button> */}
            </form>
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" onChange={handleChange} name="price" />
            <button onClick={handleSubmit}>Create</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;