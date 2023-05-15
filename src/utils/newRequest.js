import axios from "axios";

const url = 'https://noco-skills-backend.onrender.com/api/'
const newRequest = axios.create({
  baseURL: url,
  withCredentials: true,
});

export default newRequest;