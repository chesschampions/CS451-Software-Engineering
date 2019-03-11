
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

var currentlySelectedPiece;

function reply_click(clicked_id)
{
	var canMove = false;
	var movereq = [player, row, column];
	io.emit("moveReq",);

    var row = parseInt(clicked_id);
    row = row < 10? 0 : Math.floor(row / 10);
    var column = parseInt(clicked_id);
    column = column % 10;
    var listOfMoves = [];
    var clickedSquare = document.getElementById(clicked_id);
    
    if(clickedSquare.textContent === "") {
    	/*if(hasMandatory(currentlySelectedPiece.textContent)){
    		if(isEatingPiece(clicked_id, currentlySelectedPiece.textContent)){
    			if(clickedSquare.className == "green"){
    				movePiece(clickedSquare, row, column);
    			} else {
    				alert("You must take a piece if able");
    			}
    		}
    	} else */
    	if(clickedSquare.className === "green" && canMove === true)
    		movePiece(clickedSquare, row, column);
    	}
    	
    	currentlySelectedPiece = null;
    	clearLastHighlightedMoves();
    } else {
    	currentlySelectedPiece = clickedSquare;
    	listOfMoves = checkR(row, column);
    	if(listOfMoves == ""){
    		listOfMoves = checkG(row, column);
    	}
    	clearLastHighlightedMoves();
    	for (i = 0; i<listOfMoves.length; i++){
    		var temp = listOfMoves[i].toString();
    		document.getElementById(temp).className = "green";
    		lastHighlightedMoves.push(temp);
    	}
    }
}

function hasMandatory(player){
	var allPieces = document.getElementsByClassName("black");
	var myPieces = [];
	if(player == "O"){
		for(i = 0; i<allPieces.length; i++){
			if(allPieces[i].textContent == "O")
				myPieces.push(allPieces[i]);
		}
	} else {
		for(i = 0; i<allPieces.length; i++){
			if(allPieces[i].textContent == "X")
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

function isEatingPiece(clicked_id, player){
	var allPieces = document.getElementsByClassName("black");
	var myPieces = [];
	if(player == "O"){
		for(i = 0; i<allPieces.length; i++){
			if(allPieces[i].textContent == "O")
				myPieces.push(allPieces[i]);
		}
	} else {
		for(i = 0; i<allPieces.length; i++){
			if(allPieces[i].textContent == "X")
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
    	
    	for(j = 0; j<listOfMoves; j++){
    		if(parseInt(clicked_id) == listOfMoves[j])
    			alert("is eating piece is true");
    			return true;
    	}

	}

	return false;
}

function movePiece(clickedSquare, row, column)
{
	clickedSquare.textContent = currentlySelectedPiece.textContent;
    currentlySelectedPiece.textContent = "";
    clickedPieceID = currentlySelectedPiece.id;
    var row1 = parseInt(clickedPieceID);
    row1 = row1 < 10? 0 : Math.floor(row1 / 10);
    var column1 = parseInt(clickedPieceID);
    column1 = column1 % 10;
    board[row][column] = board[row1][column1];
    board[row1][column1] = 0;
    currentlySelectedPiece = null;
}

function clearLastHighlightedMoves()
{
	for (i = 0; i<lastHighlightedMoves.length; i++){
    		document.getElementById(lastHighlightedMoves[i]).className = "black";
    	}
	lastHighlightedMoves = [];
}

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

function checkR(y, x)
{
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