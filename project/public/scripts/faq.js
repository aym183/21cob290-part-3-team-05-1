function addRowHandlers(data) {
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

socket.emit('solution',  data);

// after data is recieved, calling function to show solution info
socket.on('solution', function(data, json) {
    addRowHandlers(json[0]); 
});



/* ready(() => { 
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

*/