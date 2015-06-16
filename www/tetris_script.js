
window.onload = initialize;
//globals:
var width = 10;
var height = 19;
var backcol = "#000";

var divideheight = Math.round(height / 25 * 11);
var startSpeed = 500.1; //default
var speed = startSpeed;
var speedreducer = 0.996;
var x;
var y;
var color;
var blocktype;
var score = 0;
var rowscleared = 0;
var timer;
var scoreMultiplier = 1; //defualt
var controlType; //1= swipe, 2= quadrant
var gsize = 2; //classic
var nextcol = "#333333"; //must define with 3 bytes!!!
var nextblock = 0;
var helpout = false;

var pax, pay, pbx, pby, pcx, pcy, pdx, pdy; //cur block REL postition
var npax, npay, npbx, npby, npcx, npcy, npdx, npdy; //next block ABS position

var paused;
var started;
var gameOver;
var controlLock;
var checkingscore;

function initialize() {
    save(0);
    started = true;
    startGame(width, height, 500, 0.997, 1, 1);

    document.getElementById("pausebut").onclick = pauseToggle;
    document.getElementById("pausebut").style.visibility = 'hidden';
    document.addEventListener("pause", pauseIfPossible, false);
    document.addEventListener("backbutton", backButton, false);

    drawStart();
}

function radiocontrols() {
    var buttonstart = 1;
    var but1 = document.getElementById("radio1");
    if (but1 === null)
        buttonstart = 4;

    var anygsizechecked = false;
    var anycontrolchecked = false;
    var i;
    for (i = buttonstart; i < 6; i++) {
        if (document.getElementById('radio' + i.toString()).checked) {
            if (i < 4)
                anygsizechecked = true;
            else
                anycontrolchecked = true;
        }
    }
    //check defaults
    if (!anygsizechecked && buttonstart == 1)
        document.getElementById('radio' + gsize.toString()).checked = true;
    if (!anycontrolchecked)
        document.getElementById('radio' + (controlType + 3).toString()).checked = true;

    for (i = buttonstart; i < 6; i++) {
        var rad = document.getElementById('radio' + i.toString());
        var lab = document.getElementById('label' + i.toString());
        if (rad.checked)
            lab.style.backgroundColor = "#5dc6ec";
        else
            lab.style.backgroundColor = "#fff";
    }

    if (this.id === 'radio1') //crammed
    {
        gsize = 1;
        width = 6;
        height = 12;
        startGame(width, height, 700.1, 0.994, 2, 1);
    }
    if (this.id === 'radio2') //classic
    {
        gsize = 2;
        width = 10;
        height = 19;
        startGame(width, height, 500.1, 0.996, 1, 1);
    }
    if (this.id === 'radio3') //spacious
    {
        gsize = 3;
        width = 14;
        height = 25;
        startGame(width, height, 400.1, 0.996, 0.5, 1);
    }

    if (this.id === 'radio4') //swipe
    {
        controlType = 1;
    }
    if (this.id === 'radio5') //quad
    {
        controlType = 2;
    }
}

function drawQuad() {
    document.getElementById("pausebut").style.visibility = 'visible';
    document.getElementById("pausebut").src = "assets/pause.png";
    document.getElementById("controlBox").innerHTML =
          "<div class='controls' id='controls'><table><tr>"
        + "<td id='TL' class='quadTL'><img class='imgTL' id='quadbTL' src='assets/left.png'  /></td>"
        + "<td id='TR' class='quadTR'><img class='imgTR' id='quadbTR' src='assets/right.png' /></td></tr><tr>"
        + "<td id='BL' class='quadBL'><img class='imgB' id='quadbBL' src='assets/down.png'  /></td>"
        + "<td id='BR' class='quadBR'><img class='imgB' id='quadbBR' src='assets/rotate.png'/></td></tr></table></div>";
    swipecontrols(document.getElementById("controls"));
    quadcontrols();
}

function ShowTitle(title) {
    var boxInner = document.getElementsByClassName('titleoverlayinner')[0];
    boxInner.innerHTML = title;
    var boxOne = document.getElementsByClassName('titleoverlay')[0];
    boxOne.classList.add('open');
}

function HideTitle() {
    var boxOne = document.getElementsByClassName('titleoverlay')[0];
    boxOne.classList.remove('open');
}


