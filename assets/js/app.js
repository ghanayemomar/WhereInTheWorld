// check if pure functuin or NOT
var icon = document.getElementById("icon");
icon.onclick = () => {
  document.body.classList.toggle("dark-theme");
  const isDarkMode = document.body.classList.contains("dark-theme"); //t or f
  localStorage.setItem("isDarkMode", isDarkMode);
};

const isDarkMode = localStorage.getItem("isDarkMode") === "true" ? true : false;
if (isDarkMode) {
  document.body.classList.add("dark-theme");
}
