let venue = null;

(function () {
  let countryCodes = {};

  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      countryCodes = JSON.parse(request.responseText);
    }
  };
  request.open("GET", "./js/json/country_codes_Alpha-2.json");
  request.send();

  let codeInput = document.getElementById("countryTag");
  let countryInput = document.getElementById("country");

  codeInput.addEventListener("input", function () {
    if (codeInput.value.length == 2) {
      for (let i = 0; i < countryCodes.length; i++) {
        let pair = countryCodes[i];
        if (pair.code === codeInput.value.toUpperCase()) {
          countryInput.value = pair.name;
          return;
        }
      }
    } else {
      countryInput.value = null;
    }
  });

  let nameInput = document.getElementById("name");
  let cityInput = document.getElementById("city");
  let streetInput = document.getElementById("street");
  let adminInput = document.getElementById("administrator");

  let manageButton = document.getElementById("manageButton");

  manageButton.addEventListener("click", function (e) {
    e.preventDefault();

    if (
      nameInput.value !== "" &&
      codeInput.value.length == 2 && countryInput.value !== "" &&
      cityInput.value !== "" &&
      streetInput.value !== "" &&
      adminInput.value !== ""
    ) {
      let data = {
        venueName: nameInput.value,
        countryTag: codeInput.value.toUpperCase(),
        city: cityInput.value,
        street: streetInput.value,
        administrator: adminInput.value
      };
      request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          let res = null;
          let registrationStatus = "";
          if (request.response.includes("}NEWSTRING{")) {
            res = request.response.split("NEWSTRING");
            registrationStatus = JSON.parse(res[0]).status;
            venue = JSON.parse(res[1]);
          } else {
            registrationStatus = JSON.parse(request.response).status;
          };
          switch (registrationStatus) {
            case "found": {
              document.getElementById("manager-form").style.display = "none";
              document.getElementById("edit-fields").style.display = "initial";

              if (venue && venue.isPublic) {
                document.getElementById("change-isPublic").checked = true;
              } else {
                document.getElementById("change-isPublic").checked = false;
              }
              document.getElementById("change-name").value = venue.name;
              document.getElementById("change-countryTag").value = venue.countryCode;
              document.getElementById("change-country").value = countryInput.value;
              document.getElementById("change-city").value = venue.city;
              document.getElementById("change-street").value = venue.street;
              break;
            }
            case "denied": {
              alert("You do not have permission to manage this venue!")
              break;
            }
            case "not found": {
              alert("This venue does not exist in our database!");
              break;
            }
          }
        };
      };
      request.open("POST", "../venue-manager");
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify(data));
    } else {
      alert("Please fill out all input fileds with valid information!");
    }
  });



  let changeCodeInput = document.getElementById("change-countryTag");
  let changeCountryInput = document.getElementById("change-country");

  changeCodeInput.addEventListener("input", function () {
    if (changeCodeInput.value.length == 2) {
      for (let i = 0; i < countryCodes.length; i++) {
        let pair = countryCodes[i];
        if (pair.code === changeCodeInput.value.toUpperCase()) {
          changeCountryInput.value = pair.name;
          return;
        }
      }
    } else {
      changeCountryInput.value = null;
    }
  });

  let navButtons = document.getElementsByClassName("navigation-button");
  for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function (e) {
      e.preventDefault();
      let buttons = document.getElementsByClassName("navigation-button");
      for (let j = 0; j < buttons.length; j++) {
        if (buttons[j] !== navButtons[i]) {
          buttons[j].classList.remove("active");
          document.getElementById(buttons[j].innerHTML.toLowerCase()).style.display = "none";
        };
      }
      navButtons[i].classList.toggle("active");
      if (navButtons[i].classList.contains("active")) {
        document.getElementById(navButtons[i].innerHTML.toLowerCase()).style.display = "initial";
      } else {
        document.getElementById(navButtons[i].innerHTML.toLowerCase()).style.display = "none";
      };
    });
  }
})();