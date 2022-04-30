var problemTypes = [];
var data_lists = ["hardware-numbers2", "new-operating-systems", "software-list", "problem-types", "handler-names"];
var priority_list = ["high", "medium", "low"];
var errors = ['priority', 'hardware-id', 'operating-system', 'software', 'problem-type', 'handler-name']; 
var hardware_list = [];
var os_list = [];
var software_list = [];
var probtype_list = [];
var handler_list = [];
var temp_error = [];
const employee_name = "";


function showEmployeeName() { 
  
  document.getElementById('employee_name').value=sessionStorage.getItem("employee_name");
  
}

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
    document.getElementById('problem-type').value =  data.name;

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

    socket.on('solution_details', function(data, json) {
      console.log('hello2');
      console.log(data);
      showSolutionInfo(data);
      // showTicketInfo(json[0]); 
    });

});

document.querySelector("#add-btn").addEventListener("click", (e) => {
  console.log("I here");
  document.querySelector(".AddTicketContainer").style.display="block";
  document.querySelector("#add-btn").style.display="none";
  document.querySelector("#cancel-btn").style.display="block";
  

  const socket=io();
    
    const data = {
      //session_username,
      employee_name: 'yo'
    }
    socket.emit('employeeName',  data);
  socket.on('employeeName', function(data, json) {
    
    if (localStorage.getItem("employee_name") === null) {
      sessionStorage.setItem("employee_name", data.name);
    }
    
    showEmployeeName(); 

    socket.destroy();
  });
});

document.querySelector(".submitTicket").addEventListener("click", (e) => {
    console.log("ladi");

    socket = io();

    for(let i = 0; i<data_lists.length; i++){
      //console.log(document.getElementById("new-operating-systems"));
      var current_list = span_list[i];
      var x = document.getElementById(data_lists[i]);
      var j;
      for (j = 0; j < x.options.length; j++) {
          current_list.push(x.options[j].value);
  }
      
  }

  const priority = document.getElementById("priority").value;
  const hardware_id = document.getElementById("hardware-id").value;
  const os = document.getElementById("operating-system").value;
  const software = document.getElementById("software").value;
  const problem_description = document.getElementById("description").value;
  const notes = document.getElementById("notes").value;
  const problem_type = document.getElementById("problem-type").value;
  const handler_name = document.getElementById("handler-name").value;
  var employee_name = document.getElementById('employee_name').value;//="";

  
  
  // console.log(hardware_list);
  valid_details = []

  if(!hardware_list.includes(hardware_id)){
      console.log(true);
  }else{
      console.log(false);
  }

  if (!priority_list.includes(priority)) {
      valid_details.push('priority');
  }
  if (!hardware_list.includes(hardware_id)) {
      valid_details.push('hardware-id');
  }
  if (!os_list.includes(os)) {
      valid_details.push('operating-system');
  }
  if (!software_list.includes(software)) {
      valid_details.push('software');
  }
  if (!probtype_list.includes(problem_type)) {
      valid_details.push('problem-type');
  }
  if (!handler_list.includes(handler_name)) {
      valid_details.push('handler-name');
  }


  if (valid_details.length != 0) {

      console.log("I am not null");
      for (const element of valid_details) {
          document.querySelector('#'+element).style.borderColor = 'rgb(255,0,51)';
          document.querySelector(`label[for='${element}']`).style.color = 'rgb(255,0,51)';
          document.querySelector(`#${element}-error`).innerHTML = 'Invalid Field';
          temp_error.push(element);

      }    

      document.querySelector('#'+valid_details[0]).scrollIntoView({behaviour: "smooth", block: "center"});

  } else if(valid_details.length == 0){
      
      for (const element of errors) {
  
          document.querySelector(`#${element}-error`).style.display = 'none';
      }
  

      var problemDescription = document.getElementById('problem_description').value;//="";
      console.log(problemDescription);
  
      

      var status1 = document.getElementById('status').value;//="";
      console.log(status1);


      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          
      const data = {
        employee_name: employee_name,
        statuss: status1,
        priorityy: priority,
        soft_name: software,
        hardID: hardware_id,
        h_name: handler_name,
        prob_type: problem_type,
        prob_desc: problem_description,
        os: os,
        notess: notes,
        date: date
      }
      //console.log(handler_name);
      console.log(data);
      console.log(data.statuss); 
      socket.emit("add_ticket", data);
  
      //popupCreator("Ticket Submitted");
  

      document.getElementById('employee_name').value="";
      document.getElementById('status').value="active";
      document.getElementById('priority').value="";
      document.getElementById('software').value="";
      document.getElementById('problem-type').value="";
      document.getElementById('hardware-id').value="";
      document.getElementById('handler-name').value="";
      document.getElementById('operating-system').value="";
      document.getElementById('description').value="";
      document.getElementById('notes').value="";

      document.querySelector(".AddTicketContainer").style.display="none";
      document.querySelector("#add-btn").style.display="block";
      document.querySelector("#cancel-btn").style.display="none";
  }


    
});


document.querySelector("#cancel-btn").addEventListener("click", (e) => {
  document.querySelector(".AddTicketContainer").style.display="none";
  document.querySelector("#add-btn").style.display="block";
  document.querySelector("#cancel-btn").style.display="none";

  document.getElementById('employee_name').value="";
  document.getElementById('status').value="active";
  document.getElementById('priority').value="";
  document.getElementById('software').value="";
  document.getElementById('problem-type').value="";
  document.getElementById('hardware-id').value="";
  document.getElementById('handler-name').value="";
  document.getElementById('operating-system').value="";
  document.getElementById('description').value="";
  document.getElementById('notes').value="";
  

});