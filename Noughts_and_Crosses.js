/**
 * Created by Chaika Evgeniy on 02.11.15.
 */

var configGame = {
    arrField: [],
    playerIndex: 1,
    widthX: 0,
    heightY: 0,
    winLine: 0,
    players: ['O', 'X'],
    count: 0,
    countLimit: 0,
    countIdTables: 1,
    sumTables: 3,
    arrayTables: [],
    arrayCountSteps: []
};

function initGame() {
    configGame.widthX = parseInt(document.getElementById("field-width").value);
    configGame.heightY = parseInt(document.getElementById("field-height").value);
    configGame.winLine = parseInt(document.getElementById("field-number-to-win").value);
    configGame.countLimit = configGame.widthX * configGame.heightY;

    configGame.arrField = new Array(configGame.heightY); // create new array.
    for (var i = 0; i < configGame.arrField.length; i++) {
        configGame.arrField[i] = new Array(configGame.widthX);
    }

    for (i = 0; i < configGame.arrField.length; i++) {
        for (var j = 0; j < configGame.arrField[i].length; j++) {
            configGame.arrField[i][j] = "" + configGame.countIdTables + i + j;
        }
    }
    configGame.arrayTables.push(configGame.arrField);
    configGame.arrayCountSteps.push(configGame.count);
}

//-----------------MODEL------------------------------//

function Game() {
}

Game.prototype.onClickButton = function (event) {
    event.disabled = "disabled";
    event.value = configGame.players[configGame.playerIndex];
    event.arrayGame = configGame.arrayTables;

    var idStr = event.getAttribute("data-id");
    var idT = parseInt(idStr[0]);
    var idI = parseInt(idStr[1]);
    var idJ = parseInt(idStr[2]);

    if (document.getElementById("radio").switcher.value == "cross") {
        event.value = configGame.players[1];
    }
    if (document.getElementById("radio").switcher.value == "zero") {
        event.value = configGame.players[0];
    }
    if (document.getElementById("radio").switcher.value == "dynamic") {
        event.value = configGame.players[configGame.playerIndex];
    }

    for (var i = 0; i < event.arrayGame[idT - 1].length; i++) {
        for (var j = 0; j < event.arrayGame[idT - 1][i].length; j++) {
            event.arrayGame[idT - 1][idI][idJ] = event.value;
        }
    }

    document.getElementsByClassName("game-button").button = event.value;

    configGame.arrayCountSteps[idT - 1]++;
    configGame.playerIndex == 1 ? configGame.playerIndex-- : configGame.playerIndex++;

    if (isWin() == configGame.players[1]) {
        alert("Win Crosses!");
        reset();
        return false;
    }
    if (isWin() == configGame.players[0]) {
        alert("Win Noughts!");
        reset();
        return false;
    }
    if (configGame.arrayCountSteps[idT - 1] == configGame.countLimit) {
        alert("Draw.");
        reset();
        return false;
    }


    function isWin() { // Check winning.
        for (var idI = 0; idI <= event.arrayGame[idT - 1].length - configGame.winLine; idI++)
            for (var idJ = 0; idJ <= event.arrayGame[idT - 1][0].length - configGame.winLine; idJ++) {
                var lineCount = event.arrayGame[idT - 1][idI][idJ]; // check line
                if (lineCount != null)
                    for (i = 0; i < configGame.winLine; i++)
                        if (event.arrayGame[idT - 1][i + idI][i + idJ] != lineCount) lineCount = null; // If the cell does not contain verifiable lineCount, then reset the lineCount
                if (lineCount != null) return lineCount; // if victory is found.
                lineCount = event.arrayGame[idT - 1][(configGame.winLine - 1) + idI][idJ];
                if (lineCount != null)
                    for (i = 0; i < configGame.winLine; i++)
                        if (event.arrayGame[idT - 1][(configGame.winLine - 1) - i + idI][i + idJ] != lineCount) lineCount = null;
                if (lineCount != null) return lineCount;

                for (i = 0; i < configGame.winLine; i++) { // checking vertical
                    lineCount = event.arrayGame[idT - 1][idI + i][idJ];
                    if (lineCount != null) for (j = 0; j < configGame.winLine; j++)
                        if (event.arrayGame[idT - 1][i + idI][j + idJ] != lineCount) lineCount = null;
                    if (lineCount != null) return lineCount;
                }
                for (j = 0; j < configGame.winLine; j++) { // checking horizontal
                    lineCount = event.arrayGame[idT - 1][idI][idJ + j];
                    if (lineCount != null) for (i = 0; i < configGame.winLine; i++)
                        if (event.arrayGame[idT - 1][i + idI][j + idJ] != lineCount) lineCount = null;
                    if (lineCount != null) return lineCount;
                }
            }
        return false; // if no one wins
    }

    function reset() {
        var i;
        var inp = document.getElementsByClassName('table' + idT);
        var inputs = inp[0].getElementsByTagName('input');

        for (i = 0; i < inputs.length; i++) {
            inputs[i].disabled = inputs[i].value = '';
        }

        configGame.arrayCountSteps[idT - 1] = 0;

        for (var a = 0; a < event.arrayGame[idT - 1].length; a++) {
            for (var j = 0; j < event.arrayGame[idT - 1][a].length; j++) {
                event.arrayGame[idT - 1][a][j] = "" + idT + a + j;
            }
        }
    }
};


