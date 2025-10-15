const sim = document.getElementById('sim');
let simRect;
let activeCircle = null;
let center = { x: 0, y: 0 };

sim.addEventListener('mousedown', mouseDown);

function mouseDown(event) {
    sim.innerHTML = '';
    simRect = sim.getBoundingClientRect();
    const cx = event.clientX;
    const cy = event.clientY;
    center = { x: cx, y: cy };
    console.log(`Mouse is down @ X: ${cx} Y: ${cy}`);
    const startSize = 10;
    const newPool = document.createElement('div');
    newPool.id = 'circle';
    newPool.style.width = `${startSize}`;
    newPool.style.left = `${cx - startSize / 2}px`;
    newPool.style.top = `${cy - startSize / 2}px`;
    sim.appendChild(newPool);
    activeCircle = newPool;
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
};

function mouseMove(event) {
    if (!activeCircle) return;
    const dx = event.clientX - center.x;
    const dy = event.clientY - center.y;
    let r = Math.sqrt(dx * dx + dy * dy);
    const maxLeft = center.x - simRect.left;
    const maxRight = simRect.right - center.x;
    const maxTop = center.y - simRect.top;
    const maxBottom = simRect.bottom - center.y;
    const maxR = Math.min(maxLeft, maxRight, maxTop, maxBottom)
    r = Math.min(r, maxR)
    activeCircle.style.width = `${r * 2}px`;
    activeCircle.style.left = `${center.x - r}px`;
    activeCircle.style.top = `${center.y - r}px`;
}

function mouseUp(event) {
    console.log(`Mouse is up @ X: ${event.clientX} Y: ${event.clientY}`)
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
    activeCircle = null;
}