// Data
function getClients() {
  let clients = JSON.parse(localStorage.getItem("clients"));
  console.log(clients);

  if (!clients) {
    clients = {
      data: [],
      id: 1,
    };
    localStorage.setItem("clients", JSON.stringify(clients));
  }
  return clients;
}

function saveClients(clientsInfo) {
  localStorage.setItem("clients", JSON.stringify(clientsInfo));
}

function getClient(id) {
  let client = getClients().data?.find((c) => c.id == id);
  console.log(client);
  return client;
}

function addClient(c) {
  let clients = getClients();

  c.id = clients.id++;
  clients.data.push(c);

  saveClients(clients);
}

function updateClient(id, client) {
  let clients = getClients();
  let toEdit = getClients().data?.findIndex((c) => c.id == id);

  client.id = clients.data[toEdit].id;
  clients.data[toEdit] = client;

  saveClients(clients);
}

function deleteClientData(id) {
  let clients = getClients();

  let idx = clients.data.findIndex((c) => c.id == id);
  clients.data.splice(idx, 1);

  saveClients(clients);
}

// Dialog checkbox functions
function fillChecks(gender) {
  disableChecks();

  // Enables depending on the gender
  if (gender == "Male") {
    $("#chkMale").prop("checked", true);
  }
  if (gender == "Female") {
    $("#chkFemale").prop("checked", true);
  }
  if (gender != "Male" && gender != "Female") {
    $("#chkOther").prop("checked", true);
    $("#txtGender").prop("disabled", false);
    $("#txtGender").val(gender);
  }
}

function disableChecks() {
  $("#chkMale").prop("checked", false);
  $("#chkFemale").prop("checked", false);
  $("#chkOther").prop("checked", false);

  $("#txtGender").prop("disabled", true);
  $("#txtGender").val("");
}

function getChecksValue() {
  let gender = "";
  if ($("#chkMale").prop("checked")) gender = "Male";
  if ($("#chkFemale").prop("checked")) gender = "Female";
  if ($("#chkOther").prop("checked")) gender = $("#txtGender").val();
  return gender;
}

// Dialog functions
function getModalClient() {
  let client = {
    name: $("#txtName").val(),
    lastName: $("#txtLastName").val(),
    age: $("#txtAge").val(),
    gender: getChecksValue(),
  };
  return client;
}

function cleanCreateForm() {
  $("#txtName").val("");
  $("#txtLastName").val("");
  $("#txtAge").val("");
  $("#txtGender").prop("disabled", true);
  $("#txtGender").val("");
  $("#chkFemale").prop("checked", false);
  $("#chkMale").prop("checked", false);
  $("#chkOther").prop("checked", false);
}

function fillModal(client) {
  $("#txtName").val(client.name);
  $("#txtLastName").val(client.lastName);
  $("#txtAge").val(client.age);
  fillChecks(client.gender);
}

// Table functions
function updateTable(clientsInfo) {
  $("#clientsTable tbody > tr").remove();
  for (let c of clientsInfo.data) {
    $("#clientsTable").append(createClientRow(c));
  }
}

function insertClientRow(c) {
  $("#clientsTable").append(createClientRow(c));
}

function createClientRow(c) {
  let row =
    '<tr client="' +
    c.id +
    '"><td>' +
    c.name +
    "</td><td>" +
    c.lastName +
    "</td><td>" +
    c.age +
    "</td><td>" +
    c.gender +
    '</td><td><div><button type="button" class="btn mx-1 btn-warning btnEditInd">Edit</button><button type="button" class="btn mx-1 btn-danger btnDeleteInd">Delete</button></td></div></tr>';

  return row;
}

// CRUD Operations
function createClient(client) {
  addClient(client);
  insertClientRow(client);
}

function editClient(id, client) {
  updateClient(id, client);
  updateTable(getClients());
}

function loadClients() {
  updateTable(getClients());
}

function deleteClient(id) {
  deleteClientData(id);
  updateTable(getClients());
}

// JQuery
$(document).ready(function () {
  var editMode = false;
  var selectedId = 1;
  var selectedClientRow = "";

  updateTable(getClients());

  // New client button
  $("#btnCreateClient").click(function () {
    editMode = false;
    cleanCreateForm();
    $("#clientModal").modal();
  });

  // Modify button (Individual client)
  $("#clientsTable").on("click", ".btnEditInd", function () {
    editMode = true;
    selectedId = $(this).parent().parent().parent().attr("client"); // Get client attribute from <tr>
    fillModal(getClient(selectedId));
    $("#clientModal").modal();
  });

  // Delete button click (Individual client)
  $("#clientsTable").on("click", ".btnDeleteInd", function () {
    selectedId = $(this).parent().parent().parent().attr("client");
    selectedClientRow = $(this).closest("tr");
    $("#deleteModal").modal();
  });

  // Save button
  $("#btnSave").click(function () {
    if (editMode) {
      editClient(selectedId, getModalClient());
    } else {
      createClient(getModalClient());
    }
    $("#clientModal").modal("hide");
  });

  // Delete modal confirm
  $("#btnDelete").click(function () {
    deleteClient(selectedId);
    selectedClientRow.remove();
    $("#deleteModal").modal("hide");
  });

  // Filters
  $(".txtNameSearch").keyup(function () {
    let cVal = this.value.toLowerCase().trim();

    $("tbody")
      .find("tr")
      .each(function () {
        let searchId = $(this).find("td:nth-child(1)").first().text().toLowerCase().trim();
        $(this).toggle(searchId.indexOf(cVal) !== -1);
      });
  });

  $(".txtLastNameSearch").keyup(function () {
    let cVal = this.value.toLowerCase().trim();

    $("tbody")
      .find("tr")
      .each(function () {
        let searchId = $(this).find("td:nth-child(2)").first().text().toLowerCase().trim();
        $(this).toggle(searchId.indexOf(cVal) !== -1);
      });
  });

  $(".txtAgeSearch").keyup(function () {
    let cVal = this.value.toLowerCase().trim();

    $("tbody")
      .find("tr")
      .each(function () {
        let searchId = $(this).find("td:nth-child(3)").first().text().toLowerCase().trim();
        $(this).toggle(searchId.indexOf(cVal) !== -1);
      });
  });

  $(".txtGenderSearch").keyup(function () {
    let cVal = this.value.toLowerCase().trim();

    $("tbody")
      .find("tr")
      .each(function () {
        let searchId = $(this).find("td:nth-child(4)").first().text().toLowerCase().trim();
        $(this).toggle(searchId.indexOf(cVal) !== -1);
      });
  });

  // Gender list
  $("#chkMale").click(function () {
    $("#chkFemale").prop("checked", false);
    $("#chkOther").prop("checked", false);
    $("#txtGender").prop("disabled", true);
  });

  $("#chkFemale").click(function () {
    $("#chkMale").prop("checked", false);
    $("#chkOther").prop("checked", false);
    $("#txtGender").prop("disabled", true);
  });

  $("#chkOther").click(function () {
    $("#chkFemale").prop("checked", false);
    $("#chkMale").prop("checked", false);
    $("#txtGender").prop("disabled", false);
  });
});
