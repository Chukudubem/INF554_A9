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


var files = ["world-110m.geojson", "undata.json"];
        
        Promise.all(files.map(url => d3.json(url))).then(function(data) {
            chloropleth_map(data)
    
        });