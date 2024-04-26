const canvas = document.querySelector('#game_area');
const ctx = canvas.getContext('2d');
const play_btn = document.querySelector('.play-btn');
const game_over_text = document.querySelector('.game-over');
const score_game = document.querySelector('.score');
const score_best = document.querySelector('.best-score');
const BOARD_SIZE_WIDTH = 14;
const BOARD_SIZE_HEIGHT = 10;
const BLOCK_SIZE = 50;
const BLOCK_COLOR = ['rgb(170, 215, 81)', 'rgb(162, 209, 73)']
const SNAKE_COLOR = 'rgb(70, 115, 232)';
const SNAKE_SPEED = 100;
const APPLE_COLOR = 'rgb(231, 71, 29)';

let playing = 0;
let score = 0;
let randomRow;
let randomCol;
let moveRightInterval;
let moveLeftInterval;
let moveUpInterval;
let moveDownInterval;
let locationStart = {
    x: 2,
    y: 4
}
let best_score = JSON.parse(localStorage.getItem('best_score'));
localStorage.setItem('best_score', JSON.stringify(best_score));

function clearAllInterval() {
    clearInterval(moveRightInterval);
    clearInterval(moveLeftInterval);
    clearInterval(moveUpInterval);
    clearInterval(moveDownInterval);
}

class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.canvas.width = BOARD_SIZE_WIDTH * BLOCK_SIZE;
        this.ctx.canvas.height = BOARD_SIZE_HEIGHT * BLOCK_SIZE;
        this.grid = this.generateWhiteBoard();
    }

    reset() {
        score = 0;
        best_score = JSON.parse(localStorage.getItem('best_score'));
        game_over_text.innerText = '';
        score_best.innerText = best_score;
        score_game.innerText = score;
        clearAllInterval();
        this.clearBoard();
        this.drawBoard();
        snake.resetSnake();
    }

    generateWhiteBoard() {
        return Array.from({length: BOARD_SIZE_HEIGHT}, () => Array(BOARD_SIZE_WIDTH).fill(0));
    }

    clearBoard() {
        board.ctx.clearRect(0, 0, BOARD_SIZE_WIDTH * BLOCK_SIZE, BOARD_SIZE_HEIGHT * BLOCK_SIZE);
    }

    drawCell(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    drawBoard() {
        for (let row=0; row<BOARD_SIZE_HEIGHT; row++) {
            for (let col=0; col<BOARD_SIZE_WIDTH; col++) {
                if (row%2===0) {
                    if (col%2!==0) {
                        this.drawCell(col, row, BLOCK_COLOR[0]);
                    } else {
                        this.drawCell(col, row, BLOCK_COLOR[1]);
                    }
                } else {
                    if (col%2===0) {
                        this.drawCell(col, row, BLOCK_COLOR[0]);
                    } else {
                        this.drawCell(col, row, BLOCK_COLOR[1]);
                    }                  
                }
            }
        }
    }
}

class Snake {
    constructor(ctx) {
        this.ctx = ctx;
        this.speed = 
        this.body = [
            {
                location_x: locationStart.x,
                location_y: locationStart.y
            },
            {
                location_x: locationStart.x-1,
                location_y: locationStart.y
            },
            {
                location_x: locationStart.x-2,
                location_y: locationStart.y
            }
        ]
        this.direction = {
            right: 1,
            left: 0,
            top: 1,
            bottom: 1
        }
    }

    resetSnake() {
        this.body = [
            {
                location_x: locationStart.x,
                location_y: locationStart.y
            },
            {
                location_x: locationStart.x-1,
                location_y: locationStart.y
            },
            {
                location_x: locationStart.x-2,
                location_y: locationStart.y
            }
        ]
        this.direction = {
            right: 1,
            left: 0,
            top: 1,
            bottom: 1
        }
        this.generateSnake();
    }

