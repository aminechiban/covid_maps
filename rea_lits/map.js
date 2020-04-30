/*DIMENSION DE LA MAP*/
		map_div = d3.select(".map");
		console.log(d3.select(".map").style('width'))
		var width = d3.select(".map").style('width'),
  		  height = 600;

/*AJOUT SVG DANS LA BALISE GRAPHE*/
		var svg_2019 = d3.select( ".map" )
  		.append( "svg" )
		  .attr( "width", width )
		  .attr( "height", height )
		  .attr("class","Reds contour")
		  .attr("style","opacity:0.8");

/*AJOUT DE DEUX GROUPES (Les departements et les points)*/
		var gBackground_2019 = svg_2019.append("g");
		var gZC10_2019 = svg_2019.append("g");
		var gZC20_2019 = svg_2019.append("g");
		var gZC30_2019 = svg_2019.append("g");
		var gDataPoints_2019 = svg_2019.append("g");
		var playButton = d3.select("#play-button");


max_val = 0.15;
middle_val = max_val/2;
min_val = 0;

var myColor = d3.scaleLinear()
                .domain([min_val, middle_val, max_val])
                .range(['#d73027', '#fee08b', '#1a9850'])
                .interpolate(d3.interpolateHcl);


/*CREATION D'UNE FONTCION PROJECTION, POUR PROJETER LES CONTOURS DES DEPARTEMENTS*/
    	var projection = d3.geoConicConformal().center([7, 47]).scale(2800);

/*CREATION DES ELEMENTS CONTOURS*/
	    var path = d3.geoPath() 
	                .projection(projection);

/*FONCTION ZOOM*/
	    zoom_2019 = d3.zoom()
	      .scaleExtent([1, 20])
	      .on('zoom', zoomed);

	    svg_2019.call(zoom_2019);

	    function zoomed() {

	      var scale = d3.scaleLinear()
		    .domain([4.47, 659108.56])
		    .range([1, 10]);
	      
	      k = d3.event.transform.k;
	      k_2019 = k;

	      gBackground_2019
		        .selectAll('path') 
		        .attr('transform', d3.event.transform);

		  gZC10_2019
		        .selectAll('path') 
		        .attr('transform', d3.event.transform);

		  gZC20_2019
		        .selectAll('path') 
		        .attr('transform', d3.event.transform);

		  gZC30_2019
		        .selectAll('path') 
		        .attr('transform', d3.event.transform);

		  gDataPoints_2019
	        .selectAll('circle') // To prevent stroke width from scaling
	        .attr('transform', d3.event.transform)
	        .attr('r', 4/k_2019);
	    }


/*LECTURE DU FICHIER DEPARTEMENTS CONTENANT LES CHEMINS DES CONTOURS*/
		d3.json("departements.json", function(json) {

			/*AJOUT DES PROPRIETES POUR LES DEPARTEMENTS EXISTANTES DANS LE FICHIER*/
		    gBackground_2019.selectAll("path")
	           .data(json.features)
	           .enter()
	           .append("path")
	           .attr("cursor","pointer")
	           .attr('id', function(d) {return "d" + d.properties.code;})
	           .attr("d", path)
	           .attr("stroke","#333")
	           .attr("stroke-width","0.5");

	        /*Colorier les departements*/
			d3.csv("rea_lits.csv", function(data_jour){
				

				/*FONCTION POUR AJOUTER LE HEATMAP, utilisée plus bas*/
	         		window.avec_heatmap = function(j){

						/*Ajouter les classes des couleurs à chaque departement*/
						data_jour.forEach(function(e,i) {
								
							    d3.select("#d"+e.dep)
							        .attr("fill", myColor(max_val-e[j]));

							});

	         		}

	         	d3.csv("dates_map_viz.csv", function(dates){

	         		window.t = 0;
	         		console.log(dates[t]["dates"]);
	         		t = t+1;
	         		/*Par défaut, Activer le heatmap*/
	         		avec_heatmap(dates[0]["dates"]);

	         		/*  */	
					playButton
					    .on("click", function() {
					    var button = d3.select(this);
					    if (button.text() == "Pause") {
					      moving = false;
					      clearInterval(timer);
					      // timer = 0;
					      button.text("Play");
					    } else {
					      moving = true;
					      timer = setInterval(step, 200);
					      button.text("Pause");
					    }
					  })

					function step() {
						avec_heatmap(dates[t]["dates"]);
						d3.select("#dates").select("text").text(dates[t]["dates"]);
						t = t+1;
						if(t>dates.length-1){
							moving = false;
							clearInterval(timer);
							playButton.text("Play");
							t = 0;
						}
					}
	         	})

	         	});
			})


var w = 320, h = 50;

    var key = d3.select(".legend1")
      .append("svg")
      .attr("width", h+40)
      .attr("height", w+10);

    var legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", myColor(1*max_val))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "16%")
      .attr("stop-color", myColor(0.83*max_val))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "33%")
      .attr("stop-color", myColor(0.67*max_val))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "49%")
      .attr("stop-color", myColor(0.49*max_val))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "67%")
      .attr("stop-color", myColor(0.33*max_val))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "83%")
      .attr("stop-color", myColor(0.16*max_val))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", myColor(0))
      .attr("stop-opacity", 1);

    key.append("rect")
      .attr("width", h - 30)
      .attr("height", w - 20)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(25,10)");

    var y = d3.scaleLinear()
      .range([300, 0])
      .domain([max_val, 0]);

    var yAxis = d3.axisRight()
      .scale(y)
      .ticks(5);

    key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(45,10)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("axis title");

    d3.select(".legend1").append("div")
    	.attr("class","legend_c")
    	.text("Nbr en réanimation / Nbr Lits (%)");


