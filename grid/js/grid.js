var min_row = 338;
var max_row = 360; // valore reale di max row = 432,  considero una bounding box piu piccola
var min_col = 121;
var max_col = 157; // valore reale 322
var nrows = max_row - min_row; 
var ncols =  max_col - min_col; 

var data = new Array();
var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
var ypos = 1;
var width = 10;
var height = 10;
    
for (var i = 0; i <= nrows; i++)
{
	data.push(new Array());
	for (var j = 0; j <= ncols; j++)
	{
		
		data[i].push(
		{
            x: xpos,
            y: ypos,
            width: width,
            height: height,
            color: 0
        });
        // increment the x position. I.e. move it over by 50 (width variable)
        xpos += width;
    }
    
	// reset the x position after a row is complete
    xpos = 1;
    // increment the y position for the next row. Move it down 50 (height variable)
    ypos += height; 
}
	
d3.csv('data/grid2.csv', function(csvdata){
	for (var i = 0; i < csvdata.length; i++)	
	{
		row = parseInt(csvdata[i].row);
		col = parseInt(csvdata[i].col);
		if(row < max_row && col < max_col)
		{
			row = row - min_row;
			col = col - min_col;
			total = parseInt(csvdata[i].total);
			data[row][col].color = total;
		}
	}
	
//https://github.com/johan/world.geo.json
d3.json("data/malta.geo.json", function(error, mapdata) {

	w = 580;
	h = 500;
	
	var color = d3.scale.linear().domain([1,csvdata.length])
  		.range(["white", "blue"])

	var grid = d3.select("#grid")
    	.append("svg")
    	.attr("width",w)
    	.attr("height",h);
    
	var row = grid.selectAll(".row")
    	.data(data)
    	.enter().append("g")
    	.attr("class", "row");
    
    //"#6495ED"
	var column = row.selectAll(".square")
    	.data(function(d) { return d; })
    	.enter().append("rect")
    	.attr("class","square")
    	.attr("x", function(d) { return d.x; })
    	.attr("y", function(d) { return d.y; })
    	.attr("width", function(d) { return d.width; })
    	.attr("height", function(d) { return d.height; })
    	.style("fill", function(d) { if(d.color > 0) return color(d.color); return "#fff"; })
    	.style("stroke", function(d) { if(d.color > 0) return "#222"; return "none"; })
 		.style("stroke-width", "1");
    
	// set-up unit projection and path
	var projection = d3.geo.mercator()
    	.scale(1)
    	.translate([0, 0]);
	var path = d3.geo.path()
    	.projection(projection);
	// set-up svg canvas
	var world = mapdata.features;

	// calculate bounds, scale and transform 
	// see http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
	var w1 = 75*10, h1 = 75*10;
	var b = path.bounds(mapdata),
	s = .1 / Math.max((b[1][0] - b[0][0]) / w1, (b[1][1] - b[0][1]) / h1),
        	
	t = [(w1 - s * (b[1][0] + b[0][0]))/2, (h1 - s * (b[1][1] + b[0][1]))/2];
        	
	projection.scale(s)
    	.translate(t);
	grid.selectAll("path")
    	.data(world).enter()
    	.append("path")
    	.style("fill", "#FFEBCD")
    	.style("stroke", "grey")
    	.style("stroke-width", "1")
    	.attr("d", path);
	
	
	grid.append("rect")
    	.attr("class","box")
    	.attr("x", 0)
    	.attr("y", 0)
    	.attr("width", (ncols+1)*10)
    	.attr("height", nrows*10)
    	.style("fill", "none")
    	.style("stroke", "#222")
    	.style("stroke-width", "1");
    	
    //Append a defs (for definition) element to your SVG
	var legend = d3.select("#legend")
    	.append("svg").attr("width",w)
    	.attr("height",100).attr("transform", "translate(50)").append("g");

	//Append a linearGradient element to the defs and give it a unique id
	var linearGradient = legend.append("linearGradient")
    	.attr("id", "linear-gradient");
    
    //Horizontal gradient
	linearGradient
    	.attr("x1", "0%")
    	.attr("y1", "0%")
    	.attr("x2", "100%")
    	.attr("y2", "0%");
	    
	//Set the color for the start (0%)
	linearGradient.append("stop")
    	.attr("offset", "0%")
    	.attr("stop-color", "white"); //light blue

	//Set the color for the end (100%)
	linearGradient.append("stop")
    	.attr("offset", "100%")
    	.attr("stop-color", "blue"); //dark blue
    
	//Draw the rectangle and fill with gradient
	
	
	legend.append("rect")
    	.attr("width", w/2)
    	.attr("height", 20)
    	.style("fill", "url(#linear-gradient)");
    
    legend.append("text").text("0").attr("color", "black").attr("y", 40).attr("x", 0);
	legend.append("text").text("21043").attr("color", "black").attr("y", 40).attr("x", w/2 - 10);
 	});
});