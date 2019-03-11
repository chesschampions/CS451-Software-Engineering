
//globals

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

var lastHighlightedMoves = [];
var potentiallyEatenPieces = [];

var currentlySelectedPiece;
var pieceWasKinged = false;
var pieceWasEaten = false;
var hasMandatoryMove = false;

var player = 0;// players are either player 0 (O/Q) or player 1(X/Z), this is used to determine who's turn it is to move

function reply_click(clicked_id)
{
    var row = parseInt(clicked_id);
    row = row < 10? 0 : Math.floor(row / 10);
    var column = parseInt(clicked_id);
    column = column % 10;
    var listOfMoves = [];
    var clickedSquare = document.getElementById(clicked_id);
    
    if(clickedSquare.textContent == "") {

    	
    	if(clickedSquare.className == "green"){
    		movePiece(clickedSquare, row, column);
    		//player = player==0? 1 : 0;
    	}
    	/*if(pieceWasEaten){
    		if(pieceWasKinged){ //if a piece was eaten, but resulted in a king then it's the other person's turn
    		player = player==0? 1 : 0;
    		pieceWasKinged = false;//untoggle flag
    		pieceWasEaten = false;//untoggle flag
    		} else if(hasMandatory()){ // if a piece was eaten and there's another piece available to be eaten
    			//currentClickedSquare is now the location of the piece that has a mandatory move
    			hasMandatoryMove = true;
    			pieceWasEaten = false;
    		} else {
    			pieceWasEaten = false;
    			player = player==0? 1 : 0;
    			hasMandatoryMove = false;
    		}
    	} else {
    		pieceWasEaten = false; //just making sure toggles are reset with each new turn
    		pieceWasKinged = false;
    		hasMandatoryMove = false;
    	}*/
    	
    	currentlySelectedPiece = null;
    	clearLastHighlightedMoves();
    } else {
    	currentlySelectedPiece = clickedSquare;
    	listOfMoves = checkR(row, column);
    	clearLastHighlightedMoves();

    	if(listOfMoves == ""){
    		listOfMoves = checkG(row, column);
    		for (i = 0; i<listOfMoves.length; i++){
    			var temp = listOfMoves[i].toString();
    			if(temp.length==1){
    				temp = "0"+temp;
    			}
    			potentiallyEatenPieces = [];
    			document.getElementById(temp).className = "green";
    			lastHighlightedMoves.push(temp);
    		}
    	} else {
    		for (i = 0; i<listOfMoves.length/2; i++){
    			var temp = listOfMoves[i].toString();
    			if(temp.length==1){
    				temp = "0"+temp;
    			}
    		for (i = listOfMoves.length/2; i<listOfMoves.length; i++){
    			potentiallyEatenPieces.push(listOfMoves[i]);
    		}
    			document.getElementById(temp).className = "green";
    			lastHighlightedMoves.push(temp);
    		}
    	}
    	
    	
    }
}



