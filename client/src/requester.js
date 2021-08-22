// https://roho-table.herokuapp.com/

import Axios from 'axios';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const APIBASE = isDev ? '' : 'https://roho-table.herokuapp.com';

const requester = Axios.create({ baseURL: APIBASE });

export default requester;
