//import './countryCleanName.js';

function loadCountries() {
	var request = new XMLHttpRequest();
	request.open('GET', 'https://api.covid19api.com/summary');
	//request.setRequestHeader('x-access-token', "5cf9dfd5-3449-485e-b5ae-70a60e997864");
	request.setRequestHeader('access-control-allow-origin', "*");

	request.onload = function () {
		var data = JSON.parse(this.response).Countries;

		var sorted = [];
		for(var i = 0; i < data.length; i++) {
		    var country = data[i];
		    var countryName = clearName[country.Country];
		    countryToSlug[countryName] = country.Slug;
		    sorted.push(countryName);
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
	request.send();
};

function updateFilter(){
	document.getElementById('countryFilter').innerHTML = '';

	filter_countries.sort();

	filter_countries.forEach(function(item, index){
		//download data
		if(!(item in countryData)) downloadCountry(item);

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

	loadSummary();
}

function addFilter(){
	var input = document.getElementById('filterInput').value;
	document.getElementById('filterInput').value = '';

	if(!(input in countryToSlug)) return;
	if(filter_countries.includes(input)) return;

	filter_countries.push(input); 
	updateFilter();
}

function downloadCountry(country){
	var url = "https://api.covid19api.com/total/country/" + countryToSlug[country];

	var request = new XMLHttpRequest();
	request.open('GET', url);
	request.setRequestHeader('x-access-token', "5cf9dfd5-3449-485e-b5ae-70a60e997864");

	request.onload = function () {
		var data = JSON.parse(this.response);

		countryData[country] = {};
		countryData[country]["history"] = {};

		var preActive = 0;
		var preConfirmed = 0;
		var preDeaths = 0;
		var preRecovered = 0;

		data.forEach(function (item, index){
			item["New Confirmed"] = Math.max(item.Confirmed - preConfirmed, 0);
			item["New Deaths"] = Math.max(item.Deaths - preDeaths, 0);
			item["New Recovered"] = Math.max(item.Recovered - preRecovered, 0);
			item["± Active"] = item.Active - preActive;

			preConfirmed = item.Confirmed;
			preDeaths = item.Deaths;
			preRecovered = item.Recovered;
			preActive = item.Active;

			var date = item.Date.slice(0,10);
			var date7DaysAgo = new Date(new Date(item.Date) - (7 * 24 * 60 * 60 * 1000)).toISOString().slice(0,10);

			if(index > 6) {
				item["± 7d ago"] = item["New Confirmed"] - countryData[country]["history"][date7DaysAgo]["New Confirmed"];

				var cases7Days = item["New Confirmed"];
				for (var i=1; i<7; i++){
					var daysAgo = new Date(new Date(item.Date) - (i * 24 * 60 * 60 * 1000)).toISOString().slice(0,10);
					cases7Days += countryData[country]["history"][daysAgo]["New Confirmed"];
				}
				item["Confirmed ao7"] = Math.round(cases7Days / 7);
				item["Incidence"] = Math.round(100000 * cases7Days / countryInfo[country]["population"]);
			}

			delete item["Lat"];
			delete item["Lon"];
			delete item["City"];
			delete item["CityCode"];
			delete item["CountryCode"];
			delete item["Province"];
			delete item["Country"];
			item["Date"] = date;

			countryData[country]["history"][date] = item;

			if(index + 1 == data.length) countryData[country]["summary"] = item;
		});

		loadSummary();
	}

	request.send();
}

function loadHeader(){
	var header = document.getElementById("summary_header");

	//insert header from filter
	filter_fields.forEach(function(item){
		var cell = document.createElement("th");
		cell.className = "js-sort-number";
		cell.innerHTML = item;
		header.appendChild(cell);
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
		if(countryInfo[key].flag != undefined){
			var flag = document.createElement("IMG");
			flag.src = countryInfo[key].flag;
			flag.width = 45;
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
