const cluster = require('cluster');
const os = require('os');
const express = require('express');

const numCPUs = os.cpus().length;
console.log(numCPUs);

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();

	app.get('/', (req, res) => {
		res.send('Welcome to Express Routing!',  process.pid);
	});
	
	app.get('/heavy', (req, res) => {
		let total = 0;
		for(let i=0; i< 500000000; i++) {
			total++;
		}
		res.send("total", total);
	});

	app.listen(3000, () => {
		console.log('Server is running on port 3000',  process.pid);
	});

  const server = app.listen(3000, () => {
    console.log(`Worker process ${process.pid} is listening on port 3000`);
  });
}
