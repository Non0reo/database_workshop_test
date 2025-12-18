import express from 'express'
/* const express = require('express') */
const app = express()
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/url', async (req, res) => {
  /* res.send(`Hello World! You requested: ${req.params.url}`); */

  //const data = await fetch('https://dog.ceo/api/breeds/image/random')
  const data = await fetch(req.headers.url)
    .then(response => response.json())
    .then(data => res.json(data));

  res.json(data);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/artist', (req, res) => {
  fetch('https://api.deezer.com/artist/145/top?limit=10')
    .then(response => response.json())
    .then(data => res.json(data));
});