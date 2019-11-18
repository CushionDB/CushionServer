const server = require('./server');
const https = require('https');
const fs = require('fs');
const utils = require('./utils/utils');

const envVars = utils.getEnvVars();
const key = fs.readFileSync('../key.pem');
const cert = fs.readFileSync('../cert.pem');
const passphrase = envVars.httpsPass;

const PORT = 3001;

https.createServer({key, cert, passphrase}, server).listen(PORT, () => {
  console.log(`-- Cushion server is running on port ${PORT}`);

  if (process.env.NODE_ENV === 'production') {
  	console.log('-- CouchDB is running on port 5984');
  	console.log('-- Press ^C to stop docker-compose');
  }
});
