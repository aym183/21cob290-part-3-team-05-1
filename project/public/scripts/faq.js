// var status1;
// var priority;
// var softwareName;
// var problemType;
// var hardwareID;
// var handler;
// var operatingSystem;
// var problemDescription;
// var notes;
// var creationDate;
// var lastUpdated;
// var no_of_drops;


function addRowHandlers() {
    var table = document.getElementById("table-info");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
      var currentRow = table.rows[i];
      var createClickHandler = function(row) {
        return function() {
          var cell = row.getElementsByTagName("td")[0];
          var id = cell.innerHTML;
        };
      };
      currentRow.onclick = createClickHandler(currentRow);
    }
}

function showSolutionInfo(data) {   
    console.log(data);
    document.getElementById('solutionBox').value =  data.solution_description;
    document.getElementById('description').value =  data.problem_description;
    document.getElementById('notes').value =  data.notes;
    document.getElementById('problem-type').value =  data.problem_type_id;

    // document.getElementById('solutionBox').value = data.solution_description;
}


document.querySelector(".ticket__table tbody").addEventListener("click", (e) => {
    const socket=io();
    
    const data = {
        problem_description: e.target.closest("tr").children[0].textContent
    }

    console.log(data);
    console.log('hello');

    socket.emit('solution_details',  data);

    // after data is recieved, calling function to show solution info
    // socket.on('solution_details', function(data, json) {
    //     console.log('hello2');
    //     console.log(json)
    //     showSolutionInfo(json[0]); 
    // });

    socket.on('solution_details', function(data, json) {
      console.log('hello2');
      console.log(data);
      showSolutionInfo(data);
      // showTicketInfo(json[0]); 
    });

});


document.querySelector("#add-btn").addEventListener("click", (e) => {
  document.querySelector(".AddTicketContainer").style.display="block";
  // console.log("hello");
});

document.querySelector("#submitTicket").addEventListener("click", (e) => {
  document.querySelector(".AddTicketContainer").style.display="none";
  // console.log("hello");
});

document.querySelector(".submitTicket").addEventListener("click", (e) => {
  console.log("ladi");

  socket = io();

  // const socket=io();

  // socket.emit('add_ticket',  data);

  // socket.on('add_ticket', function(data, json) {
  //   console.log("testing this out");
  //   addTicket(data);
  //   console.log("adding ticket");
  // });

  var employee_name1 = document.getElementById('employee_name').value;//="";
  console.log(employee_name1);

  var status1 = document.getElementById('status').value;//="";
  console.log(status1);

  var priority = document.getElementById('priority').value;//="";
  console.log(priority);

  var softwareName = document.getElementById('software_name').value;//="";
  console.log(softwareName);

  var problemType = document.getElementById('problem_type').value;//="";
  console.log(problemType);

  var hardwareID = document.getElementById('hardware_id').value;//="";
  console.log(hardwareID);

  var handler = document.getElementById('handler').value;//="";
  console.log(handler);

  var operatingSystem = document.getElementById('os').value;//="";
  console.log(operatingSystem);

  var problemDescription = document.getElementById('problem_description').value;//="";
  console.log(problemDescription);

  var notes = document.getElementById('notes').value;//="";
  console.log(notes);

  // creationDate = document.getElementById('creationDate').value;//="";
  // console.log(creationDate);

  // lastUpdated = document.getElementById('lastUpdated').value;//="";
  // console.log(lastUpdated);

  // no_of_drops = document.getElementById('no_of_drops').value;//="";
  // console.log(no_of_drops);
  const data = {
    employee_name: employee_name1,
    statuss: status1,
    priorityy: priority,
    soft_name: softwareName,
    hardID: hardwareID,
    h_name: handler,
    prob_type: problemType,
    prob_desc: problemDescription,
    os: operatingSystem,
    notess: notes
  }
  //console.log(handler_name);
  console.log(data);
  console.log(data.statuss); 
  socket.emit("add_ticket", data);
});