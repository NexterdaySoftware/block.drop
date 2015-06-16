

function buildBoard(Bwidth, Bheight) {
    var el = document.getElementById("board");
    var board = "<table id='mainboard'>";
    var w = 0,
        h = 0;
    for (h = 0; h < Bheight; h++) {
        if (h === 0)
            board += "<tr style='display:none;'>";
        else if (h == 2)
            board += "<tr class='border_bottom_fail'>";
        else
            board += "<tr>";
        for (w = 0; w < Bwidth; w++) {
            board += "<td id='" + threedig(w) + threedig(Bheight - h - 1) + "'></td>";
        }
        board += "</tr>\n";
    }
    board += "</table>";
    el.innerHTML = board;
    if (Bheight > 25)
        document.getElementById("mainboard").style.borderCollapse = 'collapse';
    else
        document.getElementById("mainboard").style.borderCollapse = 'separate';
}

function drawNextBlock() {
    if (y > height - 3)
        return; //avoid most block overlap for aesethics
    setnextblocktype(nextblock);
    document.getElementById(cellID(npax, npay)).style.backgroundColor = nextcol;
    document.getElementById(cellID(npbx, npby)).style.backgroundColor = nextcol;
    document.getElementById(cellID(npcx, npcy)).style.backgroundColor = nextcol;
    document.getElementById(cellID(npdx, npdy)).style.backgroundColor = nextcol;
}

function undrawNextBlock() {
    var undrawX, undrawY;
    for (undrawY = height - 3; undrawY < height - 1; undrawY++) //just top 2 minus the invisible top row
    {
        for (undrawX = 0; undrawX < width; undrawX++) {
            var cell = document.getElementById(cellID(undrawX, undrawY));
            if (compareColors(cell.style.backgroundColor, nextcol))
                document.getElementById(cellID(undrawX, undrawY)).style.backgroundColor = backcol;
        }
    }
}

function undraw() {
    document.getElementById(cellID(x + pax, y + pay)).style.backgroundColor = backcol;
    document.getElementById(cellID(x + pbx, y + pby)).style.backgroundColor = backcol;
    document.getElementById(cellID(x + pcx, y + pcy)).style.backgroundColor = backcol;
    document.getElementById(cellID(x + pdx, y + pdy)).style.backgroundColor = backcol;
    drawNextBlock();
}

function draw() {
    document.getElementById(cellID(x + pax, y + pay)).style.backgroundColor = color;
    document.getElementById(cellID(x + pbx, y + pby)).style.backgroundColor = color;
    document.getElementById(cellID(x + pcx, y + pcy)).style.backgroundColor = color;
    document.getElementById(cellID(x + pdx, y + pdy)).style.backgroundColor = color;
}

function updatescore() {
    save(score);
    document.getElementById("score").innerHTML = "<p>Score: " + score + "</p><br><p>Rows: " + rowscleared + "</p.";
}

function grav(srow) {
    for (var row = srow; row < height - 1; row++) {
        for (var col = 0; col < width; col++) {
            document.getElementById(cellID(col, row)).style.backgroundColor = document.getElementById(cellID(col, row + 1)).style.backgroundColor;
        }
    }
    for (var col2 = 0; col2 < width; col2++) {
        document.getElementById(cellID(col2, height - 1)).style.backgroundColor = backcol;
    }
}

function setblocktype(num) {
    switch (num) {
        case 0: //     square
            pax = 0;
            pay = 0;
            pbx = 1;
            pby = 0;
            pcx = 0;
            pcy = -1;
            pdx = 1;
            pdy = -1;
            break;
        case 1: //       ____
            pax = 0;
            pay = 0;
            pbx = 1;
            pby = 0;
            pcx = 2;
            pcy = 0;
            pdx = -1;
            pdy = 0;
            break;
        case 2: //       _|_
            pax = -1;
            pay = 0;
            pbx = 0;
            pby = 0;
            pcx = 1;
            pcy = 0;
            pdx = 0;
            pdy = -1;
            break;
        case 3: //       ___|
            pax = -1;
            pay = 0;
            pbx = 0;
            pby = 0;
            pcx = 1;
            pcy = 0;
            pdx = 1;
            pdy = -1;
            break;
        case 4: //       |___
            pax = -1;
            pay = -1;
            pbx = -1;
            pby = 0;
            pcx = 0;
            pcy = 0;
            pdx = 1;
            pdy = 0;
            break;
        case 5: //       ^|_
            pax = -1;
            pay = -1;
            pbx = 0;
            pby = -1;
            pcx = 0;
            pcy = 0;
            pdx = 1;
            pdy = 0;
            break;
        case 6: //       _|^
            pax = -1;
            pay = 0;
            pbx = 0;
            pby = 0;
            pcx = 0;
            pcy = -1;
            pdx = 1;
            pdy = -1;
            break;
    }
}

