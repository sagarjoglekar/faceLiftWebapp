function reverseLookup() {	var circle = L.circle([42.3488, -71.04702], 3000, {color: 'white', weight: 1, fillOpacity: 0})
	circleLayer.addLayer(circle);
 	circle.on({
     	mouseover: function () {
         	map.on('mousemove', function (e) {
         		circle.setLatLng(e.latlng);
          		checkCircle(circle);
         	});
     	}
	}); 
	//map.on('mouseup',function(e){
	//	map.removeEventListener('mousemove');
	//})

	checkCircle(circle);

	function checkCircle(circle) {
		var localLabels = {};
		Object.keys(labels).forEach(function(label) {
			localLabels[label] = 0;
			Object.keys(labels[label]).forEach(function(key) {
				var distance = labels[label][key].LatLong.distanceTo(circle._latlng);
				if(distance < circle._mRadius) {
					localLabels[label] = localLabels[label] + labels[label][key].Certainty;
					//lines.push([labels[label][key].LatLong, circle._latlng]);
				}
			})
		})


		//create scale for font size
		var totalMinMax = [1000,0]
		Object.keys(localLabels).forEach(function(label){
			if(localLabels[label] < totalMinMax[0]) {totalMinMax[0] = localLabels[label]}
			if(localLabels[label] > totalMinMax[1]) {totalMinMax[1] = localLabels[label]}
		})

		//adjust label fontsize
		Object.keys(localLabels).forEach(function(label){ 
			d3.select("#labels #"+label).style("font-size",function(){
				var fontSize = getLabelSize(localLabels[label],totalMinMax,false);
				//console.log(fontSize);
				return fontSize+"px";
			})
			.style("line-height","15px");
		})
	}
}