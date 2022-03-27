// _______________________FUNCTIONS_______________________
function loadUserInfo(type = "all") {
  var userInfo = localStorage.getItem("connections");
  userInfo = JSON.parse(userInfo);
  if (type == "email") {
    return userInfo.email;
  } else if (type == "all") {
    return userInfo;
  }
}

function notification(
  contentContainer,
  divClass,
  content,
  duration = 3000,
  types = 0
) {
  if (types == 0) {
    document.getElementById("notif--icon").className = "notif--icon";
  } else {
    document.getElementById("notif--icon").className =
      "notif--icon notif--success";
  }
  document.getElementById(contentContainer).innerHTML = content;
  document.querySelector(divClass).style.visibility = "visible";
  document.querySelector(divClass).style.opacity = "1";
  document.querySelector(divClass).style.animation = "notifPopup 0.3s ease-out";
  setTimeout(() => {
    document.querySelector(divClass).style.animation =
      "notifPopdown 0.3s ease-in";
    document.querySelector(divClass).style.opacity = "0";
    setTimeout(() => {
      document.querySelector(divClass).style.visibility = "hidden";
    }, 300);
  }, duration);
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

function closeAllWindows(appearingContainer) {
  document.querySelector(".bg--inF2F").style.filter = "blur(0)";
  document.querySelector(".Face2Face-content").style.opacity = "0";
  document.querySelector(".alertBoard-content").style.opacity = "0";
  setTimeout(() => {
    document.querySelector(".Face2Face-content").style.visibility = "hidden";
    document.querySelector(".Face2Face-content").style.display = "none";
    document.querySelector(".alertBoard-content").style.visibility = "hidden";
    document.querySelector(".alertBoard-content").style.display = "none";
    document.querySelector(appearingContainer).style.visibility = "visible";
    document.querySelector(appearingContainer).style.opacity = "1";
    document.querySelector(appearingContainer).style.display = "flex";
  }, 500);
}

function blurAll(blurVal = 8) {
  document.querySelector(".Face2Face-content").style.filter =
    "blur(" + blurVal + "px)";
  document.querySelector(".dashBoard-content").style.filter =
    "blur(" + blurVal + "px)";
  document.querySelector(".alertBoard-content").style.filter =
    "blur(" + blurVal + "px)";
}
function unBlurAll() {
  document.querySelector(".Face2Face-content").style.filter = "blur(0px)";
  document.querySelector(".dashBoard-content").style.filter = "blur(0px)";
  document.querySelector(".alertBoard-content").style.filter = "blur(0px)";
}

function resetAlertSheet(
  action1,
  action2,
  action3,
  expected1,
  expected2,
  expected3,
  date1,
  date2,
  date3,
  resetActionHtml,
  resetExpectedHtml,
  resetdateHtml
) {
  action1.innerHTML = resetActionHtml;
  action2.innerHTML = resetActionHtml;
  action3.innerHTML = resetActionHtml;
  expected1.innerHTML = resetExpectedHtml;
  expected2.innerHTML = resetExpectedHtml;
  expected3.innerHTML = resetExpectedHtml;
  date1.innerHTML = resetdateHtml;
  date2.innerHTML = resetdateHtml;
  date3.innerHTML = resetdateHtml;
}

function toggleDropContent(idDropBtn, idDropContent) {
  var dropdowns = document.getElementById(idDropContent);
  if (dropdowns.classList.contains("show")) {
    dropdowns.style.animation = "";
    dropdowns.style.animation = "fadeOutUp 0.5s";
    document.getElementById(idDropBtn).classList.toggle("rotate180");
    setTimeout(() => {
      dropdowns.classList.remove("show");
      dropdowns.style.animation = "";
    }, 400);
  } else {
    rotate(idDropBtn, idDropContent);
  }
}

function rotate(idDropBtn, idDropelm) {
  document.getElementById(idDropBtn).classList.toggle("rotate180");
  document.getElementById(idDropelm).classList.toggle("show");
}

function toggleDropContentUp(idDropBtn, idDropContent) {
  var dropdowns = document.getElementById(idDropContent);
  if (dropdowns.classList.contains("showup")) {
    dropdowns.style.animation = "";
    dropdowns.style.animation = "fadeOutDown 0.5s";
    document.getElementById(idDropBtn).classList.toggle("rotate180");
    setTimeout(() => {
      dropdowns.classList.remove("showup");
      dropdowns.style.animation = "";
    }, 400);
  } else {
    rotateup(idDropBtn, idDropContent);
  }
}

function rotateup(idDropBtn, idDropelm) {
  document.getElementById(idDropBtn).classList.toggle("rotate180");
  document.getElementById(idDropelm).classList.toggle("showup");
}

function disapear(idDropBtn, idDropContent) {
  var dropdowns = document.getElementById(idDropContent);
  var i;
  if (dropdowns.classList.contains("show")) {
    dropdowns.style.animation = "";
    dropdowns.style.animation = "fadeOutUp 0.5s";
    document.getElementById(idDropBtn).classList.toggle("rotate180");

    setTimeout(() => {
      dropdowns.classList.remove("show");
      dropdowns.style.animation = "";
    }, 500);
  }
}

function disapearUp(idDropBtn, idDropContent) {
  var dropdowns = document.getElementById(idDropContent);
  var i;
  if (dropdowns.classList.contains("showup")) {
    dropdowns.style.animation = "";
    dropdowns.style.animation = "fadeOutDown 0.5s";
    document.getElementById(idDropBtn).classList.toggle("rotate180");

    setTimeout(() => {
      dropdowns.classList.remove("showup");
      dropdowns.style.animation = "";
    }, 500);
  }
}

function fillAlertBoard(uri, options, olddataHtml, KPIlist) {
  fetch(uri, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let dataHtml = "";
      for (let elm of data) {
        dataHtml += "<tr><td>" + elm.alertedKPI + "</td></tr>";
      }
      if (olddataHtml != dataHtml) {
        olddataHtml = dataHtml;
        KPIlist.innerHTML = dataHtml;
      }
    });
  setTimeout(() => {
    var items = document.querySelectorAll("#KPIlist-Alerted tr td");

    for (let i = 0; i < items.length; i++) {
      items[i].onclick = function () {
        document.getElementById("action-field").value = "";
        document.getElementById("container-caption--alert-sheet").innerHTML =
          "ALERT: " +
          "<br>" +
          '<span class="light-bold" style="font-size:2rem">' +
          items[i].innerHTML +
          "</span>" +
          "</br>";
        document.getElementById(
          "container-caption--alert-sheet"
        ).style.lineHeight = "2.5rem";
        for (let j = 0; j < items.length; j++) {
          items[j].className = "";
        }
        items[i].className = "selected-row";
        let selectedKPI = items[i].innerHTML;
        var KPIoptions = {
          method: "POST",
          body: JSON.stringify({ selectedKPI: selectedKPI }),
          credentials: "same-origin",
          cache: "no-cache",
          headers: new Headers({
            "content-type": "application/json",
          }),
        };

        let uri = IP + "loadAlertedKPIData";
        fetch(uri, KPIoptions).then(function (response) {
          response.json().then(function (alertedKPI) {
            // console.log(alertedKPI);
            // Fill the ALERT SHEET
            if (userData.status == "Superviseur") {
              if (alertedKPI.state == 1) {
                document.querySelector(".alert-sheet").style.boxShadow =
                  "0px 0px 10px 5px var(--color-yellow)";
                document.querySelector(
                  ".alert-params--action"
                ).style.backgroundColor = "var(--color-yellow)";
                document.getElementById("action-field").disabled = false;
                document.getElementById("alert-params--conf").style.display =
                  "flex";
              } else {
                document.querySelector(".alert-sheet").style.boxShadow =
                  "0px 0px 10px 5px var(--color-yellow)";
                document.querySelector(
                  ".alert-params--action"
                ).style.backgroundColor = "var(--color-blueMode2)";
                document.getElementById("action-field").disabled = true;
                document.getElementById("alert-params--conf").style.display =
                  "none";
                // document.getElementById("notif--icon").className =
                //   "notif--icon ";
                notification(
                  "notifContF2FI",
                  ".notifF2FI",
                  "Timedout - Look for your Manager",
                  5000
                );
              }
            } else if (userData.status == "Manager") {
              if (alertedKPI.state == 1) {
                if (alertedKPI.onWait == 1) {
                  document.getElementById("alert-params--conf").style.display =
                    "flex";
                } else {
                  document.getElementById("alert-params--conf").style.display =
                    "none";
                }
                document.querySelector(".alert-sheet").style.boxShadow =
                  "0px 0px 10px 5px var(--color-yellow)";
                document.querySelector(
                  ".alert-params--action"
                ).style.backgroundColor = "var(--color-yellow)";
                document.getElementById("action-field").disabled = true;
                // document.getElementById("notif--icon").className =
                //   "notif--icon ";

                notification(
                  "notifContF2FI",
                  ".notifF2FI",
                  "Supervisor is still taking action",
                  5000
                );
              } else if (alertedKPI.state == 2) {
                document.querySelector(".alert-sheet").style.boxShadow =
                  "0px 0px 10px 5px var(--color-orange)";
                document.querySelector(
                  ".alert-params--action"
                ).style.backgroundColor = "var(--color-orange)";
                document.getElementById("action-field").disabled = false;
                document.getElementById("alert-params--conf").style.display =
                  "flex";
              } else {
                document.querySelector(".alert-sheet").style.boxShadow =
                  "0px 0px 10px 5px var(--color-red)";
                document.querySelector(
                  ".alert-params--action"
                ).style.backgroundColor = "var(--color-blueMode2)";
                document.getElementById("action-field").disabled = true;
                document.getElementById("alert-params--conf").style.display =
                  "none";
                // document.getElementById("notif--icon").className =
                //   "notif--icon ";

                notification(
                  "notifContF2FI",
                  ".notifF2FI",
                  "Timedout - Wait for the PLANT or DEPUTY Manager",
                  5000
                );
              }
              // Insert The director champs HERE
            } else {
              if (alertedKPI.state == 1) {
                document.querySelector(".alert-sheet").style.boxShadow =
                  "0px 0px 10px 5px var(--color-yellow)";
                document.querySelector(
                  ".alert-params--action"
                ).style.backgroundColor = "var(--color-yellow)";
                document.getElementById("action-field").disabled = false;
                document.getElementById("alert-params--conf").style.display =
                  "flex";
              } else if (alertedKPI.state == 2) {
                document.querySelector(".alert-sheet").style.boxShadow =
                  "0px 0px 10px 5px var(--color-orange)";
                document.querySelector(
                  ".alert-params--action"
                ).style.backgroundColor = "var(--color-orange)";
                document.getElementById("action-field").disabled = false;
                document.getElementById("alert-params--conf").style.display =
                  "flex";
              } else if (alertedKPI.state == 3) {
                document.querySelector(".alert-sheet").style.boxShadow =
                  "0px 0px 10px 5px var(--color-red)";
                document.querySelector(
                  ".alert-params--action"
                ).style.backgroundColor = "var(--color-red)";
                document.getElementById("action-field").disabled = false;
                document.getElementById("alert-params--conf").style.display =
                  "flex";
              }
            }
            if (alertedKPI.state == 1) {
              items[i].classList.add("yellowAlert");
            } else if (alertedKPI.state == 2) {
              items[i].classList.add("orangeAlert");
            } else if (alertedKPI.state == 3) {
              items[i].classList.add("redAlert");
            }
            if (alertedKPI.onWait == 0) {
              // document.getElementById("btnOnWait").style.opacity = "1";
              // document.getElementById("btnOnWait").style.visibility =
              //   "visible";
              document.getElementById("btnOnWait").innerHTML = "Done";
              document
                .getElementById("btnOnWait")
                .classList.remove("btnOnWaitClicked");
            } else {
              // document.getElementById("btnOnWait").style.opacity = "0";
              // setTimeout(function () {
              //   document.getElementById("btnOnWait").style.visibility =
              //     "hidden";
              // }, 500);
              document
                .getElementById("btnOnWait")
                .classList.add("btnOnWaitClicked");
              document.getElementById("btnOnWait").innerHTML = "Undone";
              document.querySelector(".alert-sheet").style.boxShadow =
                "0px 0px 10px 5px var(--color-blueMode2)";
              document.querySelector(
                ".alert-params--action"
              ).style.backgroundColor = "var(--color-blueMode2)";
              document.getElementById("action-field").value = "";
              document.getElementById("action-field").disabled = true;
            }

            if (alertedKPI.Validated == 1) {
              document.querySelector(".alert-sheet").style.boxShadow =
                "0px 0px 10px 5px var(--color-lightGreen)";
              document.querySelector(
                ".alert-params--action"
              ).style.backgroundColor = "var(--color-lightGreen)";
              document.getElementById("action-field").value = "";
              document.getElementById("action-field").disabled = true;
              document.getElementById("alert-params--conf").style.display =
                "none";
            } else if (alertedKPI.Validated == 0) {
              console.log("waaaaaaaa mamvalideesh");
              if (
                userData["status"] == "Director" ||
                userData["status"] == "Deputy Manager" ||
                userData["status"] == "FES"
              ) {
                document.getElementById("btnDirectorValidate").style.opacity =
                  "1";
                document.getElementById(
                  "btnDirectorValidate"
                ).style.visibility = "visible";
              }
              document.getElementById("alert-params--conf").style.opacity = "1";
              document.getElementById("alert-params--conf").style.animation =
                "zoomInDown 1s ease-out";
            }
          });
        });
        let uriSheet = IP + "fillAlertSheet";
        const constHtmlAction =
          '<span class="light-bold">Action Decided:</span>';
        const constHtmlExpected =
          '<span class="light-bold">Expected Time:</span>';
        const constHtmlDate =
          '<span class="light-bold">Date:</span> yyyy/mm/dd';

        let newActionHtml1 = document.getElementById("alert-sheet-action--1");
        let newActionHtml2 = document.getElementById("alert-sheet-action--2");
        let newActionHtml3 = document.getElementById("alert-sheet-action--3");
        let expectedTimeHtml1 = document.getElementById(
          "alert-sheet-expectedTime--1"
        );
        let expectedTimeHtml2 = document.getElementById(
          "alert-sheet-expectedTime--2"
        );
        let expectedTimeHtml3 = document.getElementById(
          "alert-sheet-expectedTime--3"
        );
        let dateHtml1 = document.getElementById("alert-sheet-date--1");
        let dateHtml2 = document.getElementById("alert-sheet-date--2");
        let dateHtml3 = document.getElementById("alert-sheet-date--3");
        fetch(uriSheet, KPIoptions).then(function (response) {
          response.json().then(function (alertedKPIinfo) {
            resetAlertSheet(
              newActionHtml1,
              newActionHtml2,
              newActionHtml3,
              expectedTimeHtml1,
              expectedTimeHtml2,
              expectedTimeHtml3,
              dateHtml1,
              dateHtml2,
              dateHtml3,
              constHtmlAction,
              constHtmlExpected,
              constHtmlDate
            );
            for (let info of alertedKPIinfo) {
              if (info.state == 1) {
                newActionHtml1.innerHTML =
                  constHtmlAction + "<br>" + info.action + "</br>";
                expectedTimeHtml1.innerHTML =
                  constHtmlExpected + " " + info.expectedTime;
                dateHtml1.innerHTML =
                  '<span class="light-bold">Date:</span> ' + info.dateHour;
              } else if (info.state == 2) {
                newActionHtml2.innerHTML =
                  constHtmlAction + "<br>" + info.action + "</br>";
                expectedTimeHtml2.innerHTML =
                  constHtmlExpected + " " + info.expectedTime;
                dateHtml2.innerHTML =
                  '<span class="light-bold">Date:</span> ' + info.dateHour;
              } else if (info.state == 3) {
                newActionHtml3.innerHTML =
                  constHtmlAction + "<br>" + info.action + "</br>";
                expectedTimeHtml3.innerHTML =
                  constHtmlExpected + " " + info.expectedTime;
                dateHtml3.innerHTML =
                  '<span class="light-bold">Date:</span> ' + info.dateHour;
              }
            }
          });
        });
      };
    }
  }, 100);
}

