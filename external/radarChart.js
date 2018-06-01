/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

//track mouse position
var mouseX;
var mouseY;
$( document ).on( "mousemove", function( event ) {
	mouseX = event.pageX;
	mouseY = event.pageY;
});
	
function RadarChart(id, data, options) {
	var cfg = {
	 w: 600,				//Width of the grid
	 h: 600,				//Height of the grid
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner grids should there be drawn
	 maxValue: 1,			//What is the value that the biggest level will represent
	 labelFactor: 1.25,		//How much farther than the outer grid level should the labels be placed
	 wrapWidth: 60,			//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35,		//The opacity of the area of the blob
	 dotRadius: 4,			//The size of the colored circles of each blog
	 opacityLevel: 0.1,		//The opacity of each level of the grid
	 strokeWidth: 2,		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 roundGrid: false,		//If true the grid will be circular
	 chartHorizontalLocation: 0.5,		//Horizontal location of the grit with respect to the width of the grid
	 chartVerticalLocation: 0.5,		//Vertical location of the grit with respect to the height of the grid
	 legendHorizontalLocation: 0.75,	//Horizontal location of the legend with respect to the width of the grid
	 legendVerticalLocation: -0.1,		//Vertical location of the legend with respect to the height of the grid
	 titleHorizontalLocation: -0.1,		//Horizontal location of the title with respect to the width of the grid
	 titleVerticalLocation: -0.1,		//Vertical location of the title with respect to the height of the grid
	 color: d3.scale.category10(),		//Color function
	 inputColor: "#FF8C00",
	 labelSize: 11,
	 legendSize: 12,
	 titleSize: 14
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if

	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data.classes, function(i){return d3.max(i.features.map(function(o){return o.value;}))}));
		
	var allAxis = (data.classes[0].features.map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format('%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select("#" + id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select("#" + id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+"#"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.chartHorizontalLocation * cfg.w + cfg.margin.left) + "," + (cfg.chartVerticalLocation * cfg.h + cfg.margin.top) + ")");
	
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
	
	if (cfg.roundGrid) {
	
		//Draw the background circles
		axisGrid.selectAll(".levels")
		   .data(d3.range(1,(cfg.levels+1)).reverse())
		   .enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("r", function(d, i){return radius/cfg.levels*d;})
			.style("fill", "#CDCDCD")
			.style("stroke", "#CDCDCD")
			.style("fill-opacity", cfg.opacityLevel)
			.style("filter" , "url(#glow)");
	
	} else {

		var points = [];
		for(var j=0; j<cfg.levels; j++){
			var levelFactor = (j+1)/cfg.levels;
		
			points[j] = "";
			for(var i=0; i<total; i++){
				points[j] += rScale(maxValue * levelFactor) * Math.sin(angleSlice*i) + "," 
						   + rScale(maxValue * levelFactor) * Math.cos(angleSlice*i) + " ";
			}
		}
	
		//Draw the background circles
		axisGrid.selectAll(".levels")
			.data(d3.range(0, cfg.levels).reverse())
			.enter()
			.append("svg:polygon")
			.attr("class", "line")
			.attr("points", function(d, i){return points[d];})
			.style("fill", "#CDCDCD")
			.style("fill-opacity", cfg.opacityLevel)
			.style("stroke", "#CDCDCD")
			.style("filter" , "url(#glow)")
		
	}

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
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });*/

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
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", cfg.labelSize + "px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
	var radarLine = d3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data.classes)
		.enter().append("g")
		.attr("class", "radarWrapper")
		.attr("id", function(d,i) { return d.name; });
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d.features); })
		.style("fill", function(d,i) { if (i == data.classes.length - 1) { return cfg.inputColor; } return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		/*.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarWrapper")
				.transition().duration(200)
				.style("opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select("#" + d.name)
				.transition().duration(200)
				.style("opacity", 1);	
			})
		.on('mouseout', function(){
				//Bring back all blobs
				d3.selectAll(".radarWrapper")
					.transition().duration(200)
					.style("opacity", 1);
		});*/
		

	/*.on('mouseover', function (d, i){
		var coords = d3.mouse(this);
		console.log(coords[0]);
		
		newX =  coords[0] - 10;
		newY =  coords[1] - 10;

		tooltip2
			.text(Format(d.value))
			.transition().duration(200)
			.style('opacity', 1);
	})
	.on('mousemove', function (d, i){
		var coords = d3.mouse(this);
		console.log(coords[0]);
		
		newX =  coords[0] - 10;
		newY =  coords[1] - 10;

		tooltip2
			.attr('x', newX)
			.attr('y', newY);
	})
	.on('mouseout', function(){
		tooltip2.transition().duration(200)
				.style("opacity", 0);
	})*/
	
	//Set up the small tooltip for when you hover over a blob
	var tooltip2 = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d.features); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { if (i == data.classes.length - 1) { return cfg.inputColor; } return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d.features; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { if (j == data.classes.length - 1) { return cfg.inputColor; } return cfg.color(j); })
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data.classes)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d.features; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
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
		});
		
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
		
		
	////////////////////////////////////////////
	/////////// Initiate title ////////////////
	////////////////////////////////////////////

	var titleG = svg.append('g')
		.attr("transform", "translate(" + (cfg.titleHorizontalLocation * cfg.w + cfg.margin.left) + "," + (cfg.titleVerticalLocation * cfg.h + cfg.margin.top) + ")");

	//Create the title for the legend
	var text = titleG.append("text")
		.attr("class", "title")
		.style("font-size", cfg.titleSize + "px")
		.style("fill", "#404040")
		.style("font-weight", "bold")
		.text(data.name);
		
	////////////////////////////////////////////
	/////////// Initiate legend ////////////////
	////////////////////////////////////////////

	var legendG = svg.append('g')
		.attr("transform", "translate(" + (cfg.legendHorizontalLocation * cfg.w + cfg.margin.left) + "," + (cfg.legendVerticalLocation * cfg.h + cfg.margin.top) + ")");

	//Create the title for the legend
	var text = legendG.append("text")
		.attr("class", "title")
		.style("font-size", cfg.legendSize + "px")
		.style("fill", "#404040")
		.text("Legend");
		
	//Initiate Legend	
	var legend = legendG.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 200)
		.attr('transform', 'translate(0,10)') 
		;
	var individualLeg =	legend.selectAll("g")
		  .data(data.classes)
		  .enter()
		  .append("g")
		  .attr("class", "individualLeg")
		  .attr("height", 100)
		  .attr("width", 200)
		  .on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll("#" + id + " .radarWrapper")
				.transition().duration(200)
				.style("opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select("#" + id + " [id='" + d.name + "']")
				.transition().duration(200)
				.style("opacity", 1);	
			d3.select("#" + id + " [id='" + data.classes[data.classes.length - 1].name + "']")
				.transition().duration(200)
				.style("opacity", 1);	
			})
		  .on('mouseout', function(){
				//Bring back all blobs
				d3.selectAll("#" + id + " .radarWrapper")
					.transition().duration(200)
					.style("opacity", 1);
		  });
		//Create colour squares
		individualLeg
		  .append("rect")
		  .attr("x", 5)
		  .attr("y", function(d, i){ return i * 20;})
		  .attr("width", 10)
		  .attr("height", 10)
		  .style("fill", function(d, i){ if (i == data.classes.length - 1) { return cfg.inputColor; } return cfg.color(i);});
		//Create text next to squares
		individualLeg
		  .append("text")
		  .attr("x", 20)
		  .attr("y", function(d, i){ return i * 20 + 9;})
		  .style("font-size", cfg.labelSize + "px")
		  .style("fill", "#737373")
		  .text(function(d) { return d.name; })
		  ;
	
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
	
}//RadarChart
