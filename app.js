const express = require('express');
const app = express();
const linksFeed = require('./feeds');
const { parse } = require('rss-to-json');


app.set('views', './views');
app.set('view engine', 'pug');

// array of links

const linksArray = linksFeed.feeds;
// async await
let RSSArray = [];
(async () => {
  const linksArrayPromises = linksArray.map(link => {
    return new Promise(async linkResolve => {
      const rss = await parse(link);
      RSSArray.push(rss);
      linkResolve();
    });
  });
  await Promise.all(linksArrayPromises);
  console.log(RSSArray);

})();



app.get('/', (req, res) => {
  res.render('index', {
     title: 'BNU Testcase',
     ar
  });
});

module.exports = app;
