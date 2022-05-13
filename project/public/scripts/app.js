/**
 * Defines functions and event listeners responsible for
 * functionality on the operator and specialist home page.
 */

var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}
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

var span_list = [hardware_list, os_list, software_list, probtype_list, handler_list];

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
 * Function that converts date from GMT format to YYYY-MM-DD format
 */

function convertDate(){

    const element = document.getElementById("ticket-body");
    const nodes = element.getElementsByTagName("tr");

    for(let i = 0; i<nodes.length; i++){
        var iteration = element.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML;
        var date = new Date(iteration).toLocaleDateString();
        element.getElementsByTagName("tr")[i].getElementsByTagName("td")[4].innerHTML= date;
    }
}


/**
 * Fetches and displays ticket info on operator home page
 * @param {object} data containing ticket ID and status
 */
function showTicketInfo(data) {  

        old_priority = data.priority;
        old_hardwareId = data.hardware_id;
        old_os = data.operating_system;
        old_softwareName = data.software;
        old_description = data.problem_description;
        old_notes = data.notes;
        old_problemType = data.name;
        old_handlerName = data.Handler;
        
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

        /* Solution displaying operations for particular ticket status */
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
                    document.querySelector(".solutionArea__section").style.display = "block";
                    document.querySelector("#submit-btn").setAttribute('disabled','disabled');
                    document.querySelector("#submit-btn").style.cursor = "default";
                    document.querySelector("#submit-btn").style.opacity = "0.3";
                    document.querySelector('.solution-status').innerText = "Solution Submitted";
                    document.querySelector(".solution-status").style.color = "rgb(3, 149, 3)";
        
                }
                else if (status=="unsuccessful") {
                    document.querySelector(".closeForm__section").style.display = "block";
                }
                else if (status=="dropped") {
                    var c = document.querySelectorAll('.closed__field');
                    for (var i = 0; i < c.length; i++) {
                         c[i].style.display = 'none';
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
function updateTicketInfo(data, status) {
    const socket = io()
    
    if(status == "handler"){
        socket.emit('dropped_update', data.id);
    } 
    const socket2 = io()
    socket2.emit('update_message',  data);
}

// Handles operations when ticket row has been clicked
ready(() => { 
    const socket = io()
    document.querySelector(".ticket__table tbody").addEventListener("click", (e) => {
        document.querySelector("#ticket-info").style.display = "flex";
        document.querySelector("#info-headers").style.display = "block";
        document.querySelector("#ticketList-container").style.display = "none";
        
        
        const data = {
            id: e.target.closest("tr").children[1].textContent,
            status: e.target.closest("tr").children[0].textContent
        }
        socket.emit('message',  data);

        // after data is recieved, calling function to show ticket info
        socket.on('message', function(data, json) {
            showTicketInfo(json[0]); 
            socket.destroy();
          });
        
        const jsonString = JSON.stringify(data)
        var status = data.status;
     
        
        if (status=="submitted") {
            
            var c = document.querySelectorAll('.closed__field');
            for (var i = 0; i < c.length; i++) {
                 c[i].style.display = 'none';
            }
            
            //Submit button disabled
            if(document.title == "Specialist Home Page" || document.title == "External Specialist Home Page"){
                document.querySelector(".solutionArea__section").style.display = "block";
                document.querySelector("#submit-btn").setAttribute('disabled','disabled');
                document.querySelector("#submit-btn").style.cursor = "default";
                document.querySelector("#submit-btn").style.opacity = "0.3";
                document.querySelector('.solution-status').innerText = "Solution Submitted";
                document.querySelector(".solution-status").style.color = "rgb(3, 149, 3)";
            }
            else{
                document.querySelector('.solution-status').innerText = "Solution Submitted";
                document.querySelector(".solution-status").style.color = "rgb(3, 149, 3)";
            }

            if (document.querySelector(".discard-solution") !== null) {
                document.querySelector(".discard-solution").style.display = "block";
            }

        }
        else if(status == "unsolvable"){

            var c = document.querySelectorAll('.closed__field');
            for (var i = 0; i < c.length-4; i++) {
                 c[i].style.display = 'block';
            }

            document.querySelector("#edit-btn").style.display = "none";
            document.querySelector("#handler-name").style.display = "none";
            document.querySelector("#handler-remove").style.display = "none";
            document.querySelector(".closeForm__section").style.display = "none";

        }
        else if (status=="unsuccessful") {
            var c = document.querySelectorAll('.closed__field');
            for (var i = 0; i < c.length; i++) {
                 c[i].style.display = 'none';
            }
            
            document.querySelector(".closeForm__section").style.display = "block";
            document.querySelector("#dropSolution-btn").style.display = "none";
            document.querySelector("#close-btn").setAttribute('disabled','disabled');
            document.querySelector("#close-btn").style.opacity = "0.3";
            document.querySelector("#submit-btn").setAttribute('disabled','disabled');
            document.querySelector("#submit-btn").style.cursor = "default";
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
        
            document.querySelector(".closeForm__section").style.display = "block";
            document.querySelector("#dropSolution-btn").style.display = "none";
            document.querySelector("#close-btn").setAttribute('disabled','disabled');
            document.querySelector("#close-btn").style.opacity = "0.3";
            document.querySelector("#submit-btn").setAttribute('disabled','disabled');
            document.querySelector("#submit-btn").style.cursor = "default";
           
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
        
            if(document.title == "Home Page"){

                document.querySelector(".closeForm__section").style.display = "block";
                document.querySelector("#dropSolution-btn").style.display = "none";
                document.querySelector("#close-btn").setAttribute('disabled','disabled');
                document.querySelector("#close-btn").style.opacity = "0.3";

            }
            else{

                document.querySelector("#submit-btn").style.opacity = "0.3";
                document.querySelector("#submit-btn").setAttribute('disabled','disabled');
                document.querySelector("#submit-btn").style.cursor = "default";      

            }
            document.querySelector('.solution-status').innerText = "";

            if (document.querySelector(".discard-solution") !== null) {
                document.querySelector(".discard-solution").style.display = "none";
            }
        } 
    });

    if(document.title == "Specialist Home Page" || document.title == "External Specialist Home Page"){
        document.querySelector("#spec-editSolution-btn").addEventListener("click", (e) => {
            // Solution edit button styling on click
            if (document.querySelector("#spec-editSolution-btn").innerHTML == "edit") {
                
                document.querySelector("#solution-area").style.backgroundColor = "white";
                document.querySelector(".solutionArea__section").style.backgroundColor = "white";
                document.querySelector("#solution-area").style.pointerEvents = "all";
                document.querySelector("#spec-editSolution-btn").innerHTML = "Update";

            }
            // Solution update button styling on click
            else if (document.querySelector("#spec-editSolution-btn").innerHTML == "Update") {

                document.querySelector("#solution-area").style.backgroundColor = "rgb(236, 236, 236)";
                document.querySelector(".solutionArea__section").style.backgroundColor = "rgb(236, 236, 236)";
                document.querySelector("#solution-area").style.pointerEvents = "none";
                document.querySelector("#spec-editSolution-btn").innerHTML = "edit";            
            }   
        });
    }
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
        }
    });    
});

