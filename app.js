const express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fs = require('fs');
//Simple way to do sessionIDs could also try to allow custom ID's from users, need extra validation.
//This will probably need to be a singleton so that we don't get any weird issues if we keep this.
var sessionCount = 0;
app.use(express.static(__dirname + '/Pages'));
//Serve base HTML view, no other pages are required state will only be updated though board datastruct.
app.get('/', function(req, res){
    res.sendFile(__dirname + '/Pages/index.html');
    res.sendFile(__dirname + '/Pages/styles.css');
});

//Set Server to listen, does some console logging.
http.listen(3000, function(){
    console.log('listening on *:3000');
});

//TODO: Connection Handler
// Check if newgame is requested and set up a new session
//    New socket.io room is created with sessionid, blank board state pushed, board state file is copied to the sessions with format sessionid.html or boardstate.
// If sessionID is given, check for sessionID.
//    If session is found in sessions then join user to socket.io room, and push session state to user
//    If session is requested but not found, throw error message to client that's displayed by the client

//TODO: Game Engine
// Board state is represented by 2D array
// X is red O is black
// Coordinates and type of piece are sent to the server for validation, if it passed board state is pushed
// If not an error is displayed

//TODO: Disconnection Handler
// Upon disconnection of one user an error message is displayed and all board moves sent are told to kindly fuck off
// Upon disconnection of both users the session is archived by saving the board state to a file, and putting it away.


//TODO: INPUT VALIDATION HELPER
// custom sessionid's and playernames are possible assuming we have input validation.
// Need a helper to make sure we only write good names to the server

//TODO: Save validation
//  WE need to make sure that users making custom named sessions don't stomp all over each other.
// Just check DIR same as searching for a session to see if it exists. (Can replace dir searching function as well in gameReq

//move a 2d array of xys of the form [[origrow,origcol],[newrow, newcol]]
//returns the new gameobj
function equalmoves(x,y) {
    return x[0] == y[0] && x[1]== y[1];
}

//Alters the datastructure and checks for king pieces.
function makeMove(gameobj,movereq){
    var nextmove = [[movereq[1],movereq[2]], [movereq[3],movereq[4]]];
    var boardchar = gameobj.boardstate[nextmove[0][0]][nextmove[0][1]];
    gameobj.boardstate[nextmove[0][0]][nextmove[0][1]] = 0;
    gameobj.boardstate[nextmove[1][0]][nextmove[1][1]] = boardchar;

    //Check for jumps.
    //up
    if(nextmove[0][0] > nextmove[1][0]&& nextmove[0][0] - nextmove[1][0] == 2){
        //right
        if(nextmove[0][1] < nextmove[1][1]){
            gameobj.boardstate[nextmove[0][0]-1][nextmove[0][1]+1] = 0; }
        else{
            gameobj.boardstate[nextmove[0][0]-1][nextmove[1][1]+1] = 0; }

    } // down
    else if(nextmove[0][0] < nextmove[1][0]&& nextmove[1][0] - nextmove[0][0] == 2){
        if(nextmove[0][1] < nextmove[1][1]){
            gameobj.boardstate[nextmove[1][0]-1][nextmove[1][1]-1] = 0;
        }
        else{
            gameobj.boardstate[nextmove[1][0]-1][nextmove[0][1]-1] = 0;
        }
    }
    gameobj.boardstate = checkForKings(gameobj.boardstate);
    if (gameobj.curPlayer == "X") {gameobj.curPlayer = "O";} else {gameobj.curPlayer = "X";}
    return gameobj;
}

//Checking for O pieces
function isO(piece){ return piece == 1 || piece == 2;}

//Looking for mandatory moves for a certain player
//Concats them into a list of all mandatory moves and returns
function checkForMandatoryMoves(player,board){
    var mandatoryMoves = [];
    var allPieces =  getPieces(player,board);
    console.log("ALL PIECES " + allPieces[0]);
    for(var i=0; i<allPieces.length; i++) {
        var piece = allPieces[i];
        var jumpcoords = checkForJumps(board, piece[1], piece[2]);
        console.log("PIECE TEST " + piece[1] + " " + piece[2]);
        console.log("CHECKING FOR JUMPs " + jumpcoords[0] + " " );
        mandatoryMoves.push(jumpcoords[i]);
        console.log("MOND 1" + mandatoryMoves);
    }
    console.log("MANDATORY " + mandatoryMoves);
    return mandatoryMoves;
}

