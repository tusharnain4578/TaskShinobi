var taskRow = `<tr class="task-row {{important}} {{darkTable}}" data-id="{{taskId}}">
<th role="button" onclick="showTask({{taskId}})" scope="row" class="task_sr"></th>
<td role="button" onclick="showTask({{taskId}})" class="task-text {{lineThrough}}">{{task}}</td>
<td role="button" onclick="showTask({{taskId}})" class="task-row-image">{{taskImg}}</td>
<td class="actions d-flex">

    <div class="fieldset check-box">
        <input class="chk" onchange="taskChecked(event);"
            type="checkbox" {{check}}/>
    </div>

    <i role="button" onclick="openEditModal({{taskId}})" class="fa-solid fa-pen-to-square text-secondary h3 ms-3"></i>

    <i role="button" onclick="deleteTask(event, {{taskId}})" class="fa-sharp fa-solid fa-trash text-danger h3 ms-3"></i>
</td>
</tr>`;

var taskImageTag = `<img class="task-img" src="{{imgSrc}}"></img>`;

function setSerialNumbers() {
  const srs = selectAll(".task_sr");
  let i = 0;
  srs.forEach((sr) => {
    sr.innerText = ++i;
  });
}

function getTaskHtml(task) {
  let taskRowHtml = taskRow.replace(/{{task}}/g, nl2space(task.task));

  taskRowHtml = taskRowHtml.replace(/{{taskId}}/g, task.id);

  taskRowHtml = taskRowHtml.replace(
    /{{check}}/g,
    task.status == "complete" ? "checked" : ""
  );

  taskRowHtml = taskRowHtml.replace(
    /{{lineThrough}}/g,
    task.status == "complete" ? "line-through" : ""
  );

  taskRowHtml = taskRowHtml.replace(
    /{{darkTable}}/g,
    theme == "dark" ? "table-dark white-border-row" : ""
  );

  taskRowHtml = taskRowHtml.replace(
    /{{important}}/g,
    task.isImportant ? `row-important` : ""
  );

  if (task.image) {
    const imgHtml = taskImageTag.replace(
      /{{imgSrc}}/g,
      "/taskimage/" + task.image
    );

    taskRowHtml = taskRowHtml.replace(/{{taskImg}}/g, imgHtml);
  } else {
    taskRowHtml = taskRowHtml.replace(/{{taskImg}}/g, "");
  }

  return taskRowHtml;
}

function switchTasks() {
  hide("#no-task-container");
  show("#task-container");
}
function switchNoTasks() {
  hide("#task-container");
  show("#no-task-container");
}

function initTaskDom(tasks) {
  const taskBody = select("#task_body");
  taskBody.innerHTML = "";

  if (tasks.length == 0) {
    switchNoTasks();
    return;
  }

  tasks.forEach((task, i) => {
    taskBody.innerHTML += getTaskHtml(task);
  });

  switchTasks();

  setSerialNumbers();
}

function addNewTask(task) {
  const taskBody = select("#task_body");
  taskBody.insertAdjacentHTML("afterbegin", getTaskHtml(task));
  setSerialNumbers();

  if (selectAll(".task-row").length == 1) {
    switchTasks();
  }
}

function editTask(task) {
  var row = select('[data-id="' + task.id + '"]');

  row.querySelector(".task-text").innerText = nl2space(task.task);
  if (task.isImportant) row.classList.add("row-important");
  else row.classList.remove("row-important");

  // taskImageTag
  if (task.image) {
    if (row.querySelector(".task-row-image").querySelector("img")) {
      row.querySelector(".task-row-image").querySelector("img").src =
        "/taskimage/" + task.image;
    } else {
      const imgHtml = taskImageTag.replace(
        /{{imgSrc}}/g,
        "/taskimage/" + task.image
      );
      row.querySelector(".task-row-image").innerHTML = imgHtml;
    }
  } else {
    row.childNodes(".task-row-image").childNodes("img").remove();
  }

  console.log(row);
}
function checkTask(task) {
  const row = select('[data-id="' + task.id + '"]');
  if (!row)
    return errorNotif("Something went wrong! Try refreshing the page.", 10000);
  const taskText = row.querySelector(".task-text");

  if (task.status == "complete") taskText.classList.add("line-through");
  else taskText.classList.remove("line-through");
}

function clearImageInput(event, input, prevContainer) {
  select(input).value = "";
  hide(prevContainer);
  hide("#" + event.target.id);
  validateField(input);
}

function removeTask(taskId) {
  const row = select('[data-id="' + taskId + '"]');
  if (!row)
    return errorNotif("Something went wrong! Try refreshing the page.", 10000);
  row.remove();
  if (selectAll(".task-row").length == 0) return switchNoTasks();
  setSerialNumbers();
}

//open edit task modal
function openEditModal(taskId) {
  getTask(taskId, (err, task) => {
    if (err) {
      errorNotif(err, 10000);
      return;
    }

    if (task) {
      select("#edit_id").value = task.id;
      select("#edit_task").value = task.task;
      select("#edit_isImportant").checked = task.isImportant;
      select("#editModalBtn").click();
    }
  });
}

//open show modal
function showTask(taskId) {
  getTask(taskId, (err, task) => {
    if (err) {
      errorNotif(err, 10000);
      return;
    }

    if (task) {
      select("#show_task").innerText = task.task;

      let datetime = new Date(task.createdAt);
      datetime = datetime.toLocaleString("en-US", dateTimeOptions);

      select("#show_dateTime").innerText = datetime;

      if (task.image) {
        select("#taskImg").src = "/taskimage/" + task.image;
        show("#taskImageContainer");
      } else {
        hide("#taskImageContainer");
      }

      if (task.isImportant) show("#show_isImportant");
      else hide("#show_isImportant");

      select("#showModalBtn").click();
    }
  });
}
