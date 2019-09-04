// the main board is two dimensional array for ease of visualisation like matrices
let mainBoard = {
    boardCells:[['', '', ''], ['', '', ''] ,['', '', '']],
    depth: 0 // the depth is related to the minimax algorithm
};

// the scores of the player are initialized to zero
let win = 0, lose = 0, draw = 0;

//some necessary DOM elements
var winElement = document.getElementById("win"); //element that shows the number of wins
var loseElement = document.getElementById("lose"); //element to show the number of lost games
var drawElement = document.getElementById("draw"); //element to show the number of draw games
var cells = document.getElementsByClassName("cell"); 
var realPlayerX = document.getElementById("player-x"); //the button go first which indicates the player wants to use x
var realPlayerO = document.getElementById("player-o"); //the button go second which indicates the player wants to use o
var resetButton = document.getElementById("reset"); //reset the score and rechoose the difficulty
var difficultySection = document.getElementById("difficulty");
var easy = document.getElementById("easy"); //easy difficulty button
var medium = document.getElementById("medium"); //medium difficulty button
var hard = document.getElementById("hard"); //hard difficulty button
var difficulty  = ''; //variable to store the difficulty chosen by the user 
var maxDepth;  //depending on the difficulty the maxdepth of the minimax algo changes
var realPlayer; //to store the user is using x or o
var pcPlayer; //to store the pc player is using x or o

//to make the go first and second buttons clickable
realPlayerX.addEventListener("click", rPlayerX);
realPlayerO.addEventListener("click", rPlayerO);

//to make chooseDifficulty buttons clickable
easy.onclick = chooseDifficulty;
medium.onclick = chooseDifficulty;
hard.onclick = chooseDifficulty;

//the only function that needs to be called everything call the function it needs
reset();

function chooseDifficulty(){
    //maxdepth is manipulated through the difficulty for the minimax algo
    difficulty = this.getAttribute("id");
    if(difficulty == "easy"){
        maxDepth = 1;
    }
    else if(difficulty == "medium"){
        maxDepth = 2;
    }
    else{
        maxDepth = 20;
    }

    //this makes choose difficulty section fades away slowly
    let i = 1;
    var inter = setInterval( function(){
        difficultySection.style.opacity = i
        i-=0.1;
        if(i <= 0){
            difficultySection.style.opacity = 1;
            difficultySection.style.display = "none";
            clearInterval(inter);
        }
            
    }, 40);
          
}

// gets called when the user clicks reset score button
function ResetScore(){
    location.assign(location.href);
    difficultySection.style.display = "block";
}


//when the user wants to start first (use X)
function rPlayerX(){
    realPlayer = "x";
    pcPlayer = "o";

    //change the shape of the button to make the user know he shouldn't use them at the middle of the game
    realPlayerX.classList.add("inactive");
    realPlayerO.classList.add("inactive");

    //also for more certainty we make the buttons fade away 
    let i = 1;
    var inter = setInterval( function(){
        realPlayerX.style.opacity = i;
        realPlayerO.style.opacity = i;
        i-=0.1;
        if(i <= 0){
            realPlayerX.style.opacity = 0;
            realPlayerO.style.opacity = 0;
            clearInterval(inter);
        }
    }, 50);

    //make the cells clickable for the user to play
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', eventListener);
        cells[i].classList.remove("inactive-cells");
    }

    //buttons disappear but the user can still click on the empty space 
    //so i removed the effect of the click to prevent errors
    realPlayerX.removeEventListener("click", rPlayerX);
    realPlayerO.removeEventListener("click", rPlayerO);
}

//when the user wants to be second to start (use O)
function rPlayerO(){
    //same as the previous function
    realPlayer = "o";
    pcPlayer = "x";
    realPlayerX.classList.add("inactive");
    realPlayerO.classList.add("inactive");
    let i = 1;
    var inter = setInterval( function(){
        realPlayerX.style.opacity = i;
        realPlayerO.style.opacity = i;
        i-=0.1;
        if(i <= 0){
            realPlayerX.style.opacity = 0;
            realPlayerO.style.opacity = 0;
            clearInterval(inter);
        }
    }, 50);
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', eventListener);
        cells[i].classList.remove("inactive-cells");
    }
    randomPcmove();
    realPlayerX.removeEventListener("click", rPlayerX);
    realPlayerO.removeEventListener("click", rPlayerO);
}

