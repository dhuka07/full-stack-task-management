const API_URL = "/tasks";

async function fetchTasks(filter = "") {
  const res = await fetch(API_URL);
  let tasks = await res.json();

  if (filter === "completed") tasks = tasks.filter(t => t.completed);
  else if (filter === "pending") tasks = tasks.filter(t => !t.completed);

  const ul = document.getElementById("taskList");
  ul.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">
        ${task.title}: ${task.description}
      </span>
    `;

    const span = li.querySelector("span");

    // ✔️ button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "✔️";
    toggleBtn.onclick = async () => {
      span.classList.toggle("completed"); // optimistic update
      try {
        const res = await fetch(`${API_URL}/${task.id}`, { method: "PUT" });
        if (!res.ok) throw new Error();
      } catch {
        span.classList.toggle("completed"); // rollback
        alert("Failed to update task");
      }
    };

    // ❌ button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = async () => {
      await fetch(`${API_URL}/${task.id}`, { method: "DELETE" });
      fetchTasks(filter);
    };

    li.append(toggleBtn, delBtn);
    ul.appendChild(li);
  });
}

document.getElementById("taskForm").onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const task = { title, description };
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    fetchTasks();
  } catch {
    alert("Failed to add task");
  }

  e.target.reset();
};

fetchTasks();
