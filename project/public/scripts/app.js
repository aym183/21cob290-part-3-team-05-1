/**
 * Defines functions and event listeners responsible for
 * functionality on the operator and specialist home page.
 */


var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}

var problemTypes = [];

ready(() => { 
    // loadData(); 
    // getProblemTypes();
});


function sendTicket(data) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "../../server.js");
    xhttp.setRequestHeader("Content-type", 'application/json');
    xhttp.send(data);
}


//Used in Update button function
var old_priority;
var old_hardwareId;
var old_os;
var old_softwareName;
var old_description;
var old_notes;
var old_problemType;
var old_handlerName;

/**
 * Fetches and displays ticket info on operator home page
 * @param {object} data containing ticket ID and status
 */
function showTicketInfo(data) {   
    

        old_priority = data.priority;
        old_hardwareId = data.hardware_id;
        old_os = data.operating_system;
        old_softwareName = data.software;
        old_description = description;
        old_notes = data.notes;
        old_problemType = data.name;
        old_handlerName = data.Handler;

        console.log(data); 
        document.getElementById('detail-status').innerHTML =  data.status;
        document.getElementById('detail-id').innerHTML = data.ticket_id;
        document.getElementById('priority').setAttribute("value", data.priority);
        document.getElementById('hardware-id').setAttribute("value", data.hardware_id);
        document.getElementById('hardware-type').setAttribute("value", data.manufacturer);
        document.getElementById('hardware-model').setAttribute("value", data.model);
        document.getElementById('hardware-make').setAttribute("value", data.make);
        document.getElementById('operating-system').setAttribute("value", data.operating_system);
        document.getElementById('software').setAttribute("value", data.software);
        document.getElementById('description').innerHTML = data.problem_description;
        document.getElementById('notes').innerHTML = data.notes;
        document.getElementById('problem-type').setAttribute("value", data.name);
        document.getElementById('notes').setAttribute("value", data.notes);
        document.getElementById('handler-name').setAttribute("value", data.Handler);

// data.solution_status == 'submitted' || 
        if (data.status == 'submitted') {
            const pending_solution = data.solution_description;
            document.getElementById('solution-area').value = pending_solution;
            
        } else if (data.status == 'closed') {
            const successful_solution = data.solution_description;
            document.getElementById('solution-area').value = "";
            document.getElementById('solution').value = successful_solution;
            document.getElementById('close-time').value = data.closing_time;
        } else {
            document.getElementById('solution-area').value = ""; 
        }
        // } else if (data.status == 'unsuccessful') {
        //     const unsuc_solution = info['solution_description'];
        // } 

        var op_body = document.querySelector(".op-ticket-body");
        op_body && op_body.querySelectorAll("tr").forEach(row => { 
            row.addEventListener("click", (e) => {
                var status = data.status;
                
                if (status=="submitted") {
        
                    var c = document.querySelectorAll('.closed__field');
                    for (var i = 0; i < c.length; i++) {
                         c[i].style.display = 'none';
                    }
                    document.querySelector(".closeForm__section").style.display = "block";
                    if (document.querySelector(".checkmark") !== null) {
                        document.querySelector('.checkmark').classList.remove('checked');
                        document.querySelector('.checkmark').classList.add('unchecked');
                        document.querySelector("#submit-btn").setAttribute('disabled','disabled');
                        document.querySelector("#submit-btn").style.cursor = "default";
                        document.querySelector(".closeButton").style.opacity = "0.3";
                    }
                    
                    document.querySelector('.solution-status').innerText = "Solution Submitted";
                    document.querySelector(".solution-status").style.color = "rgb(3, 149, 3)";
        
                    document.querySelector(".discard-solution").style.display = "block";
        
                }
                else if (status=="unsuccessful") {
                    document.querySelector(".closeForm__section").style.display = "block";
                }
                else if (status=="dropped") {
                    var c = document.querySelectorAll('.closed__field');
                    for (var i = 0; i < c.length; i++) {
                         c[i].style.display = 'none';
                    }
                    if (document.querySelector(".checkmark") !== null) {
                        document.querySelector(".closeForm__section").style.display = "block";
                        // document.querySelector('.checkmark').classList.remove('checked');
                        // document.querySelector('.checkmark').classList.add('unchecked');x                        document.querySelector("#submit-btn").setAttribute('disabled','disabled');
                        document.querySelector("#submit-btn").style.cursor = "default";
                        document.querySelector(".closeButton").style.opacity = "0.3";
                    }
                    
                    document.querySelector('.solution-status').innerText = "Solution Dropped";
                    document.querySelector(".solution-status").style.color = "rgb(179, 5, 5)";
        
                    document.querySelector(".discard-solution").style.display = "none";
                    
                }
                else if (status=="closed") {
                    var c = document.querySelectorAll('.closed__field');
                    for (var i = 0; i < c.length; i++) {
                         c[i].style.display = 'block';
                    }
        
                    document.querySelector(".closeForm__section").style.display = "none";
                    document.querySelector("#solution").style.display = "block";
                   

                }
                else {
                    var c = document.querySelectorAll('.closed__field');
                    for (var i = 0; i < c.length; i++) {
                         c[i].style.display = 'none';
                    }
                    if (document.querySelector(".checkmark") !== null) {
                        document.querySelector(".closeForm__section").style.display = "block";
                        document.querySelector('.checkmark').classList.remove('checked');
                        document.querySelector('.checkmark').classList.add('unchecked');
                        document.querySelector("#submit-btn").setAttribute('disabled','disabled');
                        document.querySelector("#submit-btn").style.cursor = "default";
                        document.querySelector(".closeButton").style.opacity = "0.3";
                    }
                    
                    document.querySelector('.solution-status').innerText = "";
        
                    document.querySelector(".discard-solution").style.display = "none";
                }

                
            }); 
        })  

   
}

