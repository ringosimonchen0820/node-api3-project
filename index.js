// code away!
const express = require('express');

const server = express();

const apiRouter = require("./users/userRouter.js");

server.use(express.json());

server.use("/api/posts/user", apiRouter);


server.get('/', (req, res) => {
    res.send(`
      <h2>Lambda User API</h>
      <p>Welcome to the Lambda User API</p>
    `);
  });



  const port = 5000;
  server.listen(port, () => {
    console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
  });
