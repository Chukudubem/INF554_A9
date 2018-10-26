function proportional_symbol(data) {
    var json = data[0]
    var dataset = data[1]
    var margin = { top: 80, left: 50, bottom: 50, right: 50 };
    var width = 1600;
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
              .attr('x', function (d) { return path.centroid(d)[0] - 7; })
              .attr('y', function (d) { return path.centroid(d)[1]; })
              .style("font-size", "10px")
              .style("font-weight", "bold")
              .text(function (d) { if (d.properties.value != 0) return d.id; });

        bubbles = svg.append("g")
                      .attr("class", "bubble")
                      .selectAll("circle")
        bubbles.data(json.features.sort(function(a, b) { return b.properties.value - a.properties.value; }))
                .enter()
                .append("circle")
                .attr("transform", function(d) {return "translate(" + path.centroid(d) + ")"; })
                .attr("r", function(d) { return radius(d.properties.value); })
                .style("opacity", .7)
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
            .attr('x',450)
            .attr('y',-50)
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .text('Proportional Symbol Map Showing Percentage Population of Internet Users in 2014');
            
    }

    var files = ["world-110m.geojson", "undata.json"];
        
        Promise.all(files.map(url => d3.json(url))).then(function(data) {
            proportional_symbol(data)
            //chloropleth_map(data)
    
        });