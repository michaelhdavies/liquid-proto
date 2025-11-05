class Pool {
    constructor(id, origin = { x: 0, y: 0 }, val = 0) {
        this.id = id;
        this.origin = { ...origin };
        this.val = val;
    }
}

class Flow {
    constructor(id, rate = 0, sourceId = 0, targetId = 0) {
        this.id = id;
        this.rate = rate;
        this.sourceId = sourceId;
        this.targetId = targetId;
    }
}

class Simulation {
    constructor() {
        this.pools = new Map();
        this.flows = new Map();
        this.poolCount = 0;
        this.flowCount = 0;
    }

    poolId(id) {
        return `P-${id}`;
    }

    flowId(id) {
        return `F-${id}`;
    }

    nextPoolId() {
        this.poolCount += 1;
        return this.poolId(this.poolCount);
    }

    nextFlowId() {
        this.flowCount += 1;
        return this.flowId(this.flowCount);
    }

    getPool(id) {
        const poolId = typeof id === 'number' ? this.poolId(id) : id;
        return this.pools.get(poolId);
    }

    getFlow(id) {
        const flowId = typeof id === 'number' ? this.flowId(id) : id;
        return this.flows.get(flowId);
    }

    addPool(origin = { x: 0, y: 0 }) {
        const pool = new Pool(this.nextPoolId(), origin);
        this.pools.set(pool.id, pool);
        return pool;
    }

    addFlow() {

    }
}

class Settings {
    constructor() {
        this.scaleFac = 1;
        this.maxTurns = 100;
        this.flowSpeed = 300;
    }
    start() { console.log(`START`); }
    pause() { console.log(`PAUSE`); }
    stop() { console.log(`STOP`); }
    reset() { console.log(`RESET`); }
    clear() { console.log(`CLEAR`); }
    save() { console.log(`SAVE`); }
}

class Program {
    constructor(div) {
        this.root = div;
        this.changeState('loading');
        this.simulation = null;
        this.settings = null;
        this.activePoolId = null;
        this.moveThresh = .8;
        this.minPoolRadiusPx = 30;
        this.onSimDown = this.onSimDown.bind(this);
        this.onSimMove = this.onSimMove.bind(this);
        this.onSimUp = this.onSimUp.bind(this);
        this.onSimCancel = this.onSimCancel.bind(this);
        this.ready();
    }

