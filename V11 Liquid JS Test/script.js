class LIQUID {
    constructor() {
        this.pools = new Map();
        this.flows = new Map();
        this.poolCount = 0;
        this.flowCount = 0;
        this.scale = 1;
        this.minPoolRem = 3;
        this.state = 'loading';
        this.validStates = ['loading', 'idle'];
        this.lastDownTime = 0;
        this.clickTimer = 0;
        this.doubleClickTime = 250;
        this.pointerDown = this.pointerDown.bind(this);
        this.pointerMove = this.pointerMove.bind(this);
        this.pointerUp = this.pointerUp.bind(this);
        this.init();
    }

    // PROGRAM INIT METHODS

    init() {
        if (this.state !== 'loading') return;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init(), { once: true });
            return;
        };
        this.greeting();
        this.systemLoad(`liquid init`);
        this.loadPage();
        if (this.state !== 'idle') {
            this.systemError(`liquid init failed`);
            return;
        } else {
            this.systemAlert(`liquid init success`);
            this.ready();
            // this.addPool();
            // this.addPool({ x: 100, y: 200 });
            // this.addPool({ x: 500, y: 200 });
            // this.addPool({ x: 200, y: 300 });
            // this.addPool({ x: 400, y: 300 });
            // this.addPool({ x: 300, y: 400 });
            // this.addPool({ x: 200, y: 500 });
            // this.addPool({ x: 400, y: 500 });
            // this.addPool({ x: 100, y: 600 });
            // this.addPool({ x: 500, y: 600 });
            return;
        }
    }

    greeting() {
        this.systemLog(`welcome to liquid`)
    }

    ready() {
        this.systemLog(`liquid ready`);
    }

    loadPage() {
        this.systemLoad(`loading page`);
        this.clearSim();
        this.initListeners();
        this.changeState('idle');
        this.systemAlert(`page loaded`);
    }

    // EVENT HANDLERS

    initListeners() {
        const parent = this.getLiquidEl();
        if (!parent) {
            this.systemError(`init listeners failed - no parent found`);
            return;
        } else {
            parent.addEventListener('pointerdown', this.pointerDown);
            this.systemAlert(`init listeners success`);
        }
    }

    pointerDown(e) {
        this.systemLog(`down`);
        e.preventDefault();
        const now = performance.now();
        const delta = now - (this.lastDownTime || 0);
        const p = this.localPoint(e);
        const parent = e.currentTarget;
        try { parent.setPointerCapture?.(e.pointerId); } catch {};
        parent.addEventListener('pointermove', this.pointerMove);
        parent.addEventListener('pointerup', this.pointerUp, { once: true });
        parent.addEventListener('lostpointercapture', this.pointerUp, { once: true });

        if (!p) {
            this.systemError(`no point captured`);
            return;
        }

        if (delta > 0 && delta < this.doubleClickTime){
                if (this.clickTimer) { clearTimeout(this.clickTimer); this.clickTimer = null; }
                this.onDoubleClick(p, e);
                this.lastDownTime = 0;
                return;
        }

        if (this.clickTimer) { clearTimeout(this.clickTimer); }
        this.clickTimer = setTimeout(() => {
            this.onSingleClick(p, e);
            this.clickTimer = null;
        }, this.doubleClickTime);

        this.lastDownTime = now;
        
    }

    onSingleClick(p, e) {
        if (this.state === 'idle') {
            this.systemAlert(`single click captured @ x: ${p.x} y: ${p.y}`);
            this.addPool(p);
            return;
        }
    }
    
    onDoubleClick(p, e) {
        this.systemAlert(`double click captured @ x: ${p.x} y: ${p.y}`)
    }

    pointerMove(e) {
        this.systemLog(`move`);
        const p = this.localPoint(e);
    }

    pointerUp(e) {
        this.systemLog(`up`);
        const parent = e.currentTarget;
        try { parent.releasePointerCapture(e.pointerId); } catch { };
        parent.removeEventListener('pointermove', this.pointerMove);
        parent.removeEventListener('pointerup', this.pointerUp);
        parent.removeEventListener('lostpointercapture', this.pointerUp);
        this.changeState('idle');
    }


    // SIMULATION METHODS

    changeActivePool(pool) {
        this.systemLoad(`changing active pool to ${pool.id}`);
        if (!pool) {
            this.systemError(`pool not found`);
        } else {
            this.activePool = pool;
            this.systemAlert(`change active pool to ${pool.id} success`)
        }
    }

    changeState(newState) {
        this.systemLoad(`changing state to ${newState}`);
        if (!this.validStates.includes(newState)) {
            this.systemError(`state change failed - invalid state ${newState}`);
        } else {
            this.state = newState;
            this.systemAlert(`state change success - valid state ${newState}`)
            return newState;
        }
    }

    getLiquidEl() {
        this.systemLoad(`getting liquid div`);
        const liquidEl = document.getElementById("LIQUID");
        if (!liquidEl) {
            this.systemError(`liquid div not found`);
            return;
        } else {
            this.systemAlert(`liquid div found`);
            return liquidEl;
        }
    }

    clearSim() {
        this.systemLoad(`clearing sim`)
        const sim = this.getLiquidEl();
        if (!sim) {
            this.systemError(`clear sim failure`)
            return;
        } else {
            sim.textContent = '';
            this.pools.clear();
            this.flows.clear();
            this.poolCount = 0;
            this.flowCount = 0;
            this.systemAlert(`clear sim success`);
        }
    }

    localPoint(e) {
        this.systemLoad('capturing local value')
        const liquid = this.getLiquidEl();
        const bounds = liquid.getBoundingClientRect();
        const px = Math.round(e.clientX - bounds.left - liquid.clientLeft);
        const py = Math.round(e.clientY - bounds.top - liquid.clientTop);
        const output = { x: px, y: py };
        this.pointerPos = output;
        this.systemAlert(`local value captured @ x: ${output.x} y: ${output.y}`);
        return output;
    }

    // ANIMATION METHODS


    // HELPER METHODS

    randomVal(val) {
        this.systemLoad(`generating random value`);
        const output = Math.max(Math.floor(Math.random() * val), 1);
        if (!output) {
            this.systemError(`random value failed`);
            return;
        } else {
            this.systemAlert(`random value success: ${output}`);
            return output;
        }
    }

    randomColor() {
        this.systemLoad(`generating random rgb color`)
        const minVal = 50;
        const maxVal = 256;
        const chanVal = maxVal - minVal;
        const r = minVal + this.randomVal(chanVal);
        const g = minVal + this.randomVal(chanVal);
        const b = minVal + this.randomVal(chanVal);
        const output = `rgb(${r}, ${g}, ${b})`;
        this.systemAlert(`random color success: ${output}`)
        return output;
    }

    // POOL METHODS

    getPoolIdString(id) {
        this.systemLoad(`getting pool id string from input: ${id}`);
        const newId = `P-${id}`;
        this.systemAlert(`get pool id string success: ${newId}`);
        return newId;
    }

    getPool(id) {
        this.systemLoad(`getting pool id ${id}`);
        const poolId = typeof id === 'number' ? this.getPoolIdString(id) : id;
        const pool = this.pools.get(poolId);
        if (!pool) {
            this.systemError(`${poolId} not found`);
            return;
        } else {
            this.systemAlert(`pool id ${pool.id} found`);
            return pool;
        }
    }

    nextPoolId() {
        this.systemLoad(`creating next pool id`);
        this.poolCount += 1;
        const newId = this.getPoolIdString(this.poolCount);
        if (!newId) {
            this.systemError(`next pool id failure`)
            return;
        } else {
            this.systemAlert(`next pool id success: ${newId}`);
            return newId;
        }
    }

    addPool(origin) {
        this.systemLoad('adding pool')
        const simEl = this.getLiquidEl();
        const pool = new POOL(this.nextPoolId(), origin);
        if (!pool) {
            this.systemError('add pool failure');
        } else {
            this.changeActivePool(pool);
            pool.color = this.randomColor();
            this.pools.set(pool.id, pool);
            const poolEl = document.createElement('div');
            poolEl.id = pool.id;
            poolEl.className = 'pool';
            const labelEl = document.createElement('h2');
            labelEl.className = 'label';
            poolEl.appendChild(labelEl);
            simEl.appendChild(poolEl);
            this.systemAlert(`pool ready: ${JSON.stringify(this.getPool(pool.id))}`)
            this.renderPool(pool);
            this.systemAlert(`add pool ${pool.id} success`);
            return pool;
        }
    }

    renderPool(pool) {
        this.systemLoad(`rendering pool ${pool.id}`)
        const currentPool = document.getElementById(pool.id);
        if (!currentPool) {
            this.systemError(`render pool ${pool.id} failure`);
            return;
        } else {
            const currentLabel = currentPool.querySelector('.label');
            currentLabel.textContent = `${Math.round(pool.val)}`;
            const poolRem = `${2 * Math.max((pool.val * this.scale), this.minPoolRem)}rem`;
            currentPool.style.width = poolRem;
            currentPool.style.height = poolRem;
            currentPool.style.left = `${pool.origin.x}px`;
            currentPool.style.top = `${pool.origin.y}px`;
            currentPool.style.borderColor = `${pool.color}`;
            this.systemAlert(`render pool ${pool.id} success`)
            return pool;
        }
    }

    // renderPools() {
    //     for (const pool of this.simulation.pools.values()) {
    //         this.renderPool(pool);
    //     }
    // }

    // FLOW METHODS

    // SYSTEM NOTIFICATIONS

    systemAlert(message) {
        if (!message) { return; }
        const output = `|  !!!  ${message.toString().toUpperCase()}  !!!  |`;
        console.log(output);
        return output;
    }

    systemLoad(message) {
        if (!message) { return; }
        const output = `|  ...  ${message.toString().toUpperCase()}  ...  |`;
        console.log(output);
        return output;
    }

    systemLog(message) {
        if (!message) { return; }
        const output = `|  ---  ${message.toString().toUpperCase()}  ---  |`;
        console.log(output);
        return output;
    }

    systemError(message) {
        if (!message) { return; }
        const output = `|  ***  ${message.toString().toUpperCase()}  ***  |`;
        console.log(output);
        return output;

    }
}

class POOL {
    constructor(id, origin = { x: 0, y: 0 }, val = 0, color = '') {
        this.id = id;
        this.origin = { ...origin };
        this.val = val;
        this.color = color;
    }
}

class FLOW {

}

// CREATE AN OBJECT TO HOLD THE SIMULATION

const LIQUID_PROGRAM = new LIQUID();