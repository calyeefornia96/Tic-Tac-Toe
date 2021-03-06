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
                overlay.toggle("clip");
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
                        }, 600);
                    }

                    moves--; //no winner, continues.
                    if (moves === 0) {
                        setTimeout(function() {
                            winner = "draw";
                            running = false;
                            announcement.text("Draw!");
                            _this.init();
                        }, 600);
                    } //no more moves left, draw and restart
                    playerTurn = false;
                    setTimeout(computerMove, 500);
                }
            });

        } // initialises the game
        function computerMove() {
            if (running && !playerTurn) {
                var avail = openSpaces();
                var movedYet = false;
                var win_test = [];
                var block_test = [];
                var potentials = [];

                // if the immediate next move causes the computer to win, the computer places it.
                for (var i = 0; i < avail.length; i++) {
                    computerMoves.forEach(function(num) {
                        win_test.push(num);
                    });
                    win_test.push(avail[i]);
                    if (checkWin(win_test)) {
                        movedYet = true;
                        placeComputer(avail[i]);
                        break;
                    }
                    win_test = [];
                }
                // if the immediate next move causes the player to win, the computer blocks it.
                if (!movedYet) {
                    for (var x = 0; x < avail.length; x++) {
                        playerMoves.forEach(function(num) {
                            block_test.push(num);
                        });
                        block_test.push(avail[x]);
                        if (checkWin(block_test)) {
                            movedYet = true;
                            placeComputer(avail[x]);
                            break;
                        }
                        block_test = [];
                    }
                }
                if (!movedYet) {
                    //if computer has alr occupied a spot, it examines spot that gives it a chance to win
                    if (computerMoves.length > 0) {
                        computerMoves.forEach(function(compMove) {
                            winConditions.forEach(function(winCond) {
                                if (winCond.indexOf(compMove) > -1) potentials.push(winCond);
                            });
                        });
                    } else {
                        potentials = winConditions;
                    }
                    if (potentials.length > 0) {
                        potentials = potentials.reduce(function(a, b) {
                            return a.concat(b);
                        });
                        potentials = potentials.filter(function(potential) {
                            return avail.includes(potential);
                        });
                    }
                    placeComputer(potentials[0]);
                }
            }
            if (checkWin(computerMoves)) {
                setTimeout(function() {
                    winner = "computer";
                    running = false;
                    announcement.text("Computer Wins!");
                    _this.init();
                }, 600);
                return;
            }
            // if no win, continue on...
            moves--;
            // if there are no moves left, the result is a draw
            if (moves === 0) {
                setTimeout(function() {
                    winner = "draw";
                    running = false;
                    announcement.text("Draw!");
                    _this.init();
                }, 600);
                return;
            }
            // if computer hasn't won and it's not a draw, allow player to select another space
            playerTurn = true;
        }


        function placeComputer(num) {
            var spot = $(".pos" + num);
            spot.html("<p class='computer'>" + computerPiece + "</p>");
            computerMoves.push(num);
        }

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
});