//reset the game keeping the score and difficulty unchanged 
function reset(){

    //clearing the content of the cells of the board variable
    for (let i = 0; i < mainBoard.boardCells.length; i++) {
        for (let j = 0; j < mainBoard.boardCells[i].length; j++) {
            mainBoard.boardCells[i][j] = '';
        }
        
    }

    //reseting the depth of the board for the algo
    mainBoard.depth = 0;


    for (let i = 0; i < cells.length; i++) {
        //clearing the content of the cells seen by the user 
        cells[i].innerHTML = "";
        //undo the color of the winnig cells if exist
        cells[i].classList.remove("win-cells");
        //make them unclickable untill the user chooses whether to go first or second
        cells[i].removeEventListener("click", eventListener);
        //make them look unclickable
        cells[i].classList.add("inactive-cells");
    }

    updateScoreBoard();

    //to make the buttons of go first and second slowly emmerge
    let i = 0;
    var inter = setInterval( function(){
        realPlayerX.style.opacity = i;
        realPlayerO.style.opacity = i;
        i+=0.1;
        if(i >= 1){
            realPlayerX.style.opacity = 1;
            realPlayerO.style.opacity = 1;
            clearInterval(inter);
        }
    }, 50);

    //make the buttons to choose x or o to start with be available and clickable
    realPlayerX.classList.remove("inactive");
    realPlayerO.classList.remove("inactive");
    realPlayerX.addEventListener("click", rPlayerX);
    realPlayerO.addEventListener("click", rPlayerO);
}


function updateScoreBoard(){
    winElement.innerHTML = "win: " + win;
    loseElement.innerHTML = "lose: " + lose;
    drawElement.innerHTML = "draw: " + draw
}

//when the user chooses to go second the pc have to make a random move the first time
function randomPcmove() {
    let x = Math.round(Math.pow(Math.random(), Math.random()) * 1000) % 3;
    let y = Math.round(Math.pow(Math.random(), Math.random()) * 1000) % 3;
    let obj = document.getElementById(x.toString() + y.toString());
    sketch(obj, pcPlayer, "pc");
};

//object used in the algorithm to store the score obtained by a certain move
function moveScore(score){
    this.score = score;
    this.x = -1;
    this.y = -1;
    //value is not very necessary but it's useful for some corner case in the medium difficulty
    this.value = 0;
}


//used this method because I needed sketch function to take variables which I can't do with the normal way
var eventListener = function(){sketch(this, realPlayer, "real")};

//to check if a certain type(x or o) have won the game
function isWin(board, type){
    for (let i = 0; i < 3; i++) {
        //horizontal line
        if(board.boardCells[i][0] == type && board.boardCells[i][1] == type && board.boardCells[i][2] == type){
            return true;
        }
        //vertical line
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


//to obtain the cells that won the game to add some color to them to distinguish them from the rest of the table
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

//function that adds the x's and o's to the UI
function sketch(obj, type, player){
    let position = obj.getAttribute('id');
    let x = parseInt(position[0]);
    let y = parseInt(position[1]);

    //to check if the place clicked is empty so we can put something in it or not
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
        //decorate the winning cells
        let winCels = winCells(mainBoard, type);
        let cel1 = document.getElementById((winCels[0][0]).toString() + winCels[0][1]);
        let cel2 = document.getElementById((winCels[1][0]).toString() + winCels[1][1]);
        let cel3 = document.getElementById((winCels[2][0]).toString() + winCels[2][1]);
        cel1.classList.add("win-cells");
        cel2.classList.add("win-cells");
        cel3.classList.add("win-cells");


        if(player == "pc"){
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
        let x, y; 
        do {
            let bestPcMove = minimax(mainBoard, pcPlayer);
            x = bestPcMove.x;
            y = bestPcMove.y; 
            console.log(bestPcMove);   
        } while (x < 0 || y < 0); 
        let obj = document.getElementById(x.toString() + y.toString());
        sketch(obj, pcPlayer, "pc");
    }
}


//returns the empty cells
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

// we will assume that the maximizing player is using x and minimizer is using o
function minimax(board, type){
    //the current call of the function have an initailized bestMove that have score zero which is the draw score i choose
    var bestMove = new moveScore(0);
    let empty = emptyCells(board); //to store the empty cells of the current state of the board

    //if the maximizing player is winning make the score with the winning score of the maximizing player
    //we subtract the depth so that the best move chosen is the closest node 
    if(isWin(board, "x")){
        return (new moveScore(50 - board.depth));
    }
    else if(isWin(board,"o")){
        return (new moveScore(-50 + board.depth));
    }

    //this is for the different difficulties if this was not added the algo will be impossible to beat
    else if(maxDepth <= board.depth){
        return (new moveScore(0));
    }

    //no empty cells thus there is draw and the score is zero for this state
    else if(empty.length == 0){
        return (new moveScore(0));
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
            if(possibleMove.score > 0){
                bestMove.value += possibleMove.score;
            }
            if(possibleMove.score >= bestMove.score){
                if(possibleMove.score > bestMove.score){
                    bestMove = possibleMove;
                }
                else if(possibleMove.value > bestMove.value){
                    bestMove = possibleMove;
                }
            }
        }

        else{
            if(possibleMove.score < 0){
                bestMove.value += possibleMove.score;
            }
            if(possibleMove.score <= bestMove.score){
                if(possibleMove.score < bestMove.score){
                    bestMove = possibleMove;
                }
                else if(possibleMove.value < bestMove.value){
                    bestMove = possibleMove;
                }
            }
        }


        //reset the board back to the state before adding anything in this cell
        board.boardCells[empty[i][0]][empty[i][1]] = '';
        board.depth--;
    }

    return bestMove;
}