function hasMandatory()
{
	var allPieces = document.getElementsByClassName("black");
	var myPieces = [];
	if(player == 0){//the 0th player is O + Q
		for(i = 0; i<allPieces.length; i++){
			if(allPieces[i].textContent == "O")
				myPieces.push(allPieces[i]);
			if(allPieces[i].textContent == "Q")
				myPieces.push(allPieces[i]);
		}
	} else {//if you're not the 0th player, then you're player 1 and are X + Z
		for(i = 0; i<allPieces.length; i++){
			if(allPieces[i].textContent == "X")
				myPieces.push(allPieces[i]);
			if(allPieces[i].textContent == "Z")
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
    	if(listOfMoves.length != 0){
    		alert("has mandatory move is true");
    		return true;
    	}
	}

	return false;
}

//note the row and column are of the location you're moving to
//row1 and col1 are the location of the piece that is moving
function movePiece(clickedSquare, row, column)
{
	clickedSquare.textContent = currentlySelectedPiece.textContent;//make the newly selected square house the "piece"
    currentlySelectedPiece.textContent = ""; //make the old location "empty"
    clickedPieceID = currentlySelectedPiece.id; //get the id of the currently selected piece (the piece, not the square)
    var row1 = parseInt(clickedPieceID); //turn the id into row/column
    row1 = row1 < 10? 0 : Math.floor(row1 / 10);
    var column1 = parseInt(clickedPieceID);
    column1 = column1 % 10;
    board[row][column] = board[row1][column1];//swap board information
    board[row1][column1] = 0;
    checkCoronation(clickedSquare, row, column);
    checkToSeeIfPieceEaten(row1, column1, row, column)
    currentlySelectedPiece = null;
}

//eRow and eColumn are the row and column of the empty square the piece is moving to
//mRow and mColumn are the row and column of the Moving piece's original location
function checkToSeeIfPieceEaten(eRow, eColumn, mRow, mColumn){

	dyingPieceRow = (eRow + mRow)/2;
	dyingPieceColumn = (eColumn + mColumn)/2;
	dyingCoordinates = dyingPieceRow*10 + dyingPieceColumn;

	for(i = 0; i < potentiallyEatenPieces.length; i++){
		if(dyingCoordinates == potentiallyEatenPieces[i]){
			document.getElementById(dyingCoordinates.toString()).textContent = "";
			board[dyingPieceRow][dyingPieceColumn] = 0;
			pieceWasEaten = true;
		}
	}

	potentiallyEatenPieces = []
}

function checkCoronation(clickedSquare, row, column)
{
	if(row == 7 && clickedSquare.textContent == "O"){
		clickedSquare.textContent = "Q";
		board[row][column] = 2;
		pieceWasKinged = true;
	}
	if(row == 0 && clickedSquare.textContent == "X"){
		clickedSquare.textContent = "Z";
		board[row][column] = 4;
		pieceWasKinged = true;
	}
}

function clearLastHighlightedMoves()
{
	for (i = 0; i<lastHighlightedMoves.length; i++){
    		document.getElementById(lastHighlightedMoves[i]).className = "black";
    	}
	lastHighlightedMoves = [];
}

//given the coordinates of a piece, checks which spaces it can move to that DO NOT involve capturing another piece
function checkG(y, x)
{
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
					if(board[y-1][x+1]==0){
						moves[holder]=(y-1)*10+x+1;
						holder+=1;
					}
				}
			}
		}
		else if(type==3||type==4){
			//checks forward moves
			if(x>0&&y<8 && y!=0){
				if(board[y-1][x-1]==0){
					moves[holder]=(y-1)*10+x-1;
					holder+=1;
				}
			}
			if(x<7&&y<8 && y!=0){
				if(board[y-1][x+1]==0){
					moves[holder]=(y-1)*10+x+1;
					holder+=1;
				}
			}
			if(type==4){
				//checks backwards moves for kingpieces
				if(x>0&&y>=0){
					if(board[y+1][x-1]==0){
						moves[holder]=(y+1)*10+x-1;
						holder+=1;
					}
				}
				if(x<7&&y>=0){
					if(board[y+1][x+1]==0){
						moves[holder]=(y+1)*10+x+1;
						holder+=1;
					}
				}
			}
		}
		return moves;
}