/**
 * Updates ticket information in database
 * @param {object} data containing ticket information to be updated
 */
function updateTicketInfo(data) {
    const socket = io()
    socket.emit('update_message',  data);

    // socket.on('message', function(data, json) {
    //     showTicketInfo(json[0]); 
    // });
}

// Table row (Ticket) Clicked
ready(() => { 
    const socket = io()
    // const socket = io('ws//localhost:5005')
    document.querySelector(".ticket__table tbody").addEventListener("click", (e) => {
        document.querySelector("#ticket-info").style.display = "flex";
        document.querySelector("#info-headers").style.display = "block";
        document.querySelector("#ticketList-container").style.display = "none";
        
        
        const data = {
            id: e.target.closest("tr").children[1].textContent,
            status: e.target.closest("tr").children[0].textContent
        }
// Creation of socket
        console.log(data);
        socket.emit('message',  data);

        // after data is recieved, calling function to show ticket info
        socket.on('message', function(data, json) {
            console.log(json[0]);
        
            showTicketInfo(json[0]); 
          });
        
        
        // console.log(data);
        const jsonString = JSON.stringify(data)

        var status = data.status;
     
        
        if (status=="submitted") {
            
            var c = document.querySelectorAll('.closed__field');
            for (var i = 0; i < c.length; i++) {
                 c[i].style.display = 'none';
            }
            if (document.querySelector(".checkmark") !== null) {
                document.querySelector('.checkmark').classList.remove('checked');
                document.querySelector('.checkmark').classList.add('unchecked');
                document.querySelector("#submit-btn").setAttribute('disabled','disabled');
                document.querySelector("#submit-btn").style.cursor = "default";
                document.querySelector(".closeButton").style.opacity = "0.3";
            }
            
            document.querySelector('.solution-status').innerText = "Solution Submitted";
            document.querySelector(".solution-status").style.color = "rgb(3, 149, 3)";

            if (document.querySelector(".discard-solution") !== null) {
                document.querySelector(".discard-solution").style.display = "block";
            }

        }
        else if (status=="pending") {

            var c = document.querySelectorAll('.closed__field');
            for (var i = 0; i < c.length; i++) {
                 c[i].style.display = 'none';
            }
            if (document.querySelector(".checkmark") !== null) {
                document.querySelector(".closeForm__section").style.display = "block";
                document.querySelector('.checkmark').classList.remove('unchecked');
                document.querySelector('.checkmark').classList.add('checked');
                document.querySelector("#submit-btn").removeAttribute('disabled');
                document.querySelector("#submit-btn").style.cursor = "pointer";
                document.querySelector(".closeButton").style.opacity = "1";
            }
            
            document.querySelector('.solution-status').innerText = "Solution Submitted";
            document.querySelector(".solution-status").style.color = "rgb(3, 149, 3)";

            if (document.querySelector(".discard-solution") !== null) {
                document.querySelector(".discard-solution").style.display = "block";
            }
        }
        else if (status=="unsuccessful") {
            var c = document.querySelectorAll('.closed__field');
            for (var i = 0; i < c.length; i++) {
                 c[i].style.display = 'none';
            }
            if (document.querySelector(".checkmark") !== null) {
                document.querySelector(".closeForm__section").style.display = "block";
                document.querySelector('.checkmark').classList.remove('checked');
                document.querySelector('.checkmark').classList.add('unchecked');
                document.querySelector("#submit-btn").setAttribute('disabled','disabled');
                document.querySelector("#submit-btn").style.cursor = "default";
                document.querySelector(".closeButton").style.opacity = "0.3";
            }
            
            document.querySelector('.solution-status').innerText = "";

            if (document.querySelector(".discard-solution") !== null) {
                document.querySelector(".discard-solution").style.display = "none";
            }
        }
        else if (status=="dropped") {
            var c = document.querySelectorAll('.closed__field');
            for (var i = 0; i < c.length; i++) {
                 c[i].style.display = 'none';
            }
            if (document.querySelector(".checkmark") !== null) {
                document.querySelector(".closeForm__section").style.display = "block";
                document.querySelector('.checkmark').classList.remove('checked');
                document.querySelector('.checkmark').classList.add('unchecked');
                document.querySelector("#submit-btn").setAttribute('disabled','disabled');
                document.querySelector("#submit-btn").style.cursor = "default";
                document.querySelector(".closeButton").style.opacity = "0.3";
            }
            
            document.querySelector('.solution-status').innerText = "Solution Dropped";
            document.querySelector(".solution-status").style.color = "rgb(179, 5, 5)";

            if (document.querySelector(".discard-solution") !== null) {
                document.querySelector(".discard-solution").style.display = "none";
            }
            
        }
        else if (status=="closed") {
            var c = document.querySelectorAll('.closed__field');
            for (var i = 0; i < c.length; i++) {
                 c[i].style.display = 'block';
            }

            document.querySelector(".closeForm__section").style.display = "none";
        }
        else {
            var c = document.querySelectorAll('.closed__field');
            for (var i = 0; i < c.length; i++) {
                 c[i].style.display = 'none';
            }
            
            if (document.querySelector(".checkmark") !== null) {
                document.querySelector(".closeForm__section").style.display = "block";
                document.querySelector('.checkmark').classList.remove('checked');
                document.querySelector('.checkmark').classList.add('unchecked');
                document.querySelector("#submit-btn").setAttribute('disabled','disabled');
                document.querySelector("#submit-btn").style.cursor = "default";
                document.querySelector(".closeButton").style.opacity = "0.3";
            }

            
            document.querySelector('.solution-status').innerText = "";

            if (document.querySelector(".discard-solution") !== null) {
                document.querySelector(".discard-solution").style.display = "none";
            }
        } 

        if (document.querySelector(".discard-solution") !== null) {
            for (const element of operator_table) {
                if (element['name'].includes(e.target.closest("tr").children[5].textContent)) {
                    document.querySelector(".discard-solution").style.display = "none";
                    document.querySelector(".previous-solution").style.display = "block";
                    break;
    
                } else {
                    document.querySelector(".previous-solution").style.display = "none";
                }
            }
        }
    });
  
});

