import axios from "axios"
const baseURL = import.meta.env.VITE_POSYAYEE_API_KEY

const Axios = axios.create({
    withCredentials: true,
    baseURL: baseURL
})

export default Axios;