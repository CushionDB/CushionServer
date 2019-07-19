import express from 'express';
import btoa from 'btoa';
import fetch from 'node-fetch';
import cors from 'cors';

const server = express();
server.use(cors());
server.use(express.json());

const PORT = 3001;
const config = {
	couchBaseUrl: 'http://localhost:5984/',
	admin: 'admin',
	adminPass: 'admin'
};

server.post('/signup', (req, res) => {
	console.log('[REQUEST BODY] ', req.body);
	console.log('------------------');
	const username = req.body.username;
	const password = req.body.password;

  let url = `http://127.0.0.1:5984/_users/org.couchdb.user:${username}`
  let options = {
    method: 'PUT',
    data: {
      name: username,
      password: password,
      roles: [],
      type: 'user'
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: 'Basic '+btoa('admin:admin')
    },
  };

  return fetch(url, options).then(response =>  {
		console.log('[RESPONSE] ', response);
		res.send(response);
	}).catch(error => {
		console.log('[ERROR] ', error);
	});
})

server.listen(PORT, () => {
	console.log(`Cushion server is running on ${PORT}`);
});
