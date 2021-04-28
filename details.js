function showDetails(country){
	addInfo(country);
	addSummary(country);
	load14Days(country);
	addDateSlider(country);
	drawGraph(country, "New Confirmed");

  	document.getElementById("details").style.height = "100%";
}

function addDateSlider(country){
	var sliderDiv = document.getElementById("dateRange");
    sliderDiv.innerHTML = '';

	var slider = document.createElement("input");
	slider.min = 4;
	slider.max = Object.keys(countryData[country]["history"]).length;
	slider.type = "range";
	slider.className = "slider";
	slider.oninput = function() {
        numberOfDays = slider.max - this.value + 4;
	    drawGraph(country, "New Confirmed");
	    load14Days(country);
    }
    slider.step = 3;
    slider.defaultValue = slider.max - numberOfDays + 4 ;

	sliderDiv.appendChild(slider);
}

function hideDetails() {
	document.getElementById("details").style.height = "0%";
}

function addInfo(country){
	var detailsInfo = document.getElementById("detailsInfo");
	detailsInfo.style.display = "flex";
	detailsInfo.innerHTML = "";

	//add flag if it exists
	if(flags[countryToISO[country]] != undefined){
		var flag = document.createElement("IMG");
		flag.src = flags[countryToISO[country]];
		flag.style.width = "30%";
		flag.style.flex = 1;
		detailsInfo.appendChild(flag);
	}

	//add country name
	var countryName = document.createElement("div");
	countryName.innerHTML = country;
	countryName.style.flex = 2;
	countryName.style.fontSize = "2.5em";
	countryName.style.textAlign = "center";
	countryName.style.verticalAlign = "middle";
	countryName.className = "countryName";
	detailsInfo.appendChild(countryName);

	//add country name
	var buttonHide = document.createElement("BUTTON");
	buttonHide.innerHTML = "x";
	buttonHide.className = "hide";
	buttonHide.onclick = function(){hideDetails()};
	detailsInfo.appendChild(buttonHide);
}

function addSummary(country){
	var today = new Date();

	var detailsSummary = document.getElementById("detailsSummary");
	detailsSummary.innerHTML = "";

	var firstRow = document.createElement("div");
	firstRow.style.display = "flex";
	detailsSummary.appendChild(firstRow);

	var totalContainer = document.createElement("div");
	totalContainer.className = "detailsSummary";
	totalContainer.innerHTML = "Total Confirmed";
	firstRow.appendChild(totalContainer);

	var totalValue = document.createElement("div");
	totalValue.className = "detailsSummary";
	totalValue.innerHTML = countryData[country]["summary"]["Total Cases"];
	totalContainer.appendChild(totalValue);

	var recoveredContainer = document.createElement("div");
	recoveredContainer.className = "detailsSummary";
	recoveredContainer.innerHTML = "2 Doses %";
	firstRow.appendChild(recoveredContainer);

	var recoveredValue = document.createElement("div");
	recoveredValue.className = "detailsSummary";
	recoveredValue.innerHTML = countryData[country]["summary"]["Vaccinated %"];
	recoveredContainer.appendChild(recoveredValue);

	var totalDeathsContainer = document.createElement("div");
	totalDeathsContainer.className = "detailsSummary";
	totalDeathsContainer.innerHTML = "Total Deaths";
	firstRow.appendChild(totalDeathsContainer);

	var totalDeathsValue = document.createElement("div");
	totalDeathsValue.className = "detailsSummary";
	totalDeathsValue.innerHTML = countryData[country]["summary"]["Total Deaths"];
	totalDeathsContainer.appendChild(totalDeathsValue);
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

	var datesArray = numberOfDates(numberOfDays);

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
            animation: {
                duration: 0
            },
	    	legend: {
	    		labels: {
	    			fontSize: 20,
	    			padding: 20
	    		}
	    	},
	        scales: {
	            xAxes: [{
	            	offset: true,
	                type: 'time',
	                time: {
	                    unit: 'week'
	                }
	            }],
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true,
               			fontSize: 20,
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
		"± 7d": 'rgba(156, 77, 179, 1)',
		"Incidence": 'rgba(19, 186, 186, 1)',
		"Cases Ao7": 'rgba(99, 55, 10, 1)',
		"New Cases": 'rgba(217, 166, 0, 0.8)',
		"New Deaths": 'rgba(181, 0, 0, 0.8)',
		"R": 'rgba(255, 255, 255, 0.8)',
		"CFR %": 'rgba(181, 0, 0, 0.8)',
		"Vaccinated": 'rgba(60, 168, 50, 0.8)',
		"Vaccinated %": 'rgba(60, 168, 50, 0.8)'
	};

	var today = new Date();

	fields_14days.forEach(function(item){
		var dataSet = {...defaultSet};
		dataSet["data"] = getData(country, item, new Date().setDate(today.getDate()-numberOfDays), today);
		dataSet["label"] = item;
		dataSet["borderColor"] = colors_14days[item];
        if(!item.includes("Incidence") )  dataSet["hidden"] = true;
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