function drawGameOver() {
    save(score);
    document.getElementById("pausebut").style.visibility = 'hidden';
    ShowTitle("Game Over");

    document.getElementById("controlBox").innerHTML =
          "<div id='pauseMenu' class='pauseMenu'><center style='height:100%;'>"
        + "<div class='wrapper'>"
        + "<div class='top'>"
        + "</div>"
        + "<div class='bottom'><a href='#' class='EndButton' id='reset'>Main Menu</a></div>"
        + "</div>"
        + "</center></div>";

    document.getElementById("reset").onclick = drawStart;
}

function drawPause() {
    document.getElementById("pausebut").style.visibility = 'visible';
    document.getElementById("pausebut").src = "assets/resume.png";
    ShowTitle("Paused");

    document.getElementById("controlBox").innerHTML =
          "<div id='pauseMenu' class='pauseMenu'><center style='height:100%;'>"
        + "<div class='wrapper'>"
        + "<div class='top'>"
        + "  <br/>"
        + "  <br/>"
        + "  <br/>"
        + "<h3>Controls:</h3>"
        + "  <label id='label4'>"
        + "    <input  id='radio4' class='radio' type='radio' name='controls' />"
        + "    Swipe (one handed)"
        + "  </label>"
        + "  <label id='label5'>"
        + "    <input id='radio5'  class='radio' type='radio' name='controls' />"
        + "     Buttons (two handed)"
        + "  </label>"
        + "  <br/>"
        + "  <label id='helpbut' class='helpbut'>"
        + "    <input name='gsize' class='radio' />"
        + "    Help"
        + "  </label>"
        + "  <br /><br />"
        + "  <a href='#' class='StartButton' id='resume'>Resume</a>"
        + "</div>"
        + "<div class='bottom'><a href='#' class='EndButton' id='reset'>End Game</a></div>"
        + "</div>"
        + "</center></div>";
    document.getElementById("helpbut").onclick = openhelppage;

    var ii = 4;
    for (ii = 4; ii < 6; ii++) {
        document.getElementById("radio" + ii.toString()).onclick = radiocontrols;
    }

    radiocontrols();
    document.getElementById("reset").onclick = checkDrawStart;
    document.getElementById("resume").onclick = pauseToggle;
}

function checkDrawStart() {
    if (confirm('Do you want to end game?')) {
        drawStart();
    }
}

function drawStart() {
    started = false;
    paused = false;
    gameOver = false;
    controlLock = false;
    clearTimeout(timer);
    speed = startSpeed;
    document.getElementById("pausebut").style.visibility = 'hidden';
    ShowTitle("Fullscreen Tetris"); //"Classic Block Drop");

    document.getElementById("controlBox").innerHTML =
          "<div id='pauseMenu' class='pauseMenu'><center>"
        + "<a href='#' class='StartButton' id='reset'>Start</a>"
        + "<div class='wrapper'>"
        + "  <br/>"
        + "<h3>Game Size:</h3>"
        + "  <label id='label1' >"
        + "    <input id='radio1' class='radio' type='radio' name='gsize' />"
        + "    Crammed"
        + "  </label>"
        + "  <label id='label2'>"
        + "    <input  id='radio2' class='radio' type='radio' name='gsize' />"
        + "    Classic"
        + "  </label>"
        + "  <label id='label3'>"
        + "    <input  id='radio3' class='radio' class='radio' type='radio' name='gsize' />"
        + "    Spacious"
        + "  </label>"
        + "  <br/>"
        + "<h3>Controls:</h3>"
        + "  <label id='label4'>"
        + "    <input  id='radio4' class='radio' type='radio' name='controls' />"
        + "    Swipe (one handed)"
        + "  </label>"
        + "  <label id='label5'>"
        + "    <input id='radio5'  class='radio' type='radio' name='controls' />"
        + "     Buttons (two handed)"
        + "  </label>"
        + "  <br/>"
        + "  <h3 id='highscore'>Local High Score: 0</h3>"
        + "  <br/>"
        + "  <label id='helpbut' class='helpbut'>"
        + "    <input name='gsize' class='radio' />"
        + "    Help"
        + "  </label>"
        + "</div>"
        + "</center></div>";

    document.getElementById("helpbut").onclick = openhelppage;
    document.getElementById("helpclose").onclick = closehelppage;

    var ii = 1;
    for (ii = 1; ii < 6; ii++) {
        document.getElementById("radio" + ii.toString()).onclick = radiocontrols;
    }

    radiocontrols();
    document.getElementById("reset").onclick = reset;

    load();

    document.getElementById('highscore').onclick = resetTopScore;
}

