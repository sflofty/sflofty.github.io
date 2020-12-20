//import './countryCleanName.js';

function loadCountries() {
	//var dataList = document.getElementById('filterOptions');
	//clearName.forEach(function(key, value){
	//	var option = document.createElement('option');
	//	option.id = key;
	//	option.value = key;
	//    dataList.appendChild(option);
	//});
	
	//updateFilter();

	var request = new XMLHttpRequest();
	request.open('GET', 'https://api.covid19api.com/summary');

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

	var preConfirmed = 0;
	var preDeaths = 0;
	var preRecovered = 0;

	request.onload = function () {
		var data = JSON.parse(this.response);

		countryData[country] = {};
		countryData[country]["history"] = {};

		data.forEach(function (item, index){
			item["New Confirmed"] = item.Confirmed - preConfirmed;
			item["New Deaths"] = item.Deaths - preDeaths;
			item["New Recovered"] = item.Recovered - preRecovered;
			item["± Active"] = item["New Confirmed"] - item["New Recovered"];

			preConfirmed = item.Confirmed;
			preDeaths = item.Deaths;
			preRecovered = item.Recovered;

			var date = item.Date.slice(0,10);
			var date7DaysAgo = new Date(new Date(item.Date) - (7 * 24 * 60 * 60 * 1000)).toISOString().slice(0,10);

			if(index > 6) {
				item["± 7d ago"] = item["New Confirmed"] - countryData[country]["history"][date7DaysAgo]["New Confirmed"];

				var cases7Days = item["New Confirmed"];
				for (var i=1; i<7; i++){
					var daysAgo = new Date(new Date(item.Date) - (i * 24 * 60 * 60 * 1000)).toISOString().slice(0,10);
					cases7Days += countryData[country]["history"][daysAgo]["New Confirmed"];
				}
				item["7 Days"] = cases7Days;
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

		var name = row.insertCell(-1);
		name.innerHTML = key;
		name.className = "rowID";
		name.id = key;
		name.addEventListener("click", function(){ showDetails(this.id) });

		//insert columns from filter
		filter_fields.forEach(function(item){
			var cell = row.insertCell(-1);
			cell.className = "number";
			cell.innerHTML = countryData[key]["summary"][item];
		});
	})

	sortTable(document.getElementById("summary_table"), 1, 'desc');
}