    drawSnakeBody(x, y) {
        this.ctx.fillStyle = SNAKE_COLOR;
        this.ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
    
    generateSnake() {
        for (let i=0; i<this.body.length; i++) {
            this.drawSnakeBody(this.body[i].location_x, this.body[i].location_y);
        }
    }

    moveRight() {
        for (let i=this.body.length-1; i>0; i--) {
            this.body[i].location_x = this.body[i-1].location_x;
            this.body[i].location_y = this.body[i-1].location_y;
        }
        this.body[0].location_x++;
        if (this.collision()) {
            game_over_text.innerText = 'Game Over!!!';
            clearAllInterval();
            playing = 0;
        } else {
            board.clearBoard();
            board.drawBoard();
            apple.drawApple(randomCol, randomRow);
            snake.generateSnake();
        }
        if (this.eatApple()) {
            this.growUp();
            apple.generateRandomApple();
            score_game.innerText = score;
            score_best.innerText = best_score;
        }
    }

    moveLeft() {
        for (let i=this.body.length-1; i>0; i--) {
            this.body[i].location_x = this.body[i-1].location_x;
            this.body[i].location_y = this.body[i-1].location_y;
        }
        this.body[0].location_x--;
        if (this.collision()) {
            game_over_text.innerText = 'Game Over!!!';
            clearAllInterval();
            playing = 0;
        } else {
            board.clearBoard();
            board.drawBoard();
            apple.drawApple(randomCol, randomRow);
            snake.generateSnake();
        }
        if (this.eatApple()) {
            this.growUp();
            apple.generateRandomApple();
            score_game.innerText = score;
            score_best.innerText = best_score;
        }
    }
    
    moveUp() {
        for (let i=this.body.length-1; i>0; i--) {
            this.body[i].location_x = this.body[i-1].location_x;
            this.body[i].location_y = this.body[i-1].location_y;
        }
        this.body[0].location_y--;
        if (this.collision()) {
            game_over_text.innerText = 'Game Over!!!';
            clearAllInterval();
            playing = 0;
        } else {
            board.clearBoard();
            board.drawBoard();
            apple.drawApple(randomCol, randomRow);
            snake.generateSnake();
        }
        if (this.eatApple()) {
            this.growUp();
            apple.generateRandomApple();
            score_game.innerText = score;
            score_best.innerText = best_score;
        }
    }

    moveDown() {
        for (let i=this.body.length-1; i>0; i--) {
            this.body[i].location_x = this.body[i-1].location_x;
            this.body[i].location_y = this.body[i-1].location_y;
        }
        this.body[0].location_y++;
        if (this.collision()) {
            game_over_text.innerText = 'Game Over!!!';
            clearAllInterval();
            playing = 0;
        } else {
            board.clearBoard();
            board.drawBoard();
            apple.drawApple(randomCol, randomRow);
            snake.generateSnake();
        }
        if (this.eatApple()) {
            this.growUp();
            apple.generateRandomApple();
            score_game.innerText = score;
            score_best.innerText = best_score;
        }
    }

    collision() {
        if (this.body[0].location_x>=BOARD_SIZE_WIDTH || 
            this.body[0].location_x<0 || 
            this.body[0].location_y>=BOARD_SIZE_HEIGHT || 
            this.body[0].location_y<0) {
                return true;
        }
        for (let i=1; i<this.body.length; i++) {
            if (this.body[0].location_x===this.body[i].location_x && 
                this.body[0].location_y===this.body[i].location_y) {
                    return true;
            }
        }
        return false;
    }

    eatApple() {
        if (this.body[0].location_x===randomCol && this.body[0].location_y===randomRow) {
            score++;
            if (score>best_score) {
                best_score = score;
                localStorage.removeItem('best_score');
                localStorage.setItem('best_score', JSON.stringify(best_score));
            }
            return true;
        }
        return false;
    }

    growUp() {
        let extraBody = {
            location_x: randomCol,
            location_y: randomRow
        }
        this.body.unshift(extraBody);
    }
}

class Apple {
    constructor(ctx) {
        this.ctx = ctx;
    }

    drawApple(x, y) {
        this.ctx.fillStyle = APPLE_COLOR;
        this.ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    isSnake(x, y) {
        for (let i=0; i<snake.body.length; i++) {
            if (snake.body[i].location_x===x && snake.body[i].location_y===y) {
                return true;
            }
        }
        return false;
    }

    generateRandomApple() {
        do {
            randomRow = Math.floor(Math.random() * BOARD_SIZE_HEIGHT);
            randomCol = Math.floor(Math.random() * BOARD_SIZE_WIDTH);
        } while (this.isSnake(randomCol, randomRow));
        this.drawApple(randomCol, randomRow);
    }
}

let board = new Board(ctx);
board.drawBoard();
let snake = new Snake(ctx);
let apple = new Apple(ctx);

play_btn.addEventListener('click', function() {
    playing = 1;
    board.reset();
    apple.generateRandomApple();
    if (!snake.direction.left) {
        snake.direction = {
            right: 1,
            left: 0,
            top: 0,
            bottom: 0
        }
        clearAllInterval();
        moveRightInterval = setInterval(() => snake.moveRight(), SNAKE_SPEED);
    }
})

document.addEventListener('keydown', function(e) {
    if (playing) {
        switch (e.code) {
            case 'ArrowDown':
                if (!snake.direction.top) {
                    snake.direction = {
                        right: 0,
                        left: 0,
                        top: 0,
                        bottom: 1
                    }
                    clearAllInterval();
                    moveDownInterval = setInterval(() => snake.moveDown(), SNAKE_SPEED);
                }
                break;
            case 'ArrowUp':
                if (!snake.direction.bottom) {
                    snake.direction = {
                        right: 0,
                        left: 0,
                        top: 1,
                        bottom: 0
                    }
                    clearAllInterval();
                    moveUpInterval = setInterval(() => snake.moveUp(), SNAKE_SPEED);
                }
                break;
            case 'ArrowRight':
                if (!snake.direction.left) {
                    snake.direction = {
                        right: 1,
                        left: 0,
                        top: 0,
                        bottom: 0
                    }
                    clearAllInterval();
                    moveRightInterval = setInterval(() => snake.moveRight(), SNAKE_SPEED);
                }
                break;
            case 'ArrowLeft':
                if (!snake.direction.right) {
                    snake.direction = {
                        right: 0,
                        left: 1,
                        top: 0,
                        bottom: 0
                    }
                    clearAllInterval();
                    moveLeftInterval = setInterval(() => snake.moveLeft(), SNAKE_SPEED);
                }
                break;
            default:
                break;
        }
    }
})