//----------------------------------- VIEW---------------------------------------- //
function GameView() {
}
GameView.prototype.drawHeader = function () {
    return this.GameHeaderTemplate();
};
GameView.prototype.drawTable = function () {
    this.GameTableTemplate();
};
/**
 * @return {string}
 */
GameView.prototype.GameHeaderTemplate = function () {
    var result = "<div class='head'><h1>Noughts and Crosses</h1><form class='form-one'><div><label>" +
        "Width: </label><p><input id='field-width'  type= 'text'  name='input1' value=''></p>";
    result += "<label >Height: </label><p><input id='field-height' type='text' name='input2' value=''></p>";
    result += "<label >Number to win: </label><p><input id='field-number-to-win' type='text' name='input3' value=''></p>";
    result += "<p><input  type='submit'  " +
        "onclick='GameController.prototype.initTable(this)' value='Start Game'/></p>" +
        "</div></form><b>Cross or Nought?</b> " +
        "<form id='radio'><p><input name='switcher' type='radio' value='cross'><span>Cross</span></p>" +
        "<p><input name='switcher' type='radio' value='zero' checked><span>Nought</span></p>"
        + "<p><input name='switcher' type='radio' value='dynamic' checked><span>In turn</span></p>" +
        "</form></div><div id=1></div>";
    return result;
};
GameView.prototype.GameTableTemplate = function () {
    var resTable = "<table class='table" + configGame.countIdTables + "'>"; // tag header table.

    for (var i = 0; i < configGame.arrField.length; i++) {
        resTable += "<tr>"; // create new line
        for (var j = 0; j < configGame.arrField[i].length; j++) { // pasting cells in a line
            resTable += "<td>";
            resTable += "<input data-id='" + configGame.countIdTables + i + '' + j +
                "' type='button' class='game-button' onclick='Game.prototype.onClickButton(this)'/>";
            resTable += "</td>";
        }
        resTable += "</tr>"; // end of line
    }
    resTable += "</table><div id=" + (++configGame.countIdTables) + ">";
    document.getElementById('' + (--configGame.countIdTables)).innerHTML = resTable + "</div>";
    configGame.countIdTables++;
};

// -----------------CONTROLLER ------------------------------//

function GameController() {
    this.header = GameView.prototype.GameHeaderTemplate;
    this.view = new GameView();
}
GameController.prototype.drawData = function (container) {
    container.innerHTML = this.view.drawHeader(this.header);
};
GameController.prototype.initTable = function (event) {
    for (var i = 0; i < configGame.sumTables; i++) {
        initGame();
        GameView.prototype.drawTable();
    }
    event.disabled = "disabled";
};

// -----------------------APPLICATION------------------------------------ //

function Application() {
    this.container = document.body;
    this.controller = new GameController();
}
Application.prototype.drawPage = function () {
    this.controller.drawData(this.container);
};

var app = new Application();

app.drawPage();