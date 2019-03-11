class gameengine {
    movevalidator(gameobj, player, move) {

    }
    //Move is a three element list of the form [[curx,cury],[nextx,nexty],player] where player can be 1/2 or -1/-2. (depending on if it's a king piece of not). board
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

    moveValidator(curBoardState,move){
        var movingPiece = move[2];
        //Check if forward move
        if (move[0][1] > move[1][1]){
            // check if jump is mandatory

        } else if (movingPiece === -2 || movingPiece === 2) {
            // check if jump is mandatory
        } else {
            return false;
        }
        // check if jump is mandatory
        // check for diagonal or cross movement.
        // check for two space or single.
        //   if two space check for valid jump.
    }

    makeMove(boardState,move){

    }
}