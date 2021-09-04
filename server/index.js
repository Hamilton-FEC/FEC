const express = require('express');
const axios = require('axios');
// If running locally, use this or SECRET="SECRET" npm start
// const { apiKey } = require('../config.js');

// Use env secret for heroku deploy
const apiKey = process.env.SECRET
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const apiUrl = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/';
const path = require('path');
const fs = require('fs');

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.raw({
  type: 'image/*',
  limit: '10mb'
}));

app.post('/api/images', (req, res)=>{
  // Get the request body which will contain a json object with our url to file.
  // Axios get the url.
  // then write the result of the get request.

  let id = req.headers.filename + (Math.floor(Math.random() * 1000)) + (Math.floor(Math.random() * 4000)) + (Math.floor(Math.random() * 5000)) + (Math.floor(Math.random() * 6000)) + '.' + (req.headers.filetype.split('/')[1]);
  // headers filename
  fs.writeFile(path.join(__dirname, `../public/images/${id}`), req.body, (err) => {
        if (err) {
          throw err;
        } else {
          res.send(`/images/${id}`);
        }});
  //axios.get(location).then((data)=>{debugger;}).catch((e)=>{debugger;})
  // then write the request body to the images folder
  // respond with the path to our file.

});

app.all('/api/*', (req, res) => {
  // req.method is what type we used
  // req.originalUrl is what we're targeting.

  // Take in the original request, filter off the /api portion,
  // make a new axios request using that type with an authorization token
  // to the appropriate URL, send back the information we obtain in the response.
  const targetUrl = apiUrl + req.originalUrl.slice(5);
  axios({
    method: req.method,
    url: targetUrl,
    headers: { authorization: apiKey },
    data: req.body,
  })
    .then((data) => {
      res.send(data.data);
    })
    .catch((e) => {
      res.send(e);
    });
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
