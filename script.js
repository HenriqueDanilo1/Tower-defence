"use strict";

// GENERAL
const maxSpawnDistance = 400;
const rotateAng = 14.06; //(spins*360+60)/81
const defaultXPosition = 30;

const player = document.getElementById("player");
const playerSkin = document.getElementById("playerSkin");
const main = document.getElementById("main");
const body = document.querySelector("body");
const score = document.getElementById("score");
const startDiv = document.getElementById("start");
const restartDivA = document.getElementById("restartA");
const restartDivB = document.getElementById("restartB");
const playButton = document.getElementById("playButton");
const background025 = document.getElementById("background025");
const background035 = document.getElementById("background035");
const background045 = document.getElementById("background045");
const gameOverText = document.getElementById("gameOver");
const tryAgain = document.getElementById("tryAgainB");

const jumpSound = new Audio("audios/jump.wav");
const startSound = new Audio("audios/kick.wav");
const kickSound = new Audio("audios/clupi.wav");
const coinSound = new Audio("audios/coin.wav");
const soundTrack = new Audio("audios/soundtrack.mp3");
const fallen = new Audio("audios/fallen.wav");
const gameOver = new Audio("audios/gameOver.wav");
const goodEndingAud = new Audio("audios/goodEnding.wav");
const goodEndingAudOST = new Audio("audios/goodEndingOST.wav");

let flyingSpeed = 1; // between 1 and 1.5
let random = 0;
let lastEnemy = null;
let spawnDistance = 0;
let existentEnemys = 0;
let firstEnemy = 0;
let realFlyingSpeed = flyingSpeed;
let playerData;
let enemyData;
let gameRunning = 1;
let beforeColisionX;
let afterColisionX;
let colisionY;
let accountedEnemy;
let i = 0;
let background;
let div;
let restarted = 0;
let started = 0;

document.addEventListener("keydown", (event) => {
  if (event.code == "Space") {
    start();
  }
});

let jumpEventlistener = (event) => {
  if (
    (event.code === "Space" || event.code === "ArrowUp") &&
    getComputedStyle(player).bottom == "40px"
  ) {
    jumpSound.play();
    increaseHeight();
  }
};

function animation() {
  function starting02(i, b) {
    //(x - 1)² + (y - 1.5)² - 0.5² = 0
    const x = [
      1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.3,
      2.4, 2.5, 2.7, 2.8, 2.9, 3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9,
      4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.5, 4.4, 4.3, 4.2, 4.1, 4, 3.9, 3.8,
      3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1, 3, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3,
      2.2, 2.1, 2, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1, 0.9, 0.8,
      0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
    ];
    const y = [
      1, 0.893, 0.802, 0.772, 0.651, 0.589, 0.535, 0.488, 0.448, 0.414, 0.385,
      0.362, 0.344, 0.324, 0.322, 0.324, 0.344, 0.362, 0.385, 0.414, 0.448,
      0.488, 0.535, 0.589, 0.651, 0.722, 0.802, 0.893, 0.999, 1.122, 1.268,
      1.45, 1.697, 2.01, 2.322, 2.634, 2.946, 3.193, 3.375, 3.522, 3.644, 3.702,
      3.75, 3.841, 3.922, 3.992, 4.054, 4.108, 4.155, 4.195, 4.228, 4.258,
      4.281, 4.299, 4.311, 4.319, 4.322, 4.319, 4.311, 4.299, 4.281, 4.258,
      4.228, 4.195, 4.155, 4.108, 4.054, 3.999, 3.922, 3.841, 3.75, 3.644,
      3.522, 3.375, 3.193, 2.946, 2.322, 1.697, 1.45, 1.268, 1.122, 1,
    ];

    setTimeout(() => {
      if (i < x.length) {
        player.style.bottom = y[i] * 40 + "px";
        player.style.left = x[i] * defaultXPosition + "px";
        player.style.rotate = b + "deg";
        starting02(i + 1, b - rotateAng);
      } else {
        kickSound.play();
        document.addEventListener("keydown", jumpEventlistener);
        gameRunning = 1;
        player.style.rotate = "0deg";
        playerSkin.style.animation = "0.5s infinite linear planeFlying";
        restarted = 0;
        flyingSpeed = 0;
        spawnEnemy();
        enemyByEnemy();
      }
    }, 20);
  }

  function starting01(i) {
    if (parseInt(getComputedStyle(player).left) < defaultXPosition) {
      setTimeout(() => {
        if (i > defaultXPosition / 0.8) {
          player.style.rotate =
            parseInt(getComputedStyle(player).rotate) + 3 + "deg";
        }
        player.style.left = parseInt(getComputedStyle(player).left) + 2 + "px";
        starting01(i + 1);
      }, 15);
    } else {
      starting02(0, 60);
    }
  }
  player.style.rotate = "0deg";
  fallen.play();
  fallen.playbackRate = 1.78;
  starting01(0);
}