// EDIT BUTTON ----------------
ready(() => { 
    document.querySelector("#edit-btn").addEventListener("click", (e) => {
        const edit_btn = document.querySelector("#edit-btn");

        if (!edit_btn.classList.contains('pushed-btn')) {
            edit_btn.classList.add('pushed-btn');
            document.querySelector('#edit-btn').style.color = 'var(--buttonTextColor)';
            document.querySelector('#edit-btn').style.backgroundColor = 'var(--buttonHover)';

            
                
            document.querySelectorAll(".ticket__information .edit-field").forEach(field => { 
                field.style.pointerEvents = "all",
                field.style.backgroundColor = "white",
                field.style.borderColor = 'black';
                field.removeAttribute("readonly")    
                })
            
            document.querySelector(".update__section").style.display = "block";
        } else {
            edit_btn.classList.remove('pushed-btn');
            document.querySelector('#edit-btn').style.color = null;
            document.querySelector('#edit-btn').style.backgroundColor = null;

            document.querySelectorAll(".ticket__information .edit-field").forEach(field => { 
                field.style.pointerEvents = "none",
                field.style.backgroundColor = "rgb(236, 236, 236)",
                field.setAttribute("readonly", true) 
                field.style.borderColor = "#ccc";
            })
            document.querySelectorAll(".ticket__information label").forEach(label => { 
                label.style.color = "black";   
            })
            document.querySelector(".update__section").style.display = "none";
            document.querySelector("#emp-table__container").style.display = "none";
            //enable ticket history button once not in edit mode
            
        }


    });    
});

