let board;
let boardWidth = window.innerWidth; // ใช้ขนาดหน้าจอของอุปกรณ์
let boardHeight = window.innerHeight; // ใช้ขนาดหน้าจอของอุปกรณ์
let context;
let playerWidth = 105;
let playerHeight = 105;
let playerX = 50;
let playerY = boardHeight - 150; // ปรับตามขนาดหน้าจอ
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};

playerImg = new Image();
playerImg.src = "photo/19567-removebg-preview.png";

let gameOver = false;
let score = 0;
let time = 0;
let live = 3;

let boxImg;
let boxWidth = 100;
let boxHeight = 80;
let boxX = boardWidth;
let boxY = boardHeight - 120; // ปรับตามขนาดหน้าจอ

boxImg = new Image();
boxImg.src = "photo/19566-removebg-preview.png";

let boxesArray = [];
let boxSpeed = -7;

let VelocityY = 0;
let Gravity = 0.28;
let canJump = true; // Flag to control jumping

let Retry = document.getElementById("RetryButton");
let RetryDelay = false;

window.onload = function () {
    board = document.getElementById("Board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    };

    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);
    document.addEventListener("touchstart", touchJump);

    Retry.addEventListener("click", () => {
        if (RetryDelay) {
            return;
        } else {
            RetryDelay = true;
            Retry.innerHTML = "wait"; 
            setTimeout(() => {
                gameReset();
                Retry.innerHTML = "retry";
                RetryDelay = false;
            }, 1000);
        }
    });

    createBoxWithRandomInterval();
};

function createBoxWithRandomInterval() {
    if (gameOver) {
        return;
    }

    createBox(); 

    let randomTime = rnd(1000, 2500); 
    setTimeout(createBoxWithRandomInterval, randomTime);
}

function rnd(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    VelocityY += Gravity;

    // Update player position
    player.y = Math.min(player.y + VelocityY, playerY);

    // Check if the player is on the ground
    if (player.y === playerY) {
        canJump = true; // Allow jumping if player is on the ground
    }

    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Check for collisions and game over condition
    for (let index = 0; index < boxesArray.length; index++) {
        let box = boxesArray[index];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        if (onCollision(player, box)) {
            gameOver = true;
            live -= 1;

            context.font = "normal bold 40px Arial"; 
            context.textAlign = "center";
            context.fillText("              กากมากนะครับ", boardWidth / 2, boardHeight / 2);
            context.fillText("                  Score : " + score, boardWidth / 2, (boardHeight / 2) + 50);

            setTimeout(() => {
                Retry.style.display = "block";
            }, 500);
        }
    }
    score++;
    time += 0.01;
    context.font = "normal bold 30px Arial";
    context.textAlign = "left";
    context.fillText("S : " + score, 130, 30); 
    context.fillText("T : " + time.toFixed(0), 20, 30);
    context.fillText("          Heart : " + live, 20, 80);
    if (time == 60) {
        gameOver = true;
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillText("You Won! With Score :" + score, boardWidth / 2, boardHeight / 2);
    }
}

function movePlayer(e) {
    if (gameOver) {
        return;
    }

    if (e.code === "Space" && player.y === playerY && canJump) {
        VelocityY = -10;
        canJump = false; // Prevent double jumping
    }
}

function touchJump(e) {
    if (gameOver) {
        return;
    }

    // Check if touch is on the screen and player can jump
    if (player.y === playerY && canJump) {
        VelocityY = -10;
        canJump = false; // Prevent double jumping
    }
}

function createBox(e) {
    if (gameOver) {
        return;
    }

    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight
    }
}