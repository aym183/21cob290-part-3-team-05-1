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





var emp_table;
var handler_table;
var hardware_table;
var os_table;
var software_table;
var operator_table;

//Used in Update button function
var old_operatorName;
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
    
        document.getElementById('detail-status').innerHTML =  data.status;
        document.getElementById('detail-id').innerHTML = data.ticket_id;
        document.getElementById('priority').setAttribute("value", data.priority);
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

        if (status == 'submitted' || status == 'pending') {
            const pending_solution = info['solution_description'];
            document.getElementById('solution-area').value = pending_solution;
            
        } else if (status == 'closed') {
            const successful_solution = info['solution_description'];
            document.getElementById('solution-area').value = "";
            document.getElementById('solution').value = successful_solution;

        } else if (status == 'unsuccessful') {
            const unsuc_solution = info['solution_description'];
        } else {
            document.getElementById('solution-area').value = ""; 
        }

        var op_body = document.querySelector(".op-ticket-body");
        op_body && op_body.querySelectorAll("tr").forEach(row => { 
            row.addEventListener("click", (e) => {
                var status = e.target.closest('tr').firstChild.className;
                
                if (status=="submitted") {
        
                    var c = document.querySelectorAll('.closed__field');
                    for (var i = 0; i < c.length; i++) {
                         c[i].style.display = 'none';
                    }
                    document.querySelector(".closeForm__section").style.display = "block";
                    if (document.querySelector(".checkmark") !== null) {
                        document.querySelector('.checkmark').classList.remove('checked');
                        document.querySelector('.checkmark').classList.add('unchecked');
                        document.querySelector("#close-btn").setAttribute('disabled','disabled');
                        document.querySelector("#close-btn").style.cursor = "default";
                        document.querySelector(".closeButton").style.opacity = "0.3";
                    }
                    
                    document.querySelector('.solution-status').innerText = "Solution Submitted";
                    document.querySelector(".solution-status").style.color = "rgb(3, 149, 3)";
        
                    document.querySelector(".discard-solution").style.display = "block";
        
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
                        document.querySelector("#close-btn").removeAttribute('disabled');
                        document.querySelector("#close-btn").style.cursor = "pointer";
                        document.querySelector(".closeButton").style.opacity = "1";
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
                        document.querySelector('.checkmark').classList.remove('checked');
                        document.querySelector('.checkmark').classList.add('unchecked');
                        document.querySelector("#close-btn").setAttribute('disabled','disabled');
                        document.querySelector("#close-btn").style.cursor = "default";
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
                        document.querySelector("#close-btn").setAttribute('disabled','disabled');
                        document.querySelector("#close-btn").style.cursor = "default";
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
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "api/v1/tickets/ticket");
    xhttp.setRequestHeader("Content-type", 'application/json');
    xhttp.send(data);
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

        socket.emit('message',  data);

        socket.on('message', function(data, json) {
        
            showTicketInfo(json[0]); 
          });
    
        // console.log(data);
        const jsonString = JSON.stringify(data)

        var status = e.target.closest('tr').firstChild.className;
        
        if (status=="submitted") {

            var c = document.querySelectorAll('.closed__field');
            for (var i = 0; i < c.length; i++) {
                 c[i].style.display = 'none';
            }
            if (document.querySelector(".checkmark") !== null) {
                document.querySelector('.checkmark').classList.remove('checked');
                document.querySelector('.checkmark').classList.add('unchecked');
                document.querySelector("#close-btn").setAttribute('disabled','disabled');
                document.querySelector("#close-btn").style.cursor = "default";
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
                document.querySelector("#close-btn").removeAttribute('disabled');
                document.querySelector("#close-btn").style.cursor = "pointer";
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
                document.querySelector("#close-btn").setAttribute('disabled','disabled');
                document.querySelector("#close-btn").style.cursor = "default";
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
                document.querySelector("#close-btn").setAttribute('disabled','disabled');
                document.querySelector("#close-btn").style.cursor = "default";
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
                document.querySelector("#close-btn").setAttribute('disabled','disabled');
                document.querySelector("#close-btn").style.cursor = "default";
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

            if(document.getElementsByClassName("ticket_history_section")[0]){
                //disabling ticket history table
                document.getElementById("ticket_history_btn").disabled = true;
                old_err_msg = document.getElementById("err_ticket_history");
                if(old_err_msg){
                    old_err_msg.remove();
                }
                var x = document.getElementsByClassName("ticket_history_container")[0];
                if(x.style.display === "block"){
                    document.getElementById("ticket_history_btn").innerHTML="Show Past Edit(s)";
                    document.getElementById("past_edits_container").remove();
                    x.style.display = "none";
                }
            }
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
            if(document.getElementsByClassName("ticket_history_section")[0]){
                document.getElementById("ticket_history_btn").disabled = false;
            }
        }


    });    
});

// Update Button clicked
ready(() => { 
    document.querySelector("#update-btn").addEventListener("click", (e) => {
        
        
        const caller_name = document.getElementById("caller-name").value;
        const caller_id = document.getElementById("caller-id").value;
        const operator_name = document.getElementById("operator-name").value;
        const hardware_id = document.getElementById("hardware-id").value;
        const os = document.getElementById("operating-system").value;
        const software = document.getElementById("software").value;
        const description = document.getElementById("description").value;
        const notes = document.getElementById("notes").value;
        const problem_type = document.getElementById("problem-type").value;
        const handler_name = document.getElementById("handler-name").value;
        
        const valid_details = [];
        if (!handler_table.some(e => e.name == handler_name)) {
            valid_details.push('handler-name');
        }
        if (!hardware_table.some(e => e.serial_number == hardware_id)) {
            valid_details.push('hardware-id');
        }
        if (!os_table.some(e => e.name == os) && os != "" && os !="null") {
            valid_details.push('operating-system');
        }
        if (!software_table.some(e => e.name == software) && software != "") {
            valid_details.push('software');
        }
        if (!operator_table.some(e => e.name == operator_name)) {
            valid_details.push('operator-name');
        }
        if (!problemTypes.some(e => e.name == problem_type)) {
            valid_details.push('problem-type');
        }

        if (valid_details.length != 0) {

            for (const element of valid_details) {
                document.querySelector('#'+element).style.borderColor = 'rgb(255,0,51)';
                document.querySelector(`label[for='${element}']`).style.color = 'rgb(255,0,51)';
                document.querySelector(`#${element}-error`).innerHTML = 'Invalid Field';
            }    

            document.querySelector('#'+valid_details[0]).scrollIntoView({behaviour: "smooth", block: "center"});

        }else if (valid_details.length == 0) {
            
            const changed_values = [];
            const changed_names = [];

            if(old_operatorName != operator_name){
                changed_values.push(operator_name);
                changed_names.push('operator');
                old_operatorName = operator_name;
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


            const ticket_details = {
                caller_id: caller_id,
                operator_name: operator_name,
                hardware_id: hardware_id,
                os: os,
                software: software,
                des: description,
                notes: notes,
                problem_type: problem_type,
                handler_name: handler_name,
                id: document.getElementById('detail-id').innerHTML
            };

            const changed_details = {
                id: document.getElementById('detail-id').innerHTML,
                changed_values: changed_values,
                changed_names: changed_names,
                current_dateTime: dateTime,
                current_handler_uname: document.getElementById("profile-username").getElementsByTagName("p")[0].innerHTML
            };

            const jsonString = JSON.stringify(ticket_details);
            updateTicketInfo(jsonString);

            
            const changedJsonString = JSON.stringify(changed_details);
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "update_history_log.php");
            xhttp.setRequestHeader("Content-type", 'application/json');
            xhttp.send(changedJsonString);
            
           
            
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
            document.querySelector("#emp-table__container").style.display = "none";
            
            if(document.getElementsByClassName("ticket_history_section")[0]){
                document.getElementById("ticket_history_btn").disabled = false;
            }
        }    

    });    
});

ready(() => { 

    // discard solution button
    var drop_btn = document.querySelector("#dropSolution-btn");
    drop_btn && drop_btn.addEventListener("click", (e) => {
        document.querySelector('.checkmark').classList.remove('checked');
        document.querySelector('.checkmark').classList.add('unchecked');
        document.getElementById('solution-area').innerText = "";
        document.querySelector("#close-btn").setAttribute('disabled','disabled');
        document.querySelector("#close-btn").style.cursor = "default";
        document.querySelector(".closeButton").style.opacity = "0.3";

        document.querySelector('.solution-status').innerText = "Solution Discarded";
        document.querySelector(".solution-status").style.color = "rgb(179, 5, 5)";

        document.querySelector(".discard-solution").style.display = "none";

        const data = {
            new_status: 'unsuccessful',
            solution: document.getElementById('solution-area').value,
            id: document.getElementById('detail-id').innerHTML
        };
        const jsonString = JSON.stringify(data);
        changeStatus(jsonString);
    }); 

    // edit solution button
    const editsolution = document.querySelector("#editSolution-btn");
    editsolution && editsolution.addEventListener("click", (e) => {
        
        if (document.querySelector("#editSolution-btn").innerHTML == "edit") {
            
            document.querySelector('.checkmark').classList.remove('checked');
            document.querySelector('.checkmark').classList.add('unchecked');
            document.getElementById("close-btn").setAttribute('disabled','disabled');
            document.querySelector(".closeButton").style.opacity = "0.3";
            document.querySelector("#solution-area").style.backgroundColor = "white";
            document.querySelector(".solutionArea__section").style.backgroundColor = "white";
            document.querySelector("#solution-area").style.pointerEvents = "all";
            document.querySelector("#editSolution-btn").innerHTML = "Update";

        }
        else if (document.querySelector("#editSolution-btn").innerHTML == "Update") {
            
            document.querySelector("#solution-area").style.backgroundColor = "rgb(236, 236, 236)";
            document.querySelector(".solutionArea__section").style.backgroundColor = "rgb(236, 236, 236)";
            document.querySelector("#solution-area").style.pointerEvents = "none";
            document.querySelector("#editSolution-btn").innerHTML = "edit";
        }   
    }); 

    // Previous Fixes button on close form
    var previousFixBtn = document.querySelector('#previousFix-btn');
    previousFixBtn && previousFixBtn.addEventListener('click', (e) => {

        document.querySelector('.previous-fix__container').style.display = 'block';
        document.querySelector('.pf-head1').style.display = 'block';
        document.querySelector('.solution__label').style.display = 'none';
        document.querySelector('#solution-area').style.display = 'none';
        document.querySelector('.previous-solution').style.display = 'none';
        document.querySelector('.dropSolution__section').style.display = 'none';
        document.querySelector('#editSolution-btn').style.display = 'none';

        const hardware_value = document.querySelector("#hardware-id").value;
        const software_value = document.querySelector("#software").value;
        const problem_value = document.querySelector("#problem-type").value;
        getPreviousFixes1(hardware_value, 'hardware');
        getPreviousFixes1(software_value, 'software');
        
        // problemTypes in form.js
        for (problemType of problemTypes) {
            if (problem_value == problemType['name']) {
                getPreviousFixes1(problemType['problem_type_id'], 'problem-type');
                break;
            }
        }

        document.querySelector('.device-filter').classList.add('btn-clicked');
        document.querySelector('.model-filter').classList.remove('btn-clicked');
        document.querySelector('.software-filter').classList.remove('btn-clicked');
        document.querySelector('.problem-type-filter').classList.remove('btn-clicked');
    });

    /* Highlight clicked previous fix. Ensure only one can be clicked at a
    * time. */
    const previousfix_container = document.querySelector('.previous-fix__container');
    previousfix_container && previousfix_container.addEventListener('click', function(event) {
        let target = event.target;
        if (target.matches('.previous-fix') || target.matches('.previous-fix *')) {

            
            const new_solution = target.closest('.previous-fix').querySelector('.fix-solution').innerHTML;
            
            document.querySelector('#solution-area').value = new_solution;

            document.querySelector('.previous-fix__container').style.display = 'none';
            document.querySelector('.pf-head1').style.display = 'none';
            document.querySelector('.solution__label').style.display = 'flex';
            document.querySelector('#solution-area').style.display = 'block';
            document.querySelector('.previous-solution').style.display = 'block';
            document.querySelector('.dropSolution__section').style.display = 'flex';
            document.querySelector('#editSolution-btn').style.display = 'block';

            document.querySelectorAll('.previous-fix')
            .forEach(element => element.remove());


        }
    });
    const gobackbtn = document.querySelector('#goback-btn')
    gobackbtn && gobackbtn.addEventListener('click', (e) => {
        document.querySelector('.previous-fix__container').style.display = 'none';
        document.querySelector('.pf-head1').style.display = 'none';
        document.querySelector('.solution__label').style.display = 'flex';
        document.querySelector('#solution-area').style.display = 'block';
        document.querySelector('.previous-solution').style.display = 'block';
        document.querySelector('.dropSolution__section').style.display = 'flex';
        document.querySelector('#editSolution-btn').style.display = 'block';

        document.querySelectorAll('.previous-fix')
        .forEach(element => element.remove());
    });

    /* On previous fixes filter click, show only the fixes of particular type. */
    const pfhead = document.querySelector('.pf-head1');
    pfhead && pfhead.addEventListener('click', function(event) {
        let target = event.target;
        if (target.matches('.previous-fixes-filter')) {

            const previousFixContainer = document.querySelector('.previous-fix__container');
            const previousFixesFilter = target;
            const filterClicked = previousFixesFilter.classList.contains('btn-clicked');

            target.closest('.pf-head1').querySelectorAll('.previous-fixes-filter')
                .forEach(element => element.classList.remove('btn-clicked'));
            if (filterClicked) {
                const hardwareInput = document.querySelector('#hardware-id').value;
                if (hardwareIDs.includes(hardwareInput)) {
                    previousFixContainer.querySelectorAll('.device-fix, .model-fix')
                        .forEach(element => element.classList.remove('hidden'));
                }

                const softwareInput = querySelector('#software').value;
                if (softwareNames.includes(softwareInput)) {
                    previousFixContainer.querySelectorAll('.software-fix')
                        .forEach(element => element.classList.remove('hidden'));
                }

                const problemTypeInputElement = target.closest('.problem-section')
                    .querySelector('.problem-type-field');
                if (problemTypeInputElement.hasAttribute('data-problem-type-id')) {
                    previousFixContainer.querySelectorAll('.problem-type-fix')
                        .forEach(element => element.classList.remove('hidden'));
                }
            } else {
                previousFixesFilter.classList.add('btn-clicked');

                previousFixContainer.querySelectorAll('.previous-fix')
                    .forEach(element => element.classList.add('hidden'));

                if (previousFixesFilter.classList.contains("device-filter")) {
                        previousFixContainer.querySelectorAll('.device-fix')
                            .forEach(element => element.classList.remove('hidden'));
                } else if (previousFixesFilter.classList.contains("model-filter")) {
                        previousFixContainer.querySelectorAll('.model-fix')
                            .forEach(element => element.classList.remove('hidden'));
                } else if (previousFixesFilter.classList.contains("software-filter")) {
                        previousFixContainer.querySelectorAll('.software-fix')
                            .forEach(element => element.classList.remove('hidden'));
                } else if (previousFixesFilter.classList.contains("problem-type-filter")) {
                        previousFixContainer.querySelectorAll('.problem-type-fix')
                            .forEach(element => element.classList.remove('hidden'));
                }
            }
        }
    });
    
    // checkmark checked and unchecked states
    var checkbox = document.querySelector('.checkmark');
    checkbox && checkbox.addEventListener('click', (e) => {
        if (!checkbox.classList.contains('checked')) {

            const solution = document.querySelector("#solution-area").value;
            const old_status = document.querySelector("#detail-status span").innerHTML;
            if (solution != "") {
                document.querySelector('.checkmark').classList.remove('unchecked');
                document.querySelector('.checkmark').classList.add('checked');
                document.getElementById("close-btn").removeAttribute('disabled');
                document.querySelector("#close-btn").style.cursor = "pointer";
                document.querySelector(".closeButton").style.opacity = "1";
                const data = {
                    old_status: old_status,
                    new_status: 'pending',
                    solution: document.getElementById('solution-area').value,
                    id: document.getElementById('detail-id').innerHTML
                };
                const jsonString = JSON.stringify(data);
                changeStatus(jsonString);
            } else {
    
            }
        } else if (checkbox.classList.contains('checked')) {
            document.querySelector('.checkmark').classList.remove('checked');
            document.querySelector('.checkmark').classList.add('unchecked');
            document.getElementById("close-btn").setAttribute('disabled','disabled');
            document.querySelector(".closeButton").style.opacity = "0.3";
            document.querySelector("#solution-area").style.cursor = "default";
            
            const handler_name = document.querySelector("#handler-name").value;
            const operator_array = [];
            for (const element of operator_table) {
                operator_array.push(element['name']);
            }

            if (operator_array.includes(handler_name)) {
                const data = {
                    old_status: 'pending',
                    new_status: 'active',
                    solution: document.getElementById('solution-area').innerHTML,
                    id: document.getElementById('detail-id').innerHTML
                };
                const jsonString = JSON.stringify(data);
                changeStatus(jsonString);
            }

        }
    });

});

// Get relevant data for input fields and store in variables for later use
// function loadData() {
//     var xhttp = new XMLHttpRequest();
    
//     xhttp.onload = function() {
//         var info = JSON.parse(this.responseText);
       
//         emp_table = info[0];
//         handler_table = info[1];
//         hardware_table = info[2];
//         os_table = info[3];
//         software_table = info[4];
//         operator_table = info[5];
    
//     };
//     xhttp.open("POST", "data_tables.php");
//     xhttp.setRequestHeader("Content-type", 'application/json');
//     xhttp.send();
// }

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
    var close_btn = document.querySelector("#close-btn");
    close_btn && close_btn.addEventListener("click", (e) => {
        popupCreator("close", "Are you sure you want to close ticket?", "", "Cancel", "Confirm", "");         
    });
    
});

