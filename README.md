# INF554 Assignment 9
## Visualization Using Maps


## Table of Content
  - Provenance
  - Introduction
  - Proportional Symbol Map
  - Chloropleth Map
  - Dot Map
  
## Provenance
I have used a number of data in this assignment:
  - The Proportional Symbol Map required the use of a geojson data for world map and the data from assignment 1 showing the percentage of internet users in ten(10) countries in 2014. The map data was gotten from [here] (https://github.com/d3/d3.github.com/blob/master/world-50m.v1.json) while the internet user data was gotten from [here](http://data.un.org/Data.aspx?q=internet+use&d=ITU&f=ind1Code%3aI99H).
  
  - The Chloropleth map makes use of similar data as the proportional symbol map.
  - The Dot Map made use of two maps as well. The Los Angeles County map was gotten from [here] (http://boundaries.latimes.com/set/la-county-neighborhoods-v6/) and the parks data was gotten from [here] (https://data.lacounty.gov/Recreation/Parks-Survey-2015/i4ww-mbp3)
  
## Introduction
There are a number of ways to show information using graphical tools and a map is one. This assignment aims to get us accustomed to some types of map visualization. Precisely, proportional symbol maps that maps a value to the size of a symbol(in our case, a cirlce) on a map, chloropleth maps that do a similar thing as the symbol map but instead of a symbol use color intensity to represent continuous values like the percentage value in our assignment, finally, the dot map is used to map an occurence on a map. In our case, it is a one-to-one mapping of parks around the Los Angeles county. The files in this assignment have been loaded in parallel using the function below:

    var files = ["world-110m.geojson", "undata.json"];
        
        Promise.all(files.map(url => d3.json(url))).then(function(data) {
            chloropleth_map(data)
    

## Proportional Symbol Map

I have had to write a function that checks for matching country names in both files and only then does it return a label for the country and a coordinate to map the cx,cy of my  symbol. For proportionality of the circle, the diameter is matched and returned only where the value parameter in my data join returns any value other than 0. The code is as below:

      function proportional_symbol(data) {
    var json = data[0]
    var dataset = data[1]
    var margin = { top: 80, left: 50, bottom: 50, right: 50 };
    var width = 1200;
    var height= 900;
    var radius = d3.scaleLinear()
                   .domain([0, 100])
                   .range([0, 50]);

        json.features.forEach(function(d) {
            var result = dataset.filter(function(datum) {
            return d.properties.name === datum.id;
        });
           //console.log(result[0])
        d.properties.value = (result[0] !== undefined) ? result[0].value : 0;
        });
        
        var svg = d3.select("#symbolmap")
                    .attr("width", width)
                    .attr("height", height)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

        var projection = d3.geoMercator()
                           .fitSize([width, height], json);
        var path = d3.geoPath()
                     .projection(projection);

        svg.selectAll("path")
           .data(json.features)  //data join with features
           .enter()
           .append("path")
           .attr("fill", "white")
           .attr("stroke", "black")
           .attr("d", path);  //generate geographic path        

        labels = svg.selectAll('text')
        labels.data(json.features)
              .enter()
              .append('text')
              .attr("transform", function (d) {
                //fixing exceptions for centroid
                if (d.id == "USA") {
                    return "translate(331,320)"
                }
                else if (d.id == "FRA") {
                    return "translate(587,303)"
                }
                return "translate(" + (path.centroid(d)[0] - 7) + "," + (path.centroid(d)[1]+4) + ")";
            })
              .style("font-size", "10px")
              .style("font-weight", "bold")
              .text(function (d) { if (d.properties.value != 0) return d.id; });

        bubbles = svg.append("g")
                      .attr("class", "bubble")
                      .selectAll("circle")
        bubbles.data(json.features.sort(function(a, b) { return b.properties.value - a.properties.value; }))
                .enter()
                .append("circle")
                .attr("transform", function(d) {
                    if (d.id == "USA") {
                        return "translate(331,320)"
                    }
                    else if (d.id == "FRA") {
                        return "translate(587,303)"
                    }
                    return "translate(" + path.centroid(d) + ")"; })
                .attr("r", function(d) { return radius(d.properties.value); })
                .style("opacity", .5)
        //Draw Legend
        legend = svg.append("g")
                    .attr("class", "legend")
                    .selectAll("circle")

        legend.data([25,50,75,100])
              .enter()
              .append("circle")
              .attr("transform", "translate(" + (200) + "," + (600) + ")")
              .attr("r", function(d) {return d*.5})
              .style("opacity", .4)
        //Append Legend Text
        svg.append('text')
            .attr('x',193)
            .attr('y',605)
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text('25%');
        svg.append('text')
            .attr('x',193)
            .attr('y',585)
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text('50%');
        svg.append('text')
            .attr('x',193)
            .attr('y',572)
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text('75%');
        svg.append('text')
            .attr('x',193)
            .attr('y',560)
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .text('100%');
        //Append Map Title
        svg.append('text')
            .attr('class', 'label')
            .attr('x',100)
            .attr('y',-50)
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .text('Proportional Symbol Map Showing Percentage Population of Internet Users in 2014');
            
    }

## Chloropleth Map
Similar to symbol map, but with percentage value mapped to a sequential color scale. This returns color coding for each part of the map.
Legends are used to understand the threshold between each color variance. The code is as below:

    function chloropleth_map(data){
    var json = data[0]
    var dataset = data[1]
    var margin = { top: 80, left: 80, bottom: 80, right: 80 };
    var width = 1200;
    var height= 900;
    var legend_labels = ['none', '1% - 15%', '16% - 30%', '31% - 45%', '46% - 60%', '61% - 75%', '76% - 90%', '> 90%'];
    var legend_band = [0, 10, 16, 31, 46, 61, 76, 91];
    var ls_w = 20, ls_h = 20;
    var color = d3.scaleSequential(d3.interpolateGreens);
    var steps = 5
 
    json.features.forEach(function(d) {
        var result = dataset.filter(function(datum) {
        return d.properties.name === datum.id;
    });
       //console.log(result[0])
    d.properties.value = (result[0] !== undefined) ? result[0].value : 0;
    });

    var svg = d3.select("#chloropleth")
                .attr("width", width)
                .attr("height", height)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var projection = d3.geoMercator()
                       .fitSize([width, height], json);
    var path = d3.geoPath()
                 .projection(projection);

    svg.selectAll("path")
       .data(json.features)  //data join with features
       .enter()
       .append("path")
       .attr("fill", "white")
       .attr("stroke", "black")
       .attr("d", path);  //generate geographic path        
        
        

    chloro = svg.append("g").selectAll("path")
    chloro.data(json.features)
        .enter()
        .append("path")
        .attr("fill", function(d){if (d.properties.value != 0){return color(d.properties.value/100)} else {return "none"}})
        .attr("d", path);

    labels = svg.selectAll('text')
    labels.data(json.features)
          .enter()
          .append('text')
          .attr("transform", function (d) {
                if (d.id == "USA") {
                    return "translate(331,320)"
                }
                else if (d.id == "FRA") {
                    return "translate(587,303)"
                }
                return "translate(" + (path.centroid(d)[0] - 7) + "," + (path.centroid(d)[1]+4) + ")";
            })
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text(function (d) { if (d.properties.value != 0) return d.id; });

    var g = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(50,30)");
            g.append("text")
             .attr("class", "caption")
             .attr('x',100)
             .attr('y',-50)
             .style("font-size", "24px")
             .style("font-weight", "bold")
             .text('Chloropleth Map Showing Percentage Population of Internet Users in 2014');

    //Adding legend for our Choropleth

     var legend = svg.selectAll(".legend")
                  .data(legend_band)
                  .enter().append("g")
                  .attr("class", "legend");

        legend.append("rect")
                .attr("x", 20)
                .attr("y", function(d, i){ return height - (i*ls_h) - 11*ls_h;})
                .attr("width", ls_w)
                .attr("height", ls_h)
                .style("fill", function(d, i) { return color(d/100); });

        legend.append("text")
                .attr("x", 50)
                .attr("y", function(d, i){ return height - (i*ls_h) - 10*ls_h - 4;})
                .text(function(d, i){ return legend_labels[i]; });
    }

## Dot Map
Here, we map the location of parks in Los Angeles county to the active parks in the area. We use an equally sized circle to mark the locations as opposed to some variable diameter as is in the case of a proportional symbol map. This is because in the dot map, we are only concerned with occurence and not so much with any other property. The code for this below:

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

    
    
Notes:
Changed "United States" to "USA" and "United Kingdom" to "England" in undata.json in order to match json to geojson property.
http://www-scf.usc.edu/~nwoji/A9/a9.html
