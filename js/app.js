const API_KEY = "AIzaSyCnKpFC3Iy5zPba_IZb21_OYa4rHVZ5dAs"
const API_URL = "https://maps.googleapis.com/maps/api/elevation/json"
const SAMPLE_SIZE = 5;

// Loads the Google Visualizer API
google.charts.load('current',{packages:['corechart']});
google.charts.setOnLoadCallback(drawChart);

const elevator = new google.maps.ElevationService();

function PlotGraph() {
  var p1Lat = parseFloat(document.getElementById("p1_lat").value);
  var p1Long = parseFloat(document.getElementById("p1_long").value);
  var p2Lat = parseFloat(document.getElementById("p2_lat").value);
  var p2Long = parseFloat(document.getElementById("p2_long").value);

  var invalidInputMsg = "";
  var errorText = document.getElementById("errorMessage");

  //Checks for valid input
  if (isNaN(p1Lat) || isNaN(p1Long) || isNaN(p2Lat) || isNaN(p2Long)) {
    invalidInputMsg = "Please enter valid latitude and longitude values and try again."
    errorText.textContent = invalidInputMsg;
  }else if ((p1Lat > 90 || p1Lat < -90) || (p2Lat > 90 || p2Lat < -90)) {
    if ((p1Long > 180 || p1Long < -180) || (p2Long > 180 || p2Long < -180)) {
      invalidInputMsg = "Please enter valid latitude and longitude values and try again.";
    }else{
      invalidInputMsg = "Please enter a valid latitude value and try again."
    }
    errorText.textContent = invalidInputMsg;
  }else if ((p1Long > 180 || p1Long < -180) || (p2Long > 180 || p2Long < -180)) {
    invalidInputMsg = "Please enter a valid longitude value and try again."
    errorText.textContent = invalidInputMsg;

  }else {
    //Set Array of Points for Google Line Graph
    var points = [['Distance', 'Elevation'], [p1Long,p1Lat], [p2Long, p2Lat]];
    //API Url with parameters: path & key
    var url = API_URL + "?path=" + p1Lat + "," + p1Long + "|" + p2Lat + "," + p2Long + "&samples=" + SAMPLE_SIZE + "&key=" + API_KEY;
    console.log(url);
    fetch(url, {mode: 'cors'})
      .then(response => {
        if (!response.ok){
          throw new Error("Error connecting to API. Status: " + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error("Fetch error: ", error);
      });

    console.log("Point 1: [" + p1Long + "," + p1Lat + "]");
    console.log("Point 2: [" + p2Long + "," + p2Lat + "]");
    //updateChart(points)
  }
}

function drawChart() {
  var datapoints = [
    ['Distance', 'Elevation'],
    [0,0]
  ];

// Set Data
  var data = google.visualization.arrayToDataTable(datapoints);

// Set Options
  const options = {
    hAxis: {title: 'Distance'},
    vAxis: {title: 'Elevation'},
    legend: 'none'
  };

  const chart = new google.visualization.LineChart(document.getElementById('elevationGraph'));
  chart.draw(data, options);
}

function updateChart(points){
  var datapoints = points;
  // Set Data
  var data = google.visualization.arrayToDataTable(datapoints);

// Set Options
  const options = {
    hAxis: {title: 'Distance'},
    vAxis: {title: 'Elevation'},
    legend: 'none'
  };

  const chart = new google.visualization.LineChart(document.getElementById('elevationGraph'));
  chart.draw(data, options);
}
