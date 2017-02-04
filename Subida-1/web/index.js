var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'http://xsearch.brazilsouth.cloudapp.azure.com'
});
var url = require('url');
var express = require('express');
var app = express();
app.use('/', express.static('./'));
app.get('/search', function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    client.search({
      index: 'xsearch',
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
        try{
        console.log(resp)
        resp.hits.hits = resp.hits.hits
            .map(r=>{    
               if(!r._source.content){
                   r._source.content = "";
                   return r;
               }    
                //var parts = r._source.content.split(new RegExp('(' + query.q + ')', 'gi'));
                //var text = "";
                var text = r._source.content ;
                var flag = false;
                /*parts.forEach(p =>{
                    if(p.length > 100){
                        text += "..."+p.substr(p.length-100,p.length);    
                    }else{
                        text += p;
                    }
                    text += " ";
                });*/
               r._source.content = text.substring(0,800);
               return r;
            });
        console.log("a");
        res.send(resp.hits);
        }catch(e){
            console.log(e);
            res.send([]);
        }
    }, function (err) {
        console.log(err);
        console.log("erro");
        res.send([]);
    });    
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

