// ----- อ้างอิง element ที่ต้องใช้ -----
var form = document.getElementById("add-form");
var input = document.getElementById("task-input");
var list = document.getElementById("task-list");
var emptyState = document.getElementById("empty-state");
var taskCount = document.getElementById("task-count");
var errorMessage = document.getElementById("error-message");

var STORAGE_KEY = "todo-list-tasks";

// ไอคอนสำหรับงานที่เพิ่มใหม่ (สลับไปเรื่อย ๆ)
var ICONS = ["📌", "✏️", "📚", "🧹", "🛒", "☕", "🎯", "📦"];
var iconIndex = 0;

// งานตัวอย่างสำหรับเปิดเว็บครั้งแรก
var DEFAULT_TASKS = [
  { icon: "📞", text: "โทรนัดช่างประปามาซ่อมก๊อกน้ำที่รั่ว" },
  { icon: "🌊", text: "วางแผนการท่องเที่ยวสำหรับวันหยุด" },
  { icon: "💻", text: "จัดระเบียบโต๊ะทำงาน" },
  { icon: "🎞️", text: "เตรียมสไลด์นำเสนองาน" }
];

var tasks = loadTasks();
render();

// ----- เพิ่มงานใหม่ -----
// กดปุ่ม "เพิ่ม"
form.addEventListener("submit", function (event) {
  event.preventDefault();
  addTask();
});

// กดปุ่ม Enter ในช่องพิมพ์
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // กันไม่ให้ฟอร์มถูกส่งซ้ำอีกรอบ
    addTask();
  }
});

function addTask() {
  var text = input.value.trim();

  if (text === "") {
    errorMessage.textContent = "กรุณาพิมพ์ชื่องานก่อนกดเพิ่ม";
    input.focus();
    return;
  }

  errorMessage.textContent = "";
  tasks.push({ icon: nextIcon(), text: text });
  saveTasks();
  render();

  input.value = "";
  input.focus();
}

// พิมพ์แล้วให้ข้อความแจ้งเตือนหายไป
input.addEventListener("input", function () {
  errorMessage.textContent = "";
});

// ----- วาดรายการงานทั้งหมดใหม่ -----
function render() {
  list.innerHTML = "";

  for (var i = 0; i < tasks.length; i++) {
    list.appendChild(createTaskItem(tasks[i], i));
  }

  emptyState.classList.toggle("is-visible", tasks.length === 0);
  taskCount.textContent = "ทั้งหมด " + tasks.length + " งาน";
}

// สร้าง <li> ของงาน 1 รายการ
function createTaskItem(task, index) {
  var item = document.createElement("li");
  item.className = "task-item";

  var icon = document.createElement("span");
  icon.className = "task-icon";
  icon.textContent = task.icon;

  var text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;

  var deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    deleteTask(index);
  });

  item.appendChild(icon);
  item.appendChild(text);
  item.appendChild(deleteButton);
  return item;
}

// ----- ลบงาน -----
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  render();
}

// ----- ไอคอนถัดไป -----
function nextIcon() {
  var icon = ICONS[iconIndex % ICONS.length];
  iconIndex++;
  return icon;
}

// ----- บันทึก / อ่านข้อมูลจากเครื่องผู้ใช้ -----
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    // ถ้าบันทึกไม่ได้ก็ยังใช้งานเว็บได้ตามปกติ
  }
}

function loadTasks() {
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      return DEFAULT_TASKS.slice();
    }
    var parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : DEFAULT_TASKS.slice();
  } catch (error) {
    return DEFAULT_TASKS.slice();
  }
}
