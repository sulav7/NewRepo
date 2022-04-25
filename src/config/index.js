import axios from 'axios';
import { BASE_URL } from './baseUrl';

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		//
	},
});
export default axiosInstance;
