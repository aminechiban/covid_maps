var svg_map_1 = d3.select( ".map" )
  		.append( "svg" )
		  .attr( "width", 750 )
		  .attr( "height", 540 )
		  .attr("class","Reds contour")
		  .attr("style","opacity:0.8");

var gBackground_1 = svg_map_1.append("g");

svg_map_1.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("dy", ".35em")
    .attr("font-size",30)
    .text("18-03-2020");

var myColor,max_val,min_val = 0;

d3.csv("../min_max_values.csv", function(max_min){
			max_val = +max_min[3]["max"];
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