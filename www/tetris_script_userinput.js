

function removeClickedIndicator(id) {
    var qbox = document.getElementById(id);
    qbox.classList.remove('clicked');
}

function quadcontrols() {
    var touchleft = function(e) {
        if (controlType == 2) {
            var qbox = document.getElementById("TL");
            qbox.classList.add('clicked');
            window.setTimeout(function() {
                removeClickedIndicator("TL");
            }, 100);
            left();
        }
    };
    var touchright = function(e) {
        if (controlType == 2) {
            var qbox = document.getElementById("TR");
            qbox.classList.add('clicked');
            window.setTimeout(function() {
                removeClickedIndicator("TR");
            }, 100);
            right();
        }
    };
    var touchrotate = function(e) {
        if (controlType == 2) {
            var qbox = document.getElementById("BR");
            qbox.classList.add('clicked');
            window.setTimeout(function() {
                removeClickedIndicator("BR");
            }, 100);
            rotate();
        }
    };
    var touchdrop = function(e) {
        if (controlType == 2) {
            var qbox = document.getElementById("BL");
            qbox.classList.add('clicked');
            window.setTimeout(function() {
                removeClickedIndicator("BL");
            }, 100);
            drop();
        }
    };
    document.getElementById("TL").addEventListener('touchstart', touchleft);
    document.getElementById("TR").addEventListener('touchstart', touchright);
    document.getElementById("BL").addEventListener('touchstart', touchdrop);
    document.getElementById("BR").addEventListener('touchstart', touchrotate);

    updateDivider();
}

function updateDivider() {
    if (controlType == 2) {
        document.getElementById("quadbTL").style.visibility = "visible";
        document.getElementById("quadbTR").style.visibility = "visible";
        document.getElementById("quadbBL").style.visibility = "visible";
        document.getElementById("quadbBR").style.visibility = "visible";
    } else {
        document.getElementById("quadbTL").style.visibility = "hidden";
        document.getElementById("quadbTR").style.visibility = "hidden";
        document.getElementById("quadbBL").style.visibility = "hidden";
        document.getElementById("quadbBR").style.visibility = "hidden";
    }
}

function handleswipe(swipedir) {
    switch (swipedir) {
        case "left":
            left();
            break;
        case "right":
            right();
            break;
        case "up":
            rotate();
            break;
        case "down":
            drop();
            break;
    }
}

function swipecontrols(touchsurface) {
    var isswipe = false,
        threshold = 20, //required min distance traveled to be considered swipe
        boundX1, boundX2, boundY1, boundY2;
    var touchstartfunc = function(e) {
        if (controlType != 1) //not using swipe controls
            return;
        isswipe = true;
        var touchobj = e.changedTouches[0];
        var startX = touchobj.pageX;
        var startY = touchobj.pageY;
        boundX1 = startX - threshold;
        boundX2 = startX + threshold;
        boundY1 = startY - threshold;
        boundY2 = startY + threshold;
        e.preventDefault();
    };

    var touchmovefunc = function(e) {
        if (controlType != 1) //not using swipe controls
            return;
        if (!isswipe)
            return;
        e.preventDefault() // prevent scrolling when inside DIV
        var touchobj = e.changedTouches[0];
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        if (startX < boundX1) {
            isswipe = false;
            handleswipe('left');
            return;
        }
        if (startX > boundX2) {
            isswipe = false;
            handleswipe('right');
            return;
        }
        if (startY < boundY1) {
            isswipe = false;
            handleswipe('up');
            return;
        }
        if (startY > boundY2) {
            isswipe = false;
            handleswipe('down');
            return;
        }
    };
    touchsurface.addEventListener('touchstart', touchstartfunc);
    touchsurface.addEventListener('touchmove', touchmovefunc);
}

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case (37):
            left();
            break;
        case (38): //up
            rotate();
            break;
        case (39):
            right();
            break;
        case (40): //down
            drop();
            break;
    }
}, true);


