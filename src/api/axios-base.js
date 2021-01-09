import axios from "axios";

const APIUrl = "http://api.peaga.xyz";
const BackendUrl = "http://api.peaga.xyz"
const BackendMedia = "http://api.peaga.xyz/media/"
const axiosBase = axios.create({
    baseURL: APIUrl,
    headers: { contentType: "application/json" }
  });
  const axiosData = axios.create({
    baseURL: APIUrl,
    headers: { contentType: "application/json" }
  });
  const getAPI = axios.create({
    baseURL: APIUrl,
    headers: { contentType: "application/json" }
  });


  export {axiosBase, axiosData, getAPI, BackendUrl, BackendMedia}