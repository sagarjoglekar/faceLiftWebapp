//go through all possible labels and give less intensity to less certain labels
function parseLabels(collation) {
	var labels = {};
	Object.keys(collation).forEach(function(key,i) {	

		var labelArray = collation[key].metrics.Top5PlaceLabels;
		if(typeof labelArray !== "undefined") {
			labelArray.forEach(function(label,i) {
				var label = label.replace(/\//g, '_').slice(3);
				if(Object.keys(labels).indexOf(label) === -1) {labels[label] = [];}
				labels[label][key] = {};
				labels[label][key].Certainty = (6-i);
				labels[label][key].trueSkill = collation[key].trueSkill;
				labels[label][key].LatLong = new L.LatLng(
   					collation[key].location.lat,
   					collation[key].location.long,
   					labels[label][key].Certainty
   				);
			})
		}
	});
	return labels;
}

function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  //return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  return 7926 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

//put together all necessary informations from various jsons into one Oject (combinations)
function parseCombinations(collation) {
	var combinations = {};
	//var whitelist = ["513d6a19fdc9f03587004962", "513d67c6fdc9f0358700416d", "513d6be7fdc9f03587004e2d", "513d69dcfdc9f03587004898", "513d6bf5fdc9f03587004e4d", "513d6838fdc9f035870042c7", "513d6879fdc9f035870043aa", "513d6a61fdc9f03587004a55", "513d6b9afdc9f03587004d6e", "513d677ffdc9f035870040b8", "513d6c12fdc9f03587004e94", "513d6bc6fdc9f03587004dd3", "513d697dfdc9f03587004752", "513d6842fdc9f035870042ec", "513d6acefdc9f03587004b71", "513d6a6afdc9f03587004a6a", "513d67c4fdc9f03587004166", "513d67c4fdc9f03587004166", "513d6ca7fdc9f0358700500b", "513d6b5efdc9f03587004cda", "513d684bfdc9f03587004309", "513d67aafdc9f0358700412a", "513d6b29fdc9f03587004c60", "513d6be0fdc9f03587004e1b", "513d68d3fdc9f035870044ec","513d6a39fdc9f035870049cd","513d6b29fdc9f03587004c60","513d6be7fdc9f03587004e2d","513d6be0fdc9f03587004e1b","513d6b9afdc9f03587004d6e","513d6842fdc9f035870042ec","513d68d3fdc9f035870044ec","513d6879fdc9f035870043aa","513d697dfdc9f03587004752","513d6bc6fdc9f03587004dd3","513d6a61fdc9f03587004a55","513d6b5efdc9f03587004cda"]
	var whitelist = ["513d677ffdc9f035870040b8", "513d67aafdc9f0358700412a", "513d67c6fdc9f0358700416d", "513d6c12fdc9f03587004e94", "513d684bfdc9f03587004309", "513d67c4fdc9f03587004166", "513d6838fdc9f035870042c7", "513d6bf5fdc9f03587004e4d"]
	Object.keys(collation).forEach(function(key,i ){
		if(
				//key.indexOf(["513d69cafdc9f0358700485d","513d6abbfdc9f03587004b3e","513d6b4bfdc9f03587004cac","513d6974fdc9f0358700472b","513d67d1fdc9f03587004187","513d6941fdc9f03587004676","513d6a6bfdc9f03587004a6c","513d692dfdc9f03587004632","513d6ca1fdc9f03587004ffd"]) === -1 //blacklist spurious images (End 2017)
				whitelist.indexOf(key) > -1
				&& collation[key].beautified.flag //if the location is beautifiable
				//&& key != collation[key].beautified.XformedKeys[0][0] //this condition could be optimized - e.g. take first alternative if keys are the same
				//&& collation[key].trueSkill < collation[collation[key].beautified.XformedKeys[0][0]].trueSkill //only take combinations where the beautified trueskill is bigger than the original trueskill

			) { 


			//define object and assign key
			combinations[key] = { LatLng: {}, Original: {}, Beautified: {}}
			combinations[key].LatLng = new L.LatLng(
   				collation[key].location.lat,
   				collation[key].location.long
   			);

   			var segments = ["Sky", "Building", "Pole", "Road Marking", "Road", "Pavement", "Tree", "Sign Symbol", "Fence", "Vehicle", "Pedestrian", "Bike"]
   			//all original metrics / segments
			var Original = combinations[key].Original
			Original.Key = key; //redundant, but i like it
   			Original.Metrics = {};
   			Original.Metrics.GreenCover = collation[key].metrics.GreenCover;
   			Original.Metrics.Openness = collation[key].metrics.Openness;
			//Original.Metrics.Landmarks = collation[key].metrics.TnomyScores.Landmark;
			Original.Metrics.Walkability = collation[key].metrics.TnomyScores.Walkable;
			Original.Metrics.Complexity = collation[key].metrics.VisualComplexity;
			Original.trueSkill = collation[key].trueSkill;
			Original.Segnet = {};
			segments.forEach(function(segment){
				Original.Segnet[segment]= collation[key].metrics.segnet[segment]
			})
			Original.Labels = [];
			collation[key].metrics.Top5PlaceLabels.forEach(function(label){
				Original.Labels.push(label.replace(/\//g, '_').slice(3))
			})
	
   			//all beautified metrics / segments
			var Beautified = combinations[key].Beautified
			//Beautified.Key = collation[key].beautified.XformedKeys[0][0]; //simply chooses first one, assuming its the most certain
			
			arr = [] //choose closest alternative
			collation[key].beautified.XformedKeys[0].forEach(function(bKey) {
				if(key != bKey && collation[key].trueSkill < collation[bKey].trueSkill) {
					dist = distance(collation[key].location.lat, collation[key].location.long, collation[bKey].location.lat, collation[bKey].location.long)
					arr.push({distance: dist, key: bKey})	
				}
			})

			arr.sort(function(a,b){return a.distance-b.distance})
			//console.log(arr.sort(function(a,b){return a.distance-b.distance})[0])
			//console.log(arr[0].distance)
			Beautified.Key = arr[0].key


   			Beautified.Metrics = {};
   			Beautified.Metrics.GreenCover = collation[Beautified.Key].metrics.GreenCover;
   			Beautified.Metrics.Openness = collation[Beautified.Key].metrics.Openness;
			//Beautified.Metrics.Landmarks = collation[Beautified.Key].metrics.TnomyScores.Landmark;
			Beautified.Metrics.Walkability = collation[Beautified.Key].metrics.TnomyScores.Walkable;
			Beautified.Metrics.Complexity = collation[Beautified.Key].metrics.VisualComplexity;
			Beautified.trueSkill = collation[Beautified.Key].trueSkill;
			Beautified.Segnet = {};
			segments.forEach(function(segment){
				Beautified.Segnet[segment]= collation[Beautified.Key].metrics.segnet[segment]
			})
			Beautified.Labels = [];
			collation[Beautified.Key].metrics.Top5PlaceLabels.forEach(function(label){
				Beautified.Labels.push(label.replace(/\//g, '_').slice(3))
			})
		}
	})
	//console.log(Object.keys(combinations).length);
	return combinations;
}

//parse global extreme values of all segnet value changes
function segnetMinMax(combinations) {
	var allSegnets = {
		"Sky": {},"Building": {},"Pole": {},"Road Marking": {},"Road": {},"Pavement": {},"Tree": {},"Sign Symbol": {},"Fence": {},"Vehicle": {},"Pedestrian": {},"Bike": []
	};
	
	Object.keys(allSegnets).forEach(function(segment) {
		["Original","Beautified"].forEach(function(version) {
			allSegnets[segment][version] = []
			allSegnets[segment].Change = []
		})
		Object.keys(combinations).forEach(function(key){
			var original = combinations[key].Original.Segnet[segment];
			if(typeof original === 'undefined') {original = 0};
			var beautified = combinations[key].Beautified.Segnet[segment];
			if(typeof beautified === 'undefined') {beautified = 0};
			var change = beautified - original
			
			allSegnets[segment].Original.push(original)
			allSegnets[segment].Beautified.push(beautified)
			allSegnets[segment].Change.push(change)
		})
	})

	var minMax = {};
	Object.keys(allSegnets).forEach(function(segment) {
		minMax[segment] = {}
		minMax[segment].values = allSegnets[segment] //only necessary for DNA of
		minMax[segment].minChange = allSegnets[segment].Change.reduce(function(a, b) {return Math.min(a, b);});
		minMax[segment].maxChange = allSegnets[segment].Change.reduce(function(a, b) {return Math.max(a, b);});

		var min = [
			allSegnets[segment].Original.reduce(function(a, b) {return Math.min(a, b)}),
			allSegnets[segment].Beautified.reduce(function(a, b) {return Math.min(a, b)})
		]
		minMax[segment].min = min.reduce(function(a, b) {return Math.min(a, b)})

		var max = [
			allSegnets[segment].Original.reduce(function(a, b) {return Math.max(a, b)}),
			allSegnets[segment].Beautified.reduce(function(a, b) {return Math.max(a, b)})
		]
		minMax[segment].max = max.reduce(function(a, b) {return Math.max(a, b)})
	})
	return minMax;
}

function allChanges(combinations) {
	var dimensions = {
		'Metrics': {
			'GreenCover': {},
			'Openness': {},
			//'Landmarks': {},
			'Walkability': {},
			'Complexity': {}
		},
		'Segnet': {
			'Sky': {},
			'Building': {},
			'Pole': {},
			'Road Marking': {},
			'Road': {},
			'Pavement': {},
			'Tree': {},
			'Sign Symbol': {},
			'Fence': {},
			'Vehicle': {},
			'Pedestrian': {},
			'Bike': {}
		}
	}

	Object.keys(dimensions).forEach(function(dimension){
		var maxDimension = 0
		Object.keys(dimensions[dimension]).forEach(function(element){
			var elements = dimensions[dimension]
			var versions = ["Original","Beautified"]

			versions.forEach(function(version) {
				elements[element][version] = []
				elements[element].Change = []
			})
			Object.keys(combinations).forEach(function(key){
				var original = combinations[key].Original[dimension][element];
				if(typeof original === 'undefined') {original = 0};
				var beautified = combinations[key].Beautified[dimension][element];
				if(typeof beautified === 'undefined') {beautified = 0};
				var change = beautified - original
				
				elements[element].Original.push(original)
				elements[element].Beautified.push(beautified)
				elements[element].Change.push(change)
				//get biggest value within dimension
				if(change > maxDimension) {maxDimension = change}
			})
		})

		var minMax = {};
		Object.keys(dimensions[dimension]).forEach(function(element){
			var elements = dimensions[dimension]
			minMax[element] = {}
			minMax[element].values = 	elements[element] //only necessary for DNA of
			minMax[element].minChange = 	elements[element].Change.reduce(function(a, b) {return Math.min(a, b);});
			minMax[element].maxChange = 	elements[element].Change.reduce(function(a, b) {return Math.max(a, b);});
		//
			var min = [
				elements[element].Original.reduce(function(a, b) {return Math.min(a, b)}),
				elements[element].Beautified.reduce(function(a, b) {return Math.min(a, b)})
			]
			minMax[element].min = min.reduce(function(a, b) {return Math.min(a, b)})
		//
			var max = [
				elements[element].Original.reduce(function(a, b) {return Math.max(a, b)}),
				elements[element].Beautified.reduce(function(a, b) {return Math.max(a, b)})
			]
			minMax[element].max = max.reduce(function(a, b) {return Math.max(a, b)})
			
		})
		//get biggest value within dimension
		dimensions[dimension].max = maxDimension

		dimensions[dimension].values = minMax
	})
	return dimensions
}
