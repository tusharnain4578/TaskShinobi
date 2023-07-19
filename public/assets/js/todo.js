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

  if (addTaskValid) {
    let formData = new FormData(event.target);

    let data = {};

    for (var p of formData) {
      let name = p[0];
      let value = p[1];

      data[name] = value.trim();
    }

    btnSpinShow("#addTask_btn");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("/api/task/add", options)
      .then((res) => res.json())
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
        }
      })
      .catch((error) => {
        successNotif("Something went wrong! Try refreshing the page!", 10000);
      });

    btnSpinHide("#addTask_btn");
  }
};

function updateTask(event) {
  event.preventDefault();

  select("#edit_task").dispatchEvent(new Event("input"));

  if (editTaskValid) {
    let formData = new FormData(event.target);
    let data = {};
    for (var p of formData) {
      let name = p[0];
      let value = p[1];
      data[name] = value.trim();
    }

    btnSpinShow("#editTask_btn");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
