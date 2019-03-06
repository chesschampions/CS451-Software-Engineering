class gameengine {
    //Move is a three element list of the form [[curx,cury],[nextx,nexty],player] where player can be 1/2 or -1/-2. (depending on if it's a king piece of not).

    mandatoryJump(curBoardState,player){
        //Check top and bottom rows

        //Check center rows
        for (let x in curBoardState) {
            for (let y in curBoardState[x]){

            }
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