let mainBoard = {
    boardCells:[['', '', ''], ['', '', ''] ,['', '', '']],
    depth: 0
    };
let win = 0, lose = 0, draw = 0;
var winElement = document.getElementById("win");
var loseElement = document.getElementById("lose");
var drawElement = document.getElementById("draw");
var cells = document.getElementsByClassName("cell");
var realPlayerX = document.getElementById("player-x");
var realPlayerO = document.getElementById("player-o");
var resetButton = document.getElementById("reset");
var realPlayer = "x";
var pcPlayer = "o";
reset();


realPlayerX.addEventListener("click", rPlayerX);
realPlayerO.addEventListener("click", rPlayerO);

function ResetScore(){
    location.assign(location.href);
}

function rPlayerX(){
    realPlayer = "x";
    pcPlayer = "o";
    realPlayerX.classList.add("inactive");
    realPlayerO.classList.add("inactive");
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', eventListener);
        cells[i].classList.remove("inactive-cells");
    }
    realPlayerX.removeEventListener("click", rPlayerX);
    realPlayerO.removeEventListener("click", rPlayerO);
}
function rPlayerO(){
    realPlayer = "o";
    pcPlayer = "x";
    realPlayerX.classList.add("inactive");
    realPlayerO.classList.add("inactive");
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', eventListener);
        cells[i].classList.remove("inactive-cells");
    }
    randomPcmove();
    realPlayerX.removeEventListener("click", rPlayerX);
    realPlayerO.removeEventListener("click", rPlayerO);
}

function reset(){
    for (let i = 0; i < mainBoard.boardCells.length; i++) {
        for (let j = 0; j < mainBoard.boardCells[i].length; j++) {
            mainBoard.boardCells[i][j] = '';
        }
        
    }
    mainBoard.depth = 0;
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
        cells[i].classList.remove("win-cells");
        cells[i].removeEventListener("click", eventListener);
    }
    updateScoreBoard();
    realPlayerX.classList.remove("inactive");
    realPlayerO.classList.remove("inactive");
    realPlayerX.addEventListener("click", rPlayerX);
    realPlayerO.addEventListener("click", rPlayerO);
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.add("inactive-cells");
    }
}


function updateScoreBoard(){
    winElement.innerHTML = "win: " + win;
    loseElement.innerHTML = "lose: " + lose;
    drawElement.innerHTML = "draw: " + draw
}


function randomPcmove() {
    let x = Math.round(Math.pow(Math.random(), Math.random()) * 1000) % 3;
    let y = Math.round(Math.pow(Math.random(), Math.random()) * 1000) % 3;
    let obj = document.getElementById(x.toString() + y.toString());
    sketch(obj, pcPlayer, "pc");
};


function moveScore(score, x, y){
    this.score = score;
    this.x = x;
    this.y = y;
}

var eventListener = function(){sketch(this, realPlayer, "real")};

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

function winCells(board, type){
    for (let i = 0; i < 3; i++) {
        if(board.boardCells[i][0] == type && board.boardCells[i][1] == type && board.boardCells[i][2] == type){
            return ([[i, 0],[i, 1],[i, 2]]);
        }
        else if(board.boardCells[0][i] == type && board.boardCells[1][i] == type && board.boardCells[2][i] == type){
            return ([[0, i],[1, i],[2, i]]);
        }
    }

    if(board.boardCells[0][0] == type && board.boardCells[1][1] == type && board.boardCells[2][2] == type){
            return [[0, 0], [1, 1], [2, 2]];
        }
    else if(board.boardCells[0][2] == type && board.boardCells[1][1] == type && board.boardCells[2][0] == type){
        return [[0, 2], [1, 1], [2, 0]];
    }
    else{
        return null;
    }
    
}
function isEmpty(board, x, y){
    return (board.boardCells[x][y] == '');
}

function sketch(obj, type, player){
    let position = obj.getAttribute('id');
    let x = parseInt(position[0]);
    let y = parseInt(position[1]);
    if(!isEmpty(mainBoard, x, y)){
        return false;
    }
    if(type == "x"){
        obj.innerHTML = "x";
        mainBoard.boardCells[x][y] = "x";
    }
    else{
        obj.innerHTML = "o";
        mainBoard.boardCells[x][y] = "o";
    }
    
    if(isWin(mainBoard, type)){
        let winCels = winCells(mainBoard, type);
        let cel1 = document.getElementById((winCels[0][0]).toString() + winCels[0][1]);
        let cel2 = document.getElementById((winCels[1][0]).toString() + winCels[1][1]);
        let cel3 = document.getElementById((winCels[2][0]).toString() + winCels[2][1]);
        cel1.classList.add("win-cells");
        cel2.classList.add("win-cells");
        cel3.classList.add("win-cells");
        if(player == pcPlayer){
            lose++;
        }
        else{
            win++;
        }
        setTimeout(reset, 1500);
        return;
    }

    if(emptyCells(mainBoard).length == 0){
        draw++;
        setTimeout(reset, 1500);
    }
    if(player == "real" && emptyCells(mainBoard).length != 0){  
        let bestPcMove = minimax(mainBoard, pcPlayer);
        let x = bestPcMove.x;
        let y = bestPcMove.y;
        let obj = document.getElementById(x.toString() + y.toString());
        sketch(obj, pcPlayer, pcPlayer);
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
