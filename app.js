$(document).ready(function(){
    var player = 1;
    var winner = 0;
    var colors = {};
    colors[-1] = "yellow";
    colors[1] = "red";
    var count = 0;
    var gameStartTime;
    var player1Time = 0;
    var player2Time = 0;
    var gameTimerInterval;
    var player1TimerInterval;
    var player2TimerInterval;

    $(".cell").each(function(){
        $(this).attr("id", count);
        $(this).attr("data-player", 0);
        count++;
    });

    function startGame() {
        player = 1;
        winner = 0;
        player1Time = 0;
        player2Time = 0;
        gameStartTime = new Date();
        clearInterval(gameTimerInterval);
        clearInterval(player1TimerInterval);
        clearInterval(player2TimerInterval);
        gameTimerInterval = setInterval(updateGameTimer, 1000);
        player1TimerInterval = setInterval(updatePlayer1Timer, 1000);
        $(".cell").css("background-color", "white");
        $(".cell").attr("data-player", 0);
    }

    function resetGame() {
        startGame();
        clearInterval(gameTimerInterval);
        clearInterval(player1TimerInterval);
        clearInterval(player2TimerInterval);
        $("#player1-time").text("Player 1 time: 00:00:00");
        $("#player2-time").text("Player 2 time: 00:00:00");
        $("#game-time").text("Game time: 00:00:00");
    }

    function updateGameTimer() {
        var currentTime = new Date();
        var timeDiff = currentTime - gameStartTime;
        $("#game-time").text("Game time: " + formatTime(timeDiff));
    }

    function updatePlayer1Timer() {
        if (player === 1 && winner === 0) {
            player1Time++;
            $("#player1-time").text("Player 1 time: " + formatTime(player1Time * 1000));
        }
    }

    function updatePlayer2Timer() {
        if (player === -1 && winner === 0) {
            player2Time++;
            $("#player2-time").text("Player 2 time: " + formatTime(player2Time * 1000));
        }
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
    });

    $("#reset").click(function() {
        resetGame();
    });

    $(".cell").click(function(){
        if(isValid($(this).attr("id"))){
            $(this).css("background-color", colors[player]);
            $(this).attr("data-player", player);
            if(checkWin(player)){
                alert(colors[player] + " has won!");
                winner = player;
                clearInterval(gameTimerInterval);
                clearInterval(player1TimerInterval);
                clearInterval(player2TimerInterval);
            } else {
                if (player === 1) {
                    updatePlayer2Timer();
                } else {
                    updatePlayer1Timer();
                }
                player
                *= -1;
            }
        }
    });
    
    function isValid(n){
        var id = parseInt(n);
        if(winner !== 0){
            return false;
        }
        if($("#" + id).attr("data-player") === "0"){
            if(id >= 35){
                return true;
            }
            if($("#" + (id + 7)).attr("data-player") !== "0"){
                return true;
            }
        }
        return false;
    }
    
    function checkWin(p){
        //check rows
        var chain = 0; 
        for(var i = 0; i < 42; i+=7){
            for(var j = 0; j < 7; j++){
                var cell = $("#" + (i+j));
                if(cell.attr("data-player") == p){
                    chain++;
                }else{
                    chain=0;
                }
    
                if(chain >= 4){
                    return true;
                }
            }
            chain = 0;
        }
    
        //check columns
        chain = 0;
        for(var i = 0; i < 7; i++){
            for(var j = 0; j < 42; j+=7){
                var cell = $("#" + (i + j));
                if(cell.attr("data-player") == p){
                    chain++;
                }else{
                    chain = 0;
                }
    
                if(chain >= 4){
                    return true;
                }
            }
            chain = 0;
        }
    
        //check diagonals
        var topLeft = 0;
        var topRight = topLeft + 3;
    
        for(var i = 0; i <3; i++){
            for(var j = 0; j < 4; j++){
                if($("#" + topLeft).attr("data-player") == p
                && $("#" + (topLeft + 8)).attr("data-player") == p
                && $("#" + (topLeft + 16)).attr("data-player") == p
                && $("#" + (topLeft + 24)).attr("data-player") == p){
                    return true;
                }
    
                if($("#" + topRight).attr("data-player") == p
                && $("#" + (topRight + 6)).attr("data-player") == p
                && $("#" + (topRight + 12)).attr("data-player") == p
                && $("#" + (topRight + 18)).attr("data-player") == p){
                    return true;
                }
    
                topLeft++;
                topRight = topLeft + 3;
            }
            topLeft = i * 7 + 7;
            topRight = topLeft + 3;
        }
        
        return false;
    }
});