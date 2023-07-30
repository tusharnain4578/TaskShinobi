const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

const addClass = (selector, _class) => {
  const els = selectAll(selector);
  els.forEach((el) => el.classList.add(_class));
};
const removeClass = (selector, _class) => {
  const els = selectAll(selector);
  els.forEach((el) => el.classList.remove(_class));
};

const successNotif = (msg, duration = 5000) => {
  mdtoast(msg, { duration: duration, type: mdtoast.SUCCESS });
};
const errorNotif = (msg, duration = 5000) => {
  mdtoast(msg, { duration: duration, type: mdtoast.ERROR });
};

function onEvent(field, event, callback) {
  const els = selectAll(field);

  els.forEach((el) => {
    el.addEventListener(event, callback);
  });
}

const show = (selector, displayProp = "block") =>
  (select(selector).style.display = displayProp);
const hide = (selector) => (select(selector).style.display = "none");

function invalidateField(selector, message = null) {
  select(selector).classList.add("is-invalid");
  select(selector).nextElementSibling.innerText = message;
}

function validateField(selector) {
  select(selector).classList.remove("is-invalid");
  select(selector).nextElementSibling.innerText = "";
}

function btnSpinShow(selector) {
  select(selector).lastElementChild.style.display = "block";
}
function btnSpinHide(selector) {
  select(selector).lastElementChild.style.display = "none";
}

function nl2space(text) {
  return text.replace(/[\r\n]+/g, " ");
}

const dateTimeOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

const sgValidator = (event) => {
  let field = event.target.id;

  let value = select("#" + field).value.trim();

  let invalid = { field: field };

  if (value.length == 0) {
    invalid.msg = "Field is Required!";
  } else if ("sg_name" == field && value.length > 30) {
    invalid.msg = "Maximum 30 characters allowed!";
  } else if ("sg_email" == field) {
    if (!emailRegex.test(value)) {
      invalid.msg = "Invalid Email Address!";
    } else if (value.length > 150) {
      invalid.msg = "Max 150 characters allowed!";
    }
  } else if ("sg_password" == field) {
    if (value.length < 8) {
      invalid.msg = "Password must be atleat 8 digits!";
    } else if (!passwordRegex.test(value)) {
      invalid.msg =
        "Password must atleast contains 1 uppercase letter, 1 lowercase letter, 1 numeric digit and 1 special character!";
    }
    select("#sg_cpassword").dispatchEvent(new Event("input"));
  } else if ("sg_cpassword" == field && select("#sg_password").value != value) {
    invalid.msg = "Confirm Password must match the password!";
  }

  if (invalid.msg) {
    sgValid = false;
    return invalidateField("#" + field, invalid.msg);
  }

  sgValid = true;
  validateField("#" + field);
};

onEvent("#sg_name", "input", sgValidator);
onEvent("#sg_email", "input", sgValidator);
onEvent("#sg_password", "input", sgValidator);
onEvent("#sg_cpassword", "input", sgValidator);

const lgValidator = (event) => {
  let field = event.target.id;
  let value = select("#" + field).value.trim();
  let invalid = { field: field };
  if (value.length == 0) {
    invalid.msg = "Field is Required!";
  } else if ("lg_email" == field) {
    if (!emailRegex.test(value)) {
      invalid.msg = "Invalid Email Address!";
    } else if (value.length > 150) {
      invalid.msg = "Max 150 characters allowed!";
    }
  }

  if (invalid.msg) {
    lgValid = false;
    return invalidateField("#" + field, invalid.msg);
  }
  lgValid = true;
  validateField("#" + field);
};
onEvent("#lg_email", "input", lgValidator);
onEvent("#lg_password", "input", lgValidator);

//
function onModalClose(event) {
  const id = event.target.id;

  const inputs = selectAll(`#${id} input`);

  inputs.forEach((input) => {
    validateField("#" + input.id);
    input.value = "";
  });
}

onEvent("#signupModal", "hidden.bs.modal", onModalClose);
onEvent("#loginModal", "hidden.bs.modal", onModalClose);

//on closing of edit modal
onEvent("#editModal", "hidden.bs.modal", function () {
  select("#edit_task_image").value = "";
  hide("#edit_task_image_prev");
  validateField("#edit_task");
  validateField("#edit_task_image");
  hide("#clear_edit_input");
});

onEvent(".task-textbox", "keypress", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    event.target.closest("form").dispatchEvent(new Event("submit"));
  }
});
