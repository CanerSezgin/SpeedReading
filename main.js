var _newText = document.getElementById('newText');
var _showArea = document.getElementById('show-area');
var _gameArea = document.getElementById('game-area');
var _btnBegin = document.getElementById('btn-begin');
var _btnNewText = document.getElementById('btn-newText');
var _btnReset = document.getElementById('btn-reset');
var _btnRead = document.getElementById('btn-read');
var _btnChunk1 = document.getElementById('btn-chunk-1');
var _btnChunk2 = document.getElementById('btn-chunk-2');
var _btnChunkMixed = document.getElementById('btn-chunk-mixed');
var _inputWPM = document.getElementById('input-wpm');
var chunkType = 1;

_gameArea.style.display = "none";
var wordArray;
var game;   

function arrangeTextData(){
    var newText = _newText.value.split(' ');
    var array = [];
    newText.forEach(word => {
        word = word.trim();
        if(word.length > 0){
            array.push(word)
        }
    });
    return array
}

function splitChunks(array, no){
    var result = []
    if(no == 'mixed'){
        no = 1;
        for (let i = 0; i < array.length; i+=no) {
            no = Math.floor(Math.random() * 2) +1
            result.push(array.slice(i, i+no))
        }
    } else {
        for (let i = 0; i < array.length; i+=no) {
            result.push(array.slice(i, i+no))
        }
    }
    return result;
}

class SpeedReading {
    constructor() {
        this.chunks = splitChunks(wordArray, chunkType);
        this.wpm = parseInt(_inputWPM.value);
        this.running = false;
        this.lastChunk = 0;
    }
    printWords(){
        _showArea.innerHTML = this.chunks[this.lastChunk].join(' ');
        this.lastChunk++;
    }
    start(){
        if(!this.running){
            if(this.lastChunk !== this.chunks.length){
                this.running = true;
                this.run = setInterval(() => {
                    this.printWords();
                    if(this.lastChunk === this.chunks.length){
                        clearInterval(this.run);
                        this.running = false;
                    }
                }, 60000/this.wpm);
            }
        }
    }
    stop(){
        if(this.running){
            this.running = false;
            clearInterval(this.run)
        }
    }
}

    /*** EVENTS ***/
    // Begin Button
    function beginButton(){
        _newText.style.display = "none";
        _btnBegin.style.display = "none";
        _gameArea.style.display = "";

        wordArray = arrangeTextData();
        game = new SpeedReading();
        game.printWords();
    }

    // Start & Stop Button
    function readButton(){
        if(!game.running){
            game.start();
        } else {
            game.stop();
        }
    }

    // Reset Button
    function resetButton(){
        if(game.running){
            game.stop();
        }
        game = new SpeedReading();
        game.printWords();
    }

    // Chunk Buttons
    function chunkButtons(type){
        chunkType = type;
        game.chunks = splitChunks(wordArray, type);
    }

    // WPM Changes
    function wpmInput(){
        game.wpm = parseInt(_inputWPM.value)
        if(game.running){
            game.stop();
            game.start();
        }
    }

    function arrangeSpeed(symbol){
        var speed = parseInt(_inputWPM.value);
        switch (symbol) {
            case '+':
                speed += 50;
                break;

            case '-':
                speed -= 50;
                break;
        
            default:
                break;
        } 
        _inputWPM.value = speed;
        wpmInput();
    }

    _btnRead.addEventListener("click", readButton);
    _btnReset.addEventListener("click", resetButton);
    _btnChunk1.addEventListener("click", () => chunkButtons(1));
    _btnChunk2.addEventListener("click", () => chunkButtons(2));
    _btnChunkMixed.addEventListener("click", () => chunkButtons('mixed'));
    _inputWPM.addEventListener("change", wpmInput);
    _btnBegin.addEventListener("click", beginButton);
    _btnNewText.addEventListener("click", () => {
        resetButton();
        _newText.style.display = "";
        _btnBegin.style.display = "";
        _gameArea.style.display = "none";
    })

    window.addEventListener("keyup", (event) => {
        if(_gameArea.style.display !== 'none' ){
            switch (event.keyCode) {
                // Start / Stop (Space)
                case 32:
                    readButton();
                    break;
    
                // Reset (r)
                case 82:
                    resetButton();
                    break;
    
                // Chunk-1 (q)
                case 81:
                    chunkButtons(1)
                    break;
    
                // Chunk-2 (w)
                case 87:
                    chunkButtons(2)
                    break;
    
                // Chunk-Mixed (e)
                case 69:
                    chunkButtons('mixed')
                    break;
    
                // Increase Speed (+)
                case 107:
                    arrangeSpeed('+')
                    break;
    
                // Decrease Speed (+)
                case 109:
                    arrangeSpeed('-')
                    break;
    
                default:
                    break;
            }
        }        
    });