/**
 * Fetches previous fixes of particular type.
 *
 * @param {string} value Value to search previous fixes for.
 * @param {string} Type of previous fixes to fetch.
 */
function getPreviousFixes1(value, type) {
    /* Fetch data only if employee id exists. */
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText);
            if (response['status']['success'] === true) {
                populatePreviousFixesList1(response['data']);
            } else {
                const message = document.createElement('div');
                const p = message.appendChild(document.createElement('p'));
                p.textContent = response['status']['errorMessage'];
                createPopUp(
                    message,
                    [
                        {text: "OK", colour: "#af0505"}
                    ]
                );
            }
        }
    };
    if (type == 'hardware') {
        httpRequest.open("GET", `api/v1/tickets/previous-fixes?type=hardware&device_number=${value}`, true);
    } else if (type == 'software') {
        httpRequest.open("GET", `api/v1/tickets/previous-fixes?type=software&software_name=${value}`, true);
    } else if (type == 'problem-type') {
        httpRequest.open("GET", `api/v1/tickets/previous-fixes?type=problem-type&problem-type-id=${value}`, true);
    }
    httpRequest.send();
}

/**
 * Populates previous fixes list.
 *
 * @param {object} previousFixes Object containing previous fixes to be added.
 * to be populated.
 */
function populatePreviousFixesList1(previousFixes) {
    const previousFixesContainer = document.querySelector('.previous-fix__container');
    for (const previousFix of previousFixes['device']) {
        let  previousFixElement = createPreviousFix1(previousFix, 'device');
        previousFixesContainer.appendChild(previousFixElement);
    }
    for (const previousFix of previousFixes['model']) {
        let  previousFixElement = createPreviousFix1(previousFix, 'model');
        previousFixesContainer.appendChild(previousFixElement);
    }
    for (const previousFix of previousFixes['software']) {
        let  previousFixElement = createPreviousFix1(previousFix, 'software');
        previousFixesContainer.appendChild(previousFixElement);
    }
    for (const previousFix of previousFixes['problem-type']) {
        let  previousFixElement = createPreviousFix1(previousFix, 'problem-type');
        previousFixesContainer.appendChild(previousFixElement);
    }
}