    ready() {
        if (this.state !== 'loading') return;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.ready(), { once: true });
            return;
        }
        this.initDom();
        this.changeState('idle');
    }

    initDom() {
        this.simulationDiv = this.root.querySelector('#sim-in');
        this.settingsDiv = this.root.querySelector('#set-in');
        this.controlsDiv = this.root.querySelector('#controls')

        this.simulation = new Simulation();
        this.settings = new Settings();
        this.initControls();
        this.initSim();

        console.log(`|  DOM INIT  |`)
    }

    initControls() {
        if (!this.controlsDiv) return;
        this.controlsDiv.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn || !this.controlsDiv.contains(btn)) return;
            const action = btn.id;
            if (typeof this.settings[action] === 'function') {
                console.log(`|  ACTION: ${action.toUpperCase()}  |`)
                this.settings[action]();
            }
        })
    }

    initSim() {
        if (!this.simulationDiv) return;
        this.simulationDiv.addEventListener('pointerdown', this.onSimDown);
        this.simulationDiv.addEventListener('pointercancel', this.onSimCancel);
        this.simulationDiv.addEventListener('contextmenu', (e) => e.preventDefault());
        this.simulationDiv.addEventListener('pointermove', (e) => {
            if (this.state !== 'idle') return;
            const p = this.localPoint(e);
            const poolHit = this.poolHit(p);
            if (!poolHit) { this.simulationDiv.style.cursor = 'default'; return; }
            const poolMoveThresh = this.moveThresh * poolHit.r;
            if (poolHit.d <= poolMoveThresh) {
                this.simulationDiv.style.cursor = 'move';
            } else {
                const dx = p.x - poolHit.pool.origin.x;
                const dy = p.y - poolHit.pool.origin.y;
                this.simulationDiv.style.cursor = (Math.abs(dx) > Math.abs(dy)) ? 'ew-resize' : 'ns-resize';
            }
        })
        this.simulationDiv.addEventListener('pointerleave', () => {
            if (this.state === 'idle') this.simulationDiv.style.cursor = 'default';
        })
    }

    changeState(state = 'idle') {
        this.state = state;
        console.log(`STATE: ${state.toUpperCase()}`);
    }

    localPoint(e) {
        const bounds = this.simulationDiv.getBoundingClientRect();
        const px = Math.round(e.clientX - bounds.left);
        const py = Math.round(e.clientY - bounds.top);
        return { x: px, y: py }
    }

    calcDistance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.hypot(dx, dy);
    }

    onSimDown(e) {
        e.preventDefault();
        const p = this.localPoint(e);
        const poolHit = this.poolHit(p);
        const flowHit = this.flowHit(p);
        if (e.button === 0) {
            console.log('SIM LEFT CLICK');
            if (this.state === 'idle') {
                if (poolHit) {
                    const poolMoveThresh = this.moveThresh * poolHit.r;
                    this.activePoolId = poolHit.pool.id;
                    if (poolHit.d <= poolMoveThresh) {
                        this.changeState('move');
                        this.dragOffset = { x: p.x - poolHit.pool.origin.x, y: p.y - poolHit.pool.origin.y };
                    } else {
                        this.changeState('resize');
                    }
                    this.setListeners(e);
                    return;
                } else if (flowHit) {
                    return;
                } else {
                    this.changeState('pool');
                    console.log(`|  NEW POOL ORIGIN @  |  X:${p.x}  |  Y:${p.y}  |`)
                    const pool = this.simulation.addPool(p);
                    this.appendPool(pool);
                    this.activePoolId = pool.id;
                    this.renderPool(pool);
                    this.setListeners(e);
                }
            } else return;
        }
        if (e.button === 2) {
            console.log('SIM RIGHT CLICK');
            const source = poolHit ? poolHit.pool.id : (flowHit ? flowHit.flow.id : 0);
            console.log(`SOURCE: ${source}`);
            this.setListeners(e);
            return;
        }
    }

    onSimMove(e) {
        console.log(`SIM MOVE`);
        const p = this.localPoint(e);
        if (!this.activePoolId) return;
        const pool = this.simulation.getPool(this.activePoolId);
        if (!pool) return;
        if (this.state === 'move') {
            pool.origin.x = p.x - this.dragOffset.x;
            pool.origin.y = p.y - this.dragOffset.y;
            this.renderPool(pool);
            return;
        }
        if (this.state === 'resize') {
            pool.val = this.calcDistance(pool.origin, p);
            this.renderPool(pool);
            return;
        }
        const newVal = this.calcDistance(pool.origin, p);
        pool.val = newVal;
        this.renderPool(pool);
    }

    onSimUp(e) {
        console.log(`SIM UP`);
        if (e.button === 2) {
            const p = this.localPoint(e);
            const poolHit = this.poolHit(p);
            const flowHit = this.flowHit(p);
            const target = poolHit ? poolHit.pool.id : (flowHit ? flowHit.flow.id : 0);
            console.log(`TARGET: ${target}`)
        }
        this.cancelListeners(e);
        return;
    }

    onSimCancel(e) {
        console.log(`SIM CANCEL`);
        this.cancelListeners(e);
        return;
    }

    setListeners(e) {
        const simDiv = e.currentTarget;
        simDiv.addEventListener('pointermove', this.onSimMove);
        simDiv.addEventListener('pointerup', this.onSimUp, { once: true });
        simDiv.setPointerCapture(e.pointerId);
        return;
    }

    cancelListeners(e) {
        const simDiv = e.currentTarget;
        simDiv.releasePointerCapture(e.pointerId);
        simDiv.removeEventListener('pointermove', this.onSimMove);
        simDiv.removeEventListener('pointerup', this.onSimUp);
        this.simulationDiv.style.cursor = 'default';
        this.activePoolId = null;
        this.dragOffset = null;
        this.changeState('idle');
        return;
    }

    appendPool(pool) {
        const poolEl = document.createElement('div');
        poolEl.id = pool.id;
        poolEl.className = 'pool';
        poolEl.style.backgroundColor = this.randomColor();
        const label = document.createElement('h4');
        label.className = 'label';
        poolEl.appendChild(label);
        this.simulationDiv.appendChild(poolEl);
    }

    renderPool(pool) {
        const poolEl = document.getElementById(pool.id);
        if (!poolEl) return;
        const labelEl = poolEl.querySelector('.label')
        labelEl.textContent = `${Math.round(pool.val)}`;
        const poolPx = `${Math.max((pool.val * this.settings.scaleFac), this.minPoolRadiusPx)*2}px`;
        poolEl.style.width = poolPx;
        poolEl.style.height = poolPx;
        poolEl.style.left = `${pool.origin.x}px`;
        poolEl.style.top = `${pool.origin.y}px`;
    }

    renderPools() {
        for (const pool of this.simulation.pools.values()) {
            this.renderPool(pool);
        }
    }

    poolHit(pt) {
        let best = null, bestD = Infinity;
        for (const pool of this.simulation.pools.values()) {
            const d = this.calcDistance(pool.origin, pt);
            const r = this.radiusOf(pool);
            if (d <= r && d < bestD) { best = { pool, d, r }; bestD = d; }
        }
        return best;
    }

    flowHit(pt) {
        return null;
    }

    radiusOf(pool) { return Math.max(pool.val * this.settings.scaleFac, this.minPoolRadiusPx) }

    renderAll() {
        this.renderPools();
        this._raf = requestAnimationFrame(() => this.renderAll())
    }

    randomColor() {
        const r = this.randomValue(256);
        const g = this.randomValue(256);
        const b = this.randomValue(256);
        const output = `rgb(${r}, ${g}, ${b})`;
        return output;
    }

    randomValue(val) {
        return Math.floor(Math.random() * val);
    }

}

const program = new Program(document.getElementById('program'));