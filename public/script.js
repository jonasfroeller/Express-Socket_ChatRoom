let hosts = [];
if (window.location.hostname === "localhost") {
    hosts["default"] = "http://localhost:4000";
    hosts["room"] = "http://localhost:5000";
} else {
    hosts["default"] = "https://express-fs-todo-app.glitch.me";
    hosts["room"] = "https://express-fs-todo-app.glitch.me";
}

[...document.getElementsByTagName("a")].forEach((a) => {
    if (a.href.includes("4000")) {
        a.href = hosts["default"];
    } else {
        a.href = hosts["room"];  
    }
})