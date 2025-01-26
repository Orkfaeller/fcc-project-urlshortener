require('dotenv').config();
const bodyParser = require('body-parser');
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const shortenedUrls = { };
let short_url = 0;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/shorturl', (req, res) => {
  // derived from https://regexr.com/3um70
  const urlRegex = /https?:\/\/[^\s$.?#].[^\s]*/;
  const original_url = req.body.url;
  if (!original_url.match(urlRegex)) {
    return res.json({ 'error': 'invalid url' });
  }

  // increment short_url counter and then add to shortenedUrls map
  shortenedUrls[++short_url] = original_url;

  res.json({ original_url, short_url });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  res.redirect(shortenedUrls[req.params.short_url]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
