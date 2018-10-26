function chloropleth_map(data){
    var json = data[0]
    var dataset = data[1]
    var margin = { top: 80, left: 50, bottom: 50, right: 50 };
    var width = 1600;
    var height= 900;
    var color = d3.scaleSequential(d3.interpolateGreens)
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
       //.style("stroke-width", 1.4)
       .attr("d", path);  //generate geographic path        
        
        

    fills = svg.append("g").selectAll("path")
    fills.data(json.features)
        .enter()
        .append("path")
        .attr("fill", function(d){if (d.properties.value != 0){return color(d.properties.value/100)} else {return "none"}})
        .attr("d", path);

    labels = svg.selectAll('text')
    labels.data(json.features)
            .enter()
            .append('text')
            .attr('x', function (d) { return path.centroid(d)[0] - 7; })
            .attr('y', function (d) { return path.centroid(d)[1] + 4; })
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text(function (d) { if (d.properties.value != 0) return d.id; });
    var labels = ['0 - 25', '26 - 50', '51 - 65', '66 - 80', '> 81'];

    var g = svg.append("g")
                .attr("class", "legendThreshold")
                .attr("transform", "translate(20,20)");
        g.append("text")
            .attr("class", "caption")
            .attr("x", 0)
            .attr("y", -6)
            .text("Percentage Population (%)");

    var legend = d3.legendColor()
                    .labels(function (d) {console.log(d); return labels[d.i]; })
                    .shapePadding(4)
                    .scale(color);

    svg.select(".legendThreshold")
       .call(legend);




}




var files = ["world-110m.geojson", "undata.json"];
        
        Promise.all(files.map(url => d3.json(url))).then(function(data) {
           //proportional_symbol(data)
            chloropleth_map(data)
    
        });