const IP = "http://127.0.0.1:5000/";
// __________________________________________________________

window.addEventListener("load", function () {
  document.querySelector(".trans").style.display = "block";
  document.querySelector(".faurTrans").style.visibility = "visible";
  setTimeout(() => {
    document.querySelector(".EntryTrans").style.width = "0%";
    document.querySelector(".trans--new-window").style.visibility = "hidden";
  }, 300);
  setTimeout(() => {
    document.querySelector(".trans").style.display = "flex";
  }, 3000);
  let status = loadUserInfo().status;
  let userFullName = loadUserInfo().fullName.split(" ");
  let htmlData = "";
  for (let i = 0; i < userFullName.length; i++) {
    if (i == 0) {
      htmlData = '<span class="pink-faurecia">' + userFullName[0] + " </span>";
    } else {
      htmlData += userFullName[i] + " ";
    }
  }
  document.getElementById("userFullName").innerHTML = htmlData;
  console.log(userFullName);

  if (status == "Manager") {
    document.getElementById("TS-nav").style.display = "none";
    document.getElementById("PARAM-nav").style.display = "none";
  }
  if (status == "Superviseur") {
    document.getElementById("TS-nav").style.display = "none";
    document.getElementById("PARAM-nav").style.display = "none";
  }
  if (status == "Director" || status == "Deputy Manager") {
    document.getElementById("PARAM-nav").style.display = "none";
  }
  document.getElementById("DB-nav").style.display = "none";

  email = loadUserInfo("email");
  // _________________FILL UAP DROPBOX__________________________
  let UAP = document.getElementById("dropSelectedItemUAP").innerHTML;
  let project = document.getElementById("dropSelectedItemProject").innerHTML;
  let indicator = document.getElementById(
    "dropSelectedItemIndicator"
  ).innerHTML;

  let uri = IP + "manConKPItofollow";
  let options = {
    method: "POST",
    body: JSON.stringify({
      UAP: UAP,
      project: project,
      indicator: indicator,
    }),
    credentials: "same-origin",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  };
  fetch(uri, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let dataHTML = "";
      for (elm of data.UAP) {
        dataHTML += '<div class="elm">' + elm + "</div>";
      }
      document.getElementById("dropContentUAP").innerHTML = dataHTML;
      document.getElementById("dropContentUAPemp").innerHTML = dataHTML;
      document.getElementById("dropContentproUAP").innerHTML = dataHTML;

      let dataHTMLproject = "";
      for (elm of data.Projects) {
        dataHTMLproject += '<div class="elm">' + elm + "</div>";
      }
      document.getElementById("dropContentProject").innerHTML = dataHTMLproject;

      let dataHTMLindicator = "";
      for (elm of data.Indicators) {
        dataHTMLindicator += '<div class="elm">' + elm + "</div>";
      }
      document.getElementById("dropContentIndicator").innerHTML =
        dataHTMLindicator;
    });
  // FILL REALTIME KPI FIELD
  uri = IP + "loadRealtimeKPI";
  options = {
    method: "POST",
    body: JSON.stringify({
      rtList: "nothing here",
    }),
    credentials: "same-origin",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  };

  fetch(uri, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.KPIname);
      let KPIname = data.KPIname;
      document.querySelector("#realtimeKPI-content tbody").innerHTML = "";
      for (let kpi of KPIname) {
        document.querySelector("#realtimeKPI-content tbody").innerHTML +=
          "<tr><td>" + kpi + "</td></tr>";
      }

      var realtimeKPI = document.querySelectorAll("#realtimeKPI-content tr");
      for (let i = 0; i < KPIname.length; i++) {
        console.log(data.criticals);
        console.log(data.criticals[i]);
        if (data.criticals[i] == 1) {
          realtimeKPI[i].classList.toggle("selected-reaktimeKPI");
        }
      }
    });
  // GET PROJECT LIST FOR NEW INDICATORS
  uri = IP + "loadingInfos";
  fetch(uri, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let dataHTMLprojectList = "";
      for (elm of data.projectList) {
        dataHTMLprojectList += '<div class="elm">' + elm + "</div>";
      }
      document.getElementById("dropContentKPIpro").innerHTML =
        dataHTMLprojectList;
    });

  // FILL SUPERVISOR's EMAIL LIST
  uri = IP + "loadingInfos";
  fetch(uri, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var supList = document.querySelectorAll("#supervisor-list-content tr");
      let dataHTMLsupervisorsList = "";
      for (elm of data.supervisorsList) {
        dataHTMLsupervisorsList += "<tr><td>" + elm + "</td></tr>";
      }
      document.querySelector("#supervisor-list-content tbody").innerHTML =
        dataHTMLsupervisorsList;
    });

  // FILL TOUR SHEET DATES LIST
  fetch(uri, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let dataHTMLsheetDates = "";
      for (elm of data.sheetDates) {
        dataHTMLsheetDates += '<div class="elm">' + elm + "</div>";
      }
      document.getElementById("dropContentSheetDates").innerHTML =
        dataHTMLsheetDates;

      document.getElementById("dropSelectedItemSheetDates").innerHTML =
        data.maxSheetDate;
    });
});

window.onclick = function () {
  if (!event.target.matches(".dropBtn")) {
    disapear("dropBtnUAP", "dropContentUAP");
    disapear("dropBtnProject", "dropContentProject");
    disapear("dropBtnIndicator", "dropContentIndicator");
    disapear("dropBtnStatus", "dropContentStatus");
    disapear("dropBtnUAPemp", "dropContentUAPemp");
    disapear("dropBtnDepartement", "dropContentDepartement");
    disapear("dropBtnproUAP", "dropContentproUAP");
    disapear("dropBtnKPItype", "dropContentKPItype");
    disapear("dropBtnKPIpro", "dropContentKPIpro");
    disapearUp("dropBtnSheetDates", "dropContentSheetDates");
  }
  setTimeout(() => {
    var realtimeKPI = document.querySelectorAll("#realtimeKPI-content tr");
    for (let i = 0; i < realtimeKPI.length; i++) {
      realtimeKPI[i].ondblclick = function () {
        console.log(realtimeKPI[i].innerHTML);
        realtimeKPI[i].remove();
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
        // ____________________________________
      };
      realtimeKPI[i].onclick = function () {
        console.log(realtimeKPI[i].innerHTML);
        realtimeKPI[i].classList.toggle("selected-reaktimeKPI");
      };
    }

    var WCIDs = document.querySelectorAll("#WCID-list-content tr");
    for (let i = 0; i < WCIDs.length; i++) {
      WCIDs[i].ondblclick = function () {
        console.log(WCIDs[i].innerHTML);
        WCIDs[i].remove();
      };
    }

    var supervisors = document.querySelectorAll(
      "#supervisor-list-content tr td"
    );
    for (let i = 0; i < supervisors.length; i++) {
      supervisors[i].onclick = function () {
        console.log(supervisors[i].innerHTML);
        supervisors[i].classList.toggle("selected-supervisor");
      };
    }
  }, 100);
};