//Checks a ring of size 2 diagonally for any jumps.
//Returns a list of possible jumps for a given piece
function checkForJumps(board, row, col){
        console.log(board);
        var Xupmoves = [];
        var Xdownmoves = [];

        var Oupmoves = [];
        var Odownmoves = [];

        var maxRow = 6;
        var minRow = 1;
        var maxCol = 6;
        var minCol = 1;

        var downRight = [];
        var downLeft  = [];
        var upRight   = [];
        var upLeft    = [];

        //Need to change so it doesn't get stuck on it's own pieces.
        if(row < maxRow && col < maxCol && board[row+2][col+2] == 0 && board[row+1][col+1] != 0) {upRight   = [row+2,col+2]; if(isO(board[row][col])) { if(!(isO(board[row+1][col+1]))){Oupmoves.push(upRight);} } else {      if(isO(board[row+1][col+1])){Xupmoves.push(upRight);}}}
        if(row > minRow && col < maxCol && board[row-2][col+2] == 0 && board[row-1][col+1] != 0) {downRight = [row-2,col+2]; if(isO(board[row][col])) { if(!(isO(board[row-1][col+1]))){Odownmoves.push(downRight);} } else {  if(isO(board[row-1][col+1])){Xdownmoves.push(downRight);}}}
        if(row < maxRow && col > minCol && board[row+2][col-2] == 0 && board[row+1][col-1] != 0) {upLeft    = [row+2,col-2]; if(isO(board[row][col])) { if(!(isO(board[row+1][col-1]))){Oupmoves.push(upLeft);} } else {       if(isO(board[row+1][col-1])){Xupmoves.push(upLeft);}}}
        if(row > minRow && col > minCol && board[row-2][col-2] == 0 && board[row-1][col-1] != 0) {downLeft  = [row-2,col-2]; if(isO(board[row][col])) { if(!(isO(board[row-1][col-1]))){Odownmoves.push(downLeft);} } else {   if(isO(board[row-1][col-1])){Xdownmoves.push(downLeft);}}}

        console.log("jumps Xup and down " + Xupmoves + " DD  " + Xdownmoves);
        console.log("jumps O yp and down" + Oupmoves + " DD  "+ Odownmoves);

        if (board[row][col] == 2){
            return Oupmoves.concat(Odownmoves);
        } else if(board[row][col] == 4 ){
            return Xupmoves.concat(Xdownmoves);
        } else if(board[row][col]==1){
            console.log("RETURNING ODOWN " + Odownmoves);
            console.log("CHECKING OUP " + Oupmoves);
            return Oupmoves;
        } else if(board[row][col] == 3){
            console.log("RETURNING XupMoves " + Xupmoves);
            console.log("CHECKING XDOWN");
            return Xdownmoves;
        } else {
            console.log("Something bad happened with jump moves");

        }
}

//Get's allpieces of a given player or both.
function getPieces(player,board){
    var pieces = [];
    for(row = 0; row < 8; row++){
        for(col = 0; col < 8; col++){
            if (board[row][col] > 0) {
                pieces.push([board[row][col], row, col])
            }
        }
    }
    if(player == "both"){
        return pieces;
    } else if(player == "O"){
        var opieces = [];
        for(i=0; i<pieces.length; i++){
            if(pieces[i][0] < 3){
                opieces.push((pieces[i]));
            }
        }
        console.log("OPIECES" + opieces)
        return opieces;

    } else if(player == "X"){
        var xpieces = [];
        for(i=0; i<pieces.length; i++){
            if(pieces[i][0] >= 3){
                xpieces.push((pieces[i]));
            }
        }
        return xpieces;

    } else {
        console.log("bad getPieces req");
    }
}

