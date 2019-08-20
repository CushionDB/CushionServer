import server from './server';

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`-- Cushion server is running on port ${PORT}`);

  if (process.env.NODE_ENV === 'production') {
  	console.log('-- CouchDB is running on port 5984');
  	console.log('-- Press ^C to stop docker-compose');
  }
});