//given the coordinates of a piece, checks which spaces it can move to that involve capturing another piece
function checkR(y, x)
{
		//returns array of possible jump moves(red fields)
		var type = board[y][x];
		var moves = [];
		var holder = 0;

		var correspondinglyEatenPieces = [];
		var iterator = 0;

		//alert(type + " " + y + x);
		if(type == 1){
			if(y==6)
				return [];
		}
		if(type == 2){
			if(y == 6 || y == 7){
				//checks backwards moves for kingpieces
				if(x>1&&y>1){
					if(board[y-1][x-1]>2){
						if(board[y-2][x-2]==0){
						moves[holder]=(y-2)*10+x-2;
						holder++;
						correspondinglyEatenPieces[iterator]=(y-1)*10+x-1;
						iterator++;
					}
					}
				}
				if(x<6&&y>1){
					if(board[y-1][x+1]>2){
						if(board[y-2][x+2]==0){
						moves[holder]=(y-2)*10+x+2;
						holder++;
						correspondinglyEatenPieces[iterator]=(y-1)*10+x+1;
						iterator++;
					}
					}
				}
			
			for(i = 0; i<correspondinglyEatenPieces.length; i++){
				moves.push(correspondinglyEatenPieces[i]);
			}
			return moves;
			}
		}

		if(type == 3){
			if(y==1){
				return [];
			}
		}

		if(type == 4){
			if(y ==1 || y == 0){
				if(board[y+1][x-1]<2){
					if(board[y+2][x-2]==0){
						moves[holder]=(y+2)*10+x-2;
						holder+=1;
						correspondinglyEatenPieces[iterator]=(y+1)*10+x-1;
						iterator++;
					}
				}
			}
			if(x<6&&y<6){
				if(board[y+1][x+1]<2){
					if(board[y+2][x+2]==0){
						moves[holder]=(y+2)*10+x+2;
						holder+=1;
						correspondinglyEatenPieces[iterator]=(y+1)*10+x+1;
						iterator++;
					}
				}
			}
			for(i = 0; i<correspondinglyEatenPieces.length; i++){
				moves.push(correspondinglyEatenPieces[i]);
			}
			return moves;
		}

		if(type==1||type==2){
			//checks forward moves
			if(x>=1&&y<6){
				if(board[y+1][x-1]>2){
					if(board[y+2][x-2]==0){
						moves[holder]=(y+2)*10+x-2;
						holder+=1;
						correspondinglyEatenPieces[iterator]=(y+1)*10+x-1;
						iterator++;
					}
				}
			}
			if(x<6&&y<6){
				if(board[y+1][x+1]>2){
					if(board[y+2][x+2]==0){
						moves[holder]=(y+2)*10+x+2;
						holder+=1;
						correspondinglyEatenPieces[iterator]=(y+1)*10+x+1;
						iterator++;
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
						correspondinglyEatenPieces[iterator]=(y-1)*10+x-1;
						iterator++;
					}
					}
				}
				if(x<6&&y>1){
					if(board[y-1][x+1]>2){
						if(board[y-2][x+2]==0){
						moves[holder]=(y-2)*10+x+2;
						holder+=1;
						correspondinglyEatenPieces[iterator]=(y-1)*10+x+1;
						iterator++;
					}
					}
				}
			}
		}
		else if(type==3||type==4){
			//checks forward moves
			if(x>1&&y<8){
				if(board[y-1][x-1]<3&&board[y-1][x-1]>0){
					if(board[y-2][x-2]==0){
						moves[holder]=(y-2)*10+x-2;
						holder+=1;
						correspondinglyEatenPieces[iterator]=(y-1)*10+x-1;
						iterator++;
					}
				}
			}
			if(x<6&&y<8){
				if(board[y-1][x+1]<3&&board[y-1][x+1]>0){
					if(board[y-2][x+2]==0){
						moves[holder]=(y-2)*10+x+2;
						holder+=1;
						correspondinglyEatenPieces[iterator]=(y-1)*10+x+1;
						iterator++;
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
						correspondinglyEatenPieces[iterator]=(y+1)*10+x-1;
						iterator++;
					}
					}
				}
				if(x<6&&y>1){
					if(board[y+1][x+1]<3&&board[y-1][x+1]>0){
						if(board[y-2][x+2]==0){
						moves[holder]=(y+2)*10+x+2;
						holder+=1;
						correspondinglyEatenPieces[iterator]=(y+1)*10+x+1;
						iterator++;
					}
					}
				}
			}
		}

		for(i = 0; i<correspondinglyEatenPieces.length; i++){
			moves.push(correspondinglyEatenPieces[i]);
		}
		return moves;
}