function openhelppage() {
    if (helpout)
        return;
    helpout = true;
    var helppage = document.getElementById('helppage');
    helppage.classList.add('open');
}

function closehelppage() {
    if (!helpout)
        return;
    helpout = false;
    var helppage = document.getElementById('helppage');
    helppage.classList.remove('open');
}

function resetTopScore() {
    if (confirm('Do you want to reset top score?')) {
        resetscore();
    }
    load();
}

function startGame(Bwidth, Bheight, Sspeed, Sspeedreducer, Sscoremultiplier, CcontrolType) {
	speedreducer = Sspeedreducer;
    controlType = CcontrolType;
    scoreMultiplier = Sscoremultiplier;
    startSpeed = Sspeed;
    speed = startSpeed;
    buildBoard(Bwidth, Bheight);
}

function threedig(num) {
    var base = num.toString();

    if (base.length === 3)
        return base;
    if (base.length === 2)
        return "0" + base;
    if (base.length === 1)
        return "00" + base;
    if (base.length === 0)
        return "000" + base;
}

function cellID(ww, hh) {
    return threedig(ww) + threedig(hh);
}

function reset() {
    nextblock = Math.floor(Math.random() * 5); //dont allow S block the first time. That block sucks.
    drawQuad();
    started = true;
    paused = false;
    gameOver = false;
    controlLock = false;
    checkingscore = false;
    clearTimeout(timer);
    speed = startSpeed;
    clear();
    createobj();
    score = 0;
    rowscleared = 0;
    updatescore();
    HideTitle();
}

function backButton() {
    if (helpout) {
        closehelppage();
    } else if (paused) {
        paused = false;
        drawQuad();
        HideTitle();
    }
}

function pauseIfPossible() {
    if (!started || gameOver)
        return;
    if (!paused) {
        paused = true;
        drawPause();
    }
}

function pauseToggle() {
    if (!started || gameOver)
        return;
    if (paused) {
        paused = false;
        drawQuad();
        HideTitle();
    } else {
        paused = true;
        drawPause();
    }
}

function onlyPause() {
    if (!started || gameOver)
        return;
    if (!paused) {
        paused = true;
        ShowTitle("Paused");
    }
}

function createobj() {
    blocktype = nextblock;
    nextblock = Math.floor(Math.random() * 7);

    x = Math.round((width - 2) / 2);
    y = height - 1;

    undrawNextBlock();
    //drawNextBlock();

    controlLock = false;
    checkingscore = false;
    if (gameOver)
        return;
    speed = speed * speedreducer;
    setblocktype(blocktype);
    color = randcolor();
    fall(true);
}

function fall(doRecall) {
    if (gameOver)
        return;
    if (paused) {
        if (doRecall)
            timer = window.setTimeout(function() {
                fall(true);
            }, 100);
        return false;
    }
    if (checkingscore) {
        if (doRecall)
            timer = window.setTimeout(function() {
                fall(true);
            }, 10);
        return false;
    }

    if (check(0, -1)) {
        undraw();
		drawNextBlock();
        y--;
        draw();
        if (doRecall)
            timer = window.setTimeout(function() {
                fall(true);
            }, (Math.round(speed)));
        return true;
    } else {
        controlLock = true;
        checkscore();
		var deadnow = checkDead();
        checkingscore = false;
        if (doRecall && !deadnow)
            timer = window.setTimeout(function() {
                createobj();
            }, 0);
        return false;
    }
}

//check if able to move here
function check(dx, dy) {
    if //check out of bounds
    (
        (x + pax + dx) < 0 || (x + pax + dx) >= width || (x + pbx + dx) < 0 || (x + pbx + dx) >= width || (x + pcx + dx) < 0 || (x + pcx + dx) >= width || (x + pdx + dx) < 0 || (x + pdx + dx) >= width || (y + pay + dy) < 0 || (y + pby + dy) < 0 || (y + pcy + dy) < 0 || (y + pdy + dy) < 0
    )
        return false;
    // check if already is use by other block. Bug to fix: blocks of the same color as 'color' will be ignored	
    var atile = document.getElementById(cellID(x + pax + dx, y + pay + dy)).style.backgroundColor;
    var btile = document.getElementById(cellID(x + pbx + dx, y + pby + dy)).style.backgroundColor;
    var ctile = document.getElementById(cellID(x + pcx + dx, y + pcy + dy)).style.backgroundColor;
    var dtile = document.getElementById(cellID(x + pdx + dx, y + pdy + dy)).style.backgroundColor;

    return ((compareColors(atile, backcol) || compareColors(atile, color) || compareColors(atile, nextcol)) && (compareColors(btile, backcol) || compareColors(btile, color) || compareColors(btile, nextcol)) && (compareColors(ctile, backcol) || compareColors(ctile, color) || compareColors(ctile, nextcol)) && (compareColors(dtile, backcol) || compareColors(dtile, color) || compareColors(dtile, nextcol)));
}

