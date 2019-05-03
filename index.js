const express = require('express');

const postRoutes = require('./Posts/postRoutes')

const server = express();

server.use('/api/posts', postRoutes);

server.use('/', (req, res) => {
    res.status(200).send('Hello from API project II');
})

server.listen(8000, () => {
    console.log("Server running on port 8000");
})