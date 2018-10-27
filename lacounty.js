function county_map(files){
	var maps = files[1];
	var data = files[0];
    var width = 800;
    var height = 1300;
    var margin = { top: 80, left: 50, bottom: 50, right: 50 };
    var svg = d3.select('#lacounty')
                .append('svg')
                .attr('height', height)
	            .attr('width', width);
    var parks = [] 

    svg.selectAll(".county")
        .data(data.features)
        .enter()
        .append("text")
        .text("")
        .attr("fill", function(d){
            parks.push([parseFloat(d.properties.longitude),parseFloat(d.properties.latitude)])
            return "none";
    }); 
    var projection = d3.geoMercator()
                       .fitSize([width, height], maps);                              
    var path = d3.geoPath()
                .projection(projection);

    var graticule = d3.geoGraticule()  
                      .step([10, 10]);

    svg.append('path')
        .datum(graticule)
        .attr("class", "graticule")
        .attr('d', path)

    svg.selectAll(".parks")
        .data(maps.features)
        .enter()
        .append("path")
        .attr("stroke-width", "1")
        .attr("stroke","black")
        .attr("fill","#ffff1a")
        .attr("opacity", .8)
        .attr("d", path)
        .on("mouseover",function(d){
            d3.select(this)
            .transition()
            .duration(200)
            .attr("fill","#c6ff1a")
            .attr("pointer", "cursor");
        })
	   .on("mouseout", function(d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("fill","#ffff1a")
     });

    svg.selectAll(".county")
        .data(maps.features)
        .enter()
        .append("text")
        .text(function (d) { return d.properties.name; })
        .attr("transform", function (d) {
            return "translate(" + path.centroid(d.geometry)[0] + "," + path.centroid(d.geometry)[1] + ")";
        })
        .style("text-anchor", "middle")
        .style("font-size", "6px")
        .on("mouseover",function(d){
            d3.select(this).style("font-size", "20px");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("font-size", "6px") 
        });

    svg.append('g')
        .attr('class', 'axis-wrap')
        .selectAll('circle')
        .data(parks)
        .enter()
        .append("circle")
        .attr('class', 'axis')
        .attr('r', 1)
        .attr("transform", function (d) {
            var marker = projection(d)
            return "translate(" + marker[0] + "," + marker[1] + ")";
        })
        .style('fill', "#53ff1a")
        .style('stroke', "#53ff1a")
        .style('stroke-width', 2)
        .style('opacity', 0.75)


    //Map Title
    svg.append("text")
        .attr("class", "label")
        .attr("x", 460)
        .attr("y", 60)
        //.attr("dy", ".35em")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        //.style("opacity", 0.5)
        .text("DOT MAP SHOWING PARKS IN LOS ANGELES COUNTY")        ;

     
}

Promise.all([
	d3.json("parks.json"),
	d3.json("la.json")
]).then(function (files) { 
  county_map(files);
});
