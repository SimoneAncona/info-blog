const forward = require('http-port-forward');
const dotenv = require('dotenv');
dotenv.config();
 
forward(process.env.PORT, 80);