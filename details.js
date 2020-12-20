function showDetails(country){
	load14Days(country);
  	document.getElementById("details").style.width = "100%";
}

function hideDetails() {
	document.getElementById("details").style.width = "0%";
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

	var datesArray = numberOfDates(9);

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

function drawGraph(){
	var activeCasesDiv = document.getElementById('activeCasesDiv');
	activeCasesDiv.innerHTML = '';
	var activeCasesData = getDailyCases(country);
	var minX = activeCasesData[0].t;
	var maxX = activeCasesData[activeCasesData.length-1].t;

	var canvas = document.createElement("canvas");
	var myChart = new Chart(canvas, {
	  type: 'line',
	  data: {
	    datasets: [{
	      label: 'Active',
	      borderColor: '#1d90c2',
	      borderWidth: 2,
	      pointRadius: 0,
	      fill: 'false',
	      data: activeCasesData
	    }]
	  },
	  options: {
	  	responsive: true,
		plugins: {
			zoom: {
				pan: {
					enabled: true,
					mode: 'x',
					rangeMin: {
						x: minX
					},
					rangeMax: {
						x: maxX
					},
				},
				zoom: {
					enabled: true,
					mode: 'x',
					rangeMin: {
						x: minX
					},
					rangeMax: {
						x: maxX
					},
				}
			}
		},
	    scales: {
			yAxes: [{
	            ticks: {
	                beginAtZero: true
	            }
			}],
			xAxes: [{
				type: 'time',
                time: {
                    displayFormats: {
                        month: 'YY-MM'
                    }
                }
			}]
		}
	  }
	});

	activeCasesDiv.appendChild(canvas);
}

function getDailyCases(country){
	var dailyCases = [];
	var data = countryData[country]["timeline"];

	for(var i = 0; i < data.length; i++) {
		var day = data[i];

	    var dayData = {
	    	t : new Date(day["updated_at"]),
	    	y : day["active"]
	    }
	    dailyCases.push(dayData);

	}
	return dailyCases;
}