import axios from "axios";

const APIUrl = "http://103.154.100.159";
const BackendUrl = "http://103.154.100.159"
const BackendMedia = "http://103.154.100.159/media/"
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


export { axiosBase, axiosData, getAPI, BackendUrl, BackendMedia }