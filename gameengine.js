class gameengine {
    movevalidator(gameobj, movereq) {

    }

    //move a 2d array of xys of the form [[origrow,origcol],[newrow, newcol]]
    //returns the new gameobj
    makeMove(gameobj,movereq){
        var nextmove = [[movereq[1],movereq[2]], [movereq[3],movereq[4]]];
        var boardchar = gameobj.boardstate[nextmove[0][0]][nextmove[0][1]];

        gameobj.boardstate[nextmove[0][0]][nextmove[0][1]] = 0;
        gameobj.boardstate[nextmove[1][0]][nextmove[1][1]] = boardchar;
        if (gameobj.curPlayer === "X") {gameobj.curPlayer = "O";} else {gameobj.curPlayer = "X";}
        return gameobj;
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