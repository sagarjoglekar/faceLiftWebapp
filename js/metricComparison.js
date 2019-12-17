function drawMetricComparison() {
	//create array so that it works nicely with d3
	var combinationsArray = Object.keys(combinations).map(function (location) {return combinations[location]});
	var metrics = [
		{name: "Complexity", color: "lightblue"},
		{name: "GreenCover", color: "green"},
		{name: "Landmarks", color: "red"},
		{name: "Openness", color: "yellow"},
		{name: "Walkability", color: "pink"},
	];


	function drawNodes() {
		//still have to figure out whhich nodes to draw
	}

	drawLinks();
	function drawLinks() {
		var nodeRadius = d3.scaleSqrt().range([2, 2]);	
		var linkWidth = d3.scaleLinear().range([2.5, 5 * nodeRadius.range()[0]]);			
		var margin = {
		  top: nodeRadius.range()[1] + 1,
		  right: nodeRadius.range()[1] + 1,
		  bottom: nodeRadius.range()[1] + 1,
		  left: nodeRadius.range()[1] + 1
		};
		var width = 800 - margin.left - margin.right;
		var height = 450 - margin.top - margin.bottom;

		var svg = d3.select(".metricComparison").append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	
    //go through all metrics and draw paths
		metrics.forEach(function(metric) {
			var link = svg.append('g').attr("class",metric.name)
			.selectAll('path')
			.data(combinationsArray)
			.enter().append('path')
			.attr('stroke-width', 1)
			.attr('opacity', .2)
			.attr('stroke', metric.color)
			.attr('class', 'links')
			.attr('id',function(d) {
				return "id"+d.Original.Key;
			})
			.attr('d', function (d,i) {
				var x = d3.scaleLinear().domain([0,5]).range([0, width]);
				console.log(d);

        //Create randomized values, so that it spreads out a bit better
				if(d.Original.Metrics[metric.name] <= 4 && d.Original.Metrics[metric.name] >= 1) {d.Original.Metrics[metric.name] = d.Original.Metrics[metric.name] + Math.random() -.5}
				if(d.Beautified.Metrics[metric.name] <= 4 && d.Beautified.Metrics[metric.name] >= 1) {d.Beautified.Metrics[metric.name] = d.Beautified.Metrics[metric.name] + Math.random() / 2 -.5}
				var original = x(d.Original.Metrics[metric.name]),
					beautified = x(d.Beautified.Metrics[metric.name]);

        //draw path vor arc
				if(original != beautified) {
					var path = ['M', original, height/2 , 'A',
    					(original - beautified)/2, ',', 
    					(original - beautified)/3, -2, 0, ',',
    					0, beautified, ',', height/2]
    					.join(' ');
    					console.log(path)
    				return path;
    			}
			})
		})
	}
}

function highlightComparison(hotLocations) {
	d3.selectAll("#metricComparison .links").attr("opacity",.2).attr("stroke-width",1)

	Object.keys(hotLocations).forEach(function(location) {
		hotKey = hotLocations[location].Original.Key;
		d3.selectAll("#metricComparison #id"+ hotKey).attr("opacity",1).attr("stroke-width",2)
	})
}
