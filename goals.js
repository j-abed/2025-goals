const goalInput = document.getElementById("goal-input");
const addGoalBtn = document.getElementById("add-goal-btn");
const goalsDisplay = document.getElementById("goals-display");
const colorPicker = document.getElementById("color-picker");
const fireworksCanvas = document.getElementById("fireworks-canvas");
const ctx = fireworksCanvas.getContext("2d");

let goals = JSON.parse(localStorage.getItem("goals")) || [];
let particles = [];
let draggingElement = null;
let dragIndex = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Save goals to localStorage
function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
}

// Calculate text color for contrast
function getContrastTextColor(bgColor) {
    const [r, g, b] = bgColor.match(/\w\w/g).map(c => parseInt(c, 16));
    return (r * 0.299 + g * 0.587 + b * 0.114) > 128 ? "#000000" : "#FFFFFF";
}

// Render goals
function renderGoals() {
    goalsDisplay.innerHTML = "";
    goals.forEach((goal, index) => {
        const card = document.createElement("div");
        card.className = `goal-card ${goal.completed ? "completed" : ""}`;
        card.style.left = goal.x || `${index * 30}px`;
        card.style.top = goal.y || `${index * 30}px`;
        card.style.backgroundColor = goal.color || "#ffffff";
        card.style.color = getContrastTextColor(goal.color || "#ffffff");
        card.textContent = goal.text;

        // Mouse Down (Start Dragging)
        card.addEventListener("mousedown", (e) => {
            if (e.target.tagName === "BUTTON") return; // Prevent dragging from buttons
            draggingElement = card;
            dragIndex = index;
            dragOffsetX = e.offsetX;
            dragOffsetY = e.offsetY;
        });

        // Complete button
        const completeBtn = document.createElement("button");
        completeBtn.className = "complete";
        completeBtn.textContent = "✔";
        completeBtn.addEventListener("click", () => {
            goal.completed = !goal.completed;
            saveGoals();
            renderGoals();
        });

        completeBtn.addEventListener("mousedown", (e) => e.stopPropagation()); // Prevent dragging

        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove";
        removeBtn.textContent = "X";
        removeBtn.addEventListener("click", () => {
            goals.splice(index, 1);
            saveGoals();
            renderGoals();
        });

        removeBtn.addEventListener("mousedown", (e) => e.stopPropagation()); // Prevent dragging

        card.appendChild(completeBtn);
        card.appendChild(removeBtn);
        goalsDisplay.appendChild(card);
    });
}

// Mouse Move (Dragging)
document.addEventListener("mousemove", (e) => {
    if (!draggingElement) return;
    const rect = goalsDisplay.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffsetX;
    const y = e.clientY - rect.top - dragOffsetY;

    draggingElement.style.left = `${Math.max(0, Math.min(x, rect.width - 150))}px`;
    draggingElement.style.top = `${Math.max(0, Math.min(y, rect.height - 80))}px`;

    // Update goal position
    goals[dragIndex].x = draggingElement.style.left;
    goals[dragIndex].y = draggingElement.style.top;
});

// Mouse Up (Stop Dragging)
document.addEventListener("mouseup", () => {
    if (draggingElement) {
        saveGoals();
        draggingElement = null;
        dragIndex = null;
    }
});

// Fireworks animation
function triggerFireworks() {
    for (let i = 0; i < 3; i++) {
        const cx = Math.random() * fireworksCanvas.width * 0.6 + fireworksCanvas.width * 0.2;
        const cy = Math.random() * fireworksCanvas.height * 0.5 + fireworksCanvas.height * 0.2;
        for (let j = 0; j < 30; j++) {
            particles.push({
                x: cx,
                y: cy,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 5 + 2,
                life: 100,
            });
        }
    }
}

// Animate fireworks
function animateFireworks() {
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;
    });
    requestAnimationFrame(animateFireworks);
}

// Resize canvas
function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateFireworks();

// Add goal
addGoalBtn.addEventListener("click", () => {
    const text = goalInput.value.trim();
    if (!text) return alert("Please enter a goal.");
    const color = colorPicker.value;
    goals.push({ text, completed: false, color, x: `${goals.length * 30}px`, y: `${goals.length * 30}px` });
    saveGoals();
    renderGoals();
    triggerFireworks();
    goalInput.value = "";
});

// Initialize
document.addEventListener("DOMContentLoaded", renderGoals);