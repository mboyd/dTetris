var game = require('./tetris.js');

/************************************************
 * Server logic
 ************************************************/

var fs = require('fs');

var http = require('http');
var http_server;

var io = require('socket.io');
var io_server;

var clients = [];

function start_servers() {
  http_server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.url == '/') {
      serve_file('index.html', res);
    } else {
      serve_file(req.url.substring(1), res);
    }
  });
  
  http_server.listen(8080, '0.0.0.0');
  console.log('Server started');
  
  io_server = io.listen(http_server);
  
  io_server.configure(function() {
    io_server.set('log level', 1);
    io_server.set('transports', ['flashsocket', 'websocket', 'htmlfile', 'xhr-polling', 
                          'jsonp-polling']);
  });
  
  io_server.sockets.on('connection', function(socket) {
    
    config = {};
    config.m = 10;
    config.n = 10;
    config.offset = 10 * (clients.length);
    socket.emit('configure', JSON.stringify(config));
    
    console.log('Screen ' + config.offset + ' connected.');
    clients.push(socket);
    
    update();
    socket.on('keypress', function (data) {
      game.handle_input(data);
      update();
    })
  })
}

function serve_file(file, res) {
  fs.readFile(file, function(err, data) {
    if (err) {
      console.log(err);
    }
    res.end(data);
  });
}

function update() {
  game.update();
  var state = game.get_state();
  for (var i = 0; i < clients.length; i++) {
    clients[i].emit('update', state);
  }
  setTimeout(update, 1000);
}

start_servers();
game.init();
update();

