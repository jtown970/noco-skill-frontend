import React, { useEffect, useReducer, useState } from "react";
// import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useLocation  } from "react-router-dom";
import OrderForm from "../add/OrderForm"
import AvailabilitySelector from '../add/AvailabilitySelector';
import BusinessHours from '../add/BusinessHours';


const EditGig = () => {
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
  console.log('currentUser._id',currentUser._id);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [cat, setCat] = useState("");
  // const [cover, setCover] = useState("");
  // const [images, setImages] = useState("");
  const [desc, setDesc] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState("");


    const locations = useLocation();
    const searchParams = new URLSearchParams(locations.search);
    const gigId = searchParams.get("gigId");
    // console.log('gigId', gigId);
    // Rest of your code handling the edit functionality
  
      // Fetch gig data on component mount
      const { isLoading, error, data } = useQuery({
        queryKey: ["editGigs"],
        queryFn: () =>
          newRequest.get(`gigs/single/${gigId}`).then((res) => {
            setTitle(res.data.title);
            setLocation(res.data.location);
            setCat(res.data.cat);
            setDesc(res.data.desc);
            setShortTitle(res.data.shortTitle);
            setShortDesc(res.data.shortDesc);
            setPrice(res.data.price);
            setBusinessHours(res.data.businessHours);
            setFeatures(res.data.features);
            console.log('businessHours',res.data.businessHours);
            return res.data;
          }),
      });

  // Rest of your component code...

  const handleBusinessHoursChange = (index, field, value) => {
    const updatedBusinessHours = [...businessHours];
    updatedBusinessHours[index][field] = value;
    setBusinessHours(updatedBusinessHours);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "cat":
        setCat(value);
        break;
      case "desc":
        setDesc(value);
        break;
      case "shortTitle":
        setShortTitle(value);
        break;
      case "shortDesc":
        setShortDesc(value);
        break;
      case "price":
        setPrice(value);
        break;
      default:
        break;
    }
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
  
    const updatedData = {
      title,
      location,
      cat,
      desc,
      shortTitle,
      shortDesc,
      price,
      businessHours,
    };
    console.log('updatedData', updatedData);
  
    try {
      // Send the update request
      const response = await newRequest.put(`/gigs/${gigId}`, updatedData);
  
      if (response.status === 200) {
        console.log('Update request sent successfully');
        // Handle success response
        navigate("/myGigs");
      } else {
        console.log('Update request failed');
        // Handle error response
      }
    } catch (error) {
      console.log('Update request failed:', error);
      // Handle error response
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

  // console.log('business hours => ',businessHours);

  return (
    <div className="add">
      <div className="container">
        <h1>Edit Gig</h1>
          {/* <div className="question-icon" >
            <div alt="Question" />
          </div> */}
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
              value={title} // Bind the input value to the title state variable
            />
            <label htmlFor="">Location</label>
            <input
              className="inputs-color"
              type="text"
              name="location"
              placeholder="e.g. where you'll meet"
              onChange={handleChange}
              value={location}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange} value={cat}>
              <option value="">none</option>
              <option value="tech">Health</option>
              <option value="music">Music</option>
              <option value="outdoor">Outdoor</option>
              <option value="sports">Sports</option>
              <option value="tech">Tech</option>
            </select>
            <label htmlFor="">Description</label>
            <textarea
              className="inputs-color"
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
              value={desc}
            ></textarea>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              className="inputs-color"
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
              value={shortTitle}
            />
            <label htmlFor="">Short Description</label>
            <textarea
              className="inputs-color"
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              value={shortDesc}
            ></textarea>
            <form onSubmit={handleSubmit}>
            {businessHours.map((item, index) => (
              <div key={index}>
                <label htmlFor={`hours-${index}`}>{item.day}</label>
                <input
                  type="text"
                  id={`hours-${index}`}
                  value={item.hours}
                  onChange={(e) =>
                    handleBusinessHoursChange(index, "hours", e.target.value)
                  }
                />
              </div>
            ))}
            {/* ... */}
          </form>
            {/* <label htmlFor="">Add Features</label>
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
            </div> */}
            <label htmlFor="">Hourly Rate</label>
            <input type="number" onChange={handleChange} name="price" value={price}/>
            <button onClick={handleSubmit}>Update</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGig;