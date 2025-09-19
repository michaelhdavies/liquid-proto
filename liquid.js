// LIQUID MHD 

// Starting values
let flow_in = 5;
let flow_out = 4;
let flow_net = flow_in - flow_out;
let pool_size = 10;
let turn = 0;
let run_count = 10;

// Run application
init();
run();

function run() {
    console.log(`RUN`)
    while (turn <= run_count) {
        logTurn();
        logSize();
        pool_size += flow_net;
        turn ++;
    };
};

function logTurn() {
    console.log(`Turn ${turn}`)
};

function logSize() {
    console.log(`Pool size: ${pool_size}`)
}

function init() {
    console.log(`INIT`);
    console.log(`Flow in: ${flow_in}`);
    console.log(`Flow out: ${flow_out}`);
    console.log(`Flow net: ${flow_net}`)
    logSize();
    logTurn();
}

console.log(`END`)