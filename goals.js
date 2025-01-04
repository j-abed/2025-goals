const goalInput = document.getElementById("goal-input");
const addGoalBtn = document.getElementById("add-goal-btn");
const goalsDisplay = document.getElementById("goals-display");
const colorPicker = document.getElementById("color-picker");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const activeCount = document.getElementById("active-count");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
}

function updateStats() {
    const completed = goals.filter(goal => goal.completed).length;
    const total = goals.length;
    totalCount.textContent = total;
    completedCount.textContent = completed;
    activeCount.textContent = total - completed;
}

function renderGoals() {
    goalsDisplay.innerHTML = "";
    goals.forEach((goal, index) => {
        const goalCard = document.createElement("div");
        goalCard.className = "goal-card";
        goalCard.style.backgroundColor = goal.color || "white";
        if (goal.completed) goalCard.classList.add("completed");
        goalCard.textContent = goal.text;

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔";
        completeBtn.className = "complete-btn";
        completeBtn.addEventListener("click", () => {
            goal.completed = !goal.completed;
            saveGoals();
            renderGoals();
            updateStats();
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "X";
        removeBtn.addEventListener("click", () => {
            goals.splice(index, 1);
            saveGoals();
            renderGoals();
            updateStats();
        });

        goalCard.appendChild(completeBtn);
        goalCard.appendChild(removeBtn);
        goalsDisplay.appendChild(goalCard);
    });
    updateStats();
}

addGoalBtn.addEventListener("click", () => {
    const text = goalInput.value;
    const trimmedText = text.trim();
    if (!trimmedText) {
        alert("Please enter a goal.");
        return;
    }

    const color = colorPicker.value;
    goals.push({ text, completed: false, color });
    saveGoals();
    renderGoals();
    goalInput.value = "";
});

document.addEventListener("DOMContentLoaded", () => {
    renderGoals();
});