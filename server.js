const http = require('http');
var url = require('url');
var YQL = require('yql');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
  var url_parts = url.parse(req.url, true);
  var path = url_parts.path;
  var path_array = path.split("/");
  var query = url_parts.query;

  if(path_array.length < 3 || path_array[1]!="locations"){
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');

    var usage = 'Usage:\
    <br>\
    <a href="http://localhost:8080/locations/24060">http://localhost:8080/locations/24060</a>\
    <br>\
    <a href="http://localhost:8080/locations/24060?scale=Celsius">http://localhost:8080/locations/24060?scale=Celsius</a>';
    res.end(usage);
  }
  else{
    /* Default scale is F */
    var isFahrenheitScale = query.scale==='Celsius'?0:1;

    var zip = path_array[2];


    cmd = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" +zip +"')"
    if(!isFahrenheitScale){
      cmd += " AND u='c'";
    }
  
    var query = new YQL(cmd);
  
    query.exec(function(err, data) {
      var condition = data.query.results.channel.item.condition;
    
      temperature = condition.temp;
      
      var payload = {
        temperature:temperature,
        scale:isFahrenheitScale?"Fahrenheit":"Celsius"
      };
  
      console.log(payload);
  
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(payload));
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
