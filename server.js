import express from 'express';

import config from './config';

const server = express();
const PORT = 3001;

server.post('/signup', (req, res) => {
	const username = res.username;
	const password = res.password;

  let url = `http://127.0.0.1:5984/_users/org.couchdb.user:${accountInfo.username}`
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

  return fetch(url, options).then(response => res.send(response));
})

server.listen(PORT, () => {
	console.log(`Cushion server is running on ${PORT}`);
});
