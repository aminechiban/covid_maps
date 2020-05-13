/*MOUSE OVER TOOLTIP*/
var div_tooltip = d3.select("body").append("div")	
		    .attr("class", "tooltip")				
		    .style("opacity", 0);

/*DEP NAMES*/
var dep_names;
d3.csv("../dep_name.csv", function(names){
	dep_names = names;
})

var svg_map_1 = d3.select( ".map" )
  		.append( "svg" )
		  .attr( "width", 630 )
		  .attr( "height", 540 )
		  .attr("class","Reds contour")
		  .attr("style","opacity:0.8");

d3.select(".map")
  		.append("button")
  		.attr("id","play-button")
  		.attr("class","button-play")
  		.text("Play")

var playButton = d3.select("#play-button");

var gBackground_1 = svg_map_1.append("g");

svg_map_1.append("text")
    .attr("id","dates")
    .attr("x", 0)
    .attr("y", 40)
    .attr("font-size",30)
    .text("18-03-2020");

var myColor,max_val,min_val = 0;

d3.csv("../min_max_values.csv", function(max_min){
			max_val = +max_min[2]["max"];
			middle_val = +max_val/2;
			myColor = d3.scaleLinear()
	                .domain([min_val, middle_val, max_val])
	                .range(['#d73027', '#fee08b', '#1a9850'])
	                .interpolate(d3.interpolateHcl);

	        var w = 300, h = 20;

		    var legend = svg_map_1.append("defs")
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

		    svg_map_1.append("rect")
		      .attr("width", h )
		      .attr("height", w )
		      .style("fill", "url(#gradient)")
		      .attr("transform", "translate(0,120)");

		    var y = d3.scaleLinear()
		      .range([300, 0])
		      .domain([max_val, 0]);

		    var yAxis = d3.axisRight()
		      .scale(y)
		      .ticks(5);

		    svg_map_1.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(20,120)")
		      .call(yAxis)
		      .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 0)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("axis title");

				})

/*CREATION D'UNE FONTCION PROJECTION, POUR PROJETER LES CONTOURS DES DEPARTEMENTS*/
var projection = d3.geoConicConformal().center([7, 47]).scale(2800);

/*CREATION DES ELEMENTS CONTOURS*/
var path = d3.geoPath() 
            .projection(projection);

/*LECTURE DU FICHIER DEPARTEMENTS CONTENANT LES CHEMINS DES CONTOURS*/
		d3.json("../departements.json", function(json) {

			/*AJOUT DES PROPRIETES POUR LES DEPARTEMENTS EXISTANTES DANS LE FICHIER*/
		    gBackground_1.selectAll("path")
	           .data(json.features)
	           .enter()
	           .append("path")
	           .attr("cursor","pointer")
	           .attr('id', function(d) {return "d" + d.properties.code;})
	           .attr("d", path)
	           .attr("stroke","#FFF")
	           .attr("stroke-width","0.5");


	        /*Colorier les departements*/
			d3.csv("../hosp_lits_10.csv", function(data_jour){
				

				/*FONCTION POUR AJOUTER LE HEATMAP, utilisée plus bas*/
	         		window.avec_heatmap = function(j){

						/*Ajouter les classes des couleurs à chaque departement*/
						data_jour.forEach(function(e,i) {
								
							    d3.select("#d"+e.dep)
							        .attr("fill", myColor(max_val-e[j]));

							    gBackground_1.selectAll("path")
									.on("mouseover", function(d) {		
							            div_tooltip.transition()		
							                .duration(200)		
							                .style("opacity", .9);		
							            div_tooltip.html(dep_names.filter(function(e) {return e.dep ==  d.properties.code})[0]["dep_name"])	
							                .style("left", (d3.event.pageX) + "px")		
							                .style("top", (d3.event.pageY - 28) + "px");	
							            })					
							        .on("mouseout", function(d) {		
							            div_tooltip.transition()		
							                .duration(500)		
							                .style("opacity", 0);	
							        });

							});

	         		}

	         	d3.csv("../dates.csv", function(dates){
	         		
	         		window.t = 0;
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
						d3.select("#dates").text(dates[t]["dates"]);
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

		});