// _____________________________________________________________________________________________________________

document.getElementById("btnStart-icon").addEventListener("click", function () {
  // document.querySelector(".blackedIn").style.filter = "blur(8px)";
  blurAll(8);
  document.querySelector(".F2FI-nav").style.opacity = "1";
  document.querySelector(".F2FI-nav").style.visibility = "visible";
  document.querySelector(".nav-elm").style.animation =
    "notifRightPopup 0.3s ease-out";
  setTimeout(() => {
    document.querySelector(".nav-elm").style.animation = "";
  }, 300);
});

document.getElementById("F2FI-nav").addEventListener("click", function () {
  // document.querySelector(".blackedIn").style.filter = "blur(0)";
  unBlurAll();
  document.querySelector(".F2FI-nav").style.opacity = "0";
  document.querySelector(".F2FI-nav").style.visibility = "hidden";
  document.querySelector(".nav-elm").style.animation =
    "notifLeftPopdown 0.3s ease-in";
  setTimeout(() => {
    document.querySelector(".nav-elm").style.animation = "";
  }, 300);
});

document.getElementById("nav-elm").addEventListener("click", function (e) {
  e.preventDefault();
});

// _____________________________________________________________________________________________________________
// _____________________________________________________________________________________________________________

// Filling the FACE TO FACE BOARD
function closeAll() {
  if (
    document
      .getElementById("Face2Face-content")
      .classList.contains("FEAMshowJack")
  ) {
    document
      .getElementById("Face2Face-content")
      .classList.remove("FEAMshowJack");
  }
  if (
    document
      .getElementById("alertBoard-content")
      .classList.contains("FEAMshowJack")
  ) {
    document
      .getElementById("alertBoard-content")
      .classList.remove("FEAMshowJack");
  }
  if (
    document
      .getElementById("dashBoard-content")
      .classList.remove("FEAMshowJack")
  ) {
    document
      .getElementById("dashBoard-content")
      .classList.remove("FEAMshowJack");
  }
  if (document.getElementById("tourSheet").classList.remove("FEAMshowJack")) {
    document.getElementById("tourSheet").classList.remove("FEAMshowJack");
  }
  if (
    document.getElementById("settings-content").classList.remove("FEAMshowJack")
  ) {
    document
      .getElementById("settings-content")
      .classList.remove("FEAMshowJack");
  }
}
document.getElementById("Face2Face-nav").addEventListener("click", function () {
  // console.log(new Date().getTime());

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var timeHour = today.getHours();
  var timeMinutes = today.getMinutes();
  console.log(timeHour);

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! DO NOT FORGET TO MAKE IT STOP AT 9H00 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! reFILL KPI's PROJECTS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // Check if it's the FACE TO FACE TIME
  if (timeHour < 9 && timeHour > 0 && timeMinutes < 1) {
    // document.getElementById("notif--icon").className = "notif--icon";
    notification(
      "notifContF2FI",
      ".notifF2FI",
      "FACE TO FACE will be available at 09h00",
      5000
    );
  } else {
    closeAll();
    console.log("closed");
    document.querySelector(".bg--inF2F").style.filter = "blur(2px)";
    console.log("filster");
    document.getElementById("Face2Face-content").style.opacity = "1";
    document
      .getElementById("Face2Face-content")
      .classList.toggle("FEAMshowJack");
    // document.querySelector(".Face2Face-content").style.display = "flex";
    // document.querySelector(".Face2Face-content").style.animation =
    //   "Opening 0.7s ease-out";
    // setTimeout(() => {
    //   document.querySelector(".Face2Face-content").style.animation = "";
    // }, 700);
    // document.querySelector(".Face2Face-content").style.visibility = "visible";
    // document.querySelector(".Face2Face-content").style.opacity = "1";

    userInfo = loadUserInfo("all");
    var options = {
      method: "POST",
      body: JSON.stringify({ userInfo: userInfo }),
      credentials: "same-origin",
      cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json",
      }),
    };
    const tableBody = document.getElementById("F2F-data");
    let dataHtml = "";

    let uri = IP + "loadF2F";
    fetch(uri, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length == 0) {
          notification(
            "notifContF2FI",
            ".notifF2FI",
            "You don't have KPIs to Follow"
          );
        }
        for (let elm of data) {
          dataHtml +=
            "<tr><td>" +
            elm.IDKPI +
            "</td>" +
            "<td>" +
            elm.KPIName +
            "</td>" +
            "<td>" +
            elm.Criteria +
            "</td>" +
            "<td>" +
            elm.STD +
            "</td>" +
            "<td>" +
            elm.STD +
            "</td>";
          if (elm.RRN1 == "X") {
            dataHtml +=
              '<td><input type="checkbox" class="RRLast24h" id="RRN1' +
              elm.IDKPI +
              '" /></td>';
          } else if (elm.RRN1 == "O") {
            dataHtml +=
              '<td><input type="checkbox" class="RRLast24h" id="RRN1' +
              elm.IDKPI +
              '" checked /></td>';
          }
          if (elm.RRN == "X") {
            dataHtml +=
              '<td><input type="checkbox" class="RRLast24h" id="RRN' +
              elm.IDKPI +
              '" /></td>';
          } else if (elm.RRN == "O") {
            dataHtml +=
              '<td><input type="checkbox" class="RRLast24h" id="RRN' +
              elm.IDKPI +
              '" checked /></td>';
          }
          dataHtml += "<td>" + elm.Action + "</td>" + "</tr>";
        }

        tableBody.innerHTML = dataHtml;
      });
  }
});

// Saving Face to Face board State
document.getElementById("F2FSaveBtn").addEventListener("click", function () {
  email = loadUserInfo("email");
  var IDKPI, RRN1, idRRN1, RRN, idRRN, KPIinfos, options;
  KPIinfos = [];
  let uri = IP + "saveF2FChange";
  var F2Fdata = document.getElementById("F2F-data"),
    F2Fdatarow;

  for (i = 0; i < F2Fdata.childNodes.length; i++) {
    F2Fdatarow = F2Fdata.childNodes[i];
    IDKPI = F2Fdatarow.childNodes[0].innerHTML;
    idRRN1 = F2Fdatarow.childNodes[5].childNodes[0].id;
    idRRN = F2Fdatarow.childNodes[6].childNodes[0].id;

    if (document.getElementById(idRRN1).checked) {
      RRN1 = "O";
    } else {
      RRN1 = "X";
    }

    if (document.getElementById(idRRN).checked) {
      RRN = "O";
    } else {
      RRN = "X";
    }

    KPIinfos.push({ IDKPI: IDKPI, RRN1: RRN1, RRN: RRN });
  }

  options = {
    method: "POST",
    body: JSON.stringify(KPIinfos),
    credentials: "same-origin",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  };

  fetch(uri, options).then(function (response) {
    response.json().then(function (data) {
      console.log(data.message);
    });
  });

  // document.getElementById("notif--icon").className =
  //   "notif--icon notif--success";
  notification("notifContF2FI", ".notifF2FI", "Saved Successfully", 3000, 1);
});

// Face2Face close button

document.getElementById("F2F-close").addEventListener("click", function () {
  // document.querySelector('.Face2Face-content').style.animation = 'getOut 1s ease-out';
  // document.querySelector('.Face2Face-content').style.opacity = '0';
  // document.querySelector('.Face2Face-content').style.animation = 'getOut 0.5s ease-in';

  closeWindow("Face2Face-content");

  // document.getElementById("Face2Face-content").style.opacity = "0";
  // setTimeout(() => {
  //   document
  //     .getElementById("Face2Face-content")
  //     .classList.toggle("FEAMshowJack");
  // }, 200);
  document.querySelector(".bg--inF2F").style.filter = "blur(0)";

  // document.querySelector(".Face2Face-content").style.opacity = "0";
  // setTimeout(() => {
  //   document.querySelector(".Face2Face-content").style.visibility = "hidden";
  //   document.querySelector(".Face2Face-content").style.display = "none";
  // }, 500);
});

// _____________________________________________________________________________________________________________

// Loading DashBoard

document.getElementById("DB-nav").addEventListener("click", function () {
  // closeAllWindows(".dashBoard-content");
  // document.getElementById();
  closeAll();
  document.querySelector(".bg--inF2F").style.filter = "blur(2px)";
  document.getElementById("dashBoard-content").style.opacity = "1";
  document.getElementById("dashBoard-content").classList.toggle("FEAMshowJack");
  var project = "selected project";

  let uri = IP + "loadDashBoard";
  projects = ["P001", "P012", "P018", "P005"];
  projectName = ["COUPE", "W10", "P24AR", "HFE"];
  for (let i = 0; i < 4; i++) {
    var options = {
      method: "POST",
      body: JSON.stringify({ project: projects[i] }),
      credentials: "same-origin",
      cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json",
      }),
    };
    fetch(uri, options).then(function (response) {
      response.json().then(function (data) {
        console.log(data);
        let pred = [];
        let act = [null, null, null, null, null, null];
        let actdata = data.dataAct;
        // for (elm of data.dataAct) {
        //   pred.push(null);
        // }
        for (let i = 0; i < data.dataAct.length - 1; i++) {
          pred.push(null);
        }

        for (elm of data.dataForecast) {
          pred.push(elm);
        }
        for (elm of act) {
          actdata.push(elm);
        }
        console.log(pred);
        console.log(data.dataAct);
        var chartoptions = {
          series: [
            {
              name: "Actual",
              data: actdata,
            },
            {
              name: "Prediction",
              data: pred,
            },
          ],
          chart: {
            type: "area",
            stacked: false,
            height: 300,
            zoom: {
              enabled: true,
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 0,
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.45,
              opacityTo: 0.05,
              stops: [20, 100, 100, 100],
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: "#8e8da4",
              },
              offsetX: 0,
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          labels: data.labels,
          xaxis: {
            type: "datetime",
            tickAmount: 8,
            axisBorder: {
              show: false,
            },

            // min: new Date("01/01/2014").getTime(),
            // max: new Date("01/20/2014").getTime(),
            labels: {
              rotate: -15,
              rotateAlways: true,
              data: data.labels,
            },
          },
          title: {
            text: projectName[i] + " EVOLUTION",
            align: "left",
            offsetX: 14,
          },
          tooltip: {
            shared: true,
          },
          legend: {
            position: "top",
            horizontalAlign: "right",
            offsetX: -10,
          },
        };
        // document.querySelector("#db--graph" + i + 1);

        // let chartContainer = document.getElementById("db--graph1");
        if (i == 0) {
          var chart1 = new ApexCharts(
            document.querySelector("#db--graph1"),
            chartoptions
          );
          setTimeout(() => {
            chart1.render();
          }, 500);
        } else if (i == 1) {
          var chart2 = new ApexCharts(
            document.querySelector("#db--graph2"),
            chartoptions
          );
          setTimeout(() => {
            chart2.render();
          }, 500);
        } else if (i == 2) {
          var chart3 = new ApexCharts(
            document.querySelector("#db--graph3"),
            chartoptions
          );
          setTimeout(() => {
            chart3.render();
          }, 500);
        } else if (i == 3) {
          var chart4 = new ApexCharts(
            document.querySelector("#db--graph4"),
            chartoptions
          );
          setTimeout(() => {
            chart4.render();
          }, 500);
        }
      });
    });
  }
});

document.getElementById("btnCloseDB").addEventListener("click", function () {
  closeWindow("dashBoard-content");
  document.querySelector(".bg--inF2F").style.filter = "blur(0)";
});

// _______________________________________________________________________________________

