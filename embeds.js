require('dotenv').config()

const yaml = require('js-yaml');
const fs   = require('fs');
const request = require('request');

const apiKey = process.env.EMBED_ROCKS_API_KEY;

const doc = yaml.safeLoad(fs.readFileSync('data/genomics_news.yml', 'utf8'));

const getEmbed = (url) => {
  return new Promise((resolve, reject) => {
    request({
      url: `https://api.embed.rocks/api?url=${url}`,
      headers: {
        'x-api-key': apiKey
      }
    }, (err, response, html) => {
      const json = JSON.parse(response.body);
      resolve(json);
    });
  });
};

const embedPromises = doc.embed.map((item) => getEmbed(item.url));

Promise.all(embedPromises).then((values) => {
  return JSON.stringify(values, null, 2);
}).then((str) => {
  // values, do stuff with
  fs.writeFileSync('data/embed.json', str);
  // success case, the file was saved
  console.log('Embed saved!');
});
