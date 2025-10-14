// LIQUID MHD 

// Starting values
let flow_in = 5;
let flow_out = 4;
let flow_net = flow_in - flow_out;
let pool_size = 12;
let turn = 0;
let turn_count = 10;

// Run application
init();
run();

function init() {
    console.log(`INIT`);
    console.log(`Flow in: ${flow_in}`);
    console.log(`Flow out: ${flow_out}`);
    console.log(`Flow net: ${flow_net}`);
    console.log(`Pool size: ${pool_size}`);
    console.log(`Turns to run: ${turn_count}`)
    console.log(`Turn ${turn}`);
};

function run() {
    console.log(`RUN`);
    runTurn();
};

function runTurn() {
    if (turn > turn_count) {
        console.log(`END`);
        return;
    } else {
        // console.log(`START TURN ${turn}`)
        console.log(`Turn ${turn} - Pool size: ${pool_size}`)
        pool_size += flow_net;
        // console.log(`END TURN ${turn}`)
        turn ++;
        setTimeout(runTurn, 1000);
    };
};