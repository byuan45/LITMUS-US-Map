var width = 400;
var height= 400;

d3.json("CTPStates.txt", function(data) {
    for (var i=0; i<data.length; ++i) {
        d = data[i].date.toString()
		data[i].date = new Date(parseInt(d.substring(0,4)), parseInt(d.substring(4,6))-1, day=parseInt(d.substring(6)));
		data[i].death = Number(data[i].death);
		data[i].hospitalizedCumulative = Number(data[i].hospitalizedCumulative);
		data[i].positive = Number(data[i].positive);
        data[i].totalTestResults = Number(data[i].totalTestResults);
    }
    //var dateExtent = d3.extent(data, function(row) { return row.date; });
    var maxDate = data[0].date, minDate = data[data.length-1].date;
    var deathExtent = d3.extent(data, function(row) { return row.death; });
    var hospExtent = d3.extent(data,  function(row) { return row.hospitalizedCumulative;  });
    var positiveExtent = d3.extent(data,  function(row) { return row.positive;  });
    var testExtent = d3.extent(data,  function(row) { return row.totalTestResults;  });


    // Axis setup
    var xScale = d3.scaleTime().domain([minDate, maxDate]).range([70, width-30]);
    var yScale = d3.scaleLinear().domain(deathExtent).range([height-60, 30]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xScale2 = d3.scaleTime().domain([minDate, maxDate]).range([70, width-30]);
    var yScale2 = d3.scaleLinear().domain(positiveExtent).range([height-60, 30]);

    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);

    var xScale3 = d3.scaleTime().domain([minDate, maxDate]).range([70, width-30]);
    var yScale3 = d3.scaleLinear().domain(testExtent).range([height-60, 30]);

    var xAxis3 = d3.axisBottom().scale(xScale3);
    var yAxis3 = d3.axisLeft().scale(yScale3);

    var states = ['All States', 'AK', 'AL', 'AR', 'AZ', 'CO', 'CT', 'FL', 'GA', 'HI', 'IA', 'ID', 'IN', 'KS', 'KY', 'MA', 'MD', 'ME', 'MN', 'MP', 'MS', 'MT', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
    var colors = d3.scaleSequential()
                    .domain([0,41])
                    .interpolator(d3.interpolateViridis);

    //Create SVGs and <g> elements as containers for charts
    var chart1G = d3.select("#chart1")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');

    var chart2G = d3.select("#chart2")
                    .append("svg:svg")
                    .attr("width",width)
                    .attr("height",height)
                    .append('g');

    var chart3G = d3.select("#chart3")
                    .append("svg:svg")
                    .attr("width",width)
                    .attr("height",height)
                    .append('g');

    var select = d3.select("#selectButton")
                    .selectAll('myOptions')
                        .data(states)
                    .enter()
                        .append('option')
                    .text(function (d) { return d; })
                    .attr("value", function (d) { return d; })

	 //add scatterplot points
     var temp1= chart1G.selectAll("circle")
	   .data(data)
	   .enter()
	   .append("circle")
	   .attr("id",function(d,i) {return i;} )
       .attr("class", "table1")
	   .attr("fill", function(d) { return colors(states.indexOf(d.state)); })
	   .attr("cx", function(d) { return xScale(d.date); })
	   .attr("cy", function(d) { return yScale(d.death); })
	   .attr("r", 1);

    var temp2= chart2G.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .attr("class", "table1")
       .attr("fill", function(d) { return colors(states.indexOf(d.state)); })
       .attr("cx", function(d) { return xScale2(d.date); })
       .attr("cy", function(d) { return yScale2(d.positive); })
       .attr("r", 1);

    var temp3= chart3G.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .attr("class", "table1")
       .attr("fill", function(d) { return colors(states.indexOf(d.state)); })
       .attr("cx", function(d) { return xScale3(d.date); })
       .attr("cy", function(d) { return yScale3(d.totalTestResults); })
       .attr("r", 1);


    chart1G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -60)+ ")")
		.call(xAxis) // call the axis generator
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    chart1G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(70, 0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Total Deaths");

    chart2G // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(0,"+ (width -60)+ ")")
        .call(xAxis2)
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    chart2G // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(70, 0)")
        .call(yAxis2)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Cases");

    chart3G // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(0,"+ (width -60)+ ")")
        .call(xAxis3)
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    chart3G // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(70, 0)")
        .call(yAxis3)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Tests");

    d3.select("#selectButton").on("change", function(d) {
        var selected = d3.select(this).property("value")
        chart1G.selectAll("circle")
                .classed('hidden', function(d) { return selected != states[0] && selected != d.state })
        chart2G.selectAll("circle")
                .classed('hidden', function(d) { return selected != states[0] && selected != d.state })
        chart3G.selectAll("circle")
                .classed('hidden', function(d) { return selected != states[0] && selected != d.state })
    })

	});