// UPDATE BUTTON CLICKED ---------
ready(() => { 
    document.querySelector("#update-btn").addEventListener("click", (e) => {
        
        for(let i = 0; i<data_lists.length; i++){
            var current_list = span_list[i];
            var x = document.getElementById(data_lists[i]);
            var j;
            for (j = 0; j < x.options.length; j++) {
                current_list.push(x.options[j].value);
            }
        }
    
        /* Error handling on update click to check if all inputs are valid */
        const priority = document.getElementById("priority").value;
        const hardware_id = document.getElementById("hardware-id").value;
        const os = document.getElementById("operating-system").value;
        const software = document.getElementById("software").value;
        const problem_description = document.getElementById("description").value;
        const notes = document.getElementById("notes").value;
        const problem_type = document.getElementById("problem-type").value;
        const handler_name = document.getElementById("handler-name").value;

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

            /* Displaying error on invalid inputs */
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

                const changed_values = [];
                const changed_names = [];

                /* Operations for checking which inputs have been changed to update ticket and history log in db */
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
                if(old_description != problem_description){
                    changed_values.push(problem_description);
                    changed_names.push('description');
                    old_description = problem_description;
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

                    /* Ticket details object to update ticket */
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
                        id: document.getElementById('detail-id').innerHTML,
                        status: document.getElementById('detail-status').innerHTML
                    };

                    /* changed details object to update history log */
                    const changed_details = {
                        id: document.getElementById('detail-id').innerHTML,
                        changed_values: changed_values,
                        changed_names: changed_names,
                        current_dateTime: dateTime,
                        current_handler_uname: document.getElementById("profile-username").getElementsByTagName("p")[0].innerHTML
                    };
                    
                    if(changed_names.includes("handler") && ticket_details.status == "dropped"){

                        updateTicketInfo(ticket_details, "handler");

                    } else{

                        updateTicketInfo(ticket_details, "none");

                    }
                    
                    socket = io();
                    socket.emit('ticket_update_history',  changed_details);
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
                    if(document.getElementsByClassName("ticket_history_section")[0]){
                        document.getElementById("ticket_history_btn").disabled = false;
                    }
        }

    });    
});

