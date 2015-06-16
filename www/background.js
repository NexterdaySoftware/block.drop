
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        width: 244,
        height: 380,
    });
    save(0);
});

function resetscore() {
    try {
        window.localStorage.setItem("scorels", "0");
    } catch (e) { //gracefully fall back to cookies
        setCookie('score', 0, 20 * 365); //20 years in future
    }
}

function save(data) {
    try {
		var score = 0;
		score = parseInt(window.localStorage.getItem("scorels"));
		if (score.toString() == 'NaN' || score < 0 || (!(score > -1)))
			score = 0;
		if (data >= score)
			window.localStorage.setItem("scorels", data.toString());
    } catch (e) { //gracefully fall back to cookies
        saveAsCookie(data);
    }
}

function load() {
    document.getElementById("highscore").innerHTML = "";
    try {
        var score = 0;
        score = parseInt(window.localStorage.getItem("scorels"));
        if (score.toString() == 'NaN' || score < 0 || (!(score > -1)))
            document.getElementById("highscore").innerHTML = "";
        else
            document.getElementById("highscore").innerHTML = "Local High Score: " + score.toString();
    } catch (e) { //gracefully fall back to cookies
        var score = loadAsCookie();
        if (score.toString() == 'NaN' || score < 0 || (!(score > -1)))
            document.getElementById("highscore").innerHTML = "";
        else
            document.getElementById("highscore").innerHTML = "Local High Score: " + score.toString();
    }
}

function saveAsCookie(data) {
    var score = 0;
    score = parseInt(getCookie('score'));
    if (score.toString() == 'NaN' || score < 0 || (!(score > -1)))
        score = 0;
    if (data >= score)
        setCookie('score', data, 20 * 365); //20 years in future
}

function loadAsCookie() {
    var score = 0;
    score = parseInt(getCookie('score'));
    return score;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
    var cook = document.cookie;

}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}