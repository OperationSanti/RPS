$(document).ready(function() {
    var player = 1;
    var winner = 0;
    var colors = {};
    colors[-1] = "yellow";
    colors[1] = "red";
    var count = 0;
    var gameStartTime;
    var player1Time = 0;
    var player2Time = 0;
    var timerInterval;

    var hasResultBeenDisplayed = false;

    $(".cell").each(function() {
        $(this).attr("id", count);
        $(this).attr("data-player", 0);
        $(this).attr("disabled", true);
        count++;
    });

    $(".cell").click(function() {
        if ($("#start").attr("disabled") !== "disabled" || isValid($(this).attr("id")) === false || winner !== 0) {
            return;
        }
        if (isValid($(this).attr("id"))) {
            $(this).css("background-color", colors[player]);
            $(this).attr("data-player", player);
            if (checkWin(player)) {
                clearInterval(timerInterval);
                winner = player;
                var playerTime = player === 1 ? player1Time * 1000 : player2Time * 1000;
                var formattedTime = formatTime(playerTime)
                $(".cell").attr("disabled", true);
                $("#pause, #reset, #rematch").removeAttr("disabled");
            } else {
                player *= -1;
            }
        }
    });
    

    $("#rematch").click(function() {
        resetGame();
        $("#start").removeAttr("disabled");
        hasResultBeenDisplayed = false;
        $(".result-message").remove();
    });


    function startGame() {
        player = 1;
        winner = 0;
        player1Time = 0;
        player2Time = 0;
        gameStartTime = new Date();
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimers, 1000);
        $("#pause").removeAttr("disabled"); // enable the Pause button
        $("#reset").removeAttr("disabled"); // enable the Reset button
        $(".cell").css("background-color", "white");
        $(".cell").attr("data-player", 0);
        $(".cell").removeAttr("disabled"); // enable the cells
    }

    function resetGame() {
        startGame();
        clearInterval(timerInterval);
        $("#player1-time").text("Player 1 time: 00:00:00");
        $("#player2-time").text("Player 2 time: 00:00:00");
        $("#game-time").text("Game time: 00:00:00");
        $(".cell").attr("disabled", true); // disable the cells
        $(".cell").css("background-color", "white"); // set all cells to white
        $(".cell").attr("data-player", 0); // reset the data-player attribute to 0
        $("#pause").attr("disabled", true); // disable the Pause button
        $("#reset").attr("disabled", true); // disable the Reset button
        if (winner === 1) {
            $("#red").css("color", "white"); // set the red color to white
        } else if (winner === -1) {
            $("#yellow").css("color", "white"); // set the yellow color to white
        }
        winner = 0; // reset the winner variable
    }
    
    

    function updateTimers() {
        updateGameTimer();
        if (player === 1 && winner === 0) {
            updatePlayer1Timer();
        } else if (player === -1 && winner === 0) {
            updatePlayer2Timer();
        }
    }

    function updateGameTimer() {
        var currentTime = new Date();
        var timeDiff = currentTime - gameStartTime;
        $("#game-time").text("Game time: " + formatTime(timeDiff));
    }

    function updatePlayer1Timer() {
        player1Time++;
        $("#player1-time").text("Player 1 time: " + formatTime(player1Time * 1000));
    }
        
    function updatePlayer2Timer() {
        player2Time++;
        $("#player2-time").text("Player 2 time: " + formatTime(player2Time * 1000));
    }

    function formatTime(time) {
        var date = new Date(time);
        var hours = date.getUTCHours().toString().padStart(2, "0");
        var minutes = date.getUTCMinutes().toString().padStart(2, "0");
        var seconds = date.getUTCSeconds().toString().padStart(2, "0");
        return hours + ":" + minutes + ":" + seconds;
    }
    
    $("#start").click(function() {
        startGame();
        $("#start").attr("disabled", true); // disable the Start button after it's pressed
    });
    
    $("#reset").click(function() {
        resetGame();
        $("#start").removeAttr("disabled"); // enable the Start button after the game is reset
    });
    $("#pause").click(function() {
        if ($("#pause").text() === "Pause") {
            clearInterval(timerInterval);
            $(".cell").attr("disabled", true); // disable the cells
            $("#pause").text("Resume");
        } else {
            timerInterval = setInterval(updateTimers, 1000);
            $(".cell").removeAttr("disabled"); // enable the cells
            $("#pause").text("Pause");
        }
    });

    $(".cell").click(function() {
        if ($("#start").attr("disabled") !== "disabled" || isValid($(this).attr("id")) === false || winner !== 0) {
            return;
        }
        if (isValid($(this).attr("id"))) {
            $(this).css("background-color", colors[player]);
            $(this).attr("data-player", player);
            if (checkWin(player)) {
                clearInterval(timerInterval);
                winner = player;
                var playerTime = player === 1 ? player1Time * 1000 : player2Time * 1000;
                var formattedTime = formatTime(playerTime);
                $(".cell").attr("disabled", true);
                $("#pause, #reset, #rematch").removeAttr("disabled");
                if (winner === 1) {
                    $("#red").css("color", "white"); // set the red color to white
                } else if (winner === -1) {
                    $("#yellow").css("color", "white"); // set the yellow color to white
                }
            } else {
                player *= -1;
            }
        }
    });
    

    function isValid(id){
        if ($("#" + id).attr("data-player") !== "0") {
            return false;
        }
        if (id < 35) {
            return $("#" + (parseInt(id) + 7)).attr("data-player") !== "0";
        }
        return true;
    }

    function checkWin(player) {
        for (var row = 0; row < 6; row++) {
            for (var col = 0; col < 7; col++) {
                var cellId = (row * 7) + col;
                if (checkDirection(cellId, player, 1, 0) || // horizontal
                    checkDirection(cellId, player, 0, 1) || // vertical
                    checkDirection(cellId, player, 1, 1) || // diagonal up
                    checkDirection(cellId, player, 1, -1)) { // diagonal down
                    clearInterval(timerInterval);
                    winner = player;
                    var playerTime = player === 1 ? player1Time * 1000 : player2Time * 1000;
                    var formattedTime = formatTime(playerTime);
                    var $resultList = $('#result-list');
                    var winnerIndex = $resultList.children().length + 1;
                    $("<li>").text(colors[player] + " won with a time of: " + formattedTime).appendTo("#result-list");
                    $(".cell").attr("disabled", true);
                    $("#pause, #reset, #rematch").removeAttr("disabled");
                    if (winner === 1) {
                        $("#red").css("color", "white"); // set the red color to white
                    } else if (winner === -1) {
                        $("#yellow").css("color", "white"); // set the yellow color to white
                    }
                    return true;
                }
            }
        }
        return false;
    }
    

    function checkDirection(cellId, player, rowDir, colDir) {
        var count = 0;
        var row = Math.floor(cellId / 7);
        var col = cellId % 7;

        while (row >= 0 && row < 6 && col >= 0 && col < 7) {
            if ($("#" + (row * 7 + col)).attr("data-player") === player.toString()) {
                count++;
                if (count === 4) {
                    return true;
                }
            } else {
                count = 0;
            }
            row += rowDir;
            col += colDir;
        }
        return false;
    }
});
 
