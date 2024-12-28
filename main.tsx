<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        h1 {
            margin-bottom: 10px;
        }
        #game-board {
            display: grid;
            grid-template-columns: repeat(20, 20px);
            grid-template-rows: repeat(20, 20px);
            gap: 1px;
            background-color: #ccc;
            border: 1px solid #999;
        }
        .cell {
            width: 20px;
            height: 20px;
            background-color: #fff;
        }
        .snake {
            background-color: #4CAF50;
        }
        .food {
            background-color: #F44336;
        }
        #score {
            margin-top: 10px;
            font-size: 18px;
        }
        #game-over {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.8);
            padding: 20px;
            text-align: center;
            border-radius: 5px;
        }
        button {
            margin-top: 10px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h1>Snake Game</h1>
    <div id="game-board"></div>
    <div id="score">Score: 0</div>
    <div id="game-over">
        <h2>Game Over!</h2>
        <p>Your score: <span id="final-score"></span></p>
        <button id="restart-button">Play Again</button>
    </div>

    <script>
        const GRID_SIZE = 20;
        const CELL_SIZE = 20;
        const INITIAL_SNAKE = [[5, 5]];
        const INITIAL_DIRECTION = [0, 1];
        const INITIAL_FOOD = [10, 10];
        const GAME_SPEED = 150;

        let snake = [...INITIAL_SNAKE];
        let direction = [...INITIAL_DIRECTION];
        let food = [...INITIAL_FOOD];
        let score = 0;
        let gameLoop;

        const gameBoard = document.getElementById('game-board');
        const scoreElement = document.getElementById('score');
        const gameOverElement = document.getElementById('game-over');
        const finalScoreElement = document.getElementById('final-score');
        const restartButton = document.getElementById('restart-button');

        function createGrid() {
            gameBoard.innerHTML = '';
            for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                gameBoard.appendChild(cell);
            }
        }

        function updateGame() {
            const newHead = [
                snake[0][0] + direction[0],
                snake[0][1] + direction[1]
            ];

            if (checkCollision(newHead)) {
                gameOver();
                return;
            }

            snake.unshift(newHead);

            if (newHead[0] === food[0] && newHead[1] === food[1]) {
                score++;
                updateScore();
                generateFood();
            } else {
                snake.pop();
            }

            updateGameBoard();
        }

        function updateGameBoard() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => cell.classList.remove('snake', 'food'));

            snake.forEach(([y, x]) => {
                const index = y * GRID_SIZE + x;
                cells[index].classList.add('snake');
            });

            const foodIndex = food[0] * GRID_SIZE + food[1];
            cells[foodIndex].classList.add('food');
        }

        function checkCollision([y, x]) {
            return (
                y < 0 || y >= GRID_SIZE ||
                x < 0 || x >= GRID_SIZE ||
                snake.some(([sy, sx]) => sy === y && sx === x)
            );
        }

        function generateFood() {
            do {
                food = [
                    Math.floor(Math.random() * GRID_SIZE),
                    Math.floor(Math.random() * GRID_SIZE)
                ];
            } while (snake.some(([y, x]) => y === food[0] && x === food[1]));
        }

        function updateScore() {
            scoreElement.textContent = `Score: ${score}`;
        }

        function gameOver() {
            clearInterval(gameLoop);
            gameOverElement.style.display = 'block';
            finalScoreElement.textContent = score;
        }

        function resetGame() {
            snake = [...INITIAL_SNAKE];
            direction = [...INITIAL_DIRECTION];
            food = [...INITIAL_FOOD];
            score = 0;
            updateScore();
            gameOverElement.style.display = 'none';
            createGrid();
            updateGameBoard();
            startGame();
        }

        function handleKeyPress(e) {
            const key = e.key;
            const newDirection = {
                'ArrowUp': [-1, 0],
                'ArrowDown': [1, 0],
                'ArrowLeft': [0, -1],
                'ArrowRight': [0, 1]
            }[key];

            if (newDirection && !isOppositeDirection(newDirection)) {
                direction = newDirection;
            }
        }

        function isOppositeDirection(newDir) {
            return newDir[0] === -direction[0] && newDir[1] === -direction[1];
        }

        function startGame() {
            gameLoop = setInterval(updateGame, GAME_SPEED);
        }

        createGrid();
        updateGameBoard();
        startGame();

        document.addEventListener('keydown', handleKeyPress);
        restartButton.addEventListener('click', resetGame);
    </script>
</body>
</html>
