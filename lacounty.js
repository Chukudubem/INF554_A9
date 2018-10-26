function la_map(files){
	
	var maps = files[1];
	var data = files[0];
    //console.log(maps);
    var width = 800;
    var height = 1300;
    var svg = d3.select('#lacounty')
                  .append('svg')
                  .attr('height', height)
	              .attr('width', width);
    var parks = [] 

//data transformation for the parks
//d3.json("parks.json").then(function (json) {
    svg.selectAll(".countries")
        .data(data.features)
        .enter()
        .append("text")
        .text("")
        .attr("fill", function(d){
            parks.push([parseFloat(d.properties.longitude),parseFloat(d.properties.latitude)])
            return "none";
    });

	
    
	  
    
    


      // Create a unit projection.
      var projection = d3.geoMercator()
      .fitSize([width, height], maps);

      // Create a path generator                              
      var path = d3.geoPath()
                   .projection(projection);

                   var graticule = d3.geoGraticule()  
                   .step([10, 10]);

      // Compute the bounds of a feature of interest, 
      // then derive scale & translate.
    //   var bounds = path.bounds(maps);
    //   var scale = 0.95 / Math.max(
    //              (bounds[1][0] - bounds[0][0]) / width,
    //              (bounds[1][1] - bounds[0][1]) / height
    //           );
    //   var translate = [
    //     (width - scale *  (bounds[1][0] + bounds[0][0])) / 2, 
    //     (height - scale *  (bounds[1][1] + bounds[0][1])) / 2
    //   ];

      // Update the projection to use computed scale & translate.
      //console.log bounds);
      //console.log(scale, translate)
    //   projection.scale(scale)
    //             .translate(translate);

      svg.append('path')
          .datum(graticule)
          .attr("class", "graticule")
          .attr('d', path)
          
		  //.attr("stroke-width","1")
		  //.attr("stroke","black")
          //.attr("fill","#66c2a5")
          ;
	
		  //console.log("park",data)
//var parks = topojson.feature(data, data.objects.Parks_and_Gardens).features



// d3.map(parks, function(d) {
// 	// show all the properties of each feature:
// 	d3.map(d3.keys(d.properties), function(name) {
// 		console.log(name + " : " + d.properties[name]);
// 	})
// });

//console.log("parksss",parks[0].properties.name) 

 svg.selectAll(".parks")
    .data(maps.features)
	.enter()
	.append("path")
	.attr("stroke-width", "1")
	.attr("stroke","black")
	//.attr("class","parks")
    .attr("fill","#ffff1a")
    .attr("opacity", .8)
	.attr("d", path)
	.on("mouseover",function(d){
        //console.log(d.properties.name)
        d3.select(this).transition().duration(200).attr("d", path *1.2)
        .attr("fill","#c6ff1a").attr("pointer", "cursor")
	  ;


	 })
	 .on("mouseout", function(d) {
			d3.select(this).transition().duration(200).attr("d", path).attr("fill","#ffff1a")
     });

     svg.selectAll(".countries")
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
        .attr("x", 1000)
        .attr("y", 1460)
        .attr("dy", ".35em")
        .style("font-size", "30px")
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("Choropleth Map for the Number of Parks per Square Mile in Los Angeles");

     
}

Promise.all([
	//d3.json("world.topojson"),
	//d3.csv("world.csv"),
	d3.json("parks.json"),
	d3.json("la.json")
]).then(function (files) { 
  //console.log(data);
  //maps(files);
  //maps1(files);
  la_map(files);
});