//check if able to rotate here
function checkrotate() {
    var testpax = pay; //first test locations
    var testpay = -pax;
    var testpbx = pby;
    var testpby = -pbx;
    var testpcx = pcy;
    var testpcy = -pcx;
    var testpdx = pdy;
    var testpdy = -pdx;
    if (
        (x + testpax) < 0 || (x + testpax) == width || (x + testpbx) < 0 || (x + testpbx) == width || (x + testpcx) < 0 || (x + testpcx) == width || (x + testpdx) < 0 || (x + testpdx) == width ||
        (y + testpay) < 0 || (y + testpby) < 0 || (y + testpcy) < 0 || (y + testpdy) < 0
    )
        return false;

    // check if already is use by other block.
    var atile = document.getElementById(cellID(x + testpax, y + testpay)).style.backgroundColor;
    var btile = document.getElementById(cellID(x + testpbx, y + testpby)).style.backgroundColor;
    var ctile = document.getElementById(cellID(x + testpcx, y + testpcy)).style.backgroundColor;
    var dtile = document.getElementById(cellID(x + testpdx, y + testpdy)).style.backgroundColor;

    return ((compareColors(atile, backcol) || compareColors(atile, color) || compareColors(atile, nextcol)) && (compareColors(btile, backcol) || compareColors(btile, color) || compareColors(btile, nextcol)) && (compareColors(ctile, backcol) || compareColors(ctile, color) || compareColors(ctile, nextcol)) && (compareColors(dtile, backcol) || compareColors(dtile, color) || compareColors(dtile, nextcol)));
}

function left() {
    if (!started || gameOver || paused || controlLock)
        return;
    if (check(-1, 0)) {
        undraw();
        x--;
        draw();
    }
}

function right() {
    if (!started || gameOver || paused || controlLock)
        return;
    if (check(1, 0)) {
        undraw();
        x++;
        draw();
    }
}

function rotate() {
    if (!started || gameOver || paused || controlLock)
        return;
    if (blocktype !== 0 && checkrotate()) //dont rotate squares
    {
        undraw();
        var ahold = pax;
        var bhold = pbx;
        var chold = pcx;
        var dhold = pdx;
        pax = pay;
        pay = -ahold;
        pbx = pby;
        pby = -bhold;
        pcx = pcy;
        pcy = -chold;
        pdx = pdy;
        pdy = -dhold;
        draw();
    }
}

function drop() {
    if (!started || gameOver || paused)
        return;
    clearTimeout(timer);
    while (fall(false));
    //fall(true);
    timer = window.setTimeout(function() {
        createobj();
    }, 0);
}

function checkscore() {
    undrawNextBlock();
    checkingscore = true;
    var rowsclearedl = 0;
    for (var row = height - 1; row >= 0; row--) {
        var rowfull = true;
        for (var col = 0; col < width; col++) {
            if (checkBack(col, row))
                rowfull = false;
        }
        if (rowfull) {
            grav(row);
            rowsclearedl++;
            rowscleared++;
        }
    }
    if (rowsclearedl == 1)
        score += 100 * scoreMultiplier; //100 per row
    else if (rowsclearedl == 2)
        score += 300 * scoreMultiplier; //150 per row
    else if (rowsclearedl == 3)
        score += 600 * scoreMultiplier; //200 per row
    else if (rowsclearedl == 4)
        score += 1000 * scoreMultiplier; //250 per row
    if (rowsclearedl !== 0)
        updatescore();
    checkingscore = false;
    return (rowscleared > 0);
}

function checkDead() {
    for (var col = 0; col < width; col++) {
        if (!checkBack(col, height - 3) && compareColors(document.getElementById(cellID(col, height - 3)).style.backgroundColor, color)) {
            drawGameOver();
            gameOver = true;
            clearTimeout(timer);
			return true;
        }
    }
	return false;
}

function checkBack(cl, rw) {
    if (compareColors(document.getElementById(cellID(cl, rw)).style.backgroundColor, backcol))
        return true;
    if (compareColors(document.getElementById(cellID(cl, rw)).style.backgroundColor, nextcol))
        return true;
    return false;
}