/**
 * Creates a previous fix element "bubble".
 *
 * @param {object} previousFix Previous Fix for which HTML element is to be
 * created.
 * @param {string} type Type of previous fix.
 * @return {object} New previous fix HTML element.
 */
function createPreviousFix1(previousFix, type) {
    const previousFixElement = document.createElement('div');
    previousFixElement.classList.add("previous-fix");
    previousFixElement.setAttribute('data-solution-id', previousFix['solution_id']);
    switch (type) {
        case "device":
            previousFixElement.classList.add('device-fix');
            break;
        case "model":
            previousFixElement.classList.add('model-fix');
            previousFixElement.classList.add('hidden');
            break;
        case "software":
            previousFixElement.classList.add('software-fix');
            previousFixElement.classList.add('hidden');
            break;
        case "problem-type":
            previousFixElement.classList.add('problem-type-fix');
            break;
        default:
            break;
    }
    
    const fixDesc = document.createElement('div');
    fixDesc.classList.add("fix-description");
    fixDesc.textContent = previousFix['description'];
    previousFixElement.appendChild(fixDesc);

    const separator = document.createElement('hr');
    previousFixElement.appendChild(separator);

    const fixSol = document.createElement('div');
    fixSol.classList.add("fix-solution");
    fixSol.textContent = previousFix['solution'];
    previousFixElement.appendChild(fixSol);

    return previousFixElement;
}

/**
 * Get all problem types from the database.
 */
// function getProblemTypes() {
//     var httpRequest = new XMLHttpRequest();
//     httpRequest.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             const response = JSON.parse(this.responseText);
//             if (response['status']['success'] === true) {
//                 problemTypes = response['data'];
//             } else {
//                 const message = document.createElement('div');
//                 const p = message.appendChild(document.createElement('p'));
//                 p.textContent = response['status']['errorMessage'];
//                 createPopUp(
//                     message,
//                     [
//                         {text: "OK", colour: "#af0505"}
//                     ]
//                 );
//             }
//         }
//     };
//     httpRequest.open("GET", "api/v1/problem-types", true);
//     httpRequest.send();
// }


function convert(str) {
    console.log(str.innerHTML);
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    //   console.log([date.getFullYear(), mnth, day].join("-"));
    console.log(document.getElementById('lastUpdated'))
    console.log([date.getFullYear(), mnth, day].join("-"))
        // document.getElementById('lastUpdated').innerHTML = [date.getFullYear(), mnth, day].join("-");
    // return [date.getFullYear(), mnth, day].join("-");
  }

convert(document.getElementById('lastUpdated'));
