


const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");
const scoreD = document.getElementById("score-d");
const btnPvp = document.getElementById("btn-pvp");
const btnAi = document.getElementById("btn-ai");
const btnRestart = document.getElementById("restart");

let board = ["", "", "", "", "", "", "", "", ""];
let current = "X";
let gameOver = false;
let mode = "pvp";
let scores = { X: 0, O: 0, D: 0 };


const WIN_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

cells.forEach(function (cell) {
    cell.addEventListener("click", function () {
        let index = cell.dataset.index;
        index = Number(index);
        handleClick(index);
    });
});
function handleClick(index) {
    if (board[index] !== "" || gameOver) return;
    placeMark(index, current);

    let winner = checkWinner();

    if (winner) {
        endGame(winner);

    } else if (board.every(function (cell) { return cell !== ""; })) {
        endGame(null);

    } else {

        current = current === "X" ? "O" : "X";

        setStatus("Player " + current + "'s turn",
            current === "X" ? "x-turn" : "o-turn");


        if (mode === "ai" && current === "O") {
            setTimeout(aiMove, 450);
        }
    }


    function placeMark(index, player) {
        board[index] = player;

        let cell = cells[index];
        cell.textContent = player;
        cell.classList.add("taken");
        cell.classList.add(player.toLowerCase());
    }

    function checkWinner() {

        for (let i = 0; i < WIN_COMBOS.length; i++) {
            let combo = WIN_COMBOS[i];
            let a = combo[0];
            let b = combo[1];
            let c = combo[2];

            if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
                return { player: board[a], combo: combo };
            }
        }
        return null;
    }

    function endGame(winner) {
        gameOver = true;

        if (winner) {
            winner.combo.forEach(function (index) {
                cells[index].classList.add("winner");
            });
            scores[winner.player]++;
            updateScores();
            setStatus("Player " + winner.player + " winner! 🎉", "win-msg");

        } else {
            scores.D++;
            updateScores();
            setStatus("Draw! No one wins 🤝", "draw-msg");
        }
    }

    function updateScores() {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
        scoreD.textContent = scores.D;
    }

    function setStatus(text, cssClass) {
        statusEl.textContent = text;
        statusEl.className = cssClass;
    }

    function restartGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        current = "X";
        gameOver = false;

        cells.forEach(function (cell) {
            cell.textContent = "";
            cell.className = "cell";
        });

        setStatus("Player X's turn", "x-turn");
    }

    btnRestart.addEventListener("click", restartGame);


    function setMode(newMode) {
        mode = newMode;

        btnPvp.classList.toggle("active", mode === "pvp");
        btnAi.classList.toggle("active", mode === "ai");

        restartGame();
    }

    btnPvp.addEventListener("click", function () { setMode("pvp"); });
    btnAi.addEventListener("click", function () { setMode("ai"); });


    btnPvp.classList.add("active");

    function aiMove() {
        if (gameOver) return;
        let move = null;
        move = findBestMove("O");
        if (move === null) move = findBestMove("X");
        if (move === null && board[4] === "") move = 4;
        if (move === null) {
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") { move = i; break; }
            }
        }
        if (move !== null) {
            placeMark(move, "O");

            let winner = checkWinner();
            if (winner) {
                endGame(winner);
            } else if (board.every(function (c) { return c !== ""; })) {
                endGame(null);
            } else {
                current = "X";
                setStatus("Player X's turn", "x-turn");
            }
        }
    }

    function findBestMove(player) {
        for (let i = 0; i < WIN_COMBOS.length; i++) {
            let combo = WIN_COMBOS[i];
            let a = combo[0], b = combo[1], c = combo[2];
            if (board[a] === player && board[b] === player && board[c] === "") return c;
            if (board[a] === player && board[c] === player && board[b] === "") return b;
            if (board[b] === player && board[c] === player && board[a] === "") return a;
        }
        return null;
    }



}