const assert = require('assert');

it('should return true', () => {
  var x = [1,1];
  var y = [1,1];
  assert.equal(equalmoves(x,y), true);
}); 

it('should return false', () => {
  var x = [1,1];
  var y = [2,2];
  assert.equal(equalmoves(x,y), false);
}); 

//makemove()

it('should return 3,3', () => {
  var move = 33;
  assert.equal(convertHashedMove(move), [3,3]);
}); 


it('should return true', () => {
  var piece = 1;
  assert.equal(isO(piece), true);
}); 

it('should return true', () => {
  var piece = 2;
  assert.equal(isO(piece), true);
}); 


it('should return false', () => {
  var piece = 3;
  assert.equal(isO(piece), true);
}); 

it('should return false', () => {
  var piece = 4;
  assert.equal(isO(piece), true);
}); 

it('should return true', () => {
  var piece = 0;
  assert.equal(isO(piece), true);
}); 

it('should return 31', () => {
  var player = "X";
  var board = [
  [1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0],
  [0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0],
  [0,0,0,3,0,3,0,3],
  [3,0,3,0,3,0,3,0],
  [0,3,0,3,0,3,0,3],
  ];
  assert.equal(checkForMandatoryMoves(player, board), [31]);
}); 

it('should return 31 and 33', () => {
  var player = "X";
  var board = [
  [1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0],
  [0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0],
  [0,3,0,3,0,3,0,3],
  [3,0,3,0,3,0,3,0],
  [0,3,0,3,0,3,0,3],
  ];
  assert.equal(checkForMandatoryMoves(player, board), [31,33]);
}); 

it('should return 31', () => {
  var row = 5;
  var column = 3;
  var board = [
  [1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0],
  [0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0],
  [0,0,0,3,0,3,0,3],
  [3,0,3,0,3,0,3,0],
  [0,3,0,3,0,3,0,3],
  ];
  assert.equal(checkForJumps(board, row, column), [31]);
}); 

it('should return 3,7,5 3,7,7', () => {
  var player == "X";
  var board = [
  [1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,3,0,3],
  ];
  assert.equal(checkForJumps(player, board), [[3,7,5],[3,7,7]]);
}); 

it('should return 31', () => {
  var row = 2;
  var col = 2;
  var board = [
  [1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0],
  [0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0],
  [0,0,0,3,0,3,0,3],
  [3,0,3,0,3,0,3,0],
  [0,3,0,3,0,3,0,3],
  ];
  assert.equal(checkForMoves(board, row, col), [31, 33]);
}); 

it('should return 31', () => {
  var row = 5;
  var col = 1;
  var board = [
  [1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,3,0,3,0,3,0,3],
  [3,0,3,0,3,0,3,0],
  [0,3,0,3,0,3,0,3],
  ];
  assert.equal(checkForMoves(board, row, col), [41, 43]);
}); 

it('should return 31', () => {
  var board = [
  [3,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,3,0,3,0,3,0,3],
  [3,0,3,0,3,0,3,0],
  [0,1,0,3,0,3,0,3],
  ];
  assert.equal(checkForKings(board), [
  [4,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,3,0,3,0,3,0,3],
  [3,0,3,0,3,0,3,0],
  [0,2,0,3,0,3,0,3],
  ]);
}); 




