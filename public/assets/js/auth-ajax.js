var msg = null;
var sgValid = false;
var lgValid = false;

var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

function signup(event) {
  event.preventDefault();

  ["sg_name", "sg_email", "sg_password", "sg_cpassword"].forEach((field) => {
    select("#" + field).dispatchEvent(new Event("input"));
  });

  if (sgValid) {
    let formData = new FormData(event.target);

    let data = {};

    for (var p of formData) {
      let name = p[0];
      let value = p[1];

      data[name] = value;
    }

    btnSpinShow("#sg_btn");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("/api/signup", options)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        if (res.error) {
          errorNotif(res.message, 10000);
          return;
        }

        if (res.field) {
          return invalidateField("#" + res.field, res.message);
        }

        if (res.success) {
          successNotif(res.message, 10000);

          if (select("#toLogin")) {
            select("#toLogin").click();
          }
        }
      })
      .catch((error) => {
        successNotif("Something went wrong! Try refreshing the page!", 10000);
      });

    btnSpinHide("#sg_btn");
  }
}

function login(event) {
  event.preventDefault();

  ["lg_email", "lg_password"].forEach((field) => {
    select("#" + field).dispatchEvent(new Event("input"));
  });

  if (lgValid) {
    let formData = new FormData(event.target);

    let data = {};

    for (var p of formData) {
      let name = p[0];
      let value = p[1];

      data[name] = value;
    }

    btnSpinShow("#lg_btn");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("/api/login", options)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        if (res.error) {
          errorNotif(res.message, 10000);
          return;
        }

        if (res.field) {
          return invalidateField("#" + res.field, res.message);
        }

        if (res.success) {
          select("#lgclose").click();
          makeItLogIn(res.user);
          initTaskDom(res.tasks);
          successNotif(res.message, 10000);
        }
      })
      .catch((error) => {
        successNotif("Something went wrong! Try refreshing the page!", 10000);
      });

    btnSpinHide("#lg_btn");
  }
}

function logout() {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch("/api/logout", options)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);

      if (res.error) {
        errorNotif(res.message, 10000);
        return;
      }

      if (res.success) {
        makeItLogout();
        successNotif(res.message, 10000);
      }
    })
    .catch((error) => {
      successNotif("Something went wrong! Try refreshing the page!", 10000);
    });
}

onEvent("#signup_form", "submit", signup);
onEvent("#login_form", "submit", login);
onEvent("#logout_btn", "click", logout);