function checkForWin(player, board){
    var allPieces = getPieces(player,board);
    if(allPieces.length == 0){
        if(player == "O"){
            alert("Player X has won the game!");
        }
        if(player == "X"){
            alert("Player O has won the game!");
        }
    }

}

//Checks a ring of size 2 diagonally for any jumps.
//Returns a list of possible jumps for a given piece
function checkForMoves(board, row, col){
    console.log("Piece were looking at ", board[row][col]);
    var upmoves =[];
    var downmoves = [];
    var maxRow = 7;
    var minRow = 0;
    var maxCol = 7;
    var minCol = 0;

    var downRight = [];
    var downLeft  = [];
    var upRight   = [];
    var upLeft    = [];

    if(row < maxRow && col < maxCol && board[row+1][col+1] == 0){upRight   = [row+1,col+1]; upmoves.push(upRight);}
    if(row > minRow && col < maxCol && board[row-1][col+1] == 0){downRight = [row-1,col+1]; downmoves.push(downRight);}
    if(row < maxRow && col > minCol && board[row+1][col-1] == 0){upLeft    = [row+1,col-1]; upmoves.push(upLeft);}
    if(row > minRow && col > minCol && board[row-1][col-1] == 0){downLeft  = [row-1,col-1]; downmoves.push(downLeft);}

    console.log("MOVES: " + upmoves.concat(downmoves)[0]);

    if (board[row][col] == 2 || board[row][col] == 4 ){
        return upmoves.concat(downmoves);
    } else if(board[row][col]==1){
        return upmoves;
    } else if(board[row][col] == 3){
        return downmoves;
    } else {
        console.log("Something bad happened with moves");
        return [];
    }
}

//Checks rows to coronate.
function checkForKings(board) {
    for (var i= 0; i < 8; i++) {
        if (board[7][i] == 1) {
            board[7][i] = 2;
        }
    }

    for (var x = 0; x < 8; x++) {
        if (board[0][x] == 3) {
            board[0][x] = 4;
        }
    }
    return board;
}

//TODO: Move validation
function movevalidator(gameobj, movereq) {
    console.log(movereq[0]);
    console.log(gameobj.curPlayer);
    if(gameobj.curPlayer != movereq[0]){return 1;}

    console.log("Passed Player Check");

    var origpos = [movereq[1],movereq[2]];
    var newpos  = [movereq[3],movereq[4]];
    var board = gameobj.boardstate;

    //var mandatoryMoves =checkForMandatoryMoves(player,gameobj.boardstate);
    console.log("Done with mandatory moves");
    var otherMoves = checkForMoves(gameobj.boardstate, origpos[0], origpos[1]);

    let jumpflag = false;
//    var mandatoryMoves = [];
    let allPieces =  getPieces(gameobj.curPlayer,board);
    console.log("ALL PIECES " + allPieces);
    var d = 0;
    for(var i=0; i<allPieces.length; i++) {
        var piece = allPieces[i];
        var jumpcoords = checkForJumps(board, piece[1], piece[2]);

        console.log("PIECE TEST " + piece[1] + " " + piece[2]);
        console.log("CHECKING FOR JUMPs " + jumpcoords[0] + " " );
        if( d == 30) {break;}
        d++;
        if(jumpcoords.length > 0 && jumpcoords != undefined) {
            jumpflag = true;
            for (var z = 0; z < jumpcoords.length; z++) {
                if (equalmoves(jumpcoords[z], newpos) == true) {
                    var nextJump = checkForJumps(board, newpos[0], newpos[1]);
                    if(nextJump != undefined && nextJump.length > 0) {
                        return 4;
                    } else {
                        return 0;
                    }
                }
            }
        }}

    if(jumpflag){
        return 2;
    } else {
        for(var i = 0; i < otherMoves.length; i++) {
            if (equalmoves(otherMoves[i],newpos) == true) {
                return 0;
            }
        }
        return 3;
    }
}


