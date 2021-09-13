const express = require('express');
const app = express();
const linksFeed = require('./feeds');
const { parse } = require('rss-to-json');

app.set('views', './views');
app.set('view engine', 'pug');

const linksArray = linksFeed.feeds;
let RSSArray = [];

app.get('/', async (req, res) => {
  const linksArrayPromises = linksArray.map(link => {
    return new Promise(async linkResolve => {
      const rss = await parse(link);
      RSSArray.push(...rss.items);
      linkResolve();
    });
  });
  await Promise.all(linksArrayPromises);
  const sortedRSSArray = RSSArray.sort((a, b) => b.published - a.published);

  const uniqueArray = sortedRSSArray.reduce((accumulator, currentValue) => {
    if (accumulator.some(item => item.title === currentValue.title)) {
      return accumulator;
    } else {
      return accumulator.concat(currentValue);
    }
  }, [])

  const firstTenUniqueItems = uniqueArray.slice(0,10);

  res.render('index', {
    title: 'BNU Testcase',
    firstTenUniqueItems,
  });
});

module.exports = app;
