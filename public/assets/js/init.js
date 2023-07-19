function makeItLogIn(user) {
  //setup navbar
  hide("#login-nav");
  select("#user-icon").innerText = user.name.trim()[0].toUpperCase();
  select("#user-name").innerText = user.name.trim();
  select("#user-email").innerText = user.email.trim();
  show("#user-nav");

  //setup application
  select("#guestPage").style.display = "none";
  select("#app").style.display = "block";
}

function makeItLogout() {
  // navbar
  hide("#user-nav");
  select("#user-icon").innerText = "";
  select("#user-name").innerText = "";
  select("#user-email").innerText = "";
  show("#login-nav");

  select("#task_body").innerHtml = "";

  //application
  select("#app").style.display = "none";
  select("#guestPage").style.display = "block";
}

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

fetch("/api/is-authenticated", options)
  .then((res) => res.json())
  .then((res) => {
    if (res.success && res.user.name && res.user.email) {
      makeItLogIn(res.user);
      initTaskDom(res.tasks);
      if (res.message) successNotif(res.message, 10000);
    } else {
      select("#guestPage").style.display = "block";
    }
  });
