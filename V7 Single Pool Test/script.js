const sim = document.getElementById('sim');

let poolMax = 0;
let poolRadius = 0;
let poolCenter = { x: 0, y: 0 };
let flowRate = { in: 0, out: 0, net: 0 };
let borderPx = 0;
let turn = 0;
const turnLimit = 1000;
let simTimer = null;
let running = false;
let flowSeed = 5;

sim.addEventListener('pointerdown', pointerDown);

function pointerDown(e) {
    e.preventDefault();
    console.log('DOWN');
    clearSim();
    const p = localPoint(e);
    poolCenter.x = Math.round(p.x);
    poolCenter.y = Math.round(p.y);
    console.log(`CENTER ASSIGNED @: X: ${poolCenter.x} Y: ${poolCenter.y}`);
    createPool(poolCenter.x, poolCenter.y);
    updatePool();
    const maxX = Math.min(p.x, p.width - p.x);
    const maxY = Math.min(p.y, p.height - p.y);
    poolMax = Math.floor(Math.max(0, Math.min(maxX, maxY) - borderPx * 2));
    console.log(`MAX SIZE: ${poolMax}`)
    sim.addEventListener('pointermove', pointerMove);
    sim.addEventListener('pointerup', pointerUp);
    sim.setPointerCapture(e.pointerId);
}

function pointerMove(e) {
    e.preventDefault();
    console.log('MOVE');
    const p = localPoint(e);
    const dx = poolCenter.x - p.x;
    const dy = poolCenter.y - p.y;
    poolRadius = Math.round(Math.hypot(dx, dy));
    poolRadius = Math.min(poolRadius, poolMax);
    updatePool();
}

function pointerUp(e) {
    console.log(`UP @: X: ${e.clientX} Y: ${e.clientY}`);
    console.log(`RADIUS: ${poolRadius}`);
    randomFlow();
    runSim();
    sim.releasePointerCapture(e.pointerId);
    sim.removeEventListener('pointermove', pointerMove);
    sim.removeEventListener('pointerup', pointerUp);
}

function createPool(x, y) {
    const newPool = document.createElement('div');
    const newLabel = document.createElement('h2');
    newPool.id = 'pool';
    newLabel.id = 'label';
    newPool.style.backgroundColor = randomColor();
    newPool.style.borderColor = randomColor();
    newLabel.style.color = randomColor();
    newPool.appendChild(newLabel);
    sim.appendChild(newPool);
    borderPx = parseFloat((getComputedStyle(newPool).borderWidth))
    console.log(`BORDER PX: ${borderPx}`)
}

function updatePool() {
    const currentPool = document.getElementById('pool');
    const currentLabel = document.getElementById('label');
    currentPool.style.left = `${poolCenter.x}px`;
    currentPool.style.top = `${poolCenter.y}px`;
    currentPool.style.width = `${poolRadius * 2}px`;
    currentLabel.textContent = poolRadius;
}

function randomColor() {
    const r = randomValue(256);
    const g = randomValue(256);
    const b = randomValue(256);
    const output = `rgb(${r}, ${g}, ${b})`;
    return output;
}

function randomValue(val) {
    return Math.floor(Math.random() * val);
}

function clearSim() {
    clearTimeout(simTimer);
    simTimer = null;
    running = false;
    turn = 0;
    poolMax = 0;
    poolRadius = 0;
    poolCenter = { x: 0, y: 0 };
    flowRate = { in: 0, out: 0, net: 0 };
    sim.textContent = '';
    console.log(`SIM CLEAR`);
    return;
}

function pauseSim() {
    clearTimeout(simTimer);
    simTimer = null;
    running = false;
    turn = 0;
    poolMax = 0;
    poolRadius = 0;
    poolCenter = { x: 0, y: 0 };
    flowRate = { in: 0, out: 0, net: 0 };
    console.log(`SIM PAUSED`);
    return;
}

function localPoint(e) {
    const r = sim.getBoundingClientRect();
    return {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        width: r.width,
        height: r.height
    };
}

function randomFlow() {
    flowRate.in = flowSeed + randomValue(flowSeed);
    flowRate.out = flowSeed + randomValue(flowSeed);
    if (flowRate.in === flowRate.out) {
        const coinToss = Math.floor(Math.random() * 2)
        console.log(`COIN TOSS: ${coinToss}`)
        if (coinToss) {
            flowRate.in += randomValue(flowSeed);
        } else {
            flowRate.out += randomValue(flowSeed);
        }
    }
    flowRate.net = flowRate.in - flowRate.out;
    console.log(`FLOWRATE SET: in: ${flowRate.in} out: ${flowRate.out} net: ${flowRate.net}`)
    return flowRate;
}

function runSim() {
    console.log(`RUN SIM`)
    if (running) return;
    running = true;
    simTimer && clearTimeout(simTimer);
    setTimeout(setTimer, 200);
}

function runTurn() {
    if (!running) return;
    const next = Math.round(Math.max(0, Math.min(poolRadius + flowRate.net, poolMax)))
    console.log(`TURN ${turn}. POOL VALUE: ${poolRadius}`)
    if (next === poolRadius || next <= 0 || turn >= turnLimit) {
        pauseSim();
        return;
    } else {
        poolRadius = next;
        updatePool();
        turn ++;
        setTimer();
    }
}

function setTimer() {
    simTimer = setTimeout(runTurn, 300);
    return simTimer;
}