// Update Button clicked
ready(() => { 
    document.querySelector("#update-btn").addEventListener("click", (e) => {
        
        
        const priority = document.getElementById("priority").value;
        const hardware_id = document.getElementById("hardware-id").value;
        const os = document.getElementById("operating-system").value;
        const software = document.getElementById("software").value;
        const problem_description = document.getElementById("description").value;
        const notes = document.getElementById("notes").value;
        const problem_type = document.getElementById("problem-type").value;
        const handler_name = document.getElementById("handler-name").value;

        const changed_values = [];
        const changed_names = [];

        if(old_priority != priority){
            changed_values.push(priority);
            changed_names.push('priority');
            old_priority = priority;
        }
        if(old_hardwareId != hardware_id){
            changed_values.push(hardware_id);
            changed_names.push('hardware');
            old_hardwareId = hardware_id;
        }
        if(!(old_os == null && os == "null") && old_os != os){
            if(os == ""){
                changed_values.push("null");
                changed_names.push('OS');
            }else{
                changed_values.push(os);
                changed_names.push('OS');
                old_os = os;
            }
        }
        if(old_softwareName != software){
            changed_values.push(software);
            changed_names.push('software');
            old_softwareName = software;
        }
        if(old_description != description){
            changed_values.push(description);
            changed_names.push('description');
            old_description = description;
        }
        if(old_notes != notes){
            changed_values.push(notes);
            changed_names.push('notes');
            old_notes = notes;
        }
        if(old_problemType != problem_type){
            changed_values.push(problem_type);
            changed_names.push('problem type');
            old_problemType = problem_type;
        }
        if(old_handlerName != handler_name){
            changed_values.push(handler_name);
            changed_names.push('handler');
            old_handlerName = handler_name;
        }
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes();
        var dateTime = date+' '+time;


            var today = new Date();

            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

            const ticket_details = {
                priority: priority,
                hardware_id: hardware_id,
                os: os,
                software: software,
                problem_description: problem_description,
                notes: notes,
                problem_type: problem_type,
                handler_name: handler_name,
                last_updated: date,
                id: document.getElementById('detail-id').innerHTML
            };

            const changed_details = {
                id: document.getElementById('detail-id').innerHTML,
                changed_values: changed_values,
                changed_names: changed_names,
                current_dateTime: dateTime,
                current_handler_uname: document.getElementById("profile-username").getElementsByTagName("p")[0].innerHTML
            };
            console.log(changed_details);

            updateTicketInfo(ticket_details);
           
            
            document.querySelector('#edit-btn').classList.remove('pushed-btn');
            document.querySelector('#edit-btn').style.color = null;
            document.querySelector('#edit-btn').style.backgroundColor = null;

            document.querySelectorAll(".ticket__information .edit-field").forEach(field => { 
                field.style.pointerEvents = "none",
                field.style.backgroundColor = "rgb(236, 236, 236)",
                field.setAttribute("readonly", true) 
                field.style.borderColor = "#ccc";
            })
            document.querySelectorAll(".ticket__information label").forEach(label => { 
                label.style.color = "black";   
            })
            document.querySelector(".update__section").style.display = "none";
            // document.querySelector("#emp-table__container").style.display = "none";
            
            if(document.getElementsByClassName("ticket_history_section")[0]){
                document.getElementById("ticket_history_btn").disabled = false;
            }
        // }    

    });    
});

