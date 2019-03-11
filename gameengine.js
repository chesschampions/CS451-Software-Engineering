class gameengine {
    movevalidator(gameobj, movereq) {
        if gameobj.curPlayer = move[0];

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
}