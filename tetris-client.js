/****************************************
 * Graphics logic
 ****************************************/

var gfx = {};

gfx.m = 10;
gfx.n = 10;
gfx.offset = 0;

gfx.init = function() {
  gfx.canvas = document.getElementById('canvas');
  gfx.ctx = canvas.getContext('2d');
}

gfx.configure = function(data) {
  gfx.m = data.m;
  gfx.n = data.n
  gfx.offset = data.offset;
  
  gfx.mp = gfx.canvas.width / gfx.m;
  gfx.np = gfx.canvas.height / gfx.n;
}

gfx.render = function(state) {
  var ctx = gfx.ctx;
  ctx.clearRect(0, 0, gfx.canvas.width, gfx.canvas.height);
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, gfx.canvas.width, gfx.canvas.height);
  
  ctx.fillStyle = '#ff0000';
  ctx.strokeStyle = '2px solid #888888';
  
  for (var i = 0; i < state.length; i++) {
    var piece = state[i];
    var points = game.pieces[piece.i][piece.r];
    for (var j = 0; j < points.length; j++) {
      var p = points[j];
      var x = p[0] + piece.x - gfx.offset;
      var y = p[1] + piece.y;
      ctx.fillRect(x*gfx.mp, y*gfx.mp, gfx.mp, gfx.np);
      ctx.strokeRect(x*gfx.mp, y*gfx.mp, gfx.mp, gfx.np);
    }
  }
}

/****************************************
 * Input nonsense
 ****************************************/
var kbd = {'37': 'l', '38': 'u', '39': 'r', '40': 'd', '191': '+', '190': '-'};
window.addEventListener('keydown', function(evt) {
  var k = evt.keyCode;
  if (socket) {
    socket.emit('keypress', kbd[String(k)]);
  }
}, false);

/****************************************
 * Network jazz
 ****************************************/
var socket;

window.onload = function() {
  gfx.init();
  socket = io.connect('http://localhost');
  socket.on('update', function(data) {
    data = JSON.parse(data);
    gfx.render(data);
  });
  
  socket.on('configure', function(data) {
    data = JSON.parse(data);
    gfx.configure(data);
  });
}
