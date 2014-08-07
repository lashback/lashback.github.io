function arrests() {

var dismissals = [{"Year":2004,"NassauDismissals":336,"NassauRemainder":335,"SuffolkDismissals":921,"SuffolkRemainder":772,"Remainder":1107,"Dismissals":1257},
{"Year":2005,"NassauDismissals":322,"NassauRemainder":437,"SuffolkDismissals":960,"SuffolkRemainder":700,"Remainder":1137,"Dismissals":1282},
{"Year":2006,"NassauDismissals":308,"NassauRemainder":391,"SuffolkDismissals":817,"SuffolkRemainder":727,"Remainder":1118,"Dismissals":1125},
{"Year":2007,"NassauDismissals":299,"NassauRemainder":462,"SuffolkDismissals":885,"SuffolkRemainder":753,"Remainder":1215,"Dismissals":1184},
{"Year":2008,"NassauDismissals":314,"NassauRemainder":430,"SuffolkDismissals":750,"SuffolkRemainder":719,"Remainder":1149,"Dismissals":1064},
{"Year":2009,"NassauDismissals":319,"NassauRemainder":434,"SuffolkDismissals":837,"SuffolkRemainder":624,"Remainder":1058,"Dismissals":1156},
{"Year":2010,"NassauDismissals":341,"NassauRemainder":325,"SuffolkDismissals":700,"SuffolkRemainder":704,"Remainder":1029,"Dismissals":1041},
{"Year":2011,"NassauDismissals":331,"NassauRemainder":333,"SuffolkDismissals":817,"SuffolkRemainder":854,"Remainder":1187,"Dismissals":1148},
{"Year":2012,"NassauDismissals":389,"NassauRemainder":377,"SuffolkDismissals":953,"SuffolkRemainder":872,"Remainder":1249,"Dismissals":1342},
{"Year":2013,"NassauDismissals":513,"NassauRemainder":430,"SuffolkDismissals":1014,"SuffolkRemainder":737,"Remainder":1167,"Dismissals":1527}]



function buildDismissalChart() {
    $('#dismissalChart').empty();
    var color = d3.scale.ordinal()
        .range(['#e5f5e0', '#00441b']);
    var margin = {top: 0, right: 0, bottom: 20, left:50};
    var width = $('#dismissalChart').width() - margin.left - margin.right;

    var graphic_aspect_width = 980;
    var graphic_aspect_height = 400;

    var height = Math.ceil((width * graphic_aspect_height) / graphic_aspect_width) - margin.top - margin.bottom;
    
    
    var dismissalChart = d3.select('#dismissalChart');
    var svg = dismissalChart.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    color.domain(d3.keys(dismissals[0]).filter(function(key) { return key === "Dismissals" || key === "Remainder"; }));
    
    dismissals.forEach(function(d) {
        var y0 = 0;
        d.categories = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        d.total = d.categories[d.categories.length - 1].y1;
        // d.NassauDismissals = +d.NassauDismissals;
        // d.SuffolkDismissals = +d.SuffolkDismissals;
        // d.NassauRemainder = +d.NassauRemainder;
        // d.SuffolkRemainder = +d.SuffolkRemainder;
        d.date = d.Year;
    });
    var x, y;
    var x = d3.scale.ordinal()
        .domain(d3.range(2004, 2014))
        .rangeRoundBands([0, width], .15);
    var y = d3.scale.linear()
        .domain([0, d3.max(dismissals, function(d) {return d.total; })])
        .range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format('d'))
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .orient("left");
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    var bar = svg.selectAll('bar')
        .data(dismissals)
      .enter()
        .append('g')
        .attr('class', 'g')
        .attr('transform', function(d) { return 'translate(' + x(d.Year) + ',0)'; });
    
    bar.selectAll('rect')
        .data(function(d) { return d.categories;})
        .enter().append('rect')
                .attr('width', x.rangeBand())
                .attr("class", function(d) { return d.name;
                })
                // .attr("x", function(d) { return x(d.Year); })
                //.attr('y', function(d) {return y(d.y1); })
                .attr('y', height)
                .attr("height", 0)
                .style('fill', function(d) {return color(d.name); })
        .transition()
            .duration(200)
            .delay(function(d, i) { return i * 200; })
            //.delay(function(d, i) { return i * 200; })
            .attr('y', function(d){ return y(d.y1);})
            .attr('height', function(d) { return y(d.y0) - y(d.y1)});


    var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
            
      } //buildDismissalChart
    buildDismissalChart();

    var lazyLayout = _.debounce(buildDismissalChart, 200);
    $(window).on('resize', lazyLayout);
}
