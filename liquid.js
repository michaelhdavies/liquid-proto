// LIQUID MHD 
// Starting values

let flow_in = 5;
let flow_out = 4;
let pool_size = 10;
let turn = 0;

init();

function tick() {
    while (turn < 10) {
        
    };
};

function logTurn() {
    console.log(`Turn ${turn}`)
};

function logSize() {
    console.log(`Pool size: ${pool_size}`)
}

function init() {
    console.log(`Flow in: ${flow_in}`);
    console.log(`Flow out: ${flow_out}`);
    logSize();
    logTurn();
}