function start() {
  if (!started) {
    started = 1;
    document.removeEventListener("keydown", (event) => {
      if (event.code == "Space") {
        start();
      }
    });
    soundTrack.play();
    soundTrack.volume = 0.01;
    background025.style.opacity = "0";

    setTimeout(() => {
      background025.style.opacity = "1";
    }, 170);

    setTimeout(() => {
      main.removeChild(startDiv);
      animation();
      enemyByEnemy();
    }, 500);
  }
}

function spawnEnemy() {
  if (gameRunning) {
    if (lastEnemy > 0) {
      random = Math.random();
      if (random >= 0.45) {
        setTimeout(() => {
          if (
            parseInt(
              getComputedStyle(document.getElementById("enemy" + lastEnemy))
                .right
            ) >=
            random * maxSpawnDistance
          ) {
            lastEnemy++;
            existentEnemys++;
            //this shit need to appearl first
            let newEnemy;
            newEnemy = document.createElement("div");
            newEnemy.id = "enemy" + lastEnemy;
            random = Math.random();
            switch (true) {
              case random < 0.1:
                newEnemy.classList.add("enemy4");
                main.appendChild(newEnemy);
                lastEnemy++;
                existentEnemys++;
                //this shit need to appearl first
                newEnemy = document.createElement("div");
                newEnemy.id = "enemy" + lastEnemy;
                newEnemy.classList.add("enemy2");
                main.appendChild(newEnemy);
                break;
              case random < 0.25:
                newEnemy.classList.add("enemy3");
                main.appendChild(newEnemy);
                lastEnemy++;
                existentEnemys++;
                //this shit need to appearl first
                newEnemy = document.createElement("div");
                newEnemy.id = "enemy" + lastEnemy;
                newEnemy.classList.add("enemy4");
                main.appendChild(newEnemy);
                break;
              case random < 0.3:
                //new enemy skin
                let newEnemy2 = document.createElement("div");
                newEnemy2.classList.add("enemy15");
                newEnemy.appendChild(newEnemy2);

                //backing to normal process
                newEnemy.classList.add("enemy1");
                newEnemy.classList.add("enemy1");
                main.appendChild(newEnemy);
                lastEnemy++;
                existentEnemys++;
                //this shit need to appearl first again
                newEnemy = document.createElement("div");
                newEnemy.id = "enemy" + lastEnemy;
                newEnemy.classList.add("enemy4");
                main.appendChild(newEnemy);

              default:
                newEnemy.classList.add("enemy4");
                main.appendChild(newEnemy);
            }
          }
          spawnEnemy();
        }, 100);
      } else {
        spawnEnemy();
      }
    } else {
      firstEnemy = document.createElement("div");
      firstEnemy.id = "enemy1";
      firstEnemy.classList.add("enemy4");
      main.appendChild(firstEnemy);
      firstEnemy = lastEnemy = existentEnemys = 1;
      spawnEnemy();
      detectColision();
    }
  }
}

function enemyByEnemy() {
  if (gameRunning) {
    setTimeout(() => {
      //move enemy
      for (let i = firstEnemy; i <= lastEnemy; i++) {
        document.getElementById(`enemy${i}`).style.right =
          parseInt(
            getComputedStyle(document.getElementById(`enemy${i}`)).right
          ) +
          realFlyingSpeed * 5 +
          "px";
      }

      //destroy enemy
      if (
        parseInt(
          getComputedStyle(document.getElementById(`enemy${firstEnemy}`)).right
        ) > parseInt(getComputedStyle(main).width)
      ) {
        main.removeChild(document.getElementById(`enemy${firstEnemy}`));
        firstEnemy++;
        existentEnemys--;
      }

      //update score
      if (
        parseFloat(
          getComputedStyle(document.getElementById(`enemy${firstEnemy}`)).right
        ) >
          parseFloat(getComputedStyle(player).right) +
            parseFloat(getComputedStyle(player).width) &&
        firstEnemy != accountedEnemy &&
        document.getElementById("enemy" + firstEnemy).classList[0] === "enemy4"
      ) {
        accountedEnemy = firstEnemy;
        updateScore();
      }

      enemyByEnemy();
    }, 20);
  }
}