//TODO: Add try catch blocks to open and save sessions.
function openSession(roomid){
    console.log("opening session " + roomid);
    var gameobj = fs.readFileSync(__dirname + "/Sessions/" + roomid, function(err,gameObjBuff){});
    console.log("Loaded!");
    return JSON.parse(gameobj.toString());
}
function saveSession(gameObj, roomid){
    console.log("saving session " + roomid);
    var gameObjString = JSON.stringify(gameObj);
    fs.writeFile(__dirname + "/Sessions/" + roomid, gameObjString, function(err){
        if (err) throw err;
        console.log('Saved!');
    });
}

io.on('connection', function(socket){
    console.log("user connected ");
    //Fresh board is generated.
    var isgame = false;
    var game = {
        curPlayer : "O",
        boardstate : [
                [1,0,1,0,1,0,1,0],
                [0,1,0,1,0,1,0,1],
                [1,0,1,0,1,0,1,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,3,0,3,0,3,0,3],
                [3,0,3,0,3,0,3,0],
                [0,3,0,3,0,3,0,3],
            ]};

    var roomid = -2;

    socket.on("gameReq", function(msg){
        if(msg === -1){
            console.log("Got a new game request");
            roomid=sessionCount;
            socket.join(roomid.toString());
            console.log("Added session and made a new io room");
            // emits the game id back to the client
            socket.emit("gid", roomid);
            socket.emit("playerName","O");
            console.log("emitted playername and gid");
            saveSession(game,roomid);
            sessionCount++;
            isgame = true;
            console.log("Session saved and incrementing counter. SESSION COUNTER =",sessionCount);

        } else if (msg >= 0) {
            //Check for session
            console.log("Player trying to join a game.");
            fs.readdir(__dirname + "/Sessions/", function(err,sessions){
                console.log("Searching for Session");
                for (let session in sessions){
                    if(parseInt(session) === msg ) {
                        console.log("session found");
                        console.log(parseInt(session));
                        roomid = parseInt(session);

                        socket.emit("playerName","X");
                        socket.emit("gid", roomid);
                        socket.join(roomid.toString());

                        console.log(openSession(roomid));
                        game = openSession(roomid);

                        io.in(roomid.toString()).emit("updateBoard",[game.boardstate,game.curPlayer]);
                        isgame = true;
                        console.log("setup session");
                    }
                }
                //No room found send error to client.
                if (roomid === -2) { socket.emit("clientError", "No game found"); }
            });
        } else {
            console.log("bad message received.");
            //error to client.
            socket.emit("clientError", "invalid game ID");
        }
    });

    //Moves done through callback functions and promises.
    socket.on("moveReq", function(msg,fn){
        if(isgame) {
            //temp value for addedmove
            //var validmove = gameengine.movevalidator(msg);
            console.log("Recived Move Request");
            game = openSession(roomid.toString());
                var movestatus = movevalidator(game, msg);
                if (movestatus == 0 || movestatus == 4) {
                    game = makeMove(game, msg);
                    console.log("sending move res");
                    if (movestatus == 4) {
                        game.curPlayer = msg[0];
                        io.in(roomid.toString()).emit("updateBoard", [game.boardstate, game.curPlayer]);
                        socket.emit("clientError", "You have a second jump!");
                    } else {
                        io.in(roomid.toString()).emit("updateBoard", [game.boardstate, game.curPlayer]);
                    }

                    saveSession(game, roomid);
                    if (checkForWin(game.curPlayer, game.boardstate)) {
                        io.in(roomid.toString()).emit("won", game.curPlayer);
                    }
                } else if (movestatus == 1) {
                    socket.emit("clientError", "not your turn yet");
                } else if (movestatus == 2) {
                    socket.emit("clientError", "You have a jump that you need to take");
                } else if (movestatus == 3) {
                    socket.emit("clientError", "That's not a valid move!");
                }
                
        }});

    //Disconnection Handler
    //Save game state in file
    //Send opponent disconnected message to client
    socket.on('disconnect', function(socket){

        if(isgame){
        console.log("user disconnected, saving game");
        saveSession(game,roomid);
        console.log("sending error to other player.");
        io.in(roomid.toString()).emit("oppoentDC","The opponent left")
        }

    });
});
