// 🌍 Elements
const planner = document.getElementById("planner");
const themeToggle = document.getElementById("themeToggle");
const daySelector = document.getElementById("daySelector");
const toast = document.getElementById("toast");
const todayDate = new Date().toDateString();
document.getElementById("date").textContent = todayDate;

// ⏰ Define working hours
const hours = ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];
const hourMap = { "8AM": 8, "9AM": 9, "10AM": 10, "11AM": 11, "12PM": 12, "1PM": 13, "2PM": 14, "3PM": 15, "4PM": 16, "5PM": 17 };
const currentHour = new Date().getHours();

// 🌒 Theme Toggle Logic
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "🌞";
}
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  themeToggle.textContent = dark ? "🌞" : "🌙";
});

// 🔔 Toast Utility
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// 🧱 Render Time Cards
function renderPlanner(day) {
  planner.innerHTML = "";
  hours.forEach(hour => {
    const card = document.createElement("div");
    card.className = "time-card";
    if (hourMap[hour] === currentHour && day === new Date().toLocaleDateString('en-US', { weekday: 'long' })) {
      card.classList.add("current");
    }

    const label = document.createElement("span");
    label.textContent = hour;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Add task...";
    input.value = localStorage.getItem(`${day}-${hour}`) || "";

    const button = document.createElement("button");
    button.textContent = "Add";
    button.className = "add-btn";
    button.addEventListener("click", () => {
      localStorage.setItem(`${day}-${hour}`, input.value);
      showToast(`✅ ${day} ${hour} saved`);
      button.textContent = "✅";
      setTimeout(() => button.textContent = "Add", 1000);
    });

    card.append(label, input, button);
    planner.appendChild(card);
  });
}

// 🛠 Init Planner
const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
daySelector.value = todayName;
renderPlanner(todayName);
daySelector.addEventListener("change", () => renderPlanner(daySelector.value));

// 🗑 Clear Day
document.getElementById("clear").addEventListener("click", () => {
  if (confirm("Clear all tasks for this day?")) {
    hours.forEach(hour => localStorage.removeItem(`${daySelector.value}-${hour}`));
    renderPlanner(daySelector.value);
  }
});

// 📅 Weekly Summary Modal
const weeklyBtn = document.getElementById("weeklySummaryBtn");
const modal = document.getElementById("weeklyModal");
const closeModal = document.getElementById("closeModal");
const weeklyContent = document.getElementById("weeklyContent");

weeklyBtn.addEventListener("click", () => {
  weeklyContent.innerHTML = "";
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  days.forEach(day => {
    let section = document.createElement("div");
    let heading = document.createElement("h3");
    heading.textContent = `📌 ${day}`;
    section.appendChild(heading);

    let hasTasks = false;
    hours.forEach(hour => {
      const task = localStorage.getItem(`${day}-${hour}`);
      if (task) {
        const p = document.createElement("p");
        p.textContent = `${hour}: ${task}`;
        section.appendChild(p);
        hasTasks = true;
      }
    });

    if (hasTasks) weeklyContent.appendChild(section);
  });

  if (!weeklyContent.innerHTML.trim()) {
    weeklyContent.innerHTML = "<p>⚠️ No tasks saved this week.</p>";
  }

  modal.style.display = "block";
});
closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => {
  if (e.target == modal) modal.style.display = "none";
});
