// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", function () {
  menu.classList.toggle("open");
});

// ---------- Academic Planner ----------
const taskForm = document.getElementById("task-form");
if (taskForm) {
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const error = document.getElementById("task-error");
  const count = document.getElementById("count");
  let tasks = []; // array of {text, done}

  function renderTasks() {
    list.innerHTML = "";
    tasks.forEach(function (task, index) {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = task.done;
      box.setAttribute("aria-label", "Mark task as completed");
      box.addEventListener("change", function () {
        tasks[index].done = box.checked;
        renderTasks();
      });

      const text = document.createElement("span");
      text.textContent = task.text;

      const del = document.createElement("button");
      del.className = "del";
      del.textContent = "Delete";
      del.addEventListener("click", function () {
        tasks.splice(index, 1);
        renderTasks();
      });

      li.append(box, text, del);
      list.appendChild(li);
    });
    updateCount();
  }

  function updateCount() {
    const done = tasks.filter(function (t) { return t.done; }).length;
    count.textContent = tasks.length === 0
      ? "No tasks yet. Add your first one above."
      : done + " of " + tasks.length + " tasks completed";
  }

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const value = input.value.trim();
    if (value === "") {
      error.textContent = "Please type a task before adding it.";
      return;
    }
    error.textContent = "";
    tasks.push({ text: value, done: false });
    input.value = "";
    renderTasks();
  });

  renderTasks();
}

// ---------- Contact form validation ----------
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  function setError(id, msg) {
    document.getElementById(id + "-error").textContent = msg;
    return msg === "";
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digitsOnly = /^[0-9]+$/;

    const results = [
      setError("name", name === "" ? "Name cannot be empty." : ""),
      setError("email", email === "" ? "Email cannot be empty."
        : !emailPattern.test(email) ? "Enter a valid email, like name@example.com." : ""),
      setError("phone", phone === "" ? "Phone number cannot be empty."
        : !digitsOnly.test(phone) ? "Phone number must contain digits only." : ""),
      setError("message", message === "" ? "Message cannot be empty." : "")
    ];

    const success = document.getElementById("success");
    if (results.every(Boolean)) {
      success.style.display = "block";
      contactForm.reset();
    } else {
      success.style.display = "none";
    }
  });
}

// ---------- Scroll reveal: items fade in as you scroll ----------
const revealTargets = document.querySelectorAll("main .card, main h2, main .bubbles");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.setProperty("--d", (i % 4) * 90 + "ms");
    el.addEventListener("animationend", function () {
      el.classList.remove("reveal", "visible"); // back to normal so hover effects work
    });
    observer.observe(el);
  });
}

// ---------- Typing effect on the homepage ----------
const typed = document.getElementById("typed");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (typed && !reduceMotion) {
  const roles = ["Software Engineering Student", "Front-End Enthusiast", "Creative Problem Solver"];
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  function tick() {
    const current = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    typed.textContent = current.slice(0, charIndex);
    let delay = deleting ? 40 : 80;
    if (!deleting && charIndex === current.length) {
      deleting = true;
      delay = 1800; // pause when a role is fully typed
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1800);
}
