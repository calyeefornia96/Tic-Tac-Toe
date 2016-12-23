$(document).ready(function(){

	function Game() {
		var moves,
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
		winConditions = [[1,2,3],[4,5,6],[7,8,9],
						 [1,4,7],[2,5,8],[3,6,9],
						 [1,5,9], [3,5,7]];
		this.init = function(){
			moves=9; // max no. of moves
			running = false; //status of game
			playerPiece = ""; //piece of player
			computerPiece = ""; // piece of computer
			playerTurn = false; //computer always go first
			playerMoves=[]; //stores player moves
			computerMoves=[]; // stores computer moves
			winner=""; //stores winner - Computer/Player
			chooseButton.off("click");//removes event listeners
			box.off("click");//removes event listeners
			box.html("")//clears out the board for fresh start
			choosePiece();
		}; //resets everything

		function choosePiece(){
			if(!running){
				chooseButton.on("click", function(){
					playerPiece = $(this).text();
					computerPiece = playerPiece === 'X' ? 'O' : 'X';
					playerTurn = playerPiece === 'X'? true : false; //allow X to go first.
					overlay.toggle("clip");
					startGame();//after choice is made, initialise game with startGame function.
				});
			}
		}

		function startGame(){
			running = true;
			if(!playerTurn){
				setTimeout(computerMove,500);
			}
		} // initialises the game

		function computerMove(){} //AI 

		function checkWin(){} // checks against the winConditions

		function openSpaces(){} //returns array of availble spaces

		function occupiedSpaces(){} //returns array of occupied spaces

		function posNum(div){
			return parseInt(div.attr('class').split(' ')[2].split('')[3]);
		} // returns the number of the box selected
		

	}
	
	var ticTacToe = new Game();
	ticTacToe.init();






})