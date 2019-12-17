
function openComparison(location, segnetMinMax) {
    $("#overlay").fadeIn();
    $(".closeOverlay").click(function(){
        $("#overlay").fadeOut();
    })
    $(document).keyup(function(e) {
        if (e.keyCode == 27) { $("#overlay").fadeOut(); }   // esc
        if (e.keyCode == 37) { openComparison(prevLocation) }   // left
        if (e.keyCode == 39) { openComparison(nextLocation) }   // left
    });

    //identify and preload next items
    var combinationsArray = Object.keys(combinations);
   	var nextKey = combinationsArray.indexOf(location.Original.Key) + 1;
   	var prevKey = nextKey - 2;
   	if(nextKey == 82) {nextKey = 2}
   	if(prevKey == 0) {prevKey = combinationsArray.length -2}
   	var nextLocation = combinations[combinationsArray[nextKey]];
   	var prevLocation = combinations[combinationsArray[prevKey]];
   	new Image().src = "img/BostonBeautified/"+prevLocation.Original.Key+".jpg";
   	new Image().src = "img/BostonBeautified/"+prevLocation.Beautified.Key+".jpg";
   	new Image().src = "img/BostonBeautified/"+nextLocation.Original.Key+".jpg";
   	new Image().src = "img/BostonBeautified/"+nextLocation.Beautified.Key+".jpg";
   	$(".prevLocation a").attr("href","#"+combinationsArray[prevKey])
   	$(".nextLocation a").attr("href","#"+combinationsArray[nextKey])
   	d3.select(".prevLocation").on("click",function(){openComparison(prevLocation)});
   	d3.select(".nextLocation").on("click",function(){openComparison(nextLocation)});

   	//exchange images
   	d3.select(".description .key").text("#"+location.Original.Key)
    d3.selectAll(".images div").selectAll("img").remove()
    d3.selectAll(".images .c1").append("img").attr("class","Original").attr("src","img/BostonBeautified/"+location.Original.Key+".jpg")
    d3.selectAll(".images .c2").append("img").attr("class","Beautified").attr("src","img/BostonBeautified/"+location.Beautified.Key+".jpg")

    //get container width for comparison
    var listSize = $(".labelList").width();
    labelComparison(location, listSize);

    //all variables needed for the radarchart
	var radarSize = $(".radarChart").width(),
		margin = {top: radarSize/8, right: radarSize/8, bottom: radarSize/8, left: radarSize/8},
		width = Math.min(radarSize, window.innerWidth - 10) - margin.left - margin.right,
		height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20),
		radarChartOptions = {
		  w: width,
		  h: height,
		  margin: margin,
		  maxValue: 5,
		  levels: 5,
		  roundStrokes: true,
		  color: d3.scaleOrdinal().range(["#08B3F7","#F93A02"])
		},
	data = []; //parse location metrics into array readable for radarchart
	["Beautified", "Original"] // draw beautified version first, since it usually is bigger
	.forEach(function(version,i) {
		data[i] = [];
		Object.keys(location[version].Metrics).forEach(function(dimension) {
			var dimensions = {axis: dimension, value: location[version].Metrics[dimension]}
			data[i].push(dimensions)
		})
	})
	//Call function to draw the Radar chart
	RadarChart(".radarChart", data, radarChartOptions);
	segnetChart(location);

	//show Labels on Top
	function labelComparison(location, listSize) {
		d3.select(".comparison .labelList svg").remove();
		var svg = d3.select(".comparison .labelList").append("svg")
			.attr("width",listSize)
			.attr("height", 90)
		
		//scales
		var position = d3.scaleLinear().domain([0,sortedLabels[0].length]).range([30,listSize]); //give some space for text rotation
		var certaintyScale = d3.scaleLinear().range([0.1,1]).domain([0,5])
	
		//create groups for translation and text-elements for rotation
		var reverseLabels = sortedLabels[0].slice().reverse(); //we want the beauiful labels on the right side
		svg.selectAll("text").data(reverseLabels).enter()
		.append("g")
		.attr("transform",function(d,i){
			return "translate("+position(i)+",14)"
		})
		.append("text")
		.attr("id",function(d){return d.label})
		.text(function(d){return d.label;})
		.style("fill",function(d){return colorLabelComparison(d.mean)})
		.style("text-anchor","end")
		.style("font-weight","400")
		.style("opacity",.1)
		.style("font-size","9")
		.style("transform","rotate(-45deg)");
	
		//what are the current combinations labels?
		var locationLabels = {};
		locationLabels.Original = location.Original.Labels;
		locationLabels.Beautified = location.Beautified.Labels;

		//create labelDots
		labelArray = []
		reverseLabels.forEach(function(labelObject) {
			labelArray.push(labelObject.label)
		})
		var dotOpacity = d3.scaleLinear().domain([0,4]).range([0,1])
		var labelDots = svg.append("g").attr("class","labelDots")
		Object.keys(locationLabels).forEach(function(version,i){
			var dotGroup = labelDots.append("g").attr("class",version)
			locationLabels[version].forEach(function(label,j) {
				var labelPosition = labelArray.indexOf(label)
				if(labelPosition > 0) {
					dotGroup.append("rect")
					.attr("width",function(){
						return 5-i
					})
					.attr("height",5)
					.attr("y",2)
					.style("opacity",dotOpacity(j))
					.attr("x",function(){
						var padding = 0;
						if(i){padding = 1}
						return position(labelPosition) + padding
					})
					.attr("fill",function(){
						if(i) {return "#08B3F7"} else {return "#F93A02"}
					})
				}
			})
		})

		//color Labels when image is hovered
		d3.selectAll(".comparison .Original, .comparison .Beautified")
		.on("mouseover",function(d){
			//change Label color
			var version = d3.select(this).attr("class")
			d3.selectAll(".labelList text").each(function(){
				var currentElement = d3.select(this)
				var currentLabel = currentElement.attr("id")
				var certainty = locationLabels[version].indexOf(currentLabel);
				if(certainty !== -1) {
					currentElement
					.style("opacity",certaintyScale(certainty))
					.style("fill","white")
					.style("font-weight","bold")
					.style("font-size","11")
				} else {
					currentElement.style("opacity",".4")
				}
			})
			
			d3.select(".radarChart #"+version+" path").style("fill-opacity", 1)//highlight radarblob
			d3.selectAll(".comparison img").style("opacity",.5)
			d3.select(this).style("opacity",1)
			d3.selectAll(".segnetChart .dots, .segnetChart .changeBars").style("opacity",0)
			d3.select(".segnetChart ."+version).style("opacity",1)
			d3.selectAll(".labelDots g").style("opacity",0)
			d3.select(".labelH").style("opacity",0)
			d3.selectAll(".labelDots g."+version).style("opacity",1)
			d3.selectAll("g.changeScale").style("opacity",0)
			d3.selectAll("g.absScale").style("opacity",1)
			d3.selectAll(".urbanElements h5").text("Presence of Urban Elements")


		})
		.on("mouseout",function(){
			d3.selectAll(".labelList text")
			.style("font-weight","400")
			.style("font-size","9")
			.style("opacity",.1)
			.style("fill",function(d){
				return colorLabelComparison(d.mean)
			})
			d3.selectAll(".radarChart path").style("fill-opacity", .15)
			d3.selectAll(".comparison img").style("opacity",1)
			d3.selectAll(".segnetChart .changeBars").style("opacity",1)
			d3.selectAll(".segnetChart .dots").style("opacity",0)
			d3.selectAll(".labelDots g").style("opacity",1)
			d3.select(".labelH").style("opacity",1)
			d3.selectAll("g.changeScale").style("opacity",1)
			d3.selectAll("g.absScale").style("opacity",0)
			d3.selectAll(".urbanElements h5").text("Change of Urban Elements")
		})
	}
	
	function colorLabelComparison(value) {
		var meanMinMax = sortedLabels[1];
		var color = d3.scaleLinear().domain([meanMinMax[0],meanMinMax[1]]).range([d3.rgb("#F93A02"),d3.rgb("#08B3F7")]);
		return color(value)
	}



	function segnetChart(location) {
		var width = $(".comparison .segnetChart").width();
		var height = 240
		d3.select(".comparison .segnetChart").selectAll("*").remove()
		var svg = d3.select(".comparison .segnetChart").append("svg").attr("width",width).attr("height",height)

		//write data - expecially to calculate normalized change
		var data = {};
		Object.keys(location.Original.Segnet).forEach(function(segment,i) {
			data[segment] = {}
			var original = location.Original.Segnet[segment]
			if(typeof original === 'undefined') {original = 0}
			var beautified = location.Beautified.Segnet[segment]
			if(typeof beautified === 'undefined') {beautified = 0}

			var min = globalSegnetMinMax[segment].min
			var max = globalSegnetMinMax[segment].max


			var minChange = globalSegnetMinMax[segment].minChange;
			var maxChange = globalSegnetMinMax[segment].maxChange;
			var change = beautified - original;

			
			data[segment].normChange = 2* ((change - minChange) / (maxChange - minChange)) -1
			data[segment].absChange = change
			//data[segment].Original = (original - min) / (max - min)
			//data[segment].Beautified = (beautified - min) / (max - min)
			data[segment].Original = original
			data[segment].Beautified = beautified


		})

		//console.log(globalSegnetMinMax)

		//scales
		//var xPosition = d3.scaleLinear().domain([-1,1]).range([5,width-5])
		var changePosition = d3.scaleLinear().domain([-.25,.25]).range([2,width-2])
		var absPosition = d3.scaleLinear().domain([0,.75]).range([2,width-2])
		var yPosition = d3.scaleLinear().domain([0,Object.keys(data).length]).range([15,height])

		//legend
		var scale = svg.append("g").attr("class","scale");
		//scale.selectAll("line").data([-1,-.5,0,.5,1]).enter().append("line")
		//.attr("stroke","grey")
		//.attr("y1",10)
		//.attr("y2",height)
		//.attr("x1",function(d){return xPosition(d)})
		//.attr("x2",function(d){return xPosition(d)})
		//.attr("opacity",.5)
		scale.selectAll("line").data(Object.keys(data)).enter().append("line")
		.attr("stroke","grey")
		.attr("y1",function(d,i){return yPosition(i) -3})
		.attr("y2",function(d,i){return yPosition(i) -3})
		.attr("x1",0)
		.attr("x2",width)
		.attr("opacity",.1)

		var changeScale = svg.append("g").attr("class","changeScale");
		changeScale.selectAll("text").data([-25,-12.5,0,12.5,25]).enter().append("text")
		.attr("y",10).style("opacity",.5).style("font-size",10).style("text-anchor","middle").style("font-weight","normal")
		.attr("fill",function(d){
			if(d<0) {return "#F93A02"}
				else if(d>0) {return "#08B3F7"}
				else {return "white"}
		})
		.attr("x",function(d){return changePosition(d/110)})
		.text(function(d){return d+'%'})

		var absScale = svg.append("g").attr("class","absScale").style("opacity",0);
		absScale.selectAll("text").data([0, 25, 50, 75]).enter().append("text")
		.attr("y",10).style("opacity",.5).style("font-size",10).style("text-anchor","left").style("font-weight","normal")
		.attr("fill","grey")
		.attr("x",function(d){return absPosition(d/110)})
		.text(function(d){return d+'%'})
		
	
		var colorScale = d3.scaleLinear().domain([1,0]).range(["white","grey"])
		var changeBars = svg.append("g").attr("class","changeBars")
		changeBars.selectAll("path").data(Object.keys(data)).enter().append("path")
		.attr("fill",function(d){
			if(data[d].absChange >	 0) {return "#08B3F7"} else {return "#F93A02"}
		})
		.style("opacity",function(d){
			//return Math.abs(data[d].absChange) *4
			return 1
		})
		.attr("d",function(d,i){
			var correction = -.5;
			if(data[d].absChange < 0) {correction = .5}
			var x1 = width /2 + correction
			var y1 = yPosition(i)
			var p2 = changePosition(data[d].absChange)
			var p3 = yPosition(i) + 13
			var p4 = width /2 + correction
			return "M"+x1+" "+y1+" H "+p2+" V "+p3+" H "+p4+" L "+x1+" "+y1
		})

		var versions = ["Original","Beautified"]
		versions.forEach(function(version, i) {
			svg.append("g").attr("class",version+" dots").style("opacity",0)
			.selectAll("path").data(Object.keys(data)).enter().append("path")
			.attr("fill",function(d){
				if(i > 0) {return "#08B3F7"} else {return "#F93A02"}
				//return "grey"
			})
			.style("opacity",function(d){
				return Math.abs(data[d].version) *2
			})
			.attr("d",function(d,i){
				//var correction = -.5;
				//if(data[d].change < 0) {correction = .5}
				var x1 = 2
				var y1 = yPosition(i)
				var p2 = absPosition(data[d][version])
				var p3 = yPosition(i) + 13
				var p4 = 2
				return "M"+x1+" "+y1+" H "+p2+" V "+p3+" H "+p4+" L "+x1+" "+y1
			})
			//.selectAll("circle").data(Object.keys(data)).enter().append("circle")
			//.attr("cy",function(d,i){return yPosition(i) + 7.5})
			//.attr("r",3)
			//.attr("cx",function(d){return xPosition(data[d][version])})
			//.attr("fill",function(d,j){
			//	if(i) {return "#08B3F7"} else {return "#F93A02"}
			//})
		})

		var labels = svg.append("g").attr("class","labels")
		labels.selectAll("text").data(Object.keys(data)).enter().append("text")
		.attr("y",function(d,i){return yPosition(i) + 10})
		.style("fill","white")
		.style("font-size",10)
		.attr("x",4)
		.text(function(d){return d})
	}
}


function RadarChart(id, data, options, size) {
	var cfg = {
	 w: 500,				//Width of the circle
	 h: 500,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.1, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.15, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format(''),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#7B7B7B")
		.style("stroke", "#7B7B7B")
		.style("fill-opacity", cfg.opacityCircles)
		//.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	/*axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });
	*/

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "lightgrey")
		.style("stroke-width", "1px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "10px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
	var radarLine = d3.lineRadial()
		.curve(d3.curveBasisClosed)
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed)
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper")
		.attr("id", function(d,i){
			if(i) {return "Original"}  else {return "Beautified"}
		});
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) {return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		//.style("fill", function(d,i,j) { return cfg.color(j); })
		.style("fill", "white")
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		/*.on("mouseover", function(d,i) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(d.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});*/
		
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
}
