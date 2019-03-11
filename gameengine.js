class gameengine {
    movevalidator(gameobj, player, move) {

    }
    //Move is a three element list of the form [[curx,cury],[nextx,nexty],player] where player can be 1/2 or -1/-2. 
    //(depending on if it's a king piece of not)
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

    moveValidator(gameobj,movereq){
        var movingPiece = movereq[2];

        // check reqplayer agaisnt curplayer, if not equal, return false
        if (gameobj.curplayer == movereq[0])
        {
            return false;
        }

        if (mandatoryJump(gameobj.curplayer))
        {
            // compile all mandatory jumps for the piece the player wants to move
            var Rmoves = fixSlyMistake(checkR(movereq[1],movereq[2]));
            if (Rmoves.length != 0)
            {
                // there is a mandatory jump for this piece
                if (Romves.includes([movereq[3],movereq[4]]))
                {
                    // move is valid because it is mandatory
                    return true;
                }else{
                    // move is invalid because there is a mandatory move
                    return false;
                }
            }else{
                // move is invalid because there is a mandatory move on a different piece
                return false;
            }
        }else{
            // no mandatory red move for the player, compile all green moves for the piece
            var Gmoves = fixSlyMistake(checkG(movereq[1],movereq[2]))
            if (Gmoves.length == 0)
            {
                // move is invalid because there are no available green move for the piece
                return false;
            }else{
                if (Gmoves.includes([movereq[3],movereq[4]]))
                {
                    // move is valid because it is one of the possible moves
                    return true;
                }else{
                    // move is invalid because it is not one of the possible moves
                    return false;
                }
            }


        }
    }

    makeMove(boardState,move){

    }
    
    // convert sly's germanic coordinate representation into the normal way
    fixSlyMistake(German_moves){
        USA_moves = [];
        var i;
        for (i = 0; i < German_moves.length; i++)
        {	
            var row = parseInt(German_moves[i]);
            row = row < 10 ? 0 : Math.floor(row /10);

            var col = parseInt(German_moves[i]);
            col = col % 10;

            USA_moves.push([row,col]);
            
        }
        return USA_moves;
    }



    checkG(y, x){
        //returns array of regular moves(green fields)
        var type = board[y][x];
        var moves = [];
        var holder = 0;
        if(type==1||type==2){
            //checks forward moves
            if(x>0&&y<7){
                //System.out.print(board[1][2]);
                //System.out.print(y+1);
                if(board[y+1][x-1]==0){
                    moves[holder]=(y+1)*10+x-1;
                    holder+=1;
                }
            }
            if(x<7&&y<7){
                if(board[y+1][x+1]==0){
                    moves[holder]=(y+1)*10+x+1;
                    holder+=1;
                }
            }
            if(type==2){
                if(x>0&&y>0){
                    if(board[y-1][x-1]==0){
                        moves[holder]=(y-1)*10+x-1;
                        holder+=1;
                    }
                }
                if(x<7&&y>0){
                    if(board[y-1][x-1]==0){
                        moves[holder]=(y-1)*10+x+1;
                        holder+=1;
                    }
                }
            }
        }
        else if(type==3||type==4){
            //checks forward moves
            if(x>0&&y<7){
                if(board[y-1][x-1]==0){
                    moves[holder]=(y-1)*10+x-1;
                    holder+=1;
                }
            }
            if(x<7&&y<7){
                if(board[y-1][x+1]==0){
                    moves[holder]=(y-1)*10+x+1;
                    holder+=1;
                }
            }
            if(type==4){
                //checks backwards moves for kingpieces
                if(x>0&&y>0){
                    if(board[y+1][x-1]==0){
                        moves[holder]=(y-1)*10+x-1;
                        holder+=1;
                    }
                }
                if(x<7&&y>0){
                    if(board[y+1][x+1]==0){
                        moves[holder]=(y+1)*10+x+1;
                        holder+=1;
                    }
                }
            }
        }
        return moves;
    }

    checkR(y, x){
    //returns array of possible jump moves(red fields)
    var type=board[y][x];
    var moves=[];
    var holder=0;
    if(type==1||type==2){
        //checks forward moves
        if(x>1&&y<6){
            if(board[y+1][x-1]>2){
                if(board[y+2][x-2]==0){
                    moves[holder]=(y+2)*10+x-2;
                    holder+=1;
                }
            }
        }
        if(x<6&&y<6){
            if(board[y+1][x+1]>2){
                if(board[y+2][x+2]==0){
                    moves[holder]=(y+2)*10+x+2;
                    holder+=1;
                }
            }
        }
        if(type==2){
            //checks backwards moves for kingpieces
            if(x>1&&y>1){
                if(board[y-1][x-1]>2){
                    if(board[y-2][x-2]==0){
                        moves[holder]=(y-2)*10+x-2;
                        holder+=1;
                    }
                }
            }
            if(x<6&&y>1){
                if(board[y-1][x+1]>2){
                    if(board[y-2][x+2]==0){
                        moves[holder]=(y-2)*10+x+2;
                        holder+=1;
                    }
                }
            }
        }
    }
    else if(type==3||type==4){
        //checks forward moves
        if(x>1&&y<6){
            if(board[y-1][x-1]<3&&board[y-1][x-1]>0){
                if(board[y-2][x-2]==0){
                    moves[holder]=(y-2)*10+x-2;
                    holder+=1;
                }
            }
        }
        if(x<6&&y<6){
            if(board[y-1][x+1]<3&&board[y-1][x+1]>0){
                if(board[y-2][x+2]==0){
                    moves[holder]=(y-2)*10+x+2;
                    holder+=1;
                }
            }
        }
        //checks backwards moves for kingpieces
        if(type==4){
            if(x>1&&y>1){
                if(board[y+1][x-1]<3&&board[y-1][x-1]>0){
                    if(board[y-2][x-2]==0){
                        moves[holder]=(y+2)*10+x-2;
                        holder+=1;
                    }
                }
            }
            if(x<6&&y>1){
                if(board[y+1][x+1]<3&&board[y-1][x+1]>0){
                    if(board[y-2][x+2]==0){
                        moves[holder]=(y+2)*10+x+2;
                        holder+=1;
                    }
                }
            }
        }
    }
    return moves;
    }

}