var status1;
var priority;
var softwareName;
var problemType;
var hardwareID;
var handler;
var operatingSystem;
var problemDescription;
var notes;
var creationDate;
var lastUpdated;
var no_of_drops;


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

function addTicket(data) {
  console.log(data);

  document.getElementById('status').value=data.status1;
  //console.log(status1);
  //const socket = io()
  socket.emit('add_ticket',  data);
  //socket.destroy();
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

  const socket=io();

  socket.emit('add_ticket',  data);

  socket.on('add_ticket', function(data, json) {
    console.log("testing this out");
    addTicket(data);
    console.log("adding ticket");
  });

  status1 = document.getElementById('status').value;//="";
  console.log(status1);

  priority = document.getElementById('priority').value;//="";
  console.log(priority);

  softwareName = document.getElementById('software_name').value;//="";
  console.log(softwareName);

  problemType = document.getElementById('problem_type').value;//="";
  console.log(problemType);

  hardwareID = document.getElementById('hardware_id').value;//="";
  console.log(hardwareID);

  handler = document.getElementById('handler').value;//="";
  console.log(handler);

  operatingSystem = document.getElementById('os').value;//="";
  console.log(operatingSystem);

  problemDescription = document.getElementById('problem_description').value;//="";
  console.log(problemDescription);

  notes = document.getElementById('notes').value;//="";
  console.log(notes);

  // creationDate = document.getElementById('creationDate').value;//="";
  // console.log(creationDate);

  // lastUpdated = document.getElementById('lastUpdated').value;//="";
  // console.log(lastUpdated);

  // no_of_drops = document.getElementById('no_of_drops').value;//="";
  // console.log(no_of_drops);
  
});