function setnextblocktype(num) {
    var nextX = Math.round((width - 2) / 2);
    var nextY = height - 2;

    switch (num) {
        case 0: //     square
            npax = 0;
            npay = 0;
            npbx = 1;
            npby = 0;
            npcx = 0;
            npcy = -1;
            npdx = 1;
            npdy = -1;
            break;
        case 1: //       ____
            npax = 0;
            npay = 0;
            npbx = 1;
            npby = 0;
            npcx = 2;
            npcy = 0;
            npdx = -1;
            npdy = 0;
            break;
        case 2: //       _|_
            npax = -1;
            npay = 0;
            npbx = 0;
            npby = 0;
            npcx = 1;
            npcy = 0;
            npdx = 0;
            npdy = -1;
            break;
        case 3: //       ___|
            npax = -1;
            npay = 0;
            npbx = 0;
            npby = 0;
            npcx = 1;
            npcy = 0;
            npdx = 1;
            npdy = -1;
            break;
        case 4: //       |___
            npax = -1;
            npay = -1;
            npbx = -1;
            npby = 0;
            npcx = 0;
            npcy = 0;
            npdx = 1;
            npdy = 0;
            break;
        case 5: //       ^|_
            npax = -1;
            npay = -1;
            npbx = 0;
            npby = -1;
            npcx = 0;
            npcy = 0;
            npdx = 1;
            npdy = 0;
            break;
        case 6: //       _|^
            npax = -1;
            npay = 0;
            npbx = 0;
            npby = 0;
            npcx = 0;
            npcy = -1;
            npdx = 1;
            npdy = -1;
            break;
    }
    npax += nextX;
    npbx += nextX;
    npcx += nextX;
    npdx += nextX;
    npay += nextY;
    npby += nextY;
    npcy += nextY;
    npdy += nextY;
}

function clear() {
    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
            document.getElementById(cellID(col, row)).style.backgroundColor = backcol;
        }
    }
}

function randcolor() {
    var r = Math.floor(Math.random() * 16);
    var g = Math.floor(Math.random() * 16);
    var b = Math.floor(Math.random() * 16);
    if (r < 5 && g < 5 && b < 5) //nothing too dark
        return randcolor();
    var colorToReturn = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    if (colorToReturn == nextcol)
        return randcolor();
    return colorToReturn;
}

//To compare colors from https://gist.github.com/tiff/887032
var compareColors;

if (window.getComputedStyle) { // Chrome, Safari, Firefox, IE9

    compareColors = (function() {
        var tempElement = document.createElement("span");
        tempElement.className = "_color-converter";
        tempElement.style.display = "none";

        function _getRgb(color) {
            tempElement.style.color = color;
            return window.getComputedStyle(tempElement, null).getPropertyValue("color");
        }

        return function(color1, color2) {
            if (!tempElement.parentNode) {
                document.body.appendChild(tempElement);
            }
            return _getRgb(color1) === _getRgb(color2);
        };
    })();

} else if (window.createPopup) { // MSIE

    compareColors = (function() {
        var body;

        function _getHex(color) {
            var range,
                value;
            body = body || createPopup().document.body;
            range = body.createTextRange();
            body.style.color = color;
            value = range.queryCommandValue("ForeColor");
            value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
            value = value.toString(16);
            return "#000000".slice(0, 7 - value.length) + value;
        }

        return function(color1, color2) {
            return _getHex(color1) === _getHex(color2);
        };
    })();

} else { // Dunno...
    compareColors = function() {
        return false;
    };
}