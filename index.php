<?php include "conf.php";?>
<!DOCTYPE html>
<html>
<head>
	 <meta charset="UTF-8">
	<title>Facelift</title>
	<link rel="stylesheet" href="css/bootstrap.min.css" crossorigin="anonymous">
    <script src="js/jquery.min.js"></script>
    <link rel="stylesheet" href="css/leaflet.css"/>
    <link rel="stylesheet" href="css/style.css" />
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">

    <!-- D3 -->
    <script src="js/d3.v4.min.js"></script>
    <script src="js//queue.v1.min.js"></script>

    <!--Leaflet + Heatmap -->
    
    <script src="js/leaflet.js"></script>
    <script src="js/simpleheat.js"></script>
    <script src="js/HeatLayer.js"></script>

    <!-- Own scripts -->
	
    <script src="js/comparison.js"></script>
    <script src="js/labels.js"></script>
    <script src="js/map.js"></script>
    <script src="js/parse.js"></script>    
    <script src="js/dna.js"></script>    
    <!--<script src="js/labelBeauty.js"></script>    
    <script src="js/reverseLookup.js"></script>  
    <script src="js/metricComparison.js"></script> -->

        <!--  ADDED FROM GOODCITYLIFE -->
    <link href='http://fonts.googleapis.com/css?family=Abel|Source+Sans+Pro:400,300,300italic,400italic,600,600italic,700,700italic,900,900italic,200italic,200' rel='stylesheet' type='text/css'>
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="../css/magnific-popup.css" rel="stylesheet">
    <link href="../css/shortcodes/shortcodes.css" rel="stylesheet">
    <link href="../css/owl.carousel.css" rel="stylesheet">
    <link href="../css/owl.theme.css" rel="stylesheet">
    <link href="../css/style.css?v=1" rel="stylesheet">
    <link href="../css/style-responsive.css" rel="stylesheet">
    <link href="../css/default-theme.css?v=1" rel="stylesheet">

    <link href="../css/custom.css" rel="stylesheet">    
    <script>
    	$(document).on('click', '.intro a[href^="#"]', function (event) {
    		event.preventDefault();
		    $('html, body').animate({
		        scrollTop: $($.attr(this, 'href')).offset().top
		    }, 500);
		});

		$(document).on('click', 'span.closer', function (event) {
			  $(this).parent().parent().hide();
		});
    </script>
