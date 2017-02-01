var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200'
});
var url = require('url');
var express = require('express');
var app = express();
app.use('/', express.static('./'));
app.get('/search', function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    client.search({
      index: 'teste',
      size:query.size,
      from:query.from,
      type: 'doc',
      body: {
        query: {
          match: {
            _all: query.q
          }
        }
      }
    }).then(function (resp) {        
        res.send(resp.hits);        
    }, function (err) {    
    });    
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