ready(() => { 

    // discard solution button
    var drop_btn = document.querySelector("#dropSolution-btn");
    drop_btn && drop_btn.addEventListener("click", (e) => {

        document.getElementById('solution-area').value = "";
        document.querySelector("#submit-btn").setAttribute('disabled','disabled');
        document.querySelector("#submit-btn").style.cursor = "default";
        document.querySelector(".closeButton").style.opacity = "0.3";

        document.querySelector('.solution-status').innerText = "Solution Discarded";
        document.querySelector(".solution-status").style.color = "rgb(179, 5, 5)";

        document.querySelector(".discard-solution").style.display = "none";

        const data = {
            new_status: 'unsuccessful',
            solution: document.getElementById('solution-area').value,
            id: document.getElementById('detail-id').innerHTML
        };
        
        changeStatus(data);
    }); 


    // Previous Fixes button on close form
    

});


// Input Fields Events
ready(() => { 
    const callerbtn = document.querySelector("#caller-btn");
    callerbtn && callerbtn.addEventListener("click", (e) => {
        const caller_btn = document.querySelector("#caller-btn");

        if (!caller_btn.classList.contains('pushed-btn')) {
            caller_btn.classList.add('pushed-btn');
            document.querySelector('#caller-btn').style.color = 'var(--buttonTextColor)';
            document.querySelector('#caller-btn').style.backgroundColor = 'var(--buttonHover)';

            document.querySelector('#emp-table__container').style.display = 'block';
            document.querySelector('.emp-search__container').style.display = 'flex';
            document.querySelector('#emp-details__table th:nth-child(3)').style.borderRadius = '0px';
            const emp_name = document.querySelector("#caller-search").value;
            
            ticketDetailTable('emp_name' ,emp_name); 
        }
        else {
            caller_btn.classList.remove('pushed-btn');
            document.querySelector('#caller-btn').style.color = null;
            document.querySelector('#caller-btn').style.backgroundColor = null;

            document.querySelector('#emp-table__container').style.display = 'none';
            document.querySelector('.emp-search__container').style.display = 'none';

        }         
    });

    document.querySelector("#handler-name").addEventListener("click", (e) => {
        document.querySelector('.emp-search__container').style.display = 'none';
        document.querySelector('#emp-table__container').style.display = 'block';
        document.querySelector('#emp-details__table th:nth-child(3)').style.borderRadius = '0 0px 10px 0';
        
        const handler_name =  document.querySelector("#handler-name").value;

        ticketDetailTable('handler_name', handler_name);         
    });
   
    var emp_details_section = document.querySelector("#emp-details__table tbody");
    emp_details_section && emp_details_section.addEventListener("click", (e) => {
        if (document.querySelector(".switch_table").style.display == "table-cell") {
            const employee_name = e.target.closest("tr").children[0].textContent;
            const employee_id = e.target.closest("tr").children[1].textContent;
            const employee_phone = e.target.closest("tr").children[4].textContent;
            document.querySelector("#caller-name").value = employee_name;
            document.querySelector("#caller-id").value = employee_id;
            document.querySelector("#caller-phone").value = employee_phone;
            document.querySelector("#caller-search").value = "";
            const ticket_details = {
                id: document.getElementById('detail-id').innerHTML, 
                caller_id: employee_id
            };
            const jsonString = JSON.stringify(ticket_details)
            updateTicketInfo(jsonString);
        } else if (document.querySelector(".switch_table").style.display == "none") {
            const handler_name = e.target.closest("tr").children[0].textContent;
            document.querySelector("#handler-name").value = handler_name;
        }
        
        document.querySelector('#emp-table__container').style.display = 'none';
        document.querySelector('#caller-btn').classList.remove('pushed-btn');
        document.querySelector('#caller-btn').style.color = null;
        document.querySelector('#caller-btn').style.backgroundColor = null;
    });
    
    const callersearch = document.querySelector("#caller-search");
    callersearch && callersearch.addEventListener("input", (e) => {
        var emp_name = document.querySelector("#caller-search").value;
    
        ticketDetailTable('emp_name' ,emp_name);
        
    });

    document.querySelector("#handler-name").addEventListener("input", (e) => {
        var handler_name =  document.querySelector("#handler-name").value;
        
        ticketDetailTable('handler_name', handler_name);
        
    });
    
    document.querySelectorAll(".ticket__information .edit-field").forEach(field => { 
        field.addEventListener("keydown", (e) => {
            if (e.target.style.borderColor == 'rgb(255, 0, 51)') {
                const id_name = e.target.getAttribute('id');
                document.querySelector(`label[for='${id_name}']`).style.color = 'black';
                document.querySelector('#'+id_name).style.borderColor = 'black';
                document.querySelector(`#${id_name}-error`).innerHTML = '';
            }
        });
    });
    
});

