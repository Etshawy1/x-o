var mainBoard = {
    boardCells:[['', '', ''], ['', '', ''] ,['', '', '']],
    value : 0,
    move:[],
    depth: 0
    };
//false means x turn true means y turn
var aiPlayer = false;
var turn = true;
var posibilities = [];

var cells = document.getElementsByClassName("cell");
for (let i = 0; i < cells.length; i++) {
    cells[i].onclick = draw;
}


var move = {move:[]};
move.move.push(Math.round(Math.pow(Math.random(), Math.random()) * 1000) % 3);
move.move.push(Math.round(Math.pow(Math.random(), Math.random()) * 1000) % 3);
aiDraw(move);









function isWin(board, x, y){
    if(x > 2 || x < 0 || y > 2 || y < 0)
    {
        console.log("wrong position");
        return false;
    }
    if(objectAt(board, x, 0) == objectAt(board, x, 1) &&
     objectAt(board, x, 1) == objectAt(board, x, 2)){
         return true;
    }
    else if(objectAt(board, 0, y) == objectAt(board, 1, y) &&
    objectAt(board, 1, y) == objectAt(board, 2, y)){
        return true;
    }
    else if( x == y && objectAt(board, 0, 0) == objectAt(board, 1, 1) &&
    objectAt(board, 1, 1) == objectAt(board, 2, 2)){
        return true;
    }
    else if( x + y == 2 && objectAt(board, 0, 2) == objectAt(board, 1, 1) &&
    objectAt(board, 1, 1) == objectAt(board, 2, 0)){
        return true;
    }
    else {
        return false;
    }

}

function copyBoard(original){
    var copy = {
        boardCells: original.boardCells.map(function(arr) {
            return arr.slice();
        }),
        value: original.value,
        move: original.move.slice(),
        depth: original.depth
    }
    return copy;
}

function objectAt(board, x, y){
    return board.boardCells[x][y];
}
function isEmpty(board, x, y){
    return (board.boardCells[x][y] == '');
}

function draw(){
    posibilities.length = 0;
    this.style.backgroundSize = "100% 100%";
    let position = this.getAttribute('id');
    let x = parseInt(position[0]);
    let y = parseInt(position[1]);
    if(!isEmpty(mainBoard, x, y)){
        return;
    }
    if(!turn){
        this.style.backgroundImage = `url('X.png')`;
        mainBoard.boardCells[x][y] = "x";
    }
    else{
        this.style.backgroundImage = `url('O.png')`;
        mainBoard.boardCells[x][y] = "o";
    }
    
    if(isWin(mainBoard, x, y)){
        if(turn){
            document.write("o player wins");
        }
        else{
            document.write("x player wins");
        }
        setTimeout(() => {
            location.assign(location.href);
        }, 2000);
        return;
    }
    //turn = !turn;
    if(emptyCells(mainBoard).length == 0){
        document.write("It's a draw");
        setTimeout(() => {
            location.assign(location.href);
        }, 2000);
    }
    minimax(mainBoard, !aiPlayer);
    var aimove = posibilities[0]
    for (let i = 1; i < posibilities.length; i++) {
        if(aimove.value < posibilities[i].value || posibilities[i].value == 99){
            aimove = posibilities[i];
        }
    }
    setTimeout(() => {
        aiDraw(aimove)    
    }, 1000) ;
}

function emptyCells(board){
    var cells = [];
    for (let i = 0; i < board.boardCells.length; i++) {
        for (let j = 0; j < board.boardCells[i].length; j++) {
            if(isEmpty(board, i, j)){
                cells.push([i, j]);
            }
            
        }
        
    }
    return cells;
}


function minimax(board, maximizer){
    let empty = emptyCells(board);
    if( empty.length == 0){
        posibilities.push(board);
        return;    
    }
    if(maximizer){
        for (let i = 0; i < empty.length; i++) {
            let temp = copyBoard(board);
            temp.boardCells[empty[i][0]][empty[i][1]] = "x";
            temp.move.push(empty[i][0]);
            temp.move.push(empty[i][1]);
            temp.depth++;
            if(!aiPlayer && isWin(temp, empty[i][0], empty[i][1])){
                temp.value = 100 - temp.depth;
                posibilities.push(temp);
                return;
            }
            // if the aiplayer was using o and putting x is making the player win
            else if(aiPlayer && isWin(temp, empty[i][0], empty[i][1])){
                return;
            }
            minimax(temp, !maximizer);
        }
    }
    else{
        for (let i = 0; i < empty.length; i++) {
            let temp = copyBoard(board);
            temp.boardCells[empty[i][0]][empty[i][1]] = "o";
            temp.depth++;
            if(aiPlayer && isWin(temp, empty[i][0], empty[i][1])){
                temp.value = -100 + temp.depth;
                posibilities.push(temp);
                return;
            }
            else if(!aiPlayer && isWin(temp, empty[i][0], empty[i][1])){
                temp.value = 98;
                temp.boardCells[empty[i][0]][empty[i][1]] = "x"
                temp.move[0] = empty[i][0];
                temp.move[1] = empty[i][1];
                posibilities.push(temp);
                return;
            }
            minimax(temp, !maximizer);
            
        }
    }
}
function aiDraw(move)
{
    let x = move.move[0];
    let y = move.move[1];
    console.log(x);
    var dr = document.getElementById(x.toString() + y.toString());
    dr.style.backgroundSize = "100% 100%";
    mainBoard.boardCells[x][y] = "x";
    dr.style.backgroundImage = `url('X.png')`;
}