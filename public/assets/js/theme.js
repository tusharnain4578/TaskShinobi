var theme = "";
function switchToDark() {
  addClass("body", "bg-dark");
  addClass("p", "text-white");
  addClass(".theme-text", "text-white");
  addClass(".modal-content", "bg-dark");
  addClass(".modal-content", "text-white");
  addClass(".card-body", "bg-dark");
  addClass(".card-body", "text-white");
  addClass("tr", "table-dark");
  addClass("tr", "white-border-row");
  addClass("textarea", "bg-dark");
  addClass("textarea", "text-white");
  addClass(".input-group-text", "bg-dark");
  addClass(".input-group-text", "text-white");
  addClass(".auth-inp", "bg-dark");
  addClass(".auth-inp", "text-white");
  localStorage && localStorage.setItem("theme", "dark");
  theme = "dark";
  removeClass("#themeBtn", "fa-moon");
  addClass("#themeBtn", "fa-sun");
}

function switchToLight() {
  removeClass("body", "bg-dark");
  removeClass("p", "text-white");
  removeClass(".theme-text", "text-white");
  removeClass(".modal-content", "bg-dark");
  removeClass(".modal-content", "text-white");
  removeClass(".card-body", "bg-dark");
  removeClass(".card-body", "text-white");
  removeClass("tr", "table-dark");
  removeClass("tr", "white-border-row");
  removeClass("textarea", "bg-dark");
  removeClass("textarea", "text-white");
  removeClass(".input-group-text", "bg-dark");
  removeClass(".input-group-text", "text-white");
  removeClass(".auth-inp", "bg-dark");
  removeClass(".auth-inp", "text-white");
  localStorage && localStorage.setItem("theme", "light");
  theme = "light";
  removeClass("#themeBtn", "fa-sun");
  addClass("#themeBtn", "fa-moon");
}

if (localStorage) {
  if (localStorage.getItem("theme") == "dark") switchToDark();
  else switchToLight();
}

const toggleTheme = () => {
  if (localStorage) {
    if (localStorage.getItem("theme") == "light") switchToDark();
    else switchToLight();
  }
};
