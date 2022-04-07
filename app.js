const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
const express = require('express');
const app  = express();
const fetch = require('node-fetch');
const { response } = require('express');

//Zou zorgen voor betere performances, niet helemaal duidelijk geworden
const LRU = require('lru-cache');
const assert = require('assert')


const compression = require('compression');

app.use(compression());

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



//Fetch the first 10 artObjects.
app.get('/', (req, res) => {
  const rijksAPI = 'https://www.rijksmuseum.nl/api/nl/collection?&imgonly=true&key=xvdOJegg';
  fetch(rijksAPI)
    .then(async response => {
      const collection = await response.json();
      res.render('index', {
        pageTitle: 'Art Museum',
        data: collection.artObjects
      });
    })
    .catch(err => res.send(err))
})

app.get('/search', (req, res) => {
  const rijksAPI = `https://www.rijksmuseum.nl/api/nl/collection?&imgonly=true&key=xvdOJegg&q=${req.query.q}`;
  fetch(rijksAPI)
    .then(async response => {
      const collection = await response.json();
      res.render('index', {
        pageTitle: 'Art Museum',
        data: collection.artObjects
      });
    })
    .catch(err => res.send(err))
})