// Manages employee and handler tables for input fields in ticket details page
function ticketDetailTable(table_type, input) {
    
    document.querySelector('#emp-details__table tbody').innerHTML = "";

    var detail_type;
    var data_type;

    var details_table = document.querySelector("#emp-details__table tbody");

    if (table_type == 'emp_name') {
        document.querySelector("#emp-table__container").style.gridRow = 2;
        document.querySelectorAll(".switch_table").forEach(field => { 
            field.style.display = 'table-cell';       
        })
        detail_type = 'name';
        data_type = emp_table;

        for (const element of data_type) {
            if (element[detail_type].includes(input) || element['employee_id'].includes(input)) {
                var row = details_table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML = element['name'];
                cell2.innerHTML = element['employee_id'];
                cell3.innerHTML = element['job'];
                if (table_type == 'emp_name' || table_type == 'emp_id') {
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4); 
                    cell4.innerHTML = element['department'];
                    cell5.innerHTML = element['telephone'];  
                }
    
            }
        }
    } else if (table_type == 'handler_name') {
        document.querySelector("#emp-table__container").style.gridRow = 20;
        document.querySelectorAll(".switch_table").forEach(field => { 
            field.style.display = 'none';       
        })
        detail_type = 'name';
        data_type = handler_table;

        for (const element of data_type) {
            if (element[detail_type].includes(input)) {
                var row = details_table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML = element['name'];
                cell2.innerHTML = element['employee_id'];
                cell3.innerHTML = element['job'];
                if (table_type == 'emp_name' || table_type == 'emp_id') {
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4); 
                    cell4.innerHTML = element['department'];
                    cell5.innerHTML = element['telephone'];  
                }
    
            }
        }
    }
}

ready(() => { 
    document.querySelector("#editSolution-btn").addEventListener("click", (e) => {
        const edit_btn = document.querySelector("#editSolution-btn");

        if (!edit_btn.classList.contains('pushed-btn')) {
            edit_btn.classList.add('pushed-btn');
            document.querySelector('#editSolution-btn').style.color = 'var(--buttonTextColor)';
            document.querySelector('#editSolution-btn').style.backgroundColor = 'var(--buttonHover)';

            
                
            document.querySelectorAll("#solution-area").forEach(field => { 
                field.style.pointerEvents = "all",
                field.style.backgroundColor = "white",
                field.style.borderColor = 'black';
                field.removeAttribute("readonly")    
                })
            
                document.querySelector(".solutionArea__section").style.backgroundColor = "white";
            // document.querySelector(".update__section").style.display = "block";
        } else {
            edit_btn.classList.remove('pushed-btn');
            document.querySelector('#editSolution-btn').style.color = null;
            document.querySelector('#editSolution-btn').style.backgroundColor = null;

            document.querySelectorAll(".solution-area").forEach(field => { 
                field.style.pointerEvents = "none",
                field.style.backgroundColor = "rgb(236, 236, 236)",
                field.setAttribute("readonly", true) 
                field.style.borderColor = "#ccc";
            })
            // document.querySelectorAll(".ticket__information label").forEach(label => { 
            //     label.style.color = "black";   
            // })
            // document.querySelector(".update__section").style.display = "none";
            // document.querySelector("#emp-table__container").style.display = "none";
            //enable ticket history button once not in edit mode
            
        }


    });    
});

//Ticket Submission
ready(() => { 

    const refreshPage = () => {
        location.reload();
      }

    document.querySelector("#submit-btn").addEventListener("click", (e) => {
        console.log("Solution");
        socket = io();
    // submit_btn && submit_btn.addEventListener("click", (e) => {
        var submit_solution =  document.getElementById("solution-area").value;   
        var ticket_status = document.getElementById('detail-status').innerHTML;
        var ticket_id = document.getElementById('detail-id').innerHTML;
        var handler_name =document.getElementById('handler-name').value;
        const data = {
            solution: submit_solution,
            status: ticket_status,
            id: ticket_id,
            h_name: handler_name
        }
        //console.log(handler_name);
        console.log(data);
        console.log(submit_solution); 
        socket.emit("Submit-Ticket", data);

        console.log(ticket_status);
    });
    


});

