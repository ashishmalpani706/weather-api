const http = require('http');
var url = require('url');
var YQL = require('yql');

const hostname = '127.0.0.1';
const port = 8080;

temperature = 0;

function getTemperature(zip, isFahrenheitScale) {
  cmd = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" +zip +"')"
  if(!isFahrenheitScale){
    cmd += " AND u='c'";
  }

  var query = new YQL(cmd);

  query.exec(function(err, data) {
    var condition = data.query.results.channel.item.condition;
  
    temperature = condition.temp;
    // console.log(temperature);
  });
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Type', 'application/json');

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  /* Default scale is F */
  isFahrenheitScale = query.scale==='Celsius'?0:1;
  scale=isFahrenheitScale?"Fahrenheit":"Celsius";
  zip = '24060';

  getTemperature(zip, isFahrenheitScale);
  console.log(isFahrenheitScale);
  console.log(temperature);

  payload = {
    temperature:temperature,
    scale:scale
  };
  
  console.log(payload);

  res.end(JSON.stringify(payload));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
