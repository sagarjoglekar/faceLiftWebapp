function mapTruth(marker) {
	var areas = ["north","east","south","west"]
	var coords = {}
	coords.center = [42.348395259793,-71.08909606933595]

	coords.southeast = [42.311338752837536,-71.01768493652345]
	coords.southwest = [42.29711950573178,-71.13819122314455]
	coords.northwest = [42.4166134339791,-71.16600036621095]
	coords.northeast = [42.43181927300787,-71.0036087036133]
	
	coords.north = [coords.center,coords.northeast,[42.43207267241209,-71.08772277832033], coords.northwest]
	coords.east = [coords.center,coords.northeast, [42.363110278811256,-70.95863342285158], coords.southeast]
	coords.south = [coords.center,coords.southeast,[42.25800001792787,-71.07707977294923], coords.southwest]
	coords.west = [coords.center,coords.southwest,[42.36818362438581,-71.19689941406251], coords.northwest]
	
	var polys = {}
	var scores = {}
	areas.forEach(function(area){
		polys[area] = L.polygon(coords[area], {color: 'red'}).addTo(map);
		scores[area] = {}
		scores[area].values = []
	})

        function isMarkerInsidePolygon(marker, poly) {
            var inside = false;
            //var x = marker.getLatLng().lat, y = marker.getLatLng().lng;
            var x = marker[0], y = marker[1]
            for (var ii=0;ii<poly.getLatLngs().length;ii++){
                var polyPoints = poly.getLatLngs()[ii];
                for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
                    var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
                    var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

                    var intersect = ((yi > y) != (yj > y))
                        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) inside = !inside;
                }
            }

            return inside;
        };

	Object.keys(marker).forEach(function(key) {
		var latlng = [marker[key].location.lat,marker[key].location.long]
		areas.forEach(function(area) {
			if(isMarkerInsidePolygon(latlng,polys[area])) {scores[area].values.push(marker[key].trueSkill);}
		})
		
	})

	Object.keys(scores).forEach(function(area){
		scores[area].avg = scores[area].values.reduce(function(a,b){return a+b}) / scores[area].values.length
	})

		console.log(scores)


	//var avg = mean.reduce(function(a,b){return a+b},0) / mean.length
	

	map.on("click",function(e){
		console.log("["+e.latlng.lat+","+e.latlng.lng+"],")
	})

}