// DISCARD SOLUTION BUTTON ---------
ready(() => { 

    var drop_btn = document.querySelector("#dropSolution-btn");
    drop_btn && drop_btn.addEventListener("click", (e) => {

        document.getElementById('solution-area').value = "";
        document.querySelector("#close-btn").setAttribute('disabled','disabled');
        document.querySelector("#close-btn").style.cursor = "default";
        document.querySelector("#close-btn").style.opacity = "0.3";
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

});

// EDIT SOLUTION BUTTON -------
ready(() => { 

    if(document.title == "Specialist Home Page" || document.title == "External Specialist Home Page"){

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
            }
        });    
    }
});

// SOLUTION SUBMISSION --------
ready(() => { 

    if(document.title == "Specialist Home Page" || document.title == "External Specialist Home Page"){
        document.querySelector("#submit-btn").addEventListener("click", (e) => {
            socket = io();
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

            socket.emit("Submit-Ticket", data);
            popupCreator("submitSolution", "Are you sure you want to submit ticket?", "", "Cancel", "Confirm");
        });
    }    
});

// DROP TICKET BUTTON ----------
ready(() => { 

    var drop_btn = document.querySelector("#drop-btn");
    drop_btn && drop_btn.addEventListener("click", (e) => {
        socket = io();
        popupCreator("drop", "Are you sure you want to drop ticket?", "", "Cancel", "Confirm");
    });
});

// LOGOUT BUTTON ---------
ready(() => { 

    var logout_btn = document.querySelector("#logout-btn");
    logout_btn && logout_btn.addEventListener("click", (e) => {
        socket = io();
        popupCreator("logout", "Are you sure you want to logout?", "", "Cancel", "Confirm");

});
});

