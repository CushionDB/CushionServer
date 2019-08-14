import server from './server';

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Cushion server is running on ${PORT}`);

  if (process.env.NODE_ENV === 'production') {
  	console.log('CouchDB is accessible through port 5984');
  	console.log('Both are running on docker');
  	console.log('Press ^C to take it down');
  }
});
