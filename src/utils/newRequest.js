import axios from "axios";

const url = 'https://noco-skills-backend.adaptable.app/api/'
const newRequest = axios.create({
  baseURL: url,
  withCredentials: true,
});

export default newRequest;