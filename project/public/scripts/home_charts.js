// FUNCTION CREATES TILE
function createTile(title, removable) {
    var tile = document.createElement('div');
    tile.classList.add('tile');
    var tileTitle = document.createElement('h2');
    tileTitle.innerHTML = title;
    return tile;
  }
  
  // COLOR SCHEME OF CHARTS
  var barColors = [
    '#372B3B',
    '#225560',
    '#EDF060',
    '#F0803C',
    '#511535',
    '#C1A5A9'
  ]
  
  // DESIGN OPTIONS FOR BAR AND HORIZONTAL BAR CHARTS
  var horizontalBaroptions= {plugins:{display: false}, indexAxis: 'y'};
  var Baroptions= {plugins: {labels: {fontColor: 'rgb(229, 232, 235)'}}};
  
  // DICTIONARY CONTAINING ALL CHARTS USED AND THEIR TYPES
  var charts = new Object();
  charts =  {
      "OS_count": 'bar',
      "Closing_Date": 'line',
      "Software_count": 'doughnut',
      "Operator_assigned": 'horizontalBar',
      "Problem_type_count": 'pie',
      "Equipment_count": 'pie',
      "Specialist_dropped": 'pie',
      "Solution_statistics": 'pie'
  };