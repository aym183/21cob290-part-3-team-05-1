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
    document.getElementById('solutionBox').innerHTML =  data.solution;
    document.getElementById('solutionBox').value = data.solution
}

document.querySelector(".ticket__table tbody").addEventListener("click", (e) => {
    const socket=io();
    
    socket.emit('solution',  data);

    // after data is recieved, calling function to show solution info
    socket.on('solution', function(data, json) {
        showSolutionInfo(json[0]); 
    });
});
