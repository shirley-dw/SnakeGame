/* board, scoreBoard, startButton, gameOverSign: Elementos HTML que se utilizan en el juego. */
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

/* boardSize, gameSpeed: Configuración del juego (tamaño del tablero y velocidad del juego). */
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

// Variables del juego 
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

/* drawSnake(): Dibuja la serpiente en el tablero, llamando a drawSquare para cada cuadrado de la serpiente. */
const drawSnake = () => {
    snake.forEach( square => drawSquare(square, 'snakeSquare'));
}

// Rellena cada cuadrado del tablero
// @params 
// square: posicion del cuadrado,
// type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)

/* drawSquare(square, type): Dibuja un cuadrado en el tablero con el tipo especificado (emptySquare, snakeSquare, foodSquare).
 Actualiza la matriz boardSquares y el elemento HTML correspondiente. */
const drawSquare = (square, type) => {
    const [ row, column ] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}
/* moveSnake(): Mueve la serpiente en la dirección actual, verificando si ha chocado con el borde o consigo misma.
 Si es así, llama a gameOver(). */
const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    const [row, column] = newSquare.split('');


    if( newSquare < 0 || 
        newSquare > boardSize * boardSize  ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9 ||
        boardSquares[row][column] === squareTypes.snakeSquare) ) {
        gameOver();
    } else {
        snake.push(newSquare);
        if(boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}
/* addFood(): Aumenta la puntuación y crea un nuevo cuadrado de comida en el tablero. */
const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

/* gameOver(): Muestra el mensaje de "Game Over" y detiene el juego. */
const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disabled = false;
}
/* setDirection(newDirection): Establece la dirección actual de la serpiente. */
const setDirection = newDirection => {
    direction = newDirection;
}

/* directionEvent(key): Maneja los eventos de teclado para cambiar la dirección de la serpiente. */
const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}

/* createRandomFood(): Crea un nuevo cuadrado de comida en un lugar aleatorio del tablero. */
const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}
/* updateScore(): Actualiza la puntuación en el tablero. */
const updateScore = () => {
    scoreBoard.innerText = score;
}

/* createBoard(): Crea el tablero, creando elementos HTML para cada cuadrado y llenando la array boardSquares. */
const createBoard = () => {
    boardSquares.forEach( (row, rowIndex) => {
        row.forEach( (column, columnndex) => {
            const squareValue = `${rowIndex}${columnndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    })
}

/* setGame(): Inicializa el juego, estableciendo la serpiente, puntuación, dirección y tablero. */
const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}

/* startGame(): Inicializa el juego, llamando a setGame() y configurando los eventos de teclado y el intervalo de movimiento. */
const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}

/* startButton.addEventListener('click', startGame):
 Asigna el evento de clic al botón de inicio, que llama a startGame() cuando se hace clic. */
startButton.addEventListener('click', startGame);
