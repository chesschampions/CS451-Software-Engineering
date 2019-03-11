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
function makeMove(gameobj,movereq){
    var nextmove = [[movereq[1],movereq[2]], [movereq[3],movereq[4]]];
    var boardchar = gameobj.boardstate[nextmove[0][0]][nextmove[0][1]];

    gameobj.boardstate[nextmove[0][0]][nextmove[0][1]] = 0;
    gameobj.boardstate[nextmove[1][0]][nextmove[1][1]] = boardchar;
    if (gameobj.curPlayer === "X") {gameobj.curPlayer = "O";} else {gameobj.curPlayer = "X";}
    return gameobj;
}


let gameEngine = class gameengine {
    movevalidator(gameobj, movereq) {

    }


    mandatoryJump(player){
        var allPieces = document.getElementsByClassName("black");
        var myPieces = [];

        if(player === "O"){
            for(i = 0; i<allPieces.length; i++){
                if(allPieces[i].textContent === "O")
                    myPieces.push(allPieces[i]);
            }
        } else {
            for(i = 0; i<allPieces.length; i++){
                if(allPieces[i].textContent === "X")
                    myPieces.push(allPieces[i]);
            }
        }

        for(i = 0; i<myPieces.length; i++){
            var pieceID = myPieces[i].id;
            var row = parseInt(pieceID);
            row = row < 10? 0 : Math.floor(row / 10);
            var column = parseInt(pieceID);
            column = column % 10;
            var listOfMoves = checkR(row, column);
            if(listOfMoves.length !== 0){
                alert("has mandatory move is true");
                return true;
            }
        }
        return false;
    }
}

//TODO: Add try catch blocks to open and save sessions.
function openSession(gamefilename,roomid){
    console.log("opening session " + roomid);
    fs.readFile(__dirname + "/Sessions/" + roomid, function(err,gameObjBuff){
        console.log("Loaded!");
        return JSON.parse(gameObjBuff.toString());
    });
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
            socket.join(roomid);
            console.log("Added session and made a new io room");
            // emits the game id back to the client
            socket.emit("gid", roomid);
            socket.emit("playerName","X");
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

                        socket.emit("playerName","O");
                        socket.emit("gid", roomid);
                        socket.join(roomid);
                        openSession(game,roomid);
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
        //temp value for addedmove
         //var validmove = gameengine.movevalidator(msg);
        console.log("Recived Move Request");
        if(true){
            game = makeMove(game,msg);
            console.log("sending move res");
            socket.to(roomid).emit("updateBoard", [game.curPlayer, game.boardstate]);
            fn(true);
            //socket.emit("moveRes",true);
        } else {
            fn(false);
            //socket.emit("moveRes",false);
            socket.emit("clientError","bad move");
        }
    });

    //Disconnection Handler
    //Save game state in file
    //Send opponent disconnected message to client
    socket.on('disconnect', function(socket){

        if(isgame){
        console.log("user disconnected, saving game");
        saveSession(game,roomid);
        console.log("sending error to other player.");
        socket.to(roomid).emit("oppoentDC","The opponent left")
        }

    });
});
