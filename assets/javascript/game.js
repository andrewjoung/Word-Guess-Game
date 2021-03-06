//Author: Andrew Joung
//Date: May 30th 2019
//THis is the JavaScript file that adds functionality to the Word Game web application
//Keeps track of the game's state through an object and manipulates and updates the DOM 
//according to the user input. 

//An array of words that will be randomly chosen for the user to guess
var wordArray = ["sword", "westeros", "esos", "bravos", "stark", "targaryen", "lannister", "direwolf", "dragon", "lion",
                 "gold", "shield", "winter", "throne", "king", "winterfell"];

var startPrompt = document.getElementById("startPrompt");
var winText = document.getElementById("winText"); //gets the text that displays the number of wins from html
var guessText = document.getElementById("guessText"); //gets the text displays guesses left from html
var wordText = document.getElementById("currentWordHint"); //gets the div in which the letters of the current word is stored
var guessedLettersText = document.getElementById("lettersGuessed"); //div that displays the letters that are guessed
var resetButton = document.getElementById("resetButton"); //gets the reset button from html
var image = document.getElementById("thronesImage"); //gets the image from html

//An object that holds information about the state of the game
var gameState = {
    word: "", 
    wins: 0, 
    guessesLeft: 10,
    lettersLeft: 1, //initalize to 1 so that the game doesnt think the user has won at the beginning of every new game
    playing: false,
    alreadyGuessed: [],
    reset: function() { //resets the state of the game except for number of wins, we have to do this manually
        this.word = "";
        this.playing = false;
        this.guessesLeft = 10;
        this.alreadyGuessed = [];
    }
};

//initalizes game
function initalizeGame() {
    var randomNumber = Math.floor((Math.random() * wordArray.length));
    var randomWord = wordArray[randomNumber]; //picking our random word from the word array;
    gameState.reset();
    gameState.word = randomWord;
    gameState.lettersLeft = randomWord.length;
    startPrompt.style.display = "none";
    winText.textContent = gameState.wins.toString();
    guessText.textContent = gameState.guessesLeft.toString();
    for(var i = 0; i < gameState.word.length; i++) {
        wordText.innerHTML += "<div class=letterDiv id=letter" + i + "> </div>";
    }
    gameState.playing = true;
}

//clears letter board 
function clearBoard() {
    wordText.innerHTML = ""; //clear correct letter div 
    guessedLettersText.innerHTML = ""; //clear guessed letter div
    thronesImage.style.display = "none"; //clears image;
}

//add event listener that will reset the game if the reset button is clicked 
resetButton.addEventListener("click", function() {
    gameState.wins = 0;
    gameState.reset();
    startPrompt.style.display = "block";
    clearBoard();
    winText.textContent = gameState.wins.toString();
    guessText.textContent = gameState.guessesLeft.toString();
}, false);

document.onkeyup = function(event) {
    
    var guessedLetter; //the letter that is guessed 
 
    //when the game first starts
    if(!gameState.playing) {
       initalizeGame();
    } else { //when the game is started 
        //if the letter has not already been guessed
        //and if the key pressed is a letter
        if(gameState.alreadyGuessed.indexOf(event.key) === -1 && event.keyCode >= 65 && event.keyCode <= 90) { 
            gameState.alreadyGuessed.push(event.key); //add the letter to already guessed array
            guessedLetter = event.key;
            if(gameState.word.includes(guessedLetter)) { //if the user guesses the letter correctly         
                //loop through the word and find every instance of the letter
                //this ensures that letters that occcur more than once will appear on the screen
                for(var i = 0; i < gameState.word.length; i++) {
                    if(gameState.word.charAt(i) === guessedLetter) { //if the letter at the current index is the correctly guessed letter 
                        var letter = document.getElementById("letter" + i);
                        letter.textContent = guessedLetter;
                        letter.style.border = "none";
                        gameState.lettersLeft--; //decrease the letters left to guess
                    }
                }
                thronesImage.style.display = "block";
                thronesImage.src = "assets/images/correct.jpg";
            } else { //the guess is incorrect 
                guessedLettersText.innerHTML += "<div class=guessedLetterDiv>" + guessedLetter + "</div>";
                gameState.guessesLeft--;
                guessText.textContent = gameState.guessesLeft;
                thronesImage.style.display="block";
                thronesImage.src = "assets/images/incorrect.jpeg";
            }
        } else {
            alert("Invalid key!"); //alert the user that the letter has been guessed already;
        }
    }

    if(gameState.lettersLeft === 0) { //user has won
        alert("you've won!");
        gameState.wins++; //increase number of wins
        clearBoard(); //clear the board of letters and images
        initalizeGame(); //initalize game
    } else if (gameState.guessesLeft === 0) { //user has lost
        alert("you've lost");
        clearBoard(); //clear board
        initalizeGame(); //intalize game 
    }
}