// Load Alert Board
document.getElementById("AB-nav").addEventListener("click", function () {
  // closeAllWindows(".alertBoard-content");
  closeAll();
  document.querySelector(".bg--inF2F").style.filter = "blur(2px)";
  document.getElementById("alertBoard-content").style.opacity = "1";
  document
    .getElementById("alertBoard-content")
    .classList.toggle("FEAMshowJack");
  userData = loadUserInfo();
  console.log(userData);
  console.log(userData);
  if (userData.status == "Superviseur" || userData.status == "Manager") {
    document.getElementById("btnDirectorValidate").style.visibility = "hidden";
  }
  let options = {
    method: "POST",
    body: JSON.stringify(userData),
    credentials: "same-origin",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  };
  let uri = IP + "loadAlertBoardData";

  const KPIlist = document.getElementById("KPIlist-Alerted");
  let olddataHtml = "";
  //
  fillAlertBoard(uri, options, olddataHtml, KPIlist);
  //
  // boucle for making requests to get alerted KPIs
  var inter = setInterval(function () {
    fetch(uri, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        let dataHtml = "";
        for (let elm of data) {
          dataHtml += "<tr><td>" + elm.alertedKPI + "</td></tr>";
        }
        if (olddataHtml != dataHtml) {
          olddataHtml = dataHtml;
          KPIlist.innerHTML = dataHtml;
        }
      });
    setTimeout(() => {
      var items = document.querySelectorAll("#KPIlist-Alerted tr td");

      for (let i = 0; i < items.length; i++) {
        items[i].onclick = function () {
          document.getElementById("action-field").value = "";
          document.getElementById("container-caption--alert-sheet").innerHTML =
            "ALERT: " +
            "<br>" +
            '<span class="light-bold" style="font-size:2rem">' +
            items[i].innerHTML +
            "</span>" +
            "</br>";
          document.getElementById(
            "container-caption--alert-sheet"
          ).style.lineHeight = "2.5rem";
          for (let j = 0; j < items.length; j++) {
            items[j].className = "";
          }
          items[i].className = "selected-row";
          let selectedKPI = items[i].innerHTML;
          var KPIoptions = {
            method: "POST",
            body: JSON.stringify({ selectedKPI: selectedKPI }),
            credentials: "same-origin",
            cache: "no-cache",
            headers: new Headers({
              "content-type": "application/json",
            }),
          };

          let uri = IP + "loadAlertedKPIData";
          fetch(uri, KPIoptions).then(function (response) {
            response.json().then(function (alertedKPI) {
              // console.log(alertedKPI);
              // Fill the ALERT SHEET
              if (userData.status == "Superviseur") {
                if (alertedKPI.state == 1) {
                  document.querySelector(".alert-sheet").style.boxShadow =
                    "0px 0px 10px 5px var(--color-yellow)";
                  document.querySelector(
                    ".alert-params--action"
                  ).style.backgroundColor = "var(--color-yellow)";
                  document.getElementById("action-field").disabled = false;
                  document.getElementById("alert-params--conf").style.display =
                    "flex";
                } else {
                  document.querySelector(".alert-sheet").style.boxShadow =
                    "0px 0px 10px 5px var(--color-yellow)";
                  document.querySelector(
                    ".alert-params--action"
                  ).style.backgroundColor = "var(--color-blueMode2)";
                  document.getElementById("action-field").disabled = true;
                  document.getElementById("alert-params--conf").style.display =
                    "none";
                  // document.getElementById("notif--icon").className =
                  //   "notif--icon ";
                  notification(
                    "notifContF2FI",
                    ".notifF2FI",
                    "Timedout - Look for your Manager",
                    5000
                  );
                }
              } else if (userData.status == "Manager") {
                if (alertedKPI.state == 1) {
                  if (alertedKPI.onWait == 1) {
                    document.getElementById(
                      "alert-params--conf"
                    ).style.display = "flex";
                  } else {
                    document.getElementById(
                      "alert-params--conf"
                    ).style.display = "none";
                  }
                  document.querySelector(".alert-sheet").style.boxShadow =
                    "0px 0px 10px 5px var(--color-yellow)";
                  document.querySelector(
                    ".alert-params--action"
                  ).style.backgroundColor = "var(--color-yellow)";
                  document.getElementById("action-field").disabled = true;
                  // document.getElementById("notif--icon").className =
                  //   "notif--icon ";

                  notification(
                    "notifContF2FI",
                    ".notifF2FI",
                    "Supervisor is still taking action",
                    5000
                  );
                } else if (alertedKPI.state == 2) {
                  document.querySelector(".alert-sheet").style.boxShadow =
                    "0px 0px 10px 5px var(--color-orange)";
                  document.querySelector(
                    ".alert-params--action"
                  ).style.backgroundColor = "var(--color-orange)";
                  document.getElementById("action-field").disabled = false;
                  document.getElementById("alert-params--conf").style.display =
                    "flex";
                } else {
                  document.querySelector(".alert-sheet").style.boxShadow =
                    "0px 0px 10px 5px var(--color-red)";
                  document.querySelector(
                    ".alert-params--action"
                  ).style.backgroundColor = "var(--color-blueMode2)";
                  document.getElementById("action-field").disabled = true;
                  document.getElementById("alert-params--conf").style.display =
                    "none";
                  // document.getElementById("notif--icon").className =
                  //   "notif--icon ";

                  notification(
                    "notifContF2FI",
                    ".notifF2FI",
                    "Timedout - Wait for the PLANT or DEPUTY Manager",
                    5000
                  );
                }
                // Insert The director champs HERE
              } else {
                if (alertedKPI.state == 1) {
                  document.querySelector(".alert-sheet").style.boxShadow =
                    "0px 0px 10px 5px var(--color-yellow)";
                  document.querySelector(
                    ".alert-params--action"
                  ).style.backgroundColor = "var(--color-yellow)";
                  document.getElementById("action-field").disabled = false;
                  document.getElementById("alert-params--conf").style.display =
                    "flex";
                } else if (alertedKPI.state == 2) {
                  document.querySelector(".alert-sheet").style.boxShadow =
                    "0px 0px 10px 5px var(--color-orange)";
                  document.querySelector(
                    ".alert-params--action"
                  ).style.backgroundColor = "var(--color-orange)";
                  document.getElementById("action-field").disabled = false;
                  document.getElementById("alert-params--conf").style.display =
                    "flex";
                } else if (alertedKPI.state == 3) {
                  document.querySelector(".alert-sheet").style.boxShadow =
                    "0px 0px 10px 5px var(--color-red)";
                  document.querySelector(
                    ".alert-params--action"
                  ).style.backgroundColor = "var(--color-red)";
                  document.getElementById("action-field").disabled = false;
                  document.getElementById("alert-params--conf").style.display =
                    "flex";
                }
              }
              if (alertedKPI.state == 1) {
                items[i].classList.add("yellowAlert");
              } else if (alertedKPI.state == 2) {
                items[i].classList.add("orangeAlert");
              } else if (alertedKPI.state == 3) {
                items[i].classList.add("redAlert");
              }
              if (alertedKPI.onWait == 0) {
                // document.getElementById("btnOnWait").style.opacity = "1";
                // document.getElementById("btnOnWait").style.visibility =
                //   "visible";
                document.getElementById("btnOnWait").innerHTML = "Done";
                document
                  .getElementById("btnOnWait")
                  .classList.remove("btnOnWaitClicked");
              } else {
                // document.getElementById("btnOnWait").style.opacity = "0";
                // setTimeout(function () {
                //   document.getElementById("btnOnWait").style.visibility =
                //     "hidden";
                // }, 500);
                document
                  .getElementById("btnOnWait")
                  .classList.add("btnOnWaitClicked");
                document.getElementById("btnOnWait").innerHTML = "Undone";
                document.querySelector(".alert-sheet").style.boxShadow =
                  "0px 0px 10px 5px var(--color-blueMode2)";
                document.querySelector(
                  ".alert-params--action"
                ).style.backgroundColor = "var(--color-blueMode2)";
                document.getElementById("action-field").value = "";
                document.getElementById("action-field").disabled = true;
              }

              if (alertedKPI.Validated == 1) {
                document.querySelector(".alert-sheet").style.boxShadow =
                  "0px 0px 10px 5px var(--color-lightGreen)";
                document.querySelector(
                  ".alert-params--action"
                ).style.backgroundColor = "var(--color-lightGreen)";
                document.getElementById("action-field").value = "";
                document.getElementById("action-field").disabled = true;
                document.getElementById("alert-params--conf").style.display =
                  "none";
              } else if (alertedKPI.Validated == 0) {
                console.log("waaaaaaaa mamvalideesh");
                if (
                  userData["status"] == "Director" ||
                  userData["status"] == "Deputy Manager" ||
                  userData["status"] == "FES"
                ) {
                  document.getElementById("btnDirectorValidate").style.opacity =
                    "1";
                  document.getElementById(
                    "btnDirectorValidate"
                  ).style.visibility = "visible";
                }
                document.getElementById("alert-params--conf").style.opacity =
                  "1";
                document.getElementById("alert-params--conf").style.animation =
                  "zoomInDown 1s ease-out";
              }
            });
          });
          let uriSheet = IP + "fillAlertSheet";
          const constHtmlAction =
            '<span class="light-bold">Action Decided:</span>';
          const constHtmlExpected =
            '<span class="light-bold">Expected Time:</span>';
          const constHtmlDate =
            '<span class="light-bold">Date:</span> yyyy/mm/dd';

          let newActionHtml1 = document.getElementById("alert-sheet-action--1");
          let newActionHtml2 = document.getElementById("alert-sheet-action--2");
          let newActionHtml3 = document.getElementById("alert-sheet-action--3");
          let expectedTimeHtml1 = document.getElementById(
            "alert-sheet-expectedTime--1"
          );
          let expectedTimeHtml2 = document.getElementById(
            "alert-sheet-expectedTime--2"
          );
          let expectedTimeHtml3 = document.getElementById(
            "alert-sheet-expectedTime--3"
          );
          let dateHtml1 = document.getElementById("alert-sheet-date--1");
          let dateHtml2 = document.getElementById("alert-sheet-date--2");
          let dateHtml3 = document.getElementById("alert-sheet-date--3");
          fetch(uriSheet, KPIoptions).then(function (response) {
            response.json().then(function (alertedKPIinfo) {
              resetAlertSheet(
                newActionHtml1,
                newActionHtml2,
                newActionHtml3,
                expectedTimeHtml1,
                expectedTimeHtml2,
                expectedTimeHtml3,
                dateHtml1,
                dateHtml2,
                dateHtml3,
                constHtmlAction,
                constHtmlExpected,
                constHtmlDate
              );
              for (let info of alertedKPIinfo) {
                if (info.state == 1) {
                  newActionHtml1.innerHTML =
                    constHtmlAction + "<br>" + info.action + "</br>";
                  expectedTimeHtml1.innerHTML =
                    constHtmlExpected + " " + info.expectedTime;
                  dateHtml1.innerHTML =
                    '<span class="light-bold">Date:</span> ' + info.dateHour;
                } else if (info.state == 2) {
                  newActionHtml2.innerHTML =
                    constHtmlAction + "<br>" + info.action + "</br>";
                  expectedTimeHtml2.innerHTML =
                    constHtmlExpected + " " + info.expectedTime;
                  dateHtml2.innerHTML =
                    '<span class="light-bold">Date:</span> ' + info.dateHour;
                } else if (info.state == 3) {
                  newActionHtml3.innerHTML =
                    constHtmlAction + "<br>" + info.action + "</br>";
                  expectedTimeHtml3.innerHTML =
                    constHtmlExpected + " " + info.expectedTime;
                  dateHtml3.innerHTML =
                    '<span class="light-bold">Date:</span> ' + info.dateHour;
                }
              }
            });
          });
        };
      }
    }, 100);
    if (
      !document
        .getElementById("alertBoard-content")
        .classList.contains("FEAMshowJack")
    ) {
      clearInterval(inter);
    }
  }, 10000);
});

