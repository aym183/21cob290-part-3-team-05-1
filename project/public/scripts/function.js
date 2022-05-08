/**
 * Creates popup for specified operations and handles them
 * @param {string} btnName name that identifies what type of popuup to create
 * @param {string} msg1 Contains message to be displayed to user
 * @param {string} msg2 Contains second optional message to be displayed to user
 * @param {string} button1 Contains text to be displayed on failure event
 * @param {string} button2 Contains text to be displayed on success event
 */
function popupCreator(btnName, msg1, msg2, button1, button2) {
    
    const popup = document.createElement('div');
    popup.className = 'popup';

    const p1 = popup.appendChild(document.createElement('p'));
    p1.textContent = msg1;

    const p2 = popup.appendChild(document.createElement('p'));
    p2.textContent = msg2;
    

    /* Popup specifications for dropping ticket confirmation popup */
    if (btnName == "drop") {
        var reason = popup.appendChild(document.createElement('textarea'));
        reason.className = "reason-area";
        reason.setAttribute("placeholder", "Type Reason...");
        reason.setAttribute("type", "text");
        reason.setAttribute("maxlength", "300");
        reason.setAttribute("rows", "3");
        reason.setAttribute("cols", "25");
    }

    const buttons = popup.appendChild(document.createElement('div'));
    buttons.className="popup-btns-container";
    const btn1 = buttons.appendChild(document.createElement('button'));
    btn1.className = "form-btn cancel-btn";
    btn1.textContent = button1;
    btn1.addEventListener("click", (e) => {
        document.querySelector(".overlay").remove();          
    });

    const btn2 = buttons.appendChild(document.createElement('button'));
    btn2.className = "form-btn confirm-btn";
    btn2.textContent = button2;
    btn2.addEventListener("click", (e) => {    

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();      
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        /* Popup specifications for closing tickets confirmation popup */
        if (btnName == "close") {

            const data = {
                new_status: 'closed',
                solution: document.getElementById('solution-area').value,
                id: document.getElementById('detail-id').innerHTML,
                date: date,
                time: time
            };

            changeStatus(data);
            
        /* Action after logout popup confirmation */
        } else if (btnName == "logout") {
            logout();
            
        /* Action after drop popup confirmation */
        } else if (btnName == "drop") {
            const data = {
                new_status: 'dropped',
                solution: document.getElementById('solution-area').value,
                id: document.getElementById('detail-id').innerHTML,
                reason: document.querySelector(".reason-area").value,
                current_dateTime: time,
                current_date: date
            };
            dropStatus(data);
            
            //-----This will update ticket history log
            const changed_values = [document.querySelector(".reason-area").value];
            const changed_names = ["dropped"];
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes();
            var dateTime = date+' '+time;
            
            const ticket_details = {
                id: document.getElementById('detail-id').innerHTML,
                changed_values: changed_values,
                changed_names: changed_names,
                current_dateTime: dateTime,
            };
            
            updateHistory(ticket_details);
            document.querySelector(".overlay").remove();          
            
        /* Action after submitting solution popup confirmation */
        } else if (btnName == "submitSolution") { 
            
            const ticket_id = document.getElementById('detail-id').innerHTML;
            const handler_name =document.getElementById('handler-name').value;
            const data = {
            
                status: 'submitted',
                solution: document.getElementById('solution-area').value,
                id: ticket_id,
                h_name: handler_name
            };
            submitTicket(data);
        } 
        document.querySelector(".overlay").remove();
        
    });

    /* Create the overlay. */
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}


/**
 * Function that goes about handling closing of tickets
 * @param {object} data object containing values required for closing ticket such as status, soln, date and time of closing
 */
function changeStatus(data){
    const socket = io();
    socket.emit('close_ticket', data);
}

/**
 * Function that goes about dropping of tickets
 * @param {object} data object containing values required for dropping of the ticket such as reason, ticket id etc
 */
function dropStatus(data){
    const socket = io();
    socket.emit('drop_ticket', data);
}

/**
 * Function that goes about updating history log for each ticket
 * @param {object} data object containing values required for updating history log such as the changed values and changed names
 */
function updateHistory(data){
    const socket = io();
    socket.emit("update_history", data); 
}

/**
 * Function that goes about submitting solution 
 * @param {object} data object containing values required for submitting solution such as solution, handler details etc
 */
function submitTicket(data){
    const socket = io();
    socket.emit("Submit-Ticket", data);
}

/**
 * Function that goes about conducting logout
 */
function logout(){
    window.location.href = '/logout';
}

// CODE FOR CHARACTER COUNTERS IN TICKET DETAILS
const edit_button = document.getElementById('edit-btn');
const soln_edit_button = document.getElementById('editSolution-btn');
const spec_soln_edit_button = document.getElementById('spec-editSolution-btn');
const text_area = document.getElementById('description');
const notes_text_area = document.getElementById('notes');
const remaining_chars = document.getElementById('remaining_chars');
const notes_remaining_chars = document.getElementById('notes_remaining_chars');
const soln_text_area = document.getElementById('solution-area')
const solutionremaining_chars = document.getElementById('solution_remaining_chars');
const max_chars = 300;
const solution_max_chars = 500;
const notes_max_chars = 1000;

// Event listener that subtracts characters from current input on click of edit button for operator
edit_button && edit_button.addEventListener('click', () => {

    const remaining = max_chars - text_area.value.length;
    
    remaining_chars.textContent = remaining + ' characters remaining';

    const notes_remaining = notes_max_chars - notes_text_area.value.length;
    notes_remaining_chars.textContent = notes_remaining + ' characters remaining';
 

});

// Event listener that subtracts characters from current input on click of solution edit button for specialist
spec_soln_edit_button  && spec_soln_edit_button .addEventListener('click', () => {

    const remaining = solution_max_chars - soln_text_area.value.length;
    solutionremaining_chars.textContent = remaining + ' characters remaining';

});

// Event listener that subtracts characters from current input on click of solution edit button
soln_edit_button && soln_edit_button.addEventListener('click', () => {

    const remaining = solution_max_chars - soln_text_area.value.length;
    solutionremaining_chars.textContent = remaining + ' characters remaining';

});

// Event listener that subtracts characters on user input in the solution form
soln_text_area && soln_text_area.addEventListener('input', () => {
    
    const remaining = solution_max_chars - soln_text_area.value.length;
    const color = remaining < solution_max_chars * 0.1 ? 'red' : null;
    solutionremaining_chars.textContent = remaining + ' characters remaining';
    solutionremaining_chars.style.color = color;

});

// Event listener that subtracts characters on user input in the description
text_area && text_area.addEventListener('input', () => {
    
    const remaining = max_chars - text_area.value.length;
    const color = remaining < max_chars * 0.1 ? 'red' : null;
    remaining_chars.textContent = remaining + ' characters remaining';
    remaining_chars.style.color = color;

});

// Event listener that subtracts characters on user input in the notes
notes_text_area && notes_text_area.addEventListener('input', () => {
    
    const remaining = notes_max_chars - notes_text_area.value.length;
    const color = remaining < notes_max_chars * 0.1 ? 'red' : null;
    notes_remaining_chars.textContent = remaining + ' characters remaining';
    notes_remaining_chars.style.color = color;

});

