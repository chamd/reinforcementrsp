var rsp = ['rock', 'scissors', 'paper']
var basicToken = 50;
var nowToken = [[basicToken, basicToken, basicToken], [basicToken, basicToken, basicToken], [basicToken, basicToken, basicToken]]
var logs = [];
var displayLogs = [];
var globalGen = 0;
var globalScore = 0;
var ao100Score = 0;
var loop = false;
var speed = 100;
var tick = 0;

function reset() {
    document.getElementById('allStatBar').style.width = `0`;
    document.getElementById('ao100StatBar').style.width = `0`;
    document.getElementById('logs').innerHTML = '';
    nowToken = [[basicToken, basicToken, basicToken], [basicToken, basicToken, basicToken], [basicToken, basicToken, basicToken]]
    logs = [];
    displayLogs = [];
    globalGen = 0;
    globalScore = 0;
    ao100Score = 0;
}

function setLoop(value) {
    if (value == 1) {
        document.getElementById('play').style.display = 'none';
        document.getElementById('stop').style.display = 'block';
        loop = true;
    } else {
        document.getElementById('play').style.display = 'block';
        document.getElementById('stop').style.display = 'none';
        loop = false;
    }
}

function setSpeed(value) {

    if (value == 1) {
        if (speed == 1000) {
            speed = 100;
        } else if (speed == 100) {
            speed = 10;
        } else if (speed == 10) {
            speed = 1;
        } else {
            alert('충분히 빠릅니다')
        }
    } else {
        if (speed == 1) {
            speed = 10;
        } else if (speed == 10) {
            speed = 100;
        } else if (speed == 100) {
            speed = 1000;
        } else {
            alert('충분히 느립니다')
        }
    }
}

function getRandomRSP() {
    var random = Math.floor(Math.random() * 3);
    return random;
}

function getAIRSP(RSP) {
    var random = Math.floor(Math.random() * (nowToken[RSP][0] + nowToken[RSP][1] + nowToken[RSP][2])) + 1
    var result;
    if (0 < random && random <= nowToken[RSP][0]) {
        result = 0;
    } else if (nowToken[RSP][0] < random && random <= (nowToken[RSP][0] + nowToken[RSP][1])) {
        result = 1;
    } else if ((nowToken[RSP][0] + nowToken[RSP][1]) < random && random <= (nowToken[RSP][0] + nowToken[RSP][1] + nowToken[RSP][2])) {
        result = 2;
    }
    return result;
}

function whoWin(A, B) {
    var result;

    if (A == 0 && B == 1) {
        //B가 짐
        result = -1;
    } else if (A == 0 && B == 2) {
        //B가 이김
        result = 1;
    } else if (A == 1 && B == 0) {
        //B가 이김
        result = 1;
    } else if (A == 1 && B == 2) {
        //B가 짐
        result = -1;
    } else if (A == 2 && B == 0) {
        //B가 짐
        result = -1;
    } else if (A == 2 && B == 1) {
        //B가 이김
        result = 1;
    } else if (A == B) {
        //비김
        result = 0;
    }

    return result;
}

function calcToken(A, B, win) {
    if (win == 1) {
        nowToken[A][B] += 2;
        globalScore += 1;
        ao100Score += 1;
        logs.push(1)
    } else if (win == -1) {
        nowToken[A][B] -= 2;
        globalScore -= 1;
        ao100Score -= 1;
        logs.push(-1)
    } else if (win == 0) {
        nowToken[A][B] -= 1;
        globalScore -= 0.5;
        ao100Score -= 0.5;
        logs.push(-0.5)
    }

    if (nowToken < 0) {
        nowToken = 0;
    }
}

function addLog(content) {
    displayLogs.push(content);
    document.getElementById('logs').innerHTML = displayLogs.join('');
    if (displayLogs.length == 500) {
        displayLogs.shift();
    }
}

function setDebug(gen, score) {
    if (logs.length == 100) {
        ao100Score -= logs[0];
        logs.shift();
    }
    var winPer = (score / gen) * 100;
    var ao100WinPer = (ao100Score / logs.length) * 100;
    document.getElementById('allGen').innerHTML = `${gen}`
    document.getElementById('allStat').innerHTML = `${winPer.toFixed(1)}%`
    document.getElementById('ao100Stat').innerHTML = `${ao100WinPer.toFixed(1)}%`
    if (winPer.toFixed(1) > 0) {
        document.getElementById('allStatBar').style.width = `${270 / 100 * winPer.toFixed(1)}px`;
    }
    if (ao100WinPer.toFixed(1) > 0) {
        document.getElementById('ao100StatBar').style.width = `${270 / 100 * ao100WinPer.toFixed(1)}px`;
    }
}

setInterval(() => {
    tick ++;
    if (tick >= speed) {
        if (loop) {
            var nowRandomRSP = getRandomRSP();
            var nowAIRSP = getAIRSP(nowRandomRSP);
            var win = whoWin(nowRandomRSP, nowAIRSP);
            calcToken(nowRandomRSP, nowAIRSP, win);
            addLog(`<div class='win${win}'>[랜덤: ${rsp[nowRandomRSP]}] VS [AI: ${rsp[nowAIRSP]}]</div>`)
            document.getElementById('logs').scrollTop = document.getElementById('logs').scrollHeight;
            globalGen++;
            setDebug(globalGen, globalScore);
        }
        tick = 0;
    }
}, 1);