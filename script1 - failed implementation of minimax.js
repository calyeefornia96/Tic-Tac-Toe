$(document).ready(function() {

    function Game() {
        var _this = this,
            moves,
            running,
            playerPiece,
            computerPiece,
            playerTurn,
            playerMoves,
            computerMoves,
            winner,
            overlay = $(".overlay"),
            chooseButton = $(".overlay button"),
            box = $(".box"),
            announcement = $(".title"),
            winConditions = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                [1, 4, 7],
                [2, 5, 8],
                [3, 6, 9],
                [1, 5, 9],
                [3, 5, 7]
            ];
        this.init = function() {
            moves = 9; // max no. of moves
            running = false; //status of game
            playerPiece = ""; //piece of player
            computerPiece = ""; // piece of computer
            playerTurn = false; //computer always go first
            playerMoves = []; //stores player moves
            computerMoves = []; // stores computer moves
            winner = ""; //stores winner - Computer/Player
            chooseButton.off("click"); //removes event listeners
            box.off("click"); //removes event listeners
            box.html("") //clears out the board for fresh start
            choosePiece();
        }; //resets everything

        function choosePiece() {
            if (!running) {
                chooseButton.on("click", function() {
                    playerPiece = $(this).text();
                    computerPiece = playerPiece === 'X' ? 'O' : 'X';
                    playerTurn = playerPiece === 'X' ? true : false; //allow X to go first.
                    overlay.toggle("clip");
                    startGame(); //after choice is made, initialise game with startGame function.
                });
            }
        }

        function startGame() {
            running = true;
            //player doesn't go first, computer does
            if (!playerTurn) {
                setTimeout(computerMove, 500);
            }
            box.click(function() {
                if (occupiedSpace().indexOf(posNum($(this))) !== -1) return; //if box is occupied, nothing happens.

                if (running && playerTurn) {
                    $(this).html("<p class='player'>" + playerPiece + "</p>");
                    playerMoves.push(posNum($(this)));
                    //checks whether player won
                    if (checkWin(playerMoves)) {
                        setTimeout(function() {
                            winner = "player";
                            running = false;
                            announcement.text("you won!");
                            _this.init(); //restarts the game
                        });
                    }

                    moves--; //no winner, continues.
                    if (moves === 0) {
                        setTimeout(function() {
                            winner = "draw";
                            running = false;
                            announcement.text("Draw!");
                            _this.init();
                        }, 500);
                    } //no more moves left, draw and restart
                    playerTurn = false;
                    setTimeout(computerMove, 500);
                }
            });

        } // initialises the game

        function computerMove() {

            var possibleMoves = [];
            var computerTrial = computerMoves;
            var playerTrial = playerMoves;
            var bestVal = 0;
            var avail = openSpaces();

            function minimax(playerTurn, moves) {

                if (moves === 0) {
                    if (checkWin(computerTrial)) {
                        return 10;
                    } else if (checkWin(playerTrial)) {
                        return -10;
                    } else {
                        return 0;
                    }
                }

                var avail = openSpaces();
                var possible = avail;
                if (!playerTurn) { //computer turn
                    bestVal = -1000;
                    for (var i = 0; i < avail.length; i++) {
                        computerTrial.push(possible[i]);
                        possible.splice(i, 1);
                        var cBest = minimax(true, moves--);
                        if (cBest > bestVal) {
                            bestVal = cBest;
                            possibleMoves.push(possible[i]);
                        }
                    }
                }
                if (playerTurn) { //player turn
                    bestVal = 1000;
                    for (var j = 0; j < avail.length; j++) {
                        playerTrial.push(possible[j]);
                        possible.splice(j, 1);
                        var pBest = minimax(false, moves--);
                        if (pBest < bestVal) {
                            bestVal = pBest;
                        }
                    }
                }
            }

            //minimax(playerTurn,moves)
            $('.pos' + chosen).html("<p class='computer'>" + computerPiece + "</p>");
        } //AI
        function checkWin(arrays) {
            var result = false;
            if (arrays.length <= -3) return; //if a party makes less than 3 moves no way in hell they gon win. Makes code more efficient.
            winConditions.forEach(function(winArray) {
                var holdArr = winArray.filter(function(winNum) {
                    if (arrays.indexOf(winNum) > -1) return false;
                    return true;
                });
                if (holdArr.length === 0) result = true;
            });
            return result;
        } // checks against the winConditions

        function openSpaces() {
            var open = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            occupiedSpace().forEach(function(num) {
                open = open.filter(function(spots) {
                    if (spots === num) return false;
                    return true;
                });
            });
            return open;
        } //returns array of availble spaces

        function occupiedSpace() {
            return playerMoves.concat(computerMoves);
        } //returns array of occupied spaces

        function posNum(div) {
            return parseInt(div.attr('class').split(' ')[2].split('')[3]);
        } // returns the number of the box selected


    }

    var ticTacToe = new Game();
    ticTacToe.init();
})
