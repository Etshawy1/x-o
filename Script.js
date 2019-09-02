var mainBoard = {
    boardCells:[['', '', ''], ['', '', ''] ,['', '', '']],
    depth: 0
    };

var pcPlayer = "x";
var realPlayer = "o";

var cells = document.getElementsByClassName("cell");
for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', handleEvent(cells[i], realPlayer));
}
if(pcPlayer == "x"){
    randomPcmove();
}




function randomPcmove() {
    let x = Math.round(Math.pow(Math.random(), Math.random()) * 1000) % 3;
    let y = Math.round(Math.pow(Math.random(), Math.random()) * 1000) % 3;
    let obj = document.getElementById(x.toString() + y.toString());
    draw(obj, pcPlayer, "pc");
};


function moveScore(score, x, y){
    this.score = score;
    this.x = x;
    this.y = y;
}

function handleEvent(obj, type) {
    return function() {
        draw(obj, type, "real"); 
    };
}

function isWin(board, type){
    for (let i = 0; i < 3; i++) {
        if(board.boardCells[i][0] == type && board.boardCells[i][1] == type && board.boardCells[i][2] == type){
            return true;
        }
        else if(board.boardCells[0][i] == type && board.boardCells[1][i] == type && board.boardCells[2][i] == type){
            return true;
        }
    }

    if(board.boardCells[0][0] == type && board.boardCells[1][1] == type && board.boardCells[2][2] == type
        || board.boardCells[0][2] == type && board.boardCells[1][1] == type && board.boardCells[2][0] == type){
            return true;
        }
    return false;
}

function isEmpty(board, x, y){
    return (board.boardCells[x][y] == '');
}

function draw(obj, type, player){
    obj.style.backgroundSize = "100% 100%";
    let position = obj.getAttribute('id');
    let x = parseInt(position[0]);
    let y = parseInt(position[1]);
    if(!isEmpty(mainBoard, x, y)){
        return false;
    }
    if(type == "x"){
        obj.style.backgroundImage = `url('X.png')`;
        mainBoard.boardCells[x][y] = "x";
    }
    else{
        obj.style.backgroundImage = `url('O.png')`;
        mainBoard.boardCells[x][y] = "o";
    }
    
    if(isWin(mainBoard, type)){
        if(player == pcPlayer){
            document.write("you lose");    
        }
        else{
            document.write("you win");
        }
        setTimeout(() => {
            location.assign(location.href);
        }, 1000);
        return;
    }

    if(emptyCells(mainBoard).length == 0){
        document.write("It's a draw");
        setTimeout(() => {
            location.assign(location.href);
        }, 1000);
    }
    if(player == "real"){  
        let bestPcMove = minimax(mainBoard, pcPlayer);
        let x = bestPcMove.x;
        let y = bestPcMove.y;
        let obj = document.getElementById(x.toString() + y.toString());
        draw(obj, pcPlayer, pcPlayer);
    }
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

// we will assume that the maximizing player is using x and minimizer is using x
function minimax(board, type){
    var bestMove = new moveScore(0, -1, -1);
    let empty = emptyCells(board);

    //if the maximizing player is winning make the score with the winning score of the maximizing player
    //we subtract the depth so that the best move chosen is the closest node 
    if(isWin(board, "x")){
        return (new moveScore(50 - board.depth, -1, -1));
    }
    else if(isWin(board,"o")){
        return (new moveScore(-50 + board.depth, -1, -1));
    }

    //no empty cells thus there is draw and the score is zero for this state
    else if(empty.length == 0){
        return (new moveScore(0, -1, -1));
    }

    //initialize the maximizing player with a very low score
    if(type == "x"){
        bestMove.score = -100;
    }
    //initialize the minimizing player with a very high score
    else{
        bestMove.score = 100;
    }
    //we try every empty cell
    for (let i = 0; i < empty.length; i++) {
        board.boardCells[empty[i][0]][empty[i][1]] = type;
        board.depth++;
        //now the other player will try to play
        let possibleMove = minimax(board, type == "x" ? "o" : "x");
        possibleMove.x = empty[i][0];
        possibleMove.y = empty[i][1];
        if(type == "x"){
            if(possibleMove.score > bestMove.score){
                bestMove = possibleMove;
            }
        }
        else{
            if(possibleMove.score < bestMove.score){
                bestMove = possibleMove;
            }
        }
        board.boardCells[empty[i][0]][empty[i][1]] = '';
        board.depth--;
    }
    return bestMove;
}

