function california_map(data) {
    var width = 500;
    var height= 500;
    var margin = { top: 80, left: 50, bottom: 50, right: 50 };
    var svg = d3.select("#california")
                .attr("width", width)
                .attr("height", height)
                .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    
    var projection = d3.geoMercator()
                       .fitSize([width, height], data.features[6]);  // to fit California
    var path = d3.geoPath().projection(projection);

    var graticule = d3.geoGraticule()  // graticule generator
                        .step([10, 10]);

    svg.append("path")
        .datum(graticule)  //data join with a single path
        .attr("class", "graticule")
        .attr("d", path);

    svg.selectAll(".states")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill", function (d) { return (d.id == "06" ? "#FFCC00" : "white"); })
        .attr("stroke", "black")
        .attr("d", path);

    // var marker = projection([-118.2851, 34.0224]);  //USC lon, lat
    // svg.append("circle")
    //     .attr("cx", marker[0])
    //     .attr("cy", marker[1])
    //     .attr("r", 5);
             }
        d3.json("us.json").then(function (data) {
            california_map(data)
            
        });