// PAST EDITS BUTTON -------
ready(() => { 

document.querySelector("#ticket_history_btn").addEventListener("click", (e) => {
    const socket2 = io();
    var container = document.getElementsByClassName("ticket_history_container")[0];
    var old_err_msg = document.getElementById("err_ticket_history");
    var past_edits_container = document.createElement('div');
    past_edits_container.setAttribute("id","past_edits_container");
    if (container.style.display === "none") {
        

        //sending ticket id to query
        var ticket_Id = document.getElementById("detail-id").innerHTML;
        const ticketId_Obj = {
            ticketId: ticket_Id
        };
     
        var response;
        
        socket2.emit('display_history',  ticketId_Obj);
        socket2.on('display_history', function(data, json) {

            var info = data;
            
            if(info.length == 0){
                if(!old_err_msg){
                    const parent = document.getElementsByClassName("ticket_history_section")[0];
                    var error_msg = document.createElement("p");
                    error_msg.textContent = "There have been no changes to ticket since creation.";
                    error_msg.setAttribute("id", "err_ticket_history");
                    parent.appendChild(error_msg);
                }
            }else{
                if(old_err_msg){
                    old_err_msg.remove();
                }
            
                //each increment in loop goes through displaying a single edit
                for(let i = 0; i < info.length; i++){
                    var edit_container = document.createElement('div');
                    edit_container.setAttribute("class","edit_container");

                    var edit_leftside_section = document.createElement('div');
                    edit_leftside_section.setAttribute("class", "edit_leftside_section");
                    var changed_item_txt = document.createElement('p');
                    changed_item_txt.setAttribute("id","past_edit_item_txt");
                    const item_node = document.createTextNode(info[i]['edited_item']);
                    changed_item_txt.appendChild(item_node);
                    edit_leftside_section.appendChild(changed_item_txt);

                    var edit_main_container = document.createElement('div');
                    edit_main_container.setAttribute("class", "edit_main_container");

                    var edit_header_section = document.createElement('div');
                    edit_header_section.setAttribute("class", "edit_header_section");
                    var name_txt = document.createElement('p');
                    name_txt.setAttribute("id","past_edit_name_txt");
                    var id_txt = document.createElement('p');
                    id_txt.setAttribute("id","past_edit_id_txt");
                    var date_time_txt = document.createElement('p');
                    date_time_txt.setAttribute("id","past_edit_date_time_txt");
                    const name_node = document.createTextNode(info[i]['name']);
                    const id_node = document.createTextNode("("+info[i]['user_id']+")");
                    const date_time_node = document.createTextNode(info[i]['date_time']);
                    name_txt.appendChild(name_node);
                    id_txt.appendChild(id_node);
                    date_time_txt.appendChild(date_time_node);
                    edit_header_section.appendChild(name_txt);
                    edit_header_section.appendChild(id_txt);
                    edit_header_section.appendChild(date_time_txt);

                    var edit_bottom_section = document.createElement('div');
                    edit_bottom_section.setAttribute("class", "edit_bottom_section");
                    var newValueLabel_txt = document.createElement('p');
                    var changed_value_txt = document.createElement('p');
                    var newValueLabel_node = document.createTextNode("New Value :");
                    var changed_value_node = document.createTextNode(info[i]['new_value']);
                    newValueLabel_txt.appendChild(newValueLabel_node);
                    changed_value_txt.appendChild(changed_value_node);
                    edit_bottom_section.appendChild(newValueLabel_txt);
                    edit_bottom_section.appendChild(changed_value_txt);
                    
                    edit_main_container.appendChild(edit_header_section);
                    edit_main_container.appendChild(edit_bottom_section);
                    edit_container.appendChild(edit_leftside_section);
                    edit_container.appendChild(edit_main_container);
                    past_edits_container.appendChild(edit_container);
                    container.appendChild(past_edits_container);                    
                }

                container.style.display = "block";
                document.getElementById("ticket_history_btn").innerHTML="Hide Past Edit(s)";
              
            }
        });

    } else {
        document.getElementById("ticket_history_btn").innerHTML="Show Past Edit(s)";
        document.getElementById("past_edits_container").remove();
        container.style.display = "none";
    }
});
});

// OVERWRITING SUBMITTED SOLUTION ---------
ready(() => {

    document.querySelector("#solution-area").addEventListener('keyup', (e) => {
        if (document.querySelector('#solution-area').value == "") {
            document.querySelector("#submit-btn").setAttribute('disabled','disabled');
            document.querySelector("#submit-btn").style.cursor = "default";
            document.querySelector("#submit-btn").style.opacity = "0.3";  
        }
        else {
            document.getElementById("submit-btn").removeAttribute('disabled');
            document.querySelector("#submit-btn").style.cursor = "pointer";
            document.querySelector("#submit-btn").style.opacity = "1"; 
        }
    });
});

ready(() => { 
    convertDate();
});




