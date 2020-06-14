require('dotenv').config();
const compression = require('compression');
const express = require('express');
const next = require('next/dist/server/next');
//import openBrowser from 'react-dev-utils/openBrowser';
import routes from '../routes';


const { PORT = 3000, HOST = '0.0.0.0', NODE_ENV } = process.env;

const dev = NODE_ENV !== 'production';  // if (node_env === production) dev = false.
const dir = 'app';  //  Location of the Next.js project. 

const app = next({ dev, dir });


const handler = routes.getRequestHandler(app);  // listen the routes and "render the pages in the app".

app.prepare().then(() => {
  const server = express();

  server.use(compression());
  server.use(handler).listen(PORT, HOST);

  if (dev) {   /// There exists an error here needed to fix.
    console.log('development mode');
    //openBrowser(`http://localhost:${PORT}`);
  }
});
