const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const playerPaddle = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
const cpuPaddle = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, dy: 4 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4, speed: 1 };

let playerScore = 0;
let cpuScore = 0;
const winningScore = 5;

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "30px Arial";
    ctx.fillText(text, x, y);
}

function draw() {
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // draw paddles and ball
    drawRect(playerPaddle.x, playerPaddle.y, paddleWidth, paddleHeight, "#fff");
    drawRect(cpuPaddle.x, cpuPaddle.y, paddleWidth, paddleHeight, "#fff");
    drawCircle(ball.x, ball.y, ballSize, "#fff");
    
    // draw scores
    drawText(playerScore, canvas.width / 4, 50, "#fff");
    drawText(cpuScore, (3 * canvas.width) / 4, 50, "#fff");
}

function update() {
    // update player paddle position
    playerPaddle.y += playerPaddle.dy;
    if (playerPaddle.y < 0) playerPaddle.y = 0;
    if (playerPaddle.y + paddleHeight > canvas.height) playerPaddle.y = canvas.height - paddleHeight;
    
    // update cpu paddle position
    if (cpuPaddle.y + paddleHeight / 2 < ball.y) {
        cpuPaddle.y += cpuPaddle.dy;
    } else {
        cpuPaddle.y -= cpuPaddle.dy;
    }
    if (cpuPaddle.y < 0) cpuPaddle.y = 0;
    if (cpuPaddle.y + paddleHeight > canvas.height) cpuPaddle.y = canvas.height - paddleHeight;
    
    // update ball position
    ball.x += ball.dx * ball.speed;
    ball.y += ball.dy * ball.speed;
    
    // check for collision with top and bottom walls
    if (ball.y < 0 || ball.y > canvas.height) {
        ball.dy *= -1;
    }
    
    // check for collision with paddles
    if (
        (ball.x - ballSize < playerPaddle.x + paddleWidth && ball.y > playerPaddle.y && ball.y < playerPaddle.y + paddleHeight) ||
        (ball.x + ballSize > cpuPaddle.x && ball.y > cpuPaddle.y && ball.y < cpuPaddle.y + paddleHeight)
    ) {
        ball.dx *= -1;
        ball.speed *= 1.001;  // Increase ball speed by .1%
    }
    
    // check for scoring
    if (ball.x < 0) {
        cpuScore++;
        resetBall();
    } else if (ball.x > canvas.width) {
        playerScore++;
        resetBall();
    }
    
    // check for winning condition
    if (playerScore === winningScore || cpuScore === winningScore) {
        resetGame();
    }
}

function resetBall() {
    ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4 * (Math.random() > 0.5 ? 1 : -1), dy: 4 * (Math.random() > 0.5 ? 1 : -1), speed: 4 };
}

function resetGame() {
    playerScore = 0;
    cpuScore = 0;
    resetBall();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        playerPaddle.dy = -6;
    } else if (event.key === "ArrowDown") {
        playerPaddle.dy = 6;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        playerPaddle.dy = 0;
    }
});

gameLoop();