document.getElementById("btnCloseAB").addEventListener("click", function () {
  closeWindow("alertBoard-content");
  document.querySelector(".bg--inF2F").style.filter = "blur(0)";
});

function closeWindow(idWindow) {
  document.getElementById(idWindow).style.opacity = "0";
  setTimeout(() => {
    document.getElementById(idWindow).classList.remove("FEAMshowJack");
  }, 200);
}

document.getElementById("btnTakeAction").addEventListener("click", function () {
  try {
    let KPIname = document.querySelector(".selected-row").innerHTML;
    let action = document.getElementById("action-field").value;
    let status = loadUserInfo().status;
    let state = document.querySelector(".alert-params--action").style
      .backgroundColor;
    if (state == "var(--color-yellow)") {
      state = 1;
    } else if (state == "var(--color-orange)") {
      state = 2;
    } else if (state == "var(--color-red)") {
      state = 3;
    } else {
      state = 0;
    }

    if (action == "") {
      notification(
        "notifContF2FI",
        ".notifF2FI",
        "Fill the Action field first"
      );
    } else {
      let uri = IP + "takeAction";
      let options = {
        method: "POST",
        body: JSON.stringify({
          KPIname: KPIname,
          action: action,
          state: state,
          status: status,
        }),
        credentials: "same-origin",
        cache: "no-cache",
        headers: new Headers({
          "content-type": "application/json",
        }),
      };

      const constHtmlAction = '<span class="light-bold">Action Decided:</span>';
      const constHtmlExpected =
        '<span class="light-bold">Expected Time:</span>';
      const constHtmlDate = '<span class="light-bold">Date:</span> yyyy/mm/dd';

      let newActionHtml1 = document.getElementById("alert-sheet-action--1");
      let newActionHtml2 = document.getElementById("alert-sheet-action--2");
      let newActionHtml3 = document.getElementById("alert-sheet-action--3");
      let expectedTimeHtml1 = document.getElementById(
        "alert-sheet-expectedTime--1"
      );
      let expectedTimeHtml2 = document.getElementById(
        "alert-sheet-expectedTime--2"
      );
      let expectedTimeHtml3 = document.getElementById(
        "alert-sheet-expectedTime--3"
      );
      let dateHtml1 = document.getElementById("alert-sheet-date--1");
      let dateHtml2 = document.getElementById("alert-sheet-date--2");
      let dateHtml3 = document.getElementById("alert-sheet-date--3");
      fetch(uri, options).then(function (response) {
        response.json().then(function (data) {
          if (data.Alert == "False") {
            state = data.state;
            if (state == 1) {
              newActionHtml1.innerHTML =
                constHtmlAction + "<br>" + action + "</br>";
              expectedTimeHtml1.innerHTML =
                constHtmlExpected + " " + data.expectedTime;
              dateHtml1.innerHTML =
                '<span class="light-bold">Date:</span> ' + data.dateHour;
            } else if (state == 2) {
              newActionHtml2.innerHTML =
                constHtmlAction + "<br>" + action + "</br>";
              expectedTimeHtml2.innerHTML =
                constHtmlExpected + " " + data.expectedTime;
              dateHtml2.innerHTML =
                '<span class="light-bold">Date:</span> ' + data.dateHour;
            } else if (state == 3) {
              newActionHtml3.innerHTML =
                constHtmlAction + "<br>" + action + "</br>";
              expectedTimeHtml3.innerHTML =
                constHtmlExpected + " " + data.expectedTime;
              dateHtml3.innerHTML =
                '<span class="light-bold">Date:</span> ' + data.dateHour;
            }
          } else {
            notification("notifContF2FI", ".notifF2FI", data.message);
          }
          document.getElementById("action-field").value = "";
        });
      });
    }
  } catch (e) {
    notification(
      "notifContF2FI",
      ".notifF2FI",
      "Select a KPI to take your action"
    );
  }
});

document.getElementById("btnOnWait").addEventListener("click", function () {
  try {
    let KPIName = document.querySelector(".selected-row").innerHTML;
    let selectedRow = document.querySelector(".selected-row");
    let btnOnWait = document.getElementById("btnOnWait");
    btnOnWait.classList.toggle("btnOnWaitClicked");
    let onWait;
    if (btnOnWait.classList.contains("btnOnWaitClicked")) {
      btnOnWait.innerHTML = "Undone";
      onWait = 1;
      document.querySelector(".alert-sheet").style.boxShadow =
        "0px 0px 10px 5px var(--color-blueMode2)";
      document.querySelector(".alert-params--action").style.backgroundColor =
        "var(--color-blueMode2)";
      document.getElementById("action-field").value = "";
      document.getElementById("action-field").disabled = true;
    } else {
      btnOnWait.innerHTML = "Done";
      onWait = 0;
      if (selectedRow.classList.contains("yellowAlert")) {
        document.querySelector(".alert-sheet").style.boxShadow =
          "0px 0px 10px 5px var(--color-yellow)";
        document.querySelector(".alert-params--action").style.backgroundColor =
          "var(--color-yellow)";
      } else if (selectedRow.classList.contains("orangeAlert")) {
        document.querySelector(".alert-sheet").style.boxShadow =
          "0px 0px 10px 5px var(--color-orange)";
        document.querySelector(".alert-params--action").style.backgroundColor =
          "var(--color-orange)";
      } else if (selectedRow.classList.contains("redAlert")) {
        document.querySelector(".alert-sheet").style.boxShadow =
          "0px 0px 10px 5px var(--color-red)";
        document.querySelector(".alert-params--action").style.backgroundColor =
          "var(--color-red)";
      }
      document.getElementById("action-field").disabled = false;
      document.getElementById("alert-params--conf").style.display = "flex";
    }

    // btnOnWait.style.animation = "getOut 0.5s ease-out";
    // btnOnWait.style.opacity = "0";
    // setTimeout(function () {
    //   btnOnWait.style.visibility = "hidden";
    // }, 500);

    let uri = IP + "onWaitAlert";
    let options = {
      method: "POST",
      body: JSON.stringify({ KPIName: KPIName, onWait: onWait }),
      credentials: "same-origin",
      cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json",
      }),
    };
    console.log(onWait);
    fetch(uri, options).then(function (response) {
      response.json().then(function (data) {
        console.log(data.message);
      });
    });
  } catch (e) {
    notification(
      "notifContF2FI",
      ".notifF2FI",
      "Select a KPI to put it on Wait for validation"
    );
  }
});

document
  .getElementById("btnDirectorValidate")
  .addEventListener("click", function () {
    try {
      const validate = 1;
      const KPIName = document.querySelector(".selected-row").innerHTML;
      let alertConf = document.getElementById("alert-params--conf");

      // let btnValidate = document.getElementById("btnDirectorValidate");

      // alertConf.style.animation = "bounceOut 1s ease-out";
      // alertConf.style.opacity = "0";
      alertConf.classList.add("validKPI");
      // setTimeout(function () {
      //   alertConf.style.visibility = "hidden";
      // }, 500);
      document.querySelector(".alert-sheet").style.boxShadow =
        "0px 0px 10px 5px var(--color-lightGreen)";
      document.querySelector(".alert-params--action").style.backgroundColor =
        "var(--color-lightGreen)";
      document.getElementById("action-field").value = "";
      document.getElementById("action-field").disabled = true;
      document.getElementById("alert-params--conf").style.opacity = "0";
      // document.getElementById("alert-params--conf").style.animation =
      //   "bounceOut 1s ease-out";
      // setInterval(() => {
      // document.getElementById("alert-params--conf").style.animation = "none";
      // document.getElementById("alert-params--conf").style.display = "none";
      // document.getElementById("alert-params--conf").style.opacity = "1";
      // }, 1000);

      let uri = IP + "validatedAlert";

      let options = {
        method: "POST",
        body: JSON.stringify({ KPIName: KPIName, validate: validate }),
        credentials: "same-origin",
        cache: "no-cache",
        headers: new Headers({
          "content-type": "application/json",
        }),
      };

      fetch(uri, options).then(function (response) {
        response.json().then(function (data) {
          console.log(data.message);
        });
      });
    } catch (e) {
      notification("notifContF2FI", ".notifF2FI", "Select a KPI to Validate");
    }
  });

// _________________________________________________________________________
// FEAM MANAGEMENT CONTROL

document.getElementById("PARAM-nav").addEventListener("click", function () {
  closeAll();
  document.querySelector(".bg--inF2F").style.filter = "blur(2px)";
  document.getElementById("settings-content").style.opacity = "1";
  document.getElementById("settings-content").classList.toggle("FEAMshowJack");
});

document.getElementById("setting-close").addEventListener("click", function () {
  closeWindow("settings-content");
  document.querySelector(".bg--inF2F").style.filter = "blur(0)";
  // document.getElementById("settings-content").style.opacity = "0";
  // setTimeout(() => {
  //   document
  //     .getElementById("settings-content")
  //     .classList.toggle("FEAMshowJack");
  // }, 200);
});

