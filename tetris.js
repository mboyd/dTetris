/************************************************
 * Game logic
 ************************************************/

var game = {};

 // Piece definitions -- point list for each rotation state, relative coords
game.square = [[[0, 0], [0, 1], [1, 1], [1, 0]], 
               [[0, 0], [0, 1], [1, 1], [1, 0]],
               [[0, 0], [0, 1], [1, 1], [1, 0]],
               [[0, 0], [0, 1], [1, 1], [1, 0]]];

game.pipe = [[[0, 0], [0, 1], [0, 2], [0, 3]],
             [[-1, 1], [0, 1], [1, 1], [2, 1]],
             [[0, 0], [0, 1], [0, 2], [0, 3]],
             [[-2, 1], [-1, 1], [0, 1], [1, 1]]];

game.pyramid = [[[0, 0], [-1, 1], [0, 1], [1, 1]],
                [[0, 0], [0, 1], [1, 1], [0, 2]], 
                [[-1, 0], [0, 0], [1, 0], [0, 1]],
                [[0, 0], [-1, 1], [0, 1], [0, 2]]];

game.pieces = [game.square, game.pipe, game.pyramid];

game.active_pieces = [];

game.init = function() {
  p1 = { i: 2,  // Piece #0 (square)
         x: 5,
         y: 5,
         r: 3 };
  game.active_pieces.push(p1);
}

game.update = function() {
  // Pass
}

game.handle_input = function(i) {
  var x = 0, y = 0, r = 0;
  switch (i) {
  case 'l':
    x = -1;
    break;
  case 'u':
    y = -1;
    break;
  case 'r':
    x = 1;
    break;
  case 'd':
    y = 1;
    break;
  case '+':
    r = 1;
    break;
  case '-':
    r = -1;
    break;
  }
  var p = game.active_pieces[0];
  p.x += x;
  p.y += y;
  p.r = (p.r + 4 + r) % 4;
}

game.get_state = function() {
  return JSON.stringify(game.active_pieces);
}

if (typeof exports != 'undefined') {
  exports.pieces = game.pieces;
  exports.init = game.init;
  exports.handle_input = game.handle_input;
  exports.update = game.update;
  exports.get_state = game.get_state;
}