</head>
<body>
   <?php include $BASE.'/header.php';?>
	<div id="overlay">
		<div class="comparison"> 
			<span class="closeOverlay" style="z-index: 99">X</span>
			<div class="container-fluid">
				<div class="prevLocation"><a><svg width=30 height=30>
					<circle r=15 cx=15 cy=15 fill="grey" />
					<polygon points="17,10 17,20 10,15" fill="black"/>
				</svg></a></div>
				<div class="nextLocation"><a><svg width=30 height=30>
					<circle r=15 cx=15 cy=15 fill="grey" />
					<polygon points="12,10 12,20 20,15" fill="black" />
				</svg></a></div>
				<div class="row">
					<div class="col-12 description">
						<div class="helper" style="z-index: 20; top: 80px; left: -50px;"><div>Hover the image you wish to focus. <span class="closer">Got it!</span></div><img src="img/helper2.png" / style="margin-left: 50px"></div>
						<span class="key"></span><!--<p><br><strong>How has this location changed?</strong></p>-->
					</div>
				</div>
				<div class="row images">
					<div class="col-6 c1"><h5>Original Location</h5></div>
					<div class="col-6 c2"><h5>Beautified Location</h5></div>
				</div>
				<div class="row">
					<h5 class="labelH" style="text-align: center;position: absolute; width: 95%; padding-top: 30px">Urban Scences</h5>
					<div class="col-12 labelList"></div>
				</div>
				<div class="row" style="padding-top: 10px; border-top: 1px dotted grey">
					<div class="col-6 designMetrics" style="border-right: 1px dotted grey">
						<h5>Urban Design Metrics</h5>
						<div class="radarChart"></div>
						<!--<p style="text-align: center;">The five Urban Design Metrics indicate, how livable the <span style="font-weight: bold; color: #F93A02;">original place</span> and its <span style="font-weight: bold; color: #08B3F7;">beautified alternative</span> are.</p>-->
					</div>
					<div class="col-6 urbanElements">
						<h5>Change of Urban Elements</h5>
						<div class="segnetChart"></div>
						<!--<p style="text-align: center;">The Segnet analysis shows, what you can actually see in the pictures.</p>-->
					</div>
				</div>
			</div>
		</div>
	</div>


	<div class="container-fluid" style="background-image: linear-gradient(32deg, #001E2F 11%, #292929 100%)">
		<div class="row">
			<div class="col-12">
				<div class="intro">
					<h1><img src="img/facelift.png" alt="facelift" /></h1>
					<p>Buildings and neighbourhoods speak. They speak of egalitarianism or elitism, beauty or ugliness, acceptance or arrogance. The aim of Facelift is to celebrate egalitarianism, beauty, and acceptance by beautifying the entire world, one Google Street view at a time.</p>
					<p>All of this is done by designing state-of-the-art technologies that make it possible to smarten a street view and read inside the Deep Learning "<i>black box</i>". With further developments of these technologies, we would be more likely to systematically understand and re-create the environments we intuitively love. </p>
					<p><strong><i>"Beauty is nothing other than the promise of happiness"</i></strong><br>Stendhal, On Love.</p>
					<!--<p><strong>Can <i>Machine Learning</i> tell us, how  future cities will look like?</strong> Probably not! But it can help to analzye urban imagery at scale and help us to explore spatial patterns of beauty.</p>
					<p>Facelift is a Deep Neural Network, that generates more beautiful versions of a given location. By Mapping and comparing these images and their metadata, we ca get a grasp of the networks understanding of urban aesthetics.</p>-->
					 <a class="button" href="#start">Explore Boston with FACELIFT</a><br><small><a class="small" href="#about">No, first tell me more about it.</a></small>
				</div>
			</div>
		</div>
		<div class="row" id="start">
			
			<div class="col-8">
				<div class="helper" style="top: 200px; left: 200px;"><div>Discover the street views before-after beautification by clicking on white-circled points. <span class="closer">Got it!</span></div><img src="img/helper2.png" / style="margin-left: 50px"></div>
				<div id="map"></div>
			</div>
			<div class ="col-4">
				<div class="helper" style="top: 10px; right: 100px;"><div>Discover where the urban elements are in the city by hovering over or clicking on the labels. <span class="closer">got it!</span></div><img src="img/helper.png" / style="float: right; margin-right: 20px"></div>
				<p style="padding: 20px 0 0 0px; margin-bottom: 5px">Labels are ordered by beauty, ranging from <span style="font-weight: bold; color: #08B3F7;">beautiful</span> to <span style="font-weight: bold; color: #F93A02;">ugly</span>. The bigger, the more frequent.</p>
				<div id="labels"></div>
				<!--<div class="btn-group" role="group" aria-label="Basic example">
				  <button type="button" class="btn btn-secondary" onclick="createList(getLabelList()); circleLayer.clearLayers();">Explore Labels</button>
				  <button type="button" class="btn btn-secondary" onclick="reverseLookup();">Explore Map</button>
				</div>-->
				<div>
					<svg height="60">
						<g transform="translate(0,5)">
							<circle r=5 fill="#36657E" cx=15></circle>
							<text x=25 y=4 fill="#d2d2d2">currently beautiful</text>
						</g>
						<g transform="translate(0,20)">
							<circle r=5 fill="#993014" cx=15></circle>
							<text x=25 y=4 fill="#d2d2d2">currently ugly</text>
						</g>
						<g transform="translate(0,35)">
							<circle r=5 fill="#993014" stroke="#fff" stroke-width=2 cx=15></circle>
							<text x=25 y=4 fill="#d2d2d2">wannabe beautiful, click to compare</text>
						</g>
					</svg>
				</div>
			</div>
		</div>
	</div>

	<div class="container-fluid" id="dna" style="background: white; color: #444">
		<div class="row" style="padding-top: 25px;">
			<div class="col">
				<h6>The DNA of Beauty</h6>
			</div>
		</div>
		<div class="row">
			<div class="col-12">
				<p>We can compare the changes in Urban Elements (left) and Urban Design Metrics (right) for all beautified locations.<br>Blue bars indicate an <span style="font-weight: bold; color: #08B3F7;">increase</span> in the beautified location, red bars indicate a <span style="font-weight: bold; color: #F93A02;">decrease</span>.
			</div>
			<!--<div class="col-3" style="text-align: right">
				<div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
				  <button type="button" class="normalized btn btn-secondary btn-sm">Normalized</button>
				  <button type="button" class="absolute btn btn-secondary btn-sm active">Absolute</button>
				</div>
			</div>-->
		</div>
		<div class="dna row justify-content-center" style="padding-bottom: 25px">
			<div class="col-4">
				<div class="metricDNA"></div>
			</div>
			<div class="col-8" style="border-left: 1px lightgrey dotted">
				<div class="elementDNA"></div>
			</div>
		</div>
	</div>
	<div class="container-fluid" id="about" style="background: white; border-top: 1px lightgrey dotted; color: #4A4A4A">
		<div class="row" style="margin-top: 25px">
			<div class="col-6">
				<h6>How does it work?</h6>
			</div>
		</div>
		<div class="row">
			<div class="col-12">
				<img src="img/explanation-2000.png" style="width: 100%"/>
			</div>
		</div>
		<div class="row">
			<div class="col-2">
				<strong>Rating images</strong>
				<p>Images of urban places are rated by humans in pairs to determine, which one is more beautiful. We then transform these ratings to absolute ranks using TrueSkill.</p>
			</div>
			<div class="col-1">
				<strong>Training Data</strong>
				<p>These most beautiful and ugliest images are used as Training Data</p>
			</div>
			<div class="col-2">
				<strong>Deep Learning</strong>
				<p>A neural network is then trained on visual cues of beauty and ugliness.</p>
			</div>
			<div class="col-3">
				<strong>Beautiful and Ugly Combinations</strong>
				<p>An original (ugly) image is then used as Input for the Beautification Process. The network generates a template using Generative models, maximizing the visual cues for beauty in accordance with the network’s knowledge. Since this template does not (yet) look like an actual place, we search for similar images in our database to find the closest match.</p>
			</div>
			<div class="col-2">
				<strong>Analysis and Computation</strong>
				<p>Both, the original and the beautiful images are then analyzed: PlacesNet detects possible Scene types in the image. SegNet shows, what urban elements are visible in the image. Using these insights, we can calculate Urban Design Metrics.</p>
			</div>
			<div class="col-2">
				<strong>Visualization & Comparison</strong>
				<p>As a result, we can display the visualizations above</p>
			</div>
		</div>
	</div>

	
	
	<script type="text/javascript">
    //some global variables
    var labels = {},
    	sortedLabels, 
    	hotLabels = [],
    	combinations,
    	map = L.map('map').setView([42.3488, -71.07702], 12),
    	heat = L.heatLayer,
    	circleLayer = L.layerGroup({interactive: false}).addTo(map);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors', maxZoom: 18,}).addTo(map);
	map.scrollWheelZoom.disable();
	map.options.keyboard = false;

	//pre-load all necessary json files, then run init()
    queue().defer(d3.json, 'data/BostonCollatedV4.json').await(init);

	function init(error, collatedJson,) {
		labels = parseLabels(collatedJson); //useful to make this global
		sortedLabels = getLabelList(labels,5);
		//showLabelsOnMap(labels);
		showLocationsOnMap(collatedJson);
		
		combinations = parseCombinations(collatedJson);
		globalSegnetMinMax = segnetMinMax(combinations);

		showCombinationsOnMap(globalSegnetMinMax);
		createList(sortedLabels);
		//openComparison(combinations["513d6c7ffdc9f03587004fa3"], segnetMinMax);
		//reverseLookup(trueSkillCoordinates);
		//drawMetricComparison();
		//labelBeauty();

		//open random combination when hash appears in URL
		if(window.location.hash.indexOf("combinations") === 1) {
			var ids = Object.keys(combinations)
			var random = Math.floor(Math.random()*ids.length)
			if(random >= 1) {
				random = random +1 
			} else if(random >= ids.length -1) {
				random = random -1 
			}
			openComparison(combinations[ids[random]], segnetMinMax);
    	}else if(window.location.hash.indexOf("51") !== -1) {
    		var key = window.location.hash.substring(1);
    		if(Object.keys(combinations).indexOf(key) !== -1) {
    			openComparison(combinations[key], segnetMinMax);
    		}
    		
    	}

		var changes = allChanges(combinations)
		drawDNA(changes,"Segnet",false)
		drawDNA(changes,"Metrics",false)
	} 
	
	</script>
	<?php include $BASE.'/footer.php';?>
</body>
</html>