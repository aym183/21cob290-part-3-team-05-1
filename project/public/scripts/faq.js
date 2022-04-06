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
      showSolutionInfo(data)
      // showTicketInfo(json[0]); 
    });
});