document
  .getElementById("dropBtnSheetDates")
  .addEventListener("click", function () {
    toggleDropContentUp("dropBtnSheetDates", "dropContentSheetDates");

    setTimeout(() => {
      let dropContent = document.getElementById(
        "dropContentSheetDates"
      ).childNodes;
      for (let i = 0; i < dropContent.length; i++) {
        dropContent[i].onclick = function () {
          document.getElementById("dropSelectedItemSheetDates").innerHTML =
            dropContent[i].innerHTML;

          let uri = IP + "loadTourSheet";
          let selectedDate = document.getElementById(
            "dropSelectedItemSheetDates"
          ).innerHTML;
          // let uri = IP + "loadTourSheet";
          let options = {
            method: "POST",
            body: JSON.stringify({ selectedDate: selectedDate }),
            credentials: "same-origin",
            cache: "no-cache",
            headers: new Headers({
              "content-type": "application/json",
            }),
          };

          let val = 0;
          let valComm = 0;
          fetch(uri, options)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              if (data.tourSheet.length == 0) {
                notification(
                  "notifContF2FI",
                  ".notifF2FI",
                  "Tour Sheet is empty for today !!"
                );
              } else {
                let diff = data.dateDiff;
                UAP = [];
                rep = [];
                UAPName = [];
                for (uap of data.infoUAP) {
                  UAP.push(uap[0]);
                  rep.push(uap[1]);
                  UAPName.push(uap[2]);
                }
                console.log(data.infoUAP);
                let dataHtml = "";
                document.querySelector(".tourSheet tbody").innerHTML = dataHtml;
                let commClassList = [];
                let commValuesList = [];
                for (let i = 0; i < UAP.length + 1; i++) {
                  uap = UAP[i];
                  repeated = rep[i];
                  console.log(uap, repeated);
                  val = 0;
                  valComm = 0;
                  for (let row of data.tourSheet) {
                    if (row.IDUAP == uap) {
                      console.log(repeated);
                      if (repeated == 1) {
                        dataHtml += "<tr><td>" + UAPName[i] + "</td>";
                        dataHtml +=
                          "<td>" +
                          row.IDKPI +
                          "</td>" +
                          "<td>" +
                          row.KPIName +
                          "</td>" +
                          "<td>" +
                          row.criteria +
                          "</td>";
                        if (row.STDdir == "X") {
                          if (diff == 1) {
                            dataHtml +=
                              '<td><input type="checkbox" disabled class="tabCheckBox" id="STDDir' +
                              row.IDKPI +
                              '"/></td>';
                          } else {
                            dataHtml +=
                              '<td><input type="checkbox" class="tabCheckBox" id="STDDir' +
                              row.IDKPI +
                              '"/></td>';
                          }
                        } else if (row.STDdir == "O") {
                          if (diff == 1) {
                            dataHtml +=
                              '<td><input type="checkbox" disabled class="tabCheckBox" checked id="STDDir' +
                              row.IDKPI +
                              '"/></td>';
                          } else {
                            dataHtml +=
                              '<td><input type="checkbox" class="tabCheckBox" checked id="STDDir' +
                              row.IDKPI +
                              '"/></td>';
                          }
                        }
                        if (row.RRdir == "X") {
                          if (diff == 1) {
                            dataHtml +=
                              '<td><input type="checkbox" disabled class="tabCheckBox" id="RRDir' +
                              row.IDKPI +
                              '"/></td>';
                          } else {
                            dataHtml +=
                              '<td><input type="checkbox" class="tabCheckBox" id="RRDir' +
                              row.IDKPI +
                              '"/></td>';
                          }
                        } else if (row.RRdir == "O") {
                          if (diff == 1) {
                            dataHtml +=
                              '<td><input type="checkbox" disabled class="tabCheckBox" checked id="RRDir' +
                              row.IDKPI +
                              '"/></td>';
                          } else {
                            dataHtml +=
                              '<td><input type="checkbox"  class="tabCheckBox" checked id="RRDir' +
                              row.IDKPI +
                              '"/></td>';
                          }
                        }

                        dataHtml +=
                          "<td>" +
                          '<input type="text" id="comment' +
                          row.IDKPI +
                          '">' +
                          "</td></tr>";

                        commClassList.push("comment" + row.IDKPI);
                        commValuesList.push(row.Comment);
                      } else {
                        if (val == 0) {
                          // console.log(repeated);
                          dataHtml +=
                            "<tr><td rowspan='" +
                            repeated +
                            "'>" +
                            UAPName[i] +
                            "</td>";
                          val = 1;
                        }
                        // console.log(row.KPIName);
                        dataHtml +=
                          "<td>" +
                          row.IDKPI +
                          "</td>" +
                          "<td>" +
                          row.KPIName +
                          "</td>" +
                          "<td>" +
                          row.criteria +
                          "</td>";
                        if (row.STDdir == "X") {
                          if (diff == 1) {
                            dataHtml +=
                              '<td><input type="checkbox" disabled class="tabCheckBox" id="STDDir' +
                              row.IDKPI +
                              '"/></td>';
                          } else {
                            dataHtml +=
                              '<td><input type="checkbox" class="tabCheckBox" id="STDDir' +
                              row.IDKPI +
                              '"/></td>';
                          }
                        } else if (row.STDdir == "O") {
                          if (diff == 1) {
                            dataHtml +=
                              '<td><input type="checkbox" disabled class="tabCheckBox" checked id="STDDir' +
                              row.IDKPI +
                              '"/></td>';
                          } else {
                            dataHtml +=
                              '<td><input type="checkbox" class="tabCheckBox" checked id="STDDir' +
                              row.IDKPI +
                              '"/></td>';
                          }
                        }
                        if (row.RRdir == "X") {
                          if (valComm == 0) {
                            if (diff == 1) {
                              dataHtml +=
                                '<td><input type="checkbox" disabled class="tabCheckBox" id="RRDir' +
                                row.IDKPI +
                                '"/></td>';
                            } else {
                              dataHtml +=
                                '<td><input type="checkbox" class="tabCheckBox" id="RRDir' +
                                row.IDKPI +
                                '"/></td>';
                            }
                          } else {
                            if (diff == 1) {
                              dataHtml +=
                                '<td><input type="checkbox" disabled class="tabCheckBox" id="RRDir' +
                                row.IDKPI +
                                '"/></td></tr>';
                            } else {
                              dataHtml +=
                                '<td><input type="checkbox" class="tabCheckBox" id="RRDir' +
                                row.IDKPI +
                                '"/></td></tr>';
                            }
                          }
                        } else if (row.RRdir == "O") {
                          if (valComm == 0) {
                            if (diff == 1) {
                              dataHtml +=
                                '<td><input type="checkbox" disabled class="tabCheckBox" checked id="RRDir' +
                                row.IDKPI +
                                '"/></td>';
                            } else {
                              dataHtml +=
                                '<td><input type="checkbox" class="tabCheckBox" checked id="RRDir' +
                                row.IDKPI +
                                '"/></td>';
                            }
                          } else {
                            if (diff == 1) {
                              dataHtml +=
                                '<td><input type="checkbox" disabled class="tabCheckBox" checked id="RRDir' +
                                row.IDKPI +
                                '"/></td></tr>';
                            } else {
                              dataHtml +=
                                '<td><input type="checkbox" class="tabCheckBox" checked id="RRDir' +
                                row.IDKPI +
                                '"/></td></tr>';
                            }
                          }
                        }
                        if (valComm == 0) {
                          dataHtml +=
                            "<td rowspan='" +
                            repeated +
                            "'>" +
                            '<input type="text" id="comment' +
                            row.IDKPI +
                            '">' +
                            "</td></tr>";

                          commClassList.push("comment" + row.IDKPI);
                          commValuesList.push(row.Comment);
                          valComm = 1;
                        }
                      }
                    }
                  }
                }
                document.querySelector(".tourSheet tbody").innerHTML = dataHtml;
                console.log(commClassList, commValuesList);
                for (let i = 0; i < commClassList.length; i++) {
                  document.getElementById(commClassList[i]).value =
                    commValuesList[i];
                  if (diff == 1) {
                    document.getElementById(commClassList[i]).disabled = true;
                    document.getElementById(commClassList[i]).style.color =
                      "gray";
                  }
                }
              }
            });
        };
      }
    }, 100);
  });

document.getElementById("dropBtnUAP").addEventListener("click", function () {
  let categorie = document.querySelector(".dropHeader--UAP").innerHTML;

  // let data = ["UAP1", "UAP2", "UAP3", "UAP4", "UAP5"];

  toggleDropContent("dropBtnUAP", "dropContentUAP");
  let UAP = document.getElementById("dropSelectedItemUAP").innerHTML;
  let project = document.getElementById("dropSelectedItemProject").innerHTML;
  let indicator = document.getElementById(
    "dropSelectedItemIndicator"
  ).innerHTML;
  setTimeout(() => {
    let dropContent = document.getElementById("dropContentUAP").childNodes;
    for (let i = 0; i < dropContent.length; i++) {
      dropContent[i].onclick = function () {
        document.getElementById("dropSelectedItemProject").innerHTML = "";
        document.getElementById("dropSelectedItemIndicator").innerHTML = "";

        document.getElementById("dropSelectedItemUAP").innerHTML =
          dropContent[i].innerHTML;

        let UAP = document.getElementById("dropSelectedItemUAP").innerHTML;
        let project = document.getElementById(
          "dropSelectedItemProject"
        ).innerHTML;
        let indicator = document.getElementById(
          "dropSelectedItemIndicator"
        ).innerHTML;

        let uri = IP + "manConKPItofollow";
        let options = {
          method: "POST",
          body: JSON.stringify({
            UAP: UAP,
            project: project,
            indicator: indicator,
          }),
          credentials: "same-origin",
          cache: "no-cache",
          headers: new Headers({
            "content-type": "application/json",
          }),
        };
        fetch(uri, options)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            let dataHTML = "";
            console.log(data);
            for (elm of data.Projects) {
              dataHTML += '<div class="elm">' + elm + "</div>";
            }
            document.getElementById("dropContentProject").innerHTML = dataHTML;

            let dataHTML2 = "";
            for (elm of data.Indicators) {
              dataHTML2 += '<div class="elm">' + elm + "</div>";
            }
            document.getElementById("dropContentIndicator").innerHTML =
              dataHTML2;
          });
      };
    }
  }, 100);
});

document
  .getElementById("dropBtnIndicator")
  .addEventListener("click", function () {
    let categorie = document.querySelector(".dropHeader--Indicator").innerHTML;
    console.log(categorie);

    toggleDropContent("dropBtnIndicator", "dropContentIndicator");

    setTimeout(() => {
      let dropContent = document.getElementById(
        "dropContentIndicator"
      ).childNodes;
      for (let i = 0; i < dropContent.length; i++) {
        dropContent[i].onclick = function () {
          document.getElementById("dropSelectedItemIndicator").innerHTML =
            dropContent[i].innerHTML;

          let existingList = document.querySelectorAll(
            "#realtimeKPI-content tr td"
          );
          let v = 0;
          for (let j = 0; j < existingList.length; j++) {
            if (dropContent[i].innerHTML == existingList[j].innerHTML) {
              // document.getElementById("notif--icon").className = "notif--icon";
              notification("notifContF2FI", ".notifF2FI", "Already Exists");
              v = 1;
            }
          }
          if (v == 0) {
            document.querySelector("#realtimeKPI-content tbody").innerHTML +=
              "<tr><td>" + dropContent[i].innerHTML + "</td></tr>";
          }
        };
      }
    }, 100);
  });

document
  .getElementById("dropBtnProject")
  .addEventListener("click", function () {
    let categorie = document.querySelector(".dropHeader--Project").innerHTML;

    // let data = ["Project1", "Project2", "Project3", "Project4", "Project5"];

    toggleDropContent("dropBtnProject", "dropContentProject");

    setTimeout(() => {
      let dropContent =
        document.getElementById("dropContentProject").childNodes;
      for (let i = 0; i < dropContent.length; i++) {
        dropContent[i].onclick = function () {
          document.getElementById("dropSelectedItemIndicator").innerHTML = "";

          document.getElementById("dropSelectedItemProject").innerHTML =
            dropContent[i].innerHTML;

          let UAP = document.getElementById("dropSelectedItemUAP").innerHTML;
          let project = document.getElementById(
            "dropSelectedItemProject"
          ).innerHTML;
          let indicator = document.getElementById(
            "dropSelectedItemIndicator"
          ).innerHTML;

          let uri = IP + "manConKPItofollow";
          let options = {
            method: "POST",
            body: JSON.stringify({
              UAP: UAP,
              project: project,
              indicator: indicator,
            }),
            credentials: "same-origin",
            cache: "no-cache",
            headers: new Headers({
              "content-type": "application/json",
            }),
          };
          fetch(uri, options)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              console.log(data);

              let dataHTML = "";
              for (elm of data.Indicators) {
                dataHTML += '<div class="elm">' + elm + "</div>";
              }
              document.getElementById("dropContentIndicator").innerHTML =
                dataHTML;
            });
        };
      }
    }, 100);
  });

document.getElementById("dropBtnStatus").addEventListener("click", function () {
  let categorie = document.querySelector(".dropHeader--Status").innerHTML;
  console.log(categorie);

  // let data = ["Status1", "Status2", "Status3", "Status4", "Status5"];
  // let dataHTML = "";
  // for (elm of data) {
  //   dataHTML += '<div class="elm">' + elm + "</div>";
  // }

  // document.getElementById("dropContentStatus").innerHTML = dataHTML;
  toggleDropContent("dropBtnStatus", "dropContentStatus");

  setTimeout(() => {
    let dropContent = document.getElementById("dropContentStatus").childNodes;
    for (let i = 0; i < dropContent.length; i++) {
      dropContent[i].onclick = function () {
        document.getElementById("dropSelectedItemIndicator").innerHTML = "";

        document.getElementById("dropSelectedItemStatus").innerHTML =
          dropContent[i].innerHTML;
      };
    }
  }, 100);
});

