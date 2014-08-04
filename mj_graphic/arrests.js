var dismissals = [{"Percent":0.5317258883,"Year":2004},
{"Percent":0.5299710624,"Year":2005},
{"Percent":0.5015604102,"Year":2006},
{"Percent":0.4935389746,"Year":2007},
{"Percent":0.4807953005,"Year":2008},
{"Percent":0.522131888,"Year":2009},
{"Percent":0.5028985507,"Year":2010},
{"Percent":0.4916488223,"Year":2011},
{"Percent":0.5179467387,"Year":2012},
{"Percent":0.5668151448,"Year":2013}]

function buildDismissalChart() {
    $('#dismissed').slideDown();
    if (!chart_entered){
    var dismissalChart = d3.select('#dismissed');
    var svg2 = dismissalChart.append('svg')
        .attr('width', width+margin2.left+margin2.right)
        .attr('height', height + margin2.top+margin2.bottom)
      .append('g')
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    dismissals.forEach(function(d) {
        d.Percent = +d.Percent;
        d.date = d.Year;
    });
    var x,y;
    var x = d3.scale.ordinal()
        .domain(d3.range(2004,2014))
        .rangeRoundBands([0, width], .2);

    var y = d3.scale.linear()
    .domain([0, 1])
    .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format('d'))
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(3)
        .tickFormat(d3.format(".0%"))
        .orient("left");
    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    var bar = svg2.selectAll('bar')
        .data(dismissals)
        .enter().append('rect')
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.Year); })
            .attr('width', x.rangeBand())
            .attr('y', height)
            .attr('height', 0)
            
    bar.transition()
        .duration(200)
        .delay(function(d, i) { return i * 200; })
        .attr("y", function(d) { return y(d.Percent); })
        .attr("height", function(d) { return height - y(d.Percent); });
      }
}
