import axios from "axios";

const BASE_URL = '';


const invoke = ({ url, method = 'GET', headers, data, ...rest }) => axios({ baseURL: BASE_URL, url, method, headers, data, ...rest });

export default invoke;