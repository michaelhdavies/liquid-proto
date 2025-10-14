
const elTurn = document.getElementById('turn');
const elPoolStart = document.getElementById('pool-start');
const elFlowIn = document.getElementById('flow-in');
const elFlowOut = document.getElementById('flow-out');
const elFlowNet = document.getElementById('flow-net')
const elPool = document.getElementById('pool');
const elPoolSize = document.getElementById('pool-size');
const elScale = document.getElementById('scale');


let turnNum = 1;
const turnTotal = 20;
const poolStart = 12;
const flowIn = 5;
const flowOut = 3;
const flowNet = flowIn - flowOut;
let poolValue = poolStart;

const svg = document.getElementById("sim");
const { width, height } = svg.viewBox.baseVal;
const viewBoxCenter = width / 2;
const maxSize = width * .48;
const startSize = maxSize * .2;
let poolSize = startSize;
let scaleFac = startSize / poolStart;

init();

function init() {
    calcPoolSize();
    initText();
    renderCircle(viewBoxCenter, viewBoxCenter, poolSize);
    runTurn();
};
function initLogs() {

};

function initText() {
    elPoolStart.textContent = poolStart;
    elFlowIn.textContent = flowIn;
    elFlowOut.textContent = flowOut;
    elFlowNet.textContent = flowNet;
    refreshText();
};

function refreshText() {
    elTurn.textContent = turnNum;
    elPool.textContent = poolValue;
    elPoolSize.textContent = poolSize;
    elScale.textContent = scaleFac;
};

function refreshSVG() {
    const elSolid = document.getElementById("solid");
    const elDash = document.getElementById("dash");
    calcPoolSize();
    elSolid.setAttribute("r", poolSize);
    elDash.setAttribute("r", poolStart * scaleFac);
};

function refreshPage() {
    refreshText();
    refreshSVG();
};

function calcScaleFac() {
    scaleFac = poolSize / poolValue;
};

function calcPoolSize() {
    const newSize = poolValue * scaleFac;
    if (newSize <= maxSize) {
        poolSize = newSize;
    } else {
        scaleFac = maxSize / poolValue
        poolSize = maxSize;
    };
};


function renderCircle(x, y, r) {
    const solidCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const dashCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    solidCircle.setAttribute("id", "solid");
    dashCircle.setAttribute("id", "dash");
    solidCircle.setAttribute("cx", x);
    dashCircle.setAttribute("cx", x);
    solidCircle.setAttribute("cy", y);
    dashCircle.setAttribute("cy", y);
    solidCircle.setAttribute("r", r);
    dashCircle.setAttribute("r", r);
    svg.appendChild(solidCircle);
    svg.appendChild(dashCircle);
};

function runTurn() {
    if (turnNum > turnTotal) {
        return;
    } else {
        console.log(`Turn ${turnNum} - Pool value: ${poolValue}`)
        refreshPage();
        poolValue += flowNet;
        turnNum++;
        setTimeout(runTurn, 1000);
    };
};