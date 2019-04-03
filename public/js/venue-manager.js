let venue = null;

function loadVenue(responseData) {
  venue = JSON.parse(responseData);

  document.getElementById("manager-form").style.display = "none";
  document.getElementById("edit-fields").style.display = "initial";

  if (venue && venue.isPublic) {
    document.getElementById("change-isPublic").checked = true;
  } else {
    document.getElementById("change-isPublic").checked = false;
  }
  document.getElementById("change-name").value = venue.name;
  document.getElementById("change-countryTag").value = venue.countryCode;
  document.getElementById("change-country").value = document.getElementById("country").value;
  document.getElementById("change-city").value = venue.city;
  document.getElementById("change-street").value = venue.street;

  loadInventory();
  loadStaff();
  loadAdmins();
}
function loadInventory() {
  let invList = document.getElementById("inv-list");
  invList.innerHTML = `<tr class="table-header">
  <th>ID</th>
  <th>Product name</th>
  <th>Amount</th>
  <th>Price</th>
</tr>
<tr>
  <td id="inv-add" colspan="4">+</td>
</tr>`;
  for (let i = 0; i < venue.inventory.items.length; i++) {
    let item = venue.inventory.items[i];
    invList.innerHTML += `<tr class="menu-item"><td>${item.id}</td><td>${item.name}</td><td>${item.amount}</td><td>${item.price}</td></tr>`;
  };
}
function loadStaff() {
  let staffList = document.getElementById("staff-list");
  staffList.innerHTML = `<tr class="table-header">
    <th>Name</th>
    <th>G+</th>
    <th>FB</th>
    <th>Twitter</th>
  </tr>
  <tr>
    <td id="staff-add" colspan="4">+</td>
  </tr>`;
  for (let i = 0; i < venue.staff.length; i++) {
    let staffMember = venue.staff[i];
    staffHTML = "";
    staffHTML += `<tr class="staff-member"><td>${staffMember.name}</td>`;
    if (staffMember.googleAcc) {
      staffHTML += `<td>✓</td>`;
    } else {
      staffHTML += `<td>x</td>`;
    }
    if (staffMember.facebookAcc) {
      staffHTML += `<td>✓</td>`;
    } else {
      staffHTML += `<td>x</td>`;
    }
    if (staffMember.twitterAcc) {
      staffHTML += `<td>✓</td>`;
    } else {
      staffHTML += `<td>x</td>`;
    }
    staffHTML += "</tr>";
    staffList.innerHTML += staffHTML;
  };
}
function loadAdmins() {
  let adminList = document.getElementById("admins-list");
  adminList.innerHTML = `<tr class="table-header">
    <th>Name</th>
    <th>G+</th>
    <th>FB</th>
    <th>Twitter</th>
  </tr>
  <tr>
    <td id="staff-add" colspan="4">+</td>
  </tr>`;
  for (let i = 0; i < venue.administrators.length; i++) {
    let admin = venue.administrators[i];
    let adminHTML = "";
    adminHTML += `<tr class="administrator"><td>${admin.name}</td>`;
    if (admin.googleAcc) {
      adminHTML += `<td>✓</td>`;
    } else {
      adminHTML += `<td>x</td>`;
    }
    if (admin.facebookAcc) {
      adminHTML += `<td>✓</td>`;
    } else {
      adminHTML += `<td>x</td>`;
    }
    if (admin.twitterAcc) {
      adminHTML += `<td>✓</td>`;
    } else {
      adminHTML += `<td>x</td>`;
    }
    adminHTML += "</tr>";
    adminList.innerHTML += adminHTML;
  };
}
function clearItemEditor() {
  document.getElementById("item-id").value = "";
  document.getElementById("item-name").value = "";
  document.getElementById("item-price").value = "";
  document.getElementById("item-amount").value = "";
  document.getElementById("item-left-in-stock").value = "";
  document.getElementById("is-food").checked = false;
  document.getElementById("is-mass-item").checked = false;
}

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


  let changeIsPublic = document.getElementById("change-isPublic");
  let changeName = document.getElementById("change-name");
  let changeCountryTag = document.getElementById("change-countryTag");
  let changeCountry = document.getElementById("change-country");
  let changeCity = document.getElementById("change-city");
  let changeStreet = document.getElementById("change-street");

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
          let venueData = "";
          if (request.response.includes("}NEWSTRING{")) {
            res = request.response.split("NEWSTRING");
            registrationStatus = JSON.parse(res[0]).status;
            venueData = res[1];
          } else {
            registrationStatus = JSON.parse(request.response).status;
          };
          switch (registrationStatus) {
            case "found": {
              loadVenue(venueData);
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

  changeCountryTag.addEventListener("input", function () {
    if (changeCountryTag.value.length == 2) {
      for (let i = 0; i < countryCodes.length; i++) {
        let pair = countryCodes[i];
        if (pair.code === changeCountryTag.value.toUpperCase()) {
          changeCountry.value = pair.name;
          return;
        }
      }
    } else {
      changeCountry.value = null;
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

  let saveButton = document.getElementById("save-button");
  saveButton.addEventListener("click", function (e) {
    e.preventDefault();
    if (
      changeName.value !== "" &&
      changeCountryTag.value.length == 2 && countryInput.value !== "" &&
      changeCountry.value !== "" &&
      changeStreet.value !== ""
    ) {
      venue.name = changeName.value;
      venue.countryCode = changeCountryTag.value.toUpperCase();
      venue.city = changeCity.value;
      venue.street = changeStreet.value;
      if (changeIsPublic.checked) {
        venue.isPublic = true;
      } else {
        venue.isPublic = false;
      };

      let request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          if (JSON.parse(request.response).status === "success") {
            alert("Changes saved!");
          }
        };
      };
      request.open("POST", "../update-venue");
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify(venue));
    } else {
      alert("Please fill out all input fileds with valid information!");
    };
  });

  let editor = document.getElementById("inventory-item-editor");
  let invList = document.getElementById("inv-list");

  let itemSave = document.getElementById("item-save");
  itemSave.addEventListener("click", function (e) {
    e.preventDefault();
    let itemID = document.getElementById("item-id");
    let itemName = document.getElementById("item-name");
    let itemPrice = document.getElementById("item-price");
    let itemAmount = document.getElementById("item-amount");
    let itemLeftInStock = document.getElementById("item-left-in-stock");
    let itemIsFood = document.getElementById("is-food");
    let itemIsMassItem = document.getElementById("is-mass-item");
    if (
      itemName.value !== "" &&
      itemPrice.value !== "" &&
      itemAmount.value !== "" &&
      itemLeftInStock.value !== ""
    ) {
      let newItem = {
        name: itemName.value,
        amount: parseFloat(itemAmount.value),
        price: parseFloat(itemPrice.value),
        leftInStock: parseFloat(itemLeftInStock.value)
      };
      if (itemID.value === "") {
        newItem.id = venue.inventory.nextID;
        venue.inventory.nextID++;
        itemID.value = newItem.id;
      } else {
        newItem.id = parseInt(itemID.value);
      }
      if (itemIsFood.checked) {
        newItem.isFood = true;
      } else {
        newItem.isFood = false;
      };
      if (itemIsMassItem.checked) {
        newItem.isMassItem = true;
      } else {
        newItem.isMassItem = false;
      };

      let itemFound = false;
      let itemIndex = null;
      for (let i = 0; i < venue.inventory.items.length; i++) {
        if (venue.inventory.items[i].id === newItem.id) {
          itemFound = true;
          itemIndex = i;
          break;
        }
      }
      if (itemFound) {
        venue.inventory.items[itemIndex] = newItem;
      } else {
        venue.inventory.items.push(newItem);
      }
      clearItemEditor();
      editor.style.display = "none";
      loadInventory();
    } else {
      alert("Please fill out all input fileds with valid information!");
    }
  });
  let itemCancel = document.getElementById("item-cancel");
  itemCancel.addEventListener("click", function (e) {
    e.preventDefault();
    clearItemEditor();

    editor.style.display = "none";
  });

  let itemDelete = document.getElementById("item-delete");
  itemDelete.addEventListener("click", function (e) {
    e.preventDefault();
    let listID = parseInt(document.getElementById("item-id").value);
    for (let i = 0; i < venue.inventory.items.length; i++) {
      let item = venue.inventory.items[i];

      if (item.id === listID) {
        venue.inventory.items.splice(venue.inventory.items.indexOf(item), 1);

        clearItemEditor();

        editor.style.display = "none";
        break;
      };
    }
    loadInventory();
  });

  let inventoryList = document.getElementById("inv-list");
  inventoryList.addEventListener("click", function (e) {
    if (e.target && e.target.id === "inv-add") {
      editor.style.display = "initial";
      itemDelete.hidden = true;
    } else if (e.target && e.target.nodeName === "TD") {
      let text = e.target.parentNode.innerHTML.split("<td>").join("");
      text = text.split("</td>").join("|");

      let itemID = parseInt(text.split("|")[0]);

      for (let i = 0; i < venue.inventory.items.length; i++) {
        let item = venue.inventory.items[i];

        if (
          item.id === itemID
        ) {
          document.getElementById("item-id").value = item.id;
          document.getElementById("item-name").value = item.name;
          document.getElementById("item-price").value = item.price;
          document.getElementById("item-amount").value = item.amount;
          document.getElementById("item-left-in-stock").value = item.leftInStock;
          if (item.isFood) {
            document.getElementById("is-food").checked = true;
          } else {
            document.getElementById("is-food").checked = false;
          };
          if (item.isMassItem) {
            document.getElementById("is-mass-item").checked = true;
          } else {
            document.getElementById("is-mass-item").checked = false;
          };

          editor.style.display = "initial";
          itemDelete.hidden = false;
          break;
        };
      }
    }
  });

})();