d3.json("CTPNational.txt", function(data) {
    for (var i=0; i<data.length; ++i) {
        d = data[i].date.toString()
        data[i].date = new Date(parseInt(d.substring(0,4)), parseInt(d.substring(4,6))-1, day=parseInt(d.substring(6)));
        data[i].death = Number(data[i].death);
        data[i].hospitalizedCumulative = Number(data[i].hospitalizedCumulative);
        data[i].positive = Number(data[i].positive);
        data[i].totalTestResults = Number(data[i].totalTestResults);
    }
    //var dateExtent = d3.extent(data, function(row) { return row.date; });
    var maxDate = data[0].date, minDate = data[data.length-1].date;
    var deathExtent = d3.extent(data, function(row) { return row.death; });
    var hospExtent = d3.extent(data,  function(row) { return row.hospitalizedCumulative;  });
    var positiveExtent = d3.extent(data,  function(row) { return row.positive;  });
    var testExtent = d3.extent(data,  function(row) { return row.totalTestResults;  });


    // Axis setup
    var xScale = d3.scaleTime().domain([minDate, maxDate]).range([70, width-30]);
    var yScale = d3.scaleLinear().domain(positiveExtent).range([height-60, 30]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xScale2 = d3.scaleLinear().domain(testExtent).range([70, width-30]);
    var yScale2 = d3.scaleLinear().domain(positiveExtent).range([height-60, 30]);

    var xAxis2 = d3.axisBottom().scale(xScale2).tickFormat(d3.format(".2s"));
    var yAxis2 = d3.axisLeft().scale(yScale2);

    var xScale3 = d3.scaleLinear().domain(hospExtent).range([70, width-30]);
    var yScale3 = d3.scaleLinear().domain(positiveExtent).range([height-60, 30]);

    var xAxis3 = d3.axisBottom().scale(xScale3).tickFormat(d3.format(".2s"));
    var yAxis3 = d3.axisLeft().scale(yScale3);


    //Create SVGs and <g> elements as containers for charts
    var chart1G = d3.select("#chart4")
                    .append("svg:svg")
                    .attr("width",width)
                    .attr("height",height)
                    .append('g');

    var chart2G = d3.select("#chart5")
                    .append("svg:svg")
                    .attr("width",width)
                    .attr("height",height)
                    .append('g');

    var chart3G = d3.select("#chart6")
                    .append("svg:svg")
                    .attr("width",width)
                    .attr("height",height)
                    .append('g');


     //add scatterplot points
     var temp1= chart1G.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .attr("class", "table1")
       .attr("fill", "red")
       .attr("cx", function(d) { return xScale(d.date); })
       .attr("cy", function(d) { return yScale(d.positive); })
       .attr("r", 1);

    var temp2= chart2G.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .attr("class", "table1")
       .attr("fill", "red")
       .attr("cx", function(d) { return xScale2(d.totalTestResults); })
       .attr("cy", function(d) { return yScale2(d.positive); })
       .attr("r", 1);

    var temp3= chart3G.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("id",function(d,i) {return i;} )
       .attr("class", "table1")
       .attr("fill", "red")
       .attr("cx", function(d) { return xScale3(d.hospitalizedCumulative); })
       .attr("cy", function(d) { return yScale3(d.positive); })
       .attr("r", 1);


    chart1G // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(0,"+ (width -60)+ ")")
        .call(xAxis) // call the axis generator
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    chart1G // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(70, 0)")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Cases");

    chart2G // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(0,"+ (width -60)+ ")")
        .call(xAxis2)
        .append("text")
        .attr("class", "label")
        .attr("x", width-16)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Tests");

    chart2G // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(70, 0)")
        .call(yAxis2)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Cases");

    chart2G
       .append("line")
       .attr("x1",xScale2(data[0].totalTestResults))
       .attr("y1",yScale2(data[0].totalTestResults * 0.07928965))
       .attr("x2",xScale2(data[data.length-1].totalTestResults))
       .attr("y2",yScale2(data[data.length-1].totalTestResults * 0.07928965))
       .style("stroke", "black");

    chart3G // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(0,"+ (width -60)+ ")")
        .call(xAxis3)
        .append("text")
        .attr("class", "label")
        .attr("x", width-16)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Hospitalizations");

    chart3G // or something else that selects the SVG element in your visualizations
        .append("g") // create a group node
        .attr("transform", "translate(70, 0)")
        .call(yAxis3)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Cases");

    chart3G
       .append("line")
       .attr("x1",xScale3(data[0].hospitalizedCumulative))
       .attr("y1",yScale3(data[0].hospitalizedCumulative * 34.39892551))
       .attr("x2",xScale3(data[data.length-1].hospitalizedCumulative))
       .attr("y2",yScale3(data[data.length-1].hospitalizedCumulative * 34.39892551))
       .style("stroke", "black");

    });
