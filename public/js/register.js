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

  let registerButton = document.getElementById("registerButton");

  registerButton.addEventListener("click", function (e) {
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
        administrator: {
          name: adminInput.value,
          googleAcc: null,
          facebookAcc: null,
          twitterAcc: null
        }
      };
      request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          let registrationStatus = JSON.parse(request.response).status;
          switch (registrationStatus) {
            case "added": {
              window.location.replace("./venue-manager.html");
              break;
            }
            case "exists": {
              alert("This venue is already in our database!");
              break;
            }
          }
        };
      };
      request.open("POST", "../register-new-venue");
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify(data));
    } else {
      alert("Please fill out all input fileds with valid information!");
    }
  });

})();