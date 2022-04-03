function popupCreator(btnName, msg1, msg2, button1, button2, element) {
    
    const popup = document.createElement('div');
    popup.className = 'popup';

    const p1 = popup.appendChild(document.createElement('p'));
    p1.textContent = msg1;

    const p2 = popup.appendChild(document.createElement('p'));
    p2.textContent = msg2;
    

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
        if (btnName == "close") {
            const data = {
                new_status: 'closed',
                solution: document.getElementById('solution-area').value,
                id: document.getElementById('detail-id').innerHTML
            };
            // const jsonString = JSON.stringify(data);
            changeStatus(data);
            // window.location.href = "index.html";
        } else if (btnName == "problemType") {
            element.remove();
        } else if (btnName == "logout") {
            destroySession(() => window.location.href = "login.html");
            
        } else if (btnName == "drop") {
            const data = {
                new_status: 'dropped',
                solution: document.getElementById('solution-area').value,
                id: document.getElementById('detail-id').innerHTML,
                reason: document.querySelector(".reason-area").value

            };
            const jsonString = JSON.stringify(data);
            changeStatus(jsonString);
            
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
                current_handler_uname: document.getElementById("profile-username").getElementsByTagName("p")[0].innerHTML
            };
            
            const ticket_details_json = JSON.stringify(ticket_details);
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "update_history_log.php");
            xhttp.setRequestHeader("Content-type", 'application/json');
            xhttp.send(ticket_details_json);
            

            if (document.getElementById("Account_Type2").innerHTML.includes("EX_specialist")){

                window.location.href = "external.html";
            }else{
                
                window.location.href = "intSpecialist.html";
            }
            
        } else if (btnName == "submitSolution") { /* Submit solution value */
            
            const ticket_id = document.getElementById('detail-id').innerHTML;
            const data = {
                old_status: 'unsuccessful',
                new_status: 'submitted',
                solution: document.getElementById('solution-area').value,
                id: ticket_id
            };
            const jsonString = JSON.stringify(data);
            changeStatus(jsonString);
        }
        document.querySelector(".overlay").remove();
        
    });

    
    //<input id="caller-name" type="text" class="field" autocomplete="off" required="required"></input>
    
    /* Create the overlay. */
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.appendChild(popup);
            
    /* Add the overlay. */
    document.body.appendChild(overlay);

}

function changeStatus(data){
    const socket = io()
    console.log(data);
    socket.emit('close_ticket',  data);

    // socket.on('close_ticket', function(data, json) {
    //     console.log(json[0]); 
    // });
}
