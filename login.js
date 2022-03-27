// _______________________FUNCTIONS_______________________
function notification(contentContainer, divClass, content) {
  document.getElementById(contentContainer).innerHTML = content;
  document.querySelector(divClass).style.opacity = "1";
  document.querySelector(divClass).style.animation = "notifPopup 0.3s ease-out";
  setTimeout(() => {
    document.querySelector(divClass).style.animation =
      "notifPopdown 0.3s ease-in";
    document.querySelector(divClass).style.opacity = "0";
  }, 3000);
}

function switchBlackeds(outBlacked, inBlacked, outContainer, inContainer) {
  document.querySelector(outBlacked).style.opacity = "0";
  document.querySelector(inBlacked).style.opacity = "1";

  document.querySelector(outBlacked).style.visibility = "hidden";
  document.querySelector(inBlacked).style.visibility = "visible";

  document.querySelector(outContainer).style.animation = "getOut 0.5s ease-in";
  document.querySelector(outContainer).style.opacity = "0"; // Keep it in 0
  document.querySelector(outContainer).style.visibility = "hidden"; // Keep it hidden

  document.querySelector(inContainer).style.animation = "popup 0.5s ease-in";
  document.querySelector(inContainer).style.opacity = "1"; // Keep it in 1
  document.querySelector(inContainer).style.visibility = "visible"; // Keep it visible
}
let IP = "http://127.0.0.1:5000/";
// __________________________________________________________

// Connect Behavior
document.getElementById("btnConnect").addEventListener("click", function () {
  var email = document.getElementById("email").value;
  var password = document.getElementById("pass").value;
  var entry = { email: email, password: password };

  var options = {
    method: "POST",
    body: JSON.stringify(entry),
    credentials: "same-origin",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  };
  let uri = IP + "authentification";
  fetch(uri, options).then(function (response) {
    response.json().then(function (data) {
      if (data.alert == "True") {
        if (data.message == "New user") {
          document.getElementById("new-email").value = email;
          switchBlackeds(".signin", ".signup", ".old-user", ".new-user");
        } else {
          notification("notifContSignin", ".notif", data.message);
        }
      } else if (data.alert == "False") {
        console.log(data);
        var testObject = { one: 1, two: 2, three: 3 };

        // Put the object into storage
        // localStorage.setItem('testObject', JSON.stringify(testObject));
        localStorage.setItem("connections", JSON.stringify(data));

        switchBlackeds(
          ".signin",
          ".apps",
          ".old-user",
          ".applications-container"
        );
      }
    });
  });
});

// Create Password Behavior
document.getElementById("btnCreate").addEventListener("click", function () {
  let newPassword = document.getElementById("new-pass").value;
  let confPassword = document.getElementById("pass-conf").value;
  let email = document.getElementById("new-email").value;
  let uri = "http://127.0.0.1:5000/createPassword";
  var entry = { email: email, newPassword: newPassword };
  var options = {
    method: "POST",
    body: JSON.stringify(entry),
    // credentials: "same-origin",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  };

  if (newPassword == confPassword && newPassword !== "") {
    fetch(uri, options).then(function (response) {
      response.json().then(function (data) {
        console.log(data.message);
        switchBlackeds(".signup", ".signin", ".new-user", ".old-user");
        document.getElementById("pass").value = newPassword;
      });
    });
  } else if (newPassword != confPassword) {
    document.getElementById("new-pass").style.animation =
      "vibration 0.4s ease-out";
    document.getElementById("new-pass").value = "";
    document.getElementById("pass-conf").style.animation =
      "vibration 0.4s ease-out";
    document.getElementById("pass-conf").value = "";
    setTimeout(() => {
      document.getElementById("new-pass").style.animation = "";
      document.getElementById("pass-conf").style.animation = "";
    }, 2000);
    notification("notifContSignup", ".notifSignup", "Unmatched Passwords");
  }
});

// Application Selection
document.getElementById("F2FI").addEventListener("click", function () {
  document.querySelector(".faurTrans").style.width = "100%";
  document.querySelector(".faurTrans").style.visibility = "visible";
  setTimeout(() => {
    // document.querySelector('.welcome-container').style.display = "none";
    // document.querySelector('.trans').style.display = "block";
    // document.querySelector('.faurTrans').style.width = "0%";
    window.location.href = "F2FI.html";
  }, 300);
  document.querySelector(".trans").style.display = "flex";
});

// document.getElementById("e-Top5").addEventListener("click", function () {
//   notification("notifContApp", ".notifApp", "Not disponible at this time");
// });

// document.getElementById("e-DLE").addEventListener("click", function () {
//   notification("notifContApp", ".notifApp", "Not disponible at this time");
// });

document.getElementById("btnReset").addEventListener("click", function () {
  notification("notifContSignin", ".notif", "Contact FES Team");
});
