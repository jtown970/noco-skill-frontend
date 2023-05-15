import axios from "axios";

const url = 'https://nocoskills.com/api/'
const newRequest = axios.create({
  baseURL: url,
  withCredentials: true,
});

export default newRequest;