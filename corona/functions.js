//import './countryCleanName.js';
function downloadData() {
	var request = new XMLHttpRequest();
	request.open('GET', 'https://covid.ourworldindata.org/data/owid-covid-data.json');

	request.onload = function () {
		allData = JSON.parse(this.response);
		console.log(allData);
	    loadCountries();
	}

	request.send();
}

function loadCountries() {
    var sorted = [];
    for (var key in allData) {
        if (allData.hasOwnProperty(key)) {
            sorted.push(allData[key].location);
        }
    }

    sorted.sort();
    var dataList = document.getElementById('filterOptions');
    sorted.forEach(function(item, index){
        var option = document.createElement('option');
        option.id = item;
        option.value = item;
        dataList.appendChild(option);
    });

	updateFilter();
}

function updateFilter(){
	document.getElementById('countryFilter').innerHTML = '';

	filter_countries.sort();

	filter_countries.forEach(function(item, index){
		//download data
		if(!(item in countryData)) calcData(item);

		//create filter indicator
		var div = document.createElement("div");

		div.id = item;
		div.className = 'country';
		div.innerHTML = item + " ×";
		div.addEventListener("click", function(){
			filter_countries.splice(index, 1);
			updateFilter();
		});

		document.getElementById('countryFilter').appendChild(div);
	})

    //updateURL();
	loadSummary();
}

function updateURL(){
    var oldUrl = window.location.href;
    console.log(oldUrl);
    var baseURL = oldUrl.substr(0, oldUrl.lastIndexOf('/'));
    console.log(baseURL);
    var url = "";

    filter_countries.forEach(function(item){
        url += url + "&" + item.split(' ').join('_');
    });

    window.location = oldUrl + "?" + url;
}

function addFilter(){
	var input = document.getElementById('filterInput').value;
	document.getElementById('filterInput').value = '';

	if(filter_countries.includes(input)) return;

	filter_countries.push(input); 
	updateFilter();
}

function calcData(country){
    var overview = allData[countryToISO[country]];
    var data = overview.data;

    countryData[country] = {};
    countryData[country]["history"] = {};
    countryData[country]["summary"] = {};

    data.forEach(function (item, index){
        var day = {};

        day["Total Cases"] = item.total_cases;
        day["Total Deaths"] = item.total_deaths;

        day["New Cases"] = item.new_cases;
        day["New Deaths"] = item.new_deaths;
        if(item.reproduction_rate != undefined){
            day["R"] = item.reproduction_rate;
        }else{
            day["R"] = "-";
            var history = countryData[country]["history"];
            for (var key in history) {
                if (history[key]["R"] != undefined) day["R"] = history[key]["R"];
            }
        }

        if(item.people_fully_vaccinated != undefined){
            day["Vaccinated"] = item.people_fully_vaccinated;
        }else{
            day["Vaccinated"] = "-";
            var history = countryData[country]["history"];
            for (var key in history) {
                if (history[key]["Vaccinated"] != undefined) day["Vaccinated"] = history[key]["Vaccinated"];
            }
        }

        day["Vaccinated %"] = Math.round(100 * day["Vaccinated"] / overview.population);

        day["CFR %"] = (100 * item.total_deaths / item.total_cases).toFixed(2);
        day["Date"] = item.date;

        var date7DaysAgo = new Date(new Date(item.date) - (7 * 24 * 60 * 60 * 1000)).toISOString().slice(0,10);

        if(index > 6) {
            day["± 7d"] = day["New Cases"] - countryData[country]["history"][date7DaysAgo]["New Cases"];

            var cases7Days = day["New Cases"];
            for (var i=1; i<7; i++){
                var daysAgo = new Date(new Date(item.date) - (i * 24 * 60 * 60 * 1000)).toISOString().slice(0,10);
                cases7Days += countryData[country]["history"][daysAgo]["New Cases"];
            }
            day["Cases Ao7"] = Math.round(cases7Days / 7);
            day["Incidence"] =  Math.round(100000 * cases7Days / overview.population);
        }
        countryData[country]["history"][item.date] = day;

        if(index + 1 == data.length) {
            countryData[country]["summary"] = day;
            console.log(countryData);
        }


	});
	loadSummary();
}

function loadHeader(){
	var headerRow = document.getElementById("summary_header");

	//insert header from filter
	filter_fields.forEach(function(item){
		var header = document.createElement("th");
		header.className = "js-sort-number";
		header.innerHTML = item;
		headerRow.appendChild(header);
	});
			
}

function loadSummary() {
	var table = document.getElementById("summary_content");
	table.innerHTML = '';

	Object.keys(countryData).forEach(function(key) {
		if (!filter_countries.includes(key)) return;

		//insert row for key = country
		var row = table.insertRow(-1);

		//insert first cell for country name and flag
		var name = row.insertCell(-1);
		name.id = key;
		name.addEventListener("click", function(){ showDetails(this.id) });

		//add flag if it exists
		if(flags[countryToISO[key]] != undefined){
			var flag = document.createElement("IMG");
			flag.src = flags[countryToISO[key]];
			flag.style.width = "2em";
			flag.className = "countryFlag";
			name.appendChild(flag);
		}

		//add country name
		var countryName = document.createElement("div");
		countryName.innerHTML = key;
		countryName.className = "countryName";
		name.appendChild(countryName);

		//insert columns from filter
		filter_fields.forEach(function(item){
			var cell = row.insertCell(-1);
			cell.className = "number";
			cell.innerHTML = countryData[key]["summary"][item];
		});
	})

	sortTable(document.getElementById("summary_table"), 1, 'desc');
}
