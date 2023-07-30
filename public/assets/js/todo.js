var addTaskValid = false;
var editTaskValid = false;

// task validation

function validateTask(event) {
  const id = event.target.id;
  const el = event.target;
  let value = event.target.value;

  value = value.trim();

  let msg = null;

  if (value.length == 0) msg = "Task cannot be empty!";
  else if (value.length > 1000)
    msg = "Maximum of 1000 characters are allowed only!";

  if (msg) {
    addTaskValid = false;

    if (id == "task") addTaskValid = false;
    else editTaskValid = false;

    return invalidateField("#" + id, msg);
  }

  if (id == "task") addTaskValid = true;
  else editTaskValid = true;

  validateField("#" + id);
}

function validateTaskImage(event) {
  const el = event.target;
  const id = el.id;
  const file = el.files[0];
  const prevContainer = `#${id}_prev`;

  const maxSize = 500 * 1024;

  if (!file) return;

  if (id == "edit_task_image") {
    editTaskValid = false;
    show("#clear_edit_input", "inherit");
  } else {
    addTaskValid = false;
    show("#clear_add_input", "inherit");
  }

  let errMsg = null;

  if (!file.type.startsWith("image/"))
    errMsg = "The selected file is not an image.";

  if (!errMsg && file.size > maxSize)
    errMsg = "Maximum image size to upload is 500kb.";

  if (errMsg) {
    hide(prevContainer);
    return invalidateField("#" + id, errMsg);
  }

  const reader = new FileReader();

  reader.onload = function () {
    const img = new Image();
    img.classList.add("preview-image");
    img.style.maxWidth = "150px";
    img.src = reader.result;

    if (select(prevContainer).querySelector(".preview-image"))
      select(prevContainer).querySelector(".preview-image").remove();

    select(prevContainer).appendChild(img);
    show(prevContainer);
  };
  reader.readAsDataURL(file);

  if (id == "edit_task_image") editTaskValid = true;
  else addTaskValid = true;

  validateField("#" + id);
}

function getTask(taskId, callback) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId }),
  };
  fetch("/api/task/get", options)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);

      if (res.error) {
        errorNotif(res.message, 10000);
        callback(res.error, null);
        return;
      }

      if (res.success) {
        callback(null, res.task);
        return;
      }
    })
    .catch((error) => {
      successNotif("Something went wrong! Try refreshing the page!", 10000);
    });
  callback(null, null);
}

const addTask = (event) => {
  event.preventDefault();

  select("#task").dispatchEvent(new Event("input"));

  if (addTaskValid) select("#task_image").dispatchEvent(new Event("change"));

  if (addTaskValid) {
    let formData = new FormData(event.target);

    btnSpinShow("#addTask_btn");

    const options = {
      method: "POST",
      body: formData,
    };

    fetch("/api/task/add", options)
      .then((res) => {
        btnSpinHide("#addTask_btn");
        return res.json();
      })
      .then((res) => {
        console.log(res);

        if (res.error) {
          errorNotif(res.message, 10000);
          return;
        }

        if (res.success) {
          successNotif(res.message, 5000);
          addNewTask(res.task);
          select("#task").value = "";
          select("#isImportant").checked = false;

          hide("#clear_add_input");
        }

        select("#task_image").value = "";
        hide("#task_image_prev");
      })
      .catch((error) => {
        successNotif("Something went wrong! Try refreshing the page!", 10000);
        btnSpinHide("#addTask_btn");
      });
  }
};

function updateTask(event) {
  event.preventDefault();

  select("#edit_task").dispatchEvent(new Event("input"));
  if (editTaskValid)
    select("#edit_task_image").dispatchEvent(new Event("change"));

  if (editTaskValid) {
    let formData = new FormData(event.target);

    btnSpinShow("#editTask_btn");

    const options = {
      method: "POST",
      body: formData,
    };

    fetch("/api/task/update", options)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        if (res.error) {
          errorNotif(res.message, 10000);
          return;
        }

        if (res.success) {
          successNotif(res.message, 5000);
          editTask(res.task);
          select("#edit_task").value = "";
          select("#edit_isImportant").checked = false;
          select("#editModalClose").click();
        }
      })
      .catch((error) => {
        successNotif("Something went wrong! Try refreshing the page!", 10000);
      });

    btnSpinHide("#editTask_btn");
  }
}

function taskChecked(event) {
  const el = event.target;
  const check = el.checked;
  el.disabled = true;

  const taskRow = el.closest(".task-row");
  const taskId = taskRow.getAttribute("data-id");

  if (!taskId)
    return errorNotif("Something went wrong! Try refreshing the page.", 10000);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskId: taskId, check: check }),
  };

  fetch("/api/task/complete", options)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);

      if (res.error) {
        el.checked = false;
        errorNotif(res.message, 10000);
        return;
      }

      if (res.success) {
        successNotif(res.message, 5000);
        checkTask(res.task);
        return;
      }
    })
    .catch((error) => {
      successNotif("Something went wrong! Try refreshing the page!", 10000);
    });
  el.disabled = false;
}

//dull row on task checked
function deleteTask(event, taskId) {
  const el = event.target;
  el.style.pointerEvents = "none";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskId }),
  };

  fetch("/api/task/delete", options)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);

      if (res.error) {
        el.checked = false;
        errorNotif(res.message, 10000);
        return;
      }

      if (res.success) {
        successNotif(res.message, 5000);
        removeTask(taskId);
        return;
      }
    })
    .catch((error) => {
      successNotif("Something went wrong! Try refreshing the page!", 10000);
    });
}