document.getElementById("dropBtnUAPemp").addEventListener("click", function () {
  let categorie = document.querySelector(".dropHeader--UAPemp").innerHTML;
  console.log(categorie);

  // let data = ["UAPemp1", "UAPemp2", "UAPemp3", "UAPemp4", "UAPemp5"];
  // let dataHTML = "";
  // for (elm of data) {
  //   dataHTML += '<div class="elm">' + elm + "</div>";
  // }

  // document.getElementById("dropContentUAPemp").innerHTML = dataHTML;
  toggleDropContent("dropBtnUAPemp", "dropContentUAPemp");

  setTimeout(() => {
    let dropContent = document.getElementById("dropContentUAPemp").childNodes;
    for (let i = 0; i < dropContent.length; i++) {
      dropContent[i].onclick = function () {
        document.getElementById("dropSelectedItemIndicator").innerHTML = "";

        document.getElementById("dropSelectedItemUAPemp").innerHTML =
          dropContent[i].innerHTML;
      };
    }
  }, 100);
});

document
  .getElementById("dropBtnDepartement")
  .addEventListener("click", function () {
    let categorie = document.querySelector(
      ".dropHeader--Departement"
    ).innerHTML;
    console.log(categorie);

    let data = [
      "Departement1",
      "Departement2",
      "Departement3",
      "Departement4",
      "Departement5",
    ];
    let dataHTML = "";
    for (elm of data) {
      dataHTML += '<div class="elm">' + elm + "</div>";
    }

    document.getElementById("dropContentDepartement").innerHTML = dataHTML;
    toggleDropContent("dropBtnDepartement", "dropContentDepartement");

    setTimeout(() => {
      let dropContent = document.getElementById(
        "dropContentDepartement"
      ).childNodes;
      for (let i = 0; i < dropContent.length; i++) {
        dropContent[i].onclick = function () {
          document.getElementById("dropSelectedItemIndicator").innerHTML = "";

          document.getElementById("dropSelectedItemDepartement").innerHTML =
            dropContent[i].innerHTML;
        };
      }
    }, 100);
  });

document.getElementById("dropBtnproUAP").addEventListener("click", function () {
  let categorie = document.querySelector(".dropHeader--proUAP").innerHTML;
  console.log(categorie);

  // let data = ["UAP1", "UAP2", "UAP3", "UAP4", "UAP5"];
  // let dataHTML = "";
  // for (elm of data) {
  //   dataHTML += '<div class="elm">' + elm + "</div>";
  // }

  // document.getElementById("dropContentproUAP").innerHTML = dataHTML;
  toggleDropContent("dropBtnproUAP", "dropContentproUAP");

  setTimeout(() => {
    let dropContent = document.getElementById("dropContentproUAP").childNodes;
    for (let i = 0; i < dropContent.length; i++) {
      dropContent[i].onclick = function () {
        document.getElementById("dropSelectedItemProject").innerHTML = "";
        document.getElementById("dropSelectedItemIndicator").innerHTML = "";

        document.getElementById("dropSelectedItemproUAP").innerHTML =
          dropContent[i].innerHTML;
      };
    }
  }, 100);
});

document
  .getElementById("dropBtnKPItype")
  .addEventListener("click", function () {
    let categorie = document.querySelector(".dropHeader--KPItype").innerHTML;
    console.log(categorie);

    // let data = ["KPItype1", "KPItype2", "KPItype3", "KPItype4", "KPItype5"];
    // let dataHTML = "";
    // for (elm of data) {
    //   dataHTML += '<div class="elm">' + elm + "</div>";
    // }

    // document.getElementById("dropContentKPItype").innerHTML = dataHTML;
    toggleDropContent("dropBtnKPItype", "dropContentKPItype");

    setTimeout(() => {
      let dropContent =
        document.getElementById("dropContentKPItype").childNodes;
      for (let i = 0; i < dropContent.length; i++) {
        dropContent[i].onclick = function () {
          document.getElementById("dropSelectedItemProject").innerHTML = "";
          document.getElementById("dropSelectedItemIndicator").innerHTML = "";

          document.getElementById("dropSelectedItemKPItype").innerHTML =
            dropContent[i].innerHTML;
        };
      }
    }, 100);
  });

document.getElementById("dropBtnKPIpro").addEventListener("click", function () {
  let categorie = document.querySelector(".dropHeader--KPIpro").innerHTML;
  console.log(categorie);

  // let data = ["KPIpro1", "KPIpro2", "KPIpro3", "KPIpro4", "KPIpro5"];
  // let dataHTML = "";
  // for (elm of data) {
  //   dataHTML += '<div class="elm">' + elm + "</div>";
  // }

  // document.getElementById("dropContentKPIpro").innerHTML = dataHTML;
  toggleDropContent("dropBtnKPIpro", "dropContentKPIpro");

  setTimeout(() => {
    let dropContent = document.getElementById("dropContentKPIpro").childNodes;
    for (let i = 0; i < dropContent.length; i++) {
      dropContent[i].onclick = function () {
        document.getElementById("dropSelectedItemProject").innerHTML = "";
        document.getElementById("dropSelectedItemIndicator").innerHTML = "";

        document.getElementById("dropSelectedItemKPIpro").innerHTML =
          dropContent[i].innerHTML;
      };
    }
  }, 100);
});

document.getElementById("btnNewEmploye").addEventListener("click", function () {
  switchBlocks(
    "content-container--SETTINGSprincipale",
    "content-container--SETTINGSsecond"
  );
});

document.getElementById("btnNewProject").addEventListener("click", function () {
  switchBlocks(
    "content-container--SETTINGSprincipale",
    "content-container--SETTINGSthird"
  );
});

document
  .getElementById("btnNewIndicator")
  .addEventListener("click", function () {
    switchBlocks(
      "content-container--SETTINGSprincipale",
      "content-container--SETTINGSfourth"
    );
  });

document
  .getElementById("returnBtn--second")
  .addEventListener("click", function () {
    switchBlocks(
      "content-container--SETTINGSsecond",
      "content-container--SETTINGSprincipale"
    );
  });

document
  .getElementById("returnBtn--third")
  .addEventListener("click", function () {
    switchBlocks(
      "content-container--SETTINGSthird",
      "content-container--SETTINGSprincipale"
    );
  });

document
  .getElementById("returnBtn--fourth")
  .addEventListener("click", function () {
    switchBlocks(
      "content-container--SETTINGSfourth",
      "content-container--SETTINGSprincipale"
    );
  });

function switchBlocks(blockID1, blockID2) {
  document.getElementById(blockID1).style.animation = "getOut 0.5s ease-in";
  setTimeout(() => {
    document.getElementById(blockID2).classList.toggle("FEAMshow");
  }, 200);
  setTimeout(() => {
    document.getElementById(blockID1).classList.toggle("FEAMshow");
    document.getElementById(blockID1).style.animation = "";
  }, 500);
}

document.getElementById("dropBtnAddWC").addEventListener("click", function () {
  let WCID = document.getElementById("newProject-WCID").value;

  if (WCID == "" || WCID.includes(" ")) {
    // document.getElementById("notif--icon").className = "notif--icon";
    notification("notifContF2FI", ".notifF2FI", "That don't look like an ID");
  } else {
    document.querySelector("#WCID-list-content tbody").innerHTML +=
      "<tr><td>" + WCID + "</td></tr>";
    document.getElementById("newProject-WCID").value = "";
  }
});

document
  .getElementById("btnSubmitRealtimeKPI")
  .addEventListener("click", function () {
    let realtimeKPItr = document.querySelectorAll("#realtimeKPI-content tr");
    let realtimeKPItd = document.querySelectorAll("#realtimeKPI-content tr td");
    let realtimeKPIlist = [];
    for (let i = 0; i < realtimeKPItd.length; i++) {
      console.log(realtimeKPItr[i].classList[0]);
      if (realtimeKPItr[i].classList[0] != undefined) {
        realtimeKPIlist.push([realtimeKPItd[i].innerHTML, 1]);
      } else {
        realtimeKPIlist.push([realtimeKPItd[i].innerHTML, 0]);
      }
    }

    let uri = IP + "submitRealtimeKPI";
    let options = {
      method: "POST",
      body: JSON.stringify({
        rtList: realtimeKPIlist,
      }),
      credentials: "same-origin",
      cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json",
      }),
    };

    fetch(uri, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        notification("notifContF2FI", ".notifF2FI", data.message, 3000, 1);
      });
  });

document
  .getElementById("btnSubmitNewEmploye")
  .addEventListener("click", function () {
    let newEmail = document.getElementById("newEmploye-email").value;
    let userName = document.getElementById("newEmploye-username").value;
    let status = document.getElementById("dropSelectedItemStatus").innerHTML;
    let UAP = document.getElementById("dropSelectedItemUAPemp").innerHTML;
    let departement = document.getElementById(
      "dropSelectedItemDepartement"
    ).innerHTML;

    if (
      newEmail == "" ||
      newEmail.includes(" ") ||
      userName == "" ||
      status == "" ||
      UAP == "" ||
      departement == ""
    ) {
      notification("notifContF2FI", ".notifF2FI", "Some fields are missing");
    } else {
      let options = {
        method: "POST",
        body: JSON.stringify({
          newEmail: newEmail,
          userName: userName,
          status: status,
          UAP: UAP,
          departement: departement,
        }),
        credentials: "same-origin",
        cache: "no-cache",
        headers: new Headers({
          "content-type": "application/json",
        }),
      };
      let uri = IP + "submitNewEmploye";
      fetch(uri, options)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          notification("notifContF2FI", ".notifF2FI", data.message);
        });
      document.getElementById("newEmploye-email").value = "";
      document.getElementById("newEmploye-username").value = "";
      document.getElementById("dropSelectedItemStatus").innerHTML = "";
      document.getElementById("dropSelectedItemUAPemp").innerHTML = "";
      document.getElementById("dropSelectedItemDepartement").innerHTML = "";

      uri = IP + "project&supervisorList";
      fetch(uri, options)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var supList = document.querySelectorAll(
            "#supervisor-list-content tr"
          );
          let dataHTMLsupervisorsList = "";
          for (elm of data.supervisorsList) {
            dataHTMLsupervisorsList += "<tr><td>" + elm + "</td></tr>";
          }
          document.querySelector("#supervisor-list-content tbody").innerHTML =
            dataHTMLsupervisorsList;
        });
    }
  });

document
  .getElementById("btnSubmitNewKPI")
  .addEventListener("click", function () {
    let KPIName = document.getElementById("newProject-KPIname").value;
    let criteria = document.getElementById("newProject-KPIcriteria").value;
    let KPItype = document.getElementById("dropSelectedItemKPItype").innerHTML;
    let target = document.getElementById("newProject-Target").value;
    let project = document.getElementById("dropSelectedItemKPIpro").innerHTML;
    let maxExpected = document.getElementById("newProject-MaxExpected").value;

    if (
      KPIName == "" &&
      criteria == "" &&
      KPItype == "" &&
      target == "" &&
      project == "" &&
      maxExpected == ""
    ) {
      notification("notifContF2FI", ".notifF2FI", "Some fields are missing");
    } else {
      let uri = IP + "submitNewIndicator";
      let options = {
        method: "POST",
        body: JSON.stringify({
          KPIName: KPIName,
          criteria: criteria,
          KPItype: KPItype,
          target: target,
          project: project,
          maxExpected: maxExpected,
        }),
        credentials: "same-origin",
        cache: "no-cache",
        headers: new Headers({
          "content-type": "application/json",
        }),
      };
      fetch(uri, options)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          notification("notifContF2FI", ".notifF2FI", data.message);
          if (data.Alert == "False") {
            document.getElementById("newProject-KPIname").value = "";
            document.getElementById("newProject-KPIcriteria").value = "";
            document.getElementById("dropSelectedItemKPItype").innerHTML = "";
            document.getElementById("newProject-Target").value = "";
            document.getElementById("dropSelectedItemKPIpro").innerHTML = "";
            document.getElementById("newProject-MaxExpected").value = "";
          }
        });
    }
  });

