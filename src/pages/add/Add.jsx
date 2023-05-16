import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import OrderForm from "./OrderForm"
import AvailabilitySelector from './AvailabilitySelector';
import BusinessHours from './BusinessHours';



const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [businessHours, setBusinessHours] = useState([
    { day: 'Monday', hours: '', end: '' },
    { day: 'Tuesday', hours: '', end: ''  },
    { day: 'Wednesday', hours: '', end: ''  },
    { day: 'Thursday', hours: '', end: ''  },
    { day: 'Friday', hours: '', end: ''  },
    { day: 'Saturday', hours: '', end: ''  },
    { day: 'Sunday', hours: '', end: ''  },
  ]);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const { email } = JSON.parse(localStorage.getItem("currentUser"));
  const [currentUserEmail, setCurrentUserEmail] = useState(undefined);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));




  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
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


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if any business hours are empty and set them to "Closed"
    const updatedBusinessHours = businessHours.map((businessHour) => {
      if (businessHour.hours === '') {
        return { ...businessHour, hours: 'Closed' };
      }
      return businessHour;
    });
  
    const gigData = {
      ...state,
      businessHours: updatedBusinessHours,
      userId: currentUser,
    };
    console.log('gigData', gigData);
  
    try {
      await mutation.mutateAsync(gigData);
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    } catch (error) {
      console.log(error);
    }
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

  console.log('business hours => ',businessHours);

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
              value={isGmail(email) ? email : ''}
              placeholder="Enter your Gmail account"
              className="usernameHideMe"
            />
            <label htmlFor="">Title</label>
            <input
              className="inputs-color"
              type="text"
              name="title"
              placeholder="e.g. I will teach you X"
              onChange={handleChange}
            />
            <label htmlFor="">Location</label>
            <input
              className="inputs-color"
              type="text"
              name="location"
              placeholder="e.g. where you'll meet"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="">none</option>
              <option value="art">Art</option>
              <option value="tech">Health</option>
              <option value="music">Music</option>
              <option value="outdoor">Outdoor</option>
              <option value="sports">Sports</option>
              <option value="tech">Tech</option>
              <option value="other">Other</option>
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
              className="inputs-color"
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="details">
            <form onSubmit={handleSubmit}>
              <BusinessHours
                businessHours={businessHours}
                setBusinessHours={setBusinessHours}
              />
            </form>
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input className="inputs-color" type="text" placeholder="e.g. golf clubs" />
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
            <label htmlFor="">Hourly Rate</label>
            <input type="number" onChange={handleChange} name="price" />
            <button onClick={handleSubmit}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;