import axios from "axios";

const baseURL = "http://localhost:8002";

// For authenticated requests (login, cart, orders, etc.)
const axiosClient = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    withXSRFToken: true,
})

// For public API requests (banners, watches, brands - no auth needed)
export const axiosPublic = axios.create({
    baseURL: baseURL,
    withCredentials: false,
})

export default axiosClient;
