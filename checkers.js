export class checkers {
    constructor(){
        this.curplayer = "red";
        this._boardstate = [];
        //Board creation algorithm

    }
}

class checkersPiece {
    constructor(player,place){
        this._player = player;
        this._place = place;
        this._promoted = false;
        this._canJump = false;
    }

    set canJump(canJump){
        this._canJump = canJump;
    }
    get canJump() {
        return this._canJump;
    }

    get place() {
        return this._place;
    }

    set place(value) {
        this._place = value;
    }

    set player(value) {
        this._player = value;
    }

    get player() {
        return this._player;
    }

    set promoted(value) {
        this._promoted = value;
    }

    get promoted() {
        return this._promoted;
    }

}
module.exports = checkers;