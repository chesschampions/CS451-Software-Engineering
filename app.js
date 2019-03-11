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


//TODO: Add try catch blocks to open and save sessions.
function openSession(gamefilename,roomid){
    console.log("opening session " + roomid);
    var gameObjBuff = fs.readFile(__dirname + "/Sessions/" + roomid);
    var gameObj = JSON.parse(gameObjBuff.toString());
    return gameObj;
}
function saveSession(gameObj, roomid){
    console.log("saving session " + roomid);
    var gameObjString = gameObj.toString();
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
        curPlayer : "X",
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
            const sessions= fs.readdir('Session');
            for (let session in sessions){
                if(parseInt(session) === msg ) {
                    roomid = parseInt(session);
                    socket.emit("playerName","O");
                    socket.join(roomid);
                    openSession(game,roomid);
                    isgame = true;
                }
            }
            //No room found send error to client.
            if (roomid === -2) { socket.emit("error", "No game found")}
        } else {
            console.log("bad message received.");
            //error to client.
            socket.emit("error", "invalid game ID");
        }
    });

    socket.on("moveReq", function(msg){
        //temp value for addedmove
        var validmove = gameengine.movevalidator(msg);
        if(validmove){
            //game.boardstate = GameEngine.makemove(game.boardstate,msg);
            io.to(roomid).emit("updateBoard", game.boardstate);
        } else {
            socket.emit("error","bad move");
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
        io.to(roomid).emit("oppoentDC","The opponent left")
        }
    });
});
