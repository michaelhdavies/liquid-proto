const svg = document.getElementById("sim");
const { width, height } = svg.viewBox.baseVal;
const cx = width/2;
const cy = height/2;
const r = Math.min(width, height) * 0.25;

const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
circle.setAttribute("cx", cx);
circle.setAttribute("cy", cy);
circle.setAttribute("r", r);
svg.appendChild(circle);