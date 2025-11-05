const sim = document.getElementById('sim');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const clearButton = document.getElementById('clear');
const saveButton = document.getElementById('save');

sim.addEventListener('pointerdown', onSim);
startButton.addEventListener('click', onStart);
pauseButton.addEventListener('click', onPause);
stopButton.addEventListener('click', onStop);
resetButton.addEventListener('click', onReset);
clearButton.addEventListener('click', onClear);
saveButton.addEventListener('click', onSave);

function onSim(e) {
    console.log(`SIM DOWN`);
    sim.addEventListener('pointermove', simMove);
    sim.addEventListener('pointerup', simUp)
    sim.setPointerCapture(e.pointerId);
}

function simMove() {
    console.log(`SIM MOVE`);
}

function simUp(e) {
    console.log(`SIM UP`);
    sim.releasePointerCapture(e.pointerId)
    sim.removeEventListener('pointermove', simMove);
    sim.removeEventListener('pointerup', simUp);
}

function onStart() {
    console.log(`START`);
}

function onPause() {
    console.log(`PAUSE`);
}

function onStop() {
    console.log(`STOP`);
}

function onReset() {
    console.log(`RESET`);
}

function onClear() {
    console.log(`CLEAR`);
}

function onSave() {
    console.log(`SAVE`);
}