document
  .getElementById("btnSubmitNewPro")
  .addEventListener("click", function () {
    let projectName = document.getElementById("newProject-name").value;
    let UAP = document.getElementById("dropSelectedItemproUAP").innerHTML;
    let WCID = document.querySelectorAll("#WCID-list-content tr td");
    let WCIDtr = document.querySelectorAll("#WCID-list-content tr");
    let WCIDlist = [];
    for (let i = 0; i < WCID.length; i++) {
      WCIDlist.push(WCID[i].innerHTML);
    }

    let selectedSupervisors = [];
    let supervisorsTr = document.querySelectorAll(
      "#supervisor-list-content tr"
    );
    let supervisorsTd = document.querySelectorAll(
      "#supervisor-list-content tr td"
    );
    for (let i = 0; i < supervisorsTr.length; i++) {
      if (supervisorsTd[i].classList[0] != undefined) {
        selectedSupervisors.push(supervisorsTd[i].innerHTML);
      }
    }
    if (
      projectName == "" ||
      projectName.includes(" ") ||
      UAP == "" ||
      WCIDlist.length == 0 ||
      selectedSupervisors.length == 0
    ) {
      if (WCIDlist.length == 0) {
        notification(
          "notifContF2FI",
          ".notifF2FI",
          "WORKCENTER_ID list is empty !"
        );
      } else if (projectName.includes(" ")) {
        notification(
          "notifContF2FI",
          ".notifF2FI",
          "That don't look like a PROJECT NAME"
        );
      } else if (selectedSupervisors.length == 0) {
        notification(
          "notifContF2FI",
          ".notifF2FI",
          "Select the project's supervisors"
        );
      } else {
        notification("notifContF2FI", ".notifF2FI", "Fill in all the fields");
      }
    } else {
      let uri = IP + "submitNewProject";
      let options = {
        method: "POST",
        body: JSON.stringify({
          projectName: projectName,
          UAP: UAP,
          WCIDs: WCIDlist,
          EmailSup: selectedSupervisors,
        }),
        credentials: "same-origin",
        cache: "no-cache",
        headers: new Headers({
          "content-type": "application/json",
        }),
      };

      fetch(uri, options)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          notification("notifContF2FI", ".notifF2FI", data.message, 3000, 1);
          // RESETING THE FIELDS
          for (let i = 0; i < supervisorsTr.length; i++) {
            if (supervisorsTd[i].classList[0] != undefined) {
              console.log(
                supervisorsTd[i].classList.remove("selected-supervisor")
              );
            }
          }
          document.getElementById("newProject-name").value = "";
          document.getElementById("dropSelectedItemproUAP").innerHTML = "";
          for (let i = 0; i < WCIDtr.length; i++) {
            WCIDtr[i].remove();
          }
        });
    }
  });

document.getElementById("TS-nav").addEventListener("click", function () {
  closeAll();
  document.querySelector(".bg--inF2F").style.filter = "blur(2px)";
  document.getElementById("tourSheet").style.opacity = "1";
  document.getElementById("tourSheet").classList.toggle("FEAMshowJack");
  let selectedDate = document.getElementById(
    "dropSelectedItemSheetDates"
  ).innerHTML;
  let uri = IP + "loadTourSheet";
  let options = {
    method: "POST",
    body: JSON.stringify({ selectedDate: selectedDate }),
    credentials: "same-origin",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  };

  let val = 0;
  let valComm = 0;
  fetch(uri, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.tourSheet.length == 0) {
        notification(
          "notifContF2FI",
          ".notifF2FI",
          "Tour Sheet is empty for today !!"
        );
      } else {
        UAP = [];
        rep = [];
        UAPName = [];
        for (uap of data.infoUAP) {
          UAP.push(uap[0]);
          rep.push(uap[1]);
          UAPName.push(uap[2]);
        }
        console.log(data.infoUAP);
        let dataHtml = "";
        document.querySelector(".tourSheet tbody").innerHTML = dataHtml;
        let commClassList = [];
        let commValuesList = [];
        for (let i = 0; i < UAP.length + 1; i++) {
          uap = UAP[i];
          repeated = rep[i];
          val = 0;
          valComm = 0;
          for (let row of data.tourSheet) {
            if (row.IDUAP == uap) {
              console.log(repeated);
              if (repeated == 1) {
                dataHtml += "<tr><td>" + UAPName[i] + "</td>";
                dataHtml +=
                  "<td>" +
                  row.IDKPI +
                  "</td>" +
                  "<td>" +
                  row.KPIName +
                  "</td>" +
                  "<td>" +
                  row.criteria +
                  "</td>";
                if (row.STDdir == "X") {
                  dataHtml +=
                    '<td><input type="checkbox" class="tabCheckBox" id="STDDir' +
                    row.IDKPI +
                    '"/></td>';
                } else if (row.STDdir == "O") {
                  dataHtml +=
                    '<td><input type="checkbox" class="tabCheckBox" checked id="STDDir' +
                    row.IDKPI +
                    '"/></td>';
                }
                if (row.RRdir == "X") {
                  dataHtml +=
                    '<td><input type="checkbox" class="tabCheckBox" id="RRDir' +
                    row.IDKPI +
                    '"/></td>';
                } else if (row.RRdir == "O") {
                  dataHtml +=
                    '<td><input type="checkbox"  class="tabCheckBox" checked id="RRDir' +
                    row.IDKPI +
                    '"/></td>';
                }

                dataHtml +=
                  "<td>" +
                  '<input type="text" id="comment' +
                  row.IDKPI +
                  '">' +
                  "</td></tr>";
                commClassList.push("comment" + row.IDKPI);
                commValuesList.push(row.Comment);
              } else {
                if (val == 0) {
                  // console.log(repeated);
                  dataHtml +=
                    "<tr><td rowspan='" +
                    repeated +
                    "'>" +
                    UAPName[i] +
                    "</td>";
                  val = 1;
                }
                // console.log(row.KPIName);
                dataHtml +=
                  "<td>" +
                  row.IDKPI +
                  "</td>" +
                  "<td>" +
                  row.KPIName +
                  "</td>" +
                  "<td>" +
                  row.criteria +
                  "</td>";
                if (row.STDdir == "X") {
                  dataHtml +=
                    '<td><input type="checkbox" class="tabCheckBox" id="STDDir' +
                    row.IDKPI +
                    '"/></td>';
                } else if (row.STDdir == "O") {
                  dataHtml +=
                    '<td><input type="checkbox" class="tabCheckBox" checked id="STDDir' +
                    row.IDKPI +
                    '"/></td>';
                }
                if (row.RRdir == "X") {
                  if (valComm == 0) {
                    dataHtml +=
                      '<td><input type="checkbox" class="tabCheckBox" id="RRDir' +
                      row.IDKPI +
                      '"/></td>';
                  } else {
                    dataHtml +=
                      '<td><input type="checkbox" class="tabCheckBox" id="RRDir' +
                      row.IDKPI +
                      '"/></td></tr>';
                  }
                } else if (row.RRdir == "O") {
                  if (valComm == 0) {
                    dataHtml +=
                      '<td><input type="checkbox" class="tabCheckBox" checked id="RRDir' +
                      row.IDKPI +
                      '"/></td>';
                  } else {
                    dataHtml +=
                      '<td><input type="checkbox" class="tabCheckBox" checked id="RRDir' +
                      row.IDKPI +
                      '"/></td></tr>';
                  }
                }
                if (valComm == 0) {
                  dataHtml +=
                    "<td rowspan='" +
                    repeated +
                    "'>" +
                    '<input type="text" id="comment' +
                    row.IDKPI +
                    '">' +
                    "</td></tr>";
                  commClassList.push("comment" + row.IDKPI);
                  commValuesList.push(row.Comment);
                  valComm = 1;
                }
              }
            }
          }
        }
        document.querySelector(".tourSheet tbody").innerHTML = dataHtml;
        console.log(commClassList, commValuesList);
        for (let i = 0; i < commClassList.length; i++) {
          document.getElementById(commClassList[i]).value = commValuesList[i];
        }
      }
    });
});

document.getElementById("btnCloseTS").addEventListener("click", function () {
  closeWindow("tourSheet");
  document.querySelector(".bg--inF2F").style.filter = "blur(0px)";
});
document
  .getElementById("btnSaveTourSheet")
  .addEventListener("click", function () {
    // try {
    let IDKPI, RR, STD, idRR, idSTD;
    let KPIinfos = [];
    let uri = IP + "updateTourSheet";
    var F2Fdata = document.getElementById("tourSheetBody"),
      F2Fdatarow;

    let selectedDate = document.getElementById(
      "dropSelectedItemSheetDates"
    ).innerHTML;

    for (i = 0; i < F2Fdata.childNodes.length; i++) {
      F2Fdatarow = F2Fdata.childNodes[i];
      let comment = "No Comment";
      if (F2Fdatarow.childNodes.length < 7) {
        IDKPI = F2Fdatarow.childNodes[0].innerHTML;
        idSTD = F2Fdatarow.childNodes[3].childNodes[0].id;
        idRR = F2Fdatarow.childNodes[4].childNodes[0].id;
      } else {
        IDKPI = F2Fdatarow.childNodes[1].innerHTML;
        idSTD = F2Fdatarow.childNodes[4].childNodes[0].id;
        idRR = F2Fdatarow.childNodes[5].childNodes[0].id;
        idComm = F2Fdatarow.childNodes[6].childNodes[0].id;
        comment = document.getElementById(idComm).value;
      }

      if (document.getElementById(idSTD).checked) {
        STD = "O";
      } else {
        STD = "X";
      }
      if (document.getElementById(idRR).checked) {
        RR = "O";
      } else {
        RR = "X";
      }
      // KPIinfos.push({ IDKPI: IDKPI, RR: RR, STD: STD });
      console.log(selectedDate, comment);
      let options = {
        method: "POST",
        body: JSON.stringify({
          IDKPI: IDKPI,
          RR: RR,
          STD: STD,
          comment: comment,
          selectedDate: selectedDate,
        }),
        credentials: "same-origin",
        cache: "no-cache",
        headers: new Headers({
          "content-type": "application/json",
        }),
      };

      fetch(uri, options)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // console.log(data);
        });
    }
    notification("notifContF2FI", ".notifF2FI", "Updated Succefully", 5000);
    // } catch (error) {
    //   notification(
    //     "notifContF2FI",
    //     ".notifF2FI",
    //     "Tour Sheet is not available right Now !! ",
    //     5000
    //   );
    // }
  });

document.getElementById("Q-nav").addEventListener("click", function () {
  document.querySelector(".faurTrans").style.width = "100%";
  document.querySelector(".faurTrans").style.visibility = "visible";
  setTimeout(() => {
    window.location.href = "Login.html";
  }, 300);
  document.querySelector(".trans").style.display = "flex";
});
