<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Game Pesawat vs Hama</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      font-family: sans-serif;
      background: #000;
      color: #fff;
    }
    canvas {
      display: block;
      background: linear-gradient(#001, #112);
    }
    #controls {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
    }
    #controls button {
      margin-right: 10px;
      padding: 6px 12px;
      font-size: 14px;
    }
    #scoreboard {
      position: absolute;
      top: 120px;
      left: 10px;
      z-index: 2;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div id="controls">
    <button id="startBtn">Start</button>
    <button id="stopBtn">Stop</button>
    <button id="resetBtn">Reset</button>
  </div>
  <div id="scoreboard">Skor: 0 | Level: 1</div>
  <canvas id="gameCanvas"></canvas>

  <script>
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let plane = { x: canvas.width / 2, y: canvas.height - 80, width: 60, height: 60 };
    let bullets = [];
    let enemies = [];
    let bulletSpeed = 8;
    let enemySpeed = 2;
    let score = 0;
    let level = 1;
    let gameOver = false;
    let gameRunning = false;
    let spawnInterval;

    const bulletSound = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
    const hitSound = new Audio("https://www.fesliyanstudios.com/play-mp3/6674");

    function drawPlane() {
      ctx.save();
      ctx.fillStyle = "lightblue";
      ctx.beginPath();
      ctx.moveTo(plane.x, plane.y);
      ctx.lineTo(plane.x - 20, plane.y + 40);
      ctx.lineTo(plane.x + 20, plane.y + 40);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawEnemy(e) {
      ctx.save();
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(e.x + e.width / 2, e.y + e.height / 2, e.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(e.x + e.width / 2 - 5, e.y + e.height / 2 - 5, 3, 0, Math.PI * 2); // mata kiri
      ctx.arc(e.x + e.width / 2 + 5, e.y + e.height / 2 - 5, 3, 0, Math.PI * 2); // mata kanan
      ctx.fill();
      ctx.restore();
    }

    function drawBullets() {
      ctx.fillStyle = "yellow";
      bullets.forEach((b, i) => {
        b.y -= bulletSpeed;
        ctx.fillRect(b.x, b.y, 4, 10);
        if (b.y < 0) bullets.splice(i, 1);
      });
    }

    function drawEnemies() {
      enemies.forEach((e, i) => {
        e.y += enemySpeed;
        drawEnemy(e);

        // Cek tabrakan dengan peluru
        bullets.forEach((b, j) => {
          if (b.x < e.x + e.width &&
              b.x + 4 > e.x &&
              b.y < e.y + e.height &&
              b.y + 10 > e.y) {
            enemies.splice(i, 1);
            bullets.splice(j, 1);
            bulletSpeed += 0.2;
            score += 10;
            hitSound.play();
          }
        });

        // Cek tabrakan dengan pesawat
        if (
          e.y + e.height > plane.y &&
          e.x < plane.x + plane.width / 2 &&
          e.x + e.width > plane.x - plane.width / 2
        ) {
          gameOver = true;
          stopGame();
        }

        // Jika hama melewati layar
        if (e.y > canvas.height) enemies.splice(i, 1);
      });
    }

    function update() {
      if (!gameRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Tulisan judul di atas
      ctx.fillStyle = "white";
      ctx.font = "36px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText("Games Memberantas Hama", canvas.width / 2, 50);

      ctx.font = "24px Arial";
      ctx.fillText("SMPN 216 Sekolah ADIWIYATA", canvas.width / 2, 85);

      drawPlane();
      drawBullets();
      drawEnemies();

      document.getElementById("scoreboard").textContent = `Skor: ${score} | Level: ${level}`;

      // Naik level otomatis
      if (score >= level * 50) {
        level++;
        enemySpeed += 0.3;
      }

      if (!gameOver) requestAnimationFrame(update);
      else showGameOver();
    }

    function showGameOver() {
      ctx.fillStyle = "red";
      ctx.font = "48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    }

    function spawnEnemy() {
      enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40
      });
    }

    function startGame() {
      if (gameRunning) return;
      gameRunning = true;
      gameOver = false;
      spawnInterval = setInterval(spawnEnemy, 1000);
      update();
    }

    function stopGame() {
      clearInterval(spawnInterval);
      gameRunning = false;
    }

    function resetGame() {
      stopGame();
      score = 0;
      level = 1;
      bullets = [];
      enemies = [];
      bulletSpeed = 8;
      enemySpeed = 2;
      gameOver = false;
      plane.x = canvas.width / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      document.getElementById("scoreboard").textContent = `Skor: 0 | Level: 1`;
    }

    canvas.addEventListener("mousemove", e => {
      plane.x = e.clientX;
    });

    canvas.addEventListener("click", () => {
      if (gameRunning && !gameOver) {
        bullets.push({ x: plane.x, y: plane.y });
        bulletSound.play();
      }
    });

    // Tombol
    document.getElementById("startBtn").addEventListener("click", startGame);
    document.getElementById("stopBtn").addEventListener("click", stopGame);
    document.getElementById("resetBtn").addEventListener("click", resetGame);
  </script>
</body>
</html>
