function showDetails(country){
	load14Days(country);
	drawGraph(country, "New Confirmed");
  	document.getElementById("details").style.height = "100%";
}

function hideDetails() {
	document.getElementById("details").style.height = "0%";
}

function load14daysHeader(){
	var header = document.getElementById("14days_header");

	//insert header from filter
	fields_14days.forEach(function(item){
		var cell = document.createElement("th");
		cell.className = "js-sort-number";
		cell.innerHTML = item;
		header.appendChild(cell);
	});
			
}

function load14Days(country) {
	var table = document.getElementById("14days_content");
	table.innerHTML = '';

	var datesArray = numberOfDates(30);

	datesArray.forEach(function(date){
		if(!(date in countryData[country]["history"])) return;

		var row = table.insertRow(-1);

		var day = row.insertCell(-1);
		day.innerHTML = date;
		day.className = "rowID";
		day.id = date;

		//insert columns from filter
		fields_14days.forEach(function(field){
			var cell = row.insertCell(-1);
			cell.className = "number";
			cell.innerHTML = countryData[country]["history"][date][field];
		});
	});
}

function numberOfDates(days) {
	var array = [];
	for (var i=0; i < days; i++){
		var day = new Date(new Date() - (i * 24 * 60 * 60 * 1000)).toISOString().slice(0,10);
		array.push(day);
	}
	return array;
};

function drawGraph(country, field){
	var dataSets = getDataSets(country);

	var ctx = document.getElementById('chart_details').getContext('2d');

	if(detailsChart != undefined) detailsChart.destroy();
	detailsChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        datasets: dataSets
	    },
	    options: {
	        scales: {
	            xAxes: [{
	                type: 'time',
	                time: {
	                    unit: 'week'
	                }
	            }],
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true,
               			fontSize: 16,
               			maxTicksLimit: 9,
	                }
	            }]
	        }
	    }
	});
}

function getDataSets(country){
	var defaultSet = {
	            fill: false,
	            borderColor: 'rgba(217, 166, 0, 1)',
	            borderWidth: 2,
            	lineTension: 0,    
	            pointRadius: 0
	        };

	var dataSets = [];

	var colors_14days = {
		"Active": 'rgba(232, 232, 232, 1)',
		"± Active": 'rgba(94, 94, 94, 1)',
		"± 7d ago": 'rgba(156, 77, 179, 1)',
		"Incidence": 'rgba(19, 186, 186, 1)',
		"Confirmed ao7": 'rgba(99, 55, 10, 1)',
		"New Confirmed": 'rgba(217, 166, 0, 0.8)',
		"New Recovered": 'rgba(22, 107, 38, 0.8)',
		"New Deaths": 'rgba(181, 0, 0, 0.8)'
	};

	var today = new Date();

	fields_14days.forEach(function(item){
		var dataSet = {...defaultSet};
		dataSet["data"] = getData(country, item, new Date().setDate(today.getDate()-90), today);
		dataSet["label"] = item;
		dataSet["borderColor"] = colors_14days[item];
         dataSet["hidden"]= true;
		if(item.includes("New")) {
			dataSet["type"] = "bar";
			dataSet["borderWidth"] = 1;
			dataSet["backgroundColor"] = colors_14days[item];
			dataSet["fill"] = true;
		}
		dataSets.push(dataSet);
	});

	return dataSets;
}

function getData(country, field, startDate, endDate){
	var dataSet = [];
	var data = countryData[country]["history"];

	for (var key in data) {
		var datapoint = {};
		var date = new Date(key);
		if(date < startDate || date > endDate) continue;

		datapoint["t"] = date;
		datapoint["y"] = data[key][field];
		dataSet.push(datapoint);
	}

	return dataSet;
}