function detectColision() {
  if (gameRunning) {
    setTimeout(() => {
      //getting data
      playerData = getComputedStyle(player);
      enemyData = getComputedStyle(
        document.getElementById("enemy" + firstEnemy)
      );
      beforeColisionX =
        parseFloat(enemyData.right) + parseFloat(enemyData.width) >
        parseFloat(playerData.right);
      afterColisionX = !(
        parseFloat(enemyData.right) >
        parseFloat(playerData.right) + parseFloat(playerData.width)
      );
      colisionY = !(
        parseFloat(getComputedStyle(player).bottom) >
          parseFloat(
            getComputedStyle(document.getElementById("enemy" + firstEnemy))
              .height
          ) +
            parseFloat(
              getComputedStyle(document.getElementById("enemy" + firstEnemy))
                .bottom
            ) ||
        parseFloat(getComputedStyle(player).bottom) +
          parseFloat(getComputedStyle(player).height) <
          parseFloat(
            getComputedStyle(document.getElementById("enemy" + firstEnemy))
              .bottom
          )
      );

      //processing data
      if (beforeColisionX && afterColisionX && colisionY) {
        if (
          beforeColisionX &&
          document.getElementById("enemy" + firstEnemy).classList[0] ===
            "enemy1" &&
          document.getElementById("enemy" + (firstEnemy + 1)).classList[0] ===
            "enemy4"
        ) {
          endGame(0);
        } else {
          endGame(1);
        }
      }
      detectColision();
    }, 1);
  }
}

function increaseHeight() {
  if (gameRunning) {
    if (parseInt(getComputedStyle(player).bottom) < 130) {
      setTimeout(() => {
        player.style.bottom =
          parseInt(getComputedStyle(player).bottom) + 3 + "px";
        increaseHeight();
      }, 1);
    } else {
      setTimeout(() => {
        reduceHeight();
      }, 700);
    }
  }
}
function reduceHeight() {
  if (gameRunning) {
    if (parseInt(getComputedStyle(player).bottom) > 40) {
      setTimeout(() => {
        player.style.bottom =
          parseInt(getComputedStyle(player).bottom) - 2 + "px";
        reduceHeight();
      }, 1);
    }
  }
}

function endGame(badEndind) {
  gameRunning = 0;
  playerSkin.style.animation = "";
  playerSkin.classList.remove("player");
  playerSkin.classList.add("playerAfterLose");
  soundTrack.pause();
  soundTrack.currentTime = 0;
  if (badEndind) {
    badEnding();
  } else {
    goodEnding();
  }
}

function badEnding() {
  document.addEventListener("keydown", restartEventB);
  gameOver.play();
  restartDivB.style.zIndex = "4";
  setTimeout(() => {
    restartDivB.style.opacity = "1";
  }, 20);
  setTimeout(() => {
    gameOverText.style.top = "100%";
    tryAgain.style.top = "7%";
  }, 1200);
}

function goodEnding() {
  document.addEventListener("keydown", restartEventA);
  goodEndingAud.play();
  goodEndingAudOST.play();
  restartDivA.style.zIndex = "4";
  setTimeout(() => {
    restartDivA.style.opacity = "1";
  }, 20);
}

let restartEventA = function (event) {
  if (event.code == "Space") {
    restart(0);
  }
};
let restartEventB = function (event) {
  if (event.code == "Space") {
    restart(1);
  }
};

function restart(badEndind) {
  if (restarted == 0) {
    restarted = 1;
    document.removeEventListener("keydown", restartEventB);
    document.removeEventListener("keydown", restartEventA);
    if (badEndind) {
      background = background035;
      div = restartDivB;
    } else {
      background = background045;
      div = restartDivA;
    }

    soundTrack.play();
    soundTrack.volume = 0.01;
    background.style.opacity = "0";

    setTimeout(() => {
      background.style.opacity = "1";
    }, 170);

    setTimeout(() => {
      div.style.opacity = "";
      div.style.zIndex = "-1";
    }, 500);

    for (let a = firstEnemy; a < firstEnemy + existentEnemys; a++) {
      document.getElementById("enemy" + a).style.animation =
        "enemyFalling 1.1s infinite linear";
    }
    score.innerHTML = "000";
    player.style.transition = "1s";
    player.style.bottom = "-45px";

    setTimeout(() => {
      for (let a = firstEnemy; a < firstEnemy + existentEnemys; a++) {
        main.removeChild(document.getElementById("enemy" + a));
      }
      lastEnemy = null;
      firstEnemy = 0;
      existentEnemys = 0;
      player.style = "";
      playerSkin.style.animation = "";
      playerSkin.classList.remove("playerAfterLose");
      i = 0;
      gameOverText.style = "";
      tryAgain.style = "";
      animation();
    }, 900);
  }
}

function updateScore() {
  score.innerHTML = (parseInt(score.innerText) + 1).toString().padStart(3, "0");
  coinSound.play();
  if (parseInt(score.innerText) > 10) {
    flyingSpeed = 1.2;
  }
  if (parseInt(score.innerText) > 20) {
    flyingSpeed = 1.35;
  }
  if (parseInt(score.innerText) > 30) {
    flyingSpeed = 1.5;
  }
}
