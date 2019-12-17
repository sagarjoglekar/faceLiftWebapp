function drawDNA(data,vis,normalized) {
	var div;
	var order;
	var elementCount;
	var pass = data

	d3.select("#dna button.normalized").on("click",function(){
		drawDNA(pass,"Segnet",true)
		drawDNA(pass,"Metrics",true)
		d3.select("#dna button.normalized").classed("active",true)
		d3.select("#dna button.absolute").classed("active",false)
	})

	d3.select("#dna button.absolute").on("click",function(){
		drawDNA(pass,"Segnet",false)
		drawDNA(pass,"Metrics",false)
		d3.select("#dna button.normalized").classed("active",false)
		d3.select("#dna button.absolute").classed("active",true)
	})
	max = data[vis].max
	data = data[vis].values
	if(vis=="Segnet") {
		div = ".elementDNA"
		//order = ["Sky","Road","Tree","Pavement","Pole","Vehicle","Fence","Building","Sky","Road Marking","Pedestrian","Road"]
		order = ["Road", "Sky", "Vehicle", "Road Marking", "Building", "Fence", "Bike", "Sign Symbol", "Pedestrian", "Pole", "Pavement", "Tree"]
		elementCount = data.Sky.values.Change.length
	}
	if(vis=="Metrics") {
		div = ".metricDNA"
		order = ordered_metrics = ["Landmarks", "Openness", "GreenCover", "Walkability", "Complexity"]
		elementCount = data.Openness.values.Change.length
	}


	var width = $(div).width();
	var height = 300;
	d3.select(div).selectAll("svg").remove();
	var svg = d3.select(div).append("svg").attr("width",width).attr("height",height)

	var xPos = d3.scaleLinear().domain([0,Object.keys(data).length]).range([0,width])
	var yPos = d3.scaleLinear().domain([0,elementCount]).range([12,height])
	var opacityScale = d3.scaleLinear().domain([0,max]).range([0,1])

	var mean = []
	order.forEach(function(container,i) {
		var arr = data[container].values.Change
		var sum = arr.reduce(function(a,b){return a+b})
		mean.push(sum /  arr.length)

		//let median = (arr[(arr.length - 1) >> 1] + arr[arr.length >> 1]) / 2
		//mean.push(median)
		//console.log(median)
	})
	//var legendColor = d3.scaleLinear().domain([mean[0],mean[mean.length-1]]).range(["#F93A02","#08B3F7"])
	var legendColor = d3.scaleLinear().domain([-1,1]).range(["#F93A02","#08B3F7"])



	order.forEach(function(container,i) {
		var group = svg.append("g").attr("class","values "+container).attr("height",height)

		//legend
		group.append("text").text(container)
		.attr("y",8)
		.attr("x",function(d,j){return xPos(i) + ((width/Object.keys(data).length) -1) / 2})
		.attr("fill",legendColor(mean[i]))
		.style("font-size",9)
		.attr("text-anchor","middle")

		//group.on("mouseover",function(){
		//	d3.selectAll(".dna .values").style("opacity",0.1)
		//	d3.select(this).style("opacity",1)
		//})
		//.on("mouseout",function(){
		//	d3.selectAll(".dna .values").style("opacity",1)
		//})

		group.selectAll("rect").data(data[container].values.Change).enter()
		.append("g").attr("class",function(d,j){return "combination"+(j+1)}).append("rect")
		.attr("width",(width/Object.keys(data).length) -1)
		.attr("height",(height/elementCount) -1)
		.attr("class",function(d,j){return "combination"+(j+1)})
		.attr("x",function(d,j){return xPos(i)})
		.attr("y",function(d,j){return yPos(j)})
		.attr("fill",function(d){
			if(normalized) {
				value = 2* ((d - data[container].minChange) / (data[container].maxChange - data[container].minChange)) -1
			} else {
				value = opacityScale(d)
			}
			
			if(value > 0) {return "#08B3F7"} else {return "#F93A02"}
		})
		.style("opacity",function(d,i){
			if(normalized) {
				value = 2* ((d - data[container].minChange) / (data[container].maxChange - data[container].minChange)) -1
			} else {
				value = opacityScale(d)
			}
			return Math.abs(value)
		})
	})
}
