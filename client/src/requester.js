// https://roho-table.herokuapp.com/

import Axios from 'axios';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// const APIBASE = isDev ? '' : 'http://146.235.205.152:5000';
const APIBASE = isDev ? '' : 'http://localhost:5000';

const requester = Axios.create({ baseURL: APIBASE });

export default requester;
