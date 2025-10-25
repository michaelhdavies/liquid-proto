const sim = document.getElementById('sim');
let flowMaxLength = 0;
let flowLength = 0;
let flowAngle = 0;
let flowRate = 20;
let origin = { x: 0, y: 0 };
let target = { x: 0, y: 0 };



sim.addEventListener('pointerdown', pointerDown);

function pointerDown(e) {
    e.preventDefault();
    console.log('DOWN');
    clearSim();
    setOrigin(e);
    createFlow();
    updateFlow(e);
    sim.addEventListener('pointermove', pointerMove);
    sim.addEventListener('pointerup', pointerUp);
    sim.setPointerCapture(e.pointerId);
}

function pointerMove(e) {
    e.preventDefault();
    console.log('MOVE');
    updatePosition(e);
    updateFlow(e);
}

function pointerUp(e) {
    console.log('UP');
    updatePosition(e);
    console.log(`| TARGET SET @ | X:${target.x} | Y:${target.y} |`);
    console.log(`| FLOW CREATED | LENGTH: ${flowLength} | RATE: ${flowRate} |`);
    sim.releasePointerCapture(e.pointerId);
    sim.removeEventListener('pointermove', pointerMove);
    sim.removeEventListener('pointerup', pointerUp);
}

function setOrigin(e) {
    const p = localPoint(e);
    origin.x = Math.round(p.x);
    origin.y = Math.round(p.y);
    target.x = Math.round(p.x);
    target.y = Math.round(p.y);
    console.log(`| ORIGIN SET @ | X:${origin.x} | Y:${origin.y} |`)
}

function createFlow() {
    console.log(`CREATE FLOW`);
    const newFlow = document.createElement('div');
    const newRate = document.createElement('h2');
    newFlow.id = 'flow';
    newRate.id = 'rate';
    newFlow.appendChild(newRate);
    sim.appendChild(newFlow);
}


function updateFlow() {
    const currentFlow = document.getElementById('flow');
    const currentRate = document.getElementById('rate');
    if (!currentFlow || !currentRate) return;
    currentFlow.style.left = `${origin.x}px`;
    currentFlow.style.top = `${origin.y - flowRate/2}px`;
    currentFlow.style.width = `${flowLength}px`;
    currentFlow.style.height = `${flowRate}px`;
    currentFlow.style.setProperty('--angle', `${flowAngle}rad`);
    currentRate.textContent = `${flowRate}`;
}

function updatePosition(e) {
    const p = localPoint(e);
    if (p.x < 0 || p.x > p.width || p.y < 0 || p.y > p.height) return;
    target.x = Math.round(p.x);
    target.y = Math.round(p.y);
    const dx = target.x - origin.x;
    const dy = target.y - origin.y;
    flowAngle = Math.atan2(dy, dx);
    flowLength = Math.hypot(dx, dy);
}

function localPoint(e) {
    const bounds = sim.getBoundingClientRect();
    return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
        width: bounds.width,
        height: bounds.height,
        left: bounds.left,
        top: bounds.top
    };
}

function clearSim() {
    origin = { x: 0, y: 0 };
    target = { x: 0, y: 0 };
    sim.textContent = '';
    console.log(`SIM RESET`);
}