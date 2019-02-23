(function () {
  let manageButton = document.getElementById("manage-btn");
  let idInput = document.getElementById("venueID");

  manageButton.addEventListener("click", function (e) {
    e.preventDefault();

    if (idInput.value !== "") {
      let request = new XMLHttpRequest();
      request.open("POST", "../manage-venue");
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify({id: idInput.value}));
    }
  });
})();