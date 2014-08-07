function dismissals() {

	// function numberWithCommas(number) {
	//   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	// }
	var format = d3.format(",");

	// function shrinkNumber(number) {
	//   if (number/1000 > 1) {
	//    return Math.round((parseFloat(number)/1000.00)*10) / 10 +"k";
	//   }
	//   return number;
	// }

	var data = [
		{	'name': 'Suffolk County',
			'abbrev': 'SC',
			'total': {"2004":1693,"2005":1660,"2006":1544,"2007":1638,"2008":1469,"2009":1461,"2010":1404,"2011":1671,"2012":1825,"2013":1751},
			'dismissals	': {"2004":336,"2005":322,"2006":308,"2007":299,"2008":314,"2009":319,"2010":341,"2011":331,"2012":389,"2013":513}
		},
		{
			'name': 'Nassau County',
			'abbrev': 'NC',
			'total': {"2004":671,"2005":759,"2006":699,"2007":761,"2008":744,"2009":753,"2010":666,"2011":664,"2012":766,"2013":943},
			'dismissals': {"2004":336,"2005":322,"2006":308,"2007":299,"2008":314,"2009":319,"2010":341,"2011":331,"2012":389,"2013":513}
		},
		// {	'name': 'New York City',
		// 	'abbrev': 'NYC',
		// 	'total': {"2004":41070,"2005":33754,"2006":35862,"2007":41737,"2008":46282,"2009":48929,"2010":53391,"2011":56809,"2012":49268,"2013":37723},
		// 	'dismissals': {"2004":24151,"2005":16199,"2006":17703,"2007":19543,"2008":23316,"2009":23331,"2010":27007,"2011":28998,"2012":28214,"2013":22095}
		// }
	]


	var chart_template = _.template(
	  "<div class='spark-wrap'>\
	    <div class='name'><%=name%></div>\
	    <svg class='graphic' id='<%=abbrev%>'></svg>\
	    <div class='year'>\
	    <span class='left'>2004</span>\
	    <span class='right'>2013</span>\
	    </div>\
	    <div class='last'><%=total['2014']%></div>\
	  </div>"
	  );

	var html = "";
	
	_.each(data, function(region){
		console.log('I AM ALIVE');
		html += chart_template(region);	
	})
	
	$('#charts-wrapper').html(html);

	
	var baseColor = '#8bc34a';
  	var highlightColor = '#68C3FF';
  	// var lineColor = '#FF8D00';
	
	var width = 200;
  	var height = 300;
	console.log(width)

	function drawChart(region) {

	    var x = d3.scale.ordinal()
	      .domain(d3.keys(region['total']))
	      .rangeRoundBands([15,width-15],0.2);

	    console.log(region.total)
	    console.log(region.total['2013']);
	    // var max = _.max(region.total);
	    var max = 1825;
	    console.log(max);
	    var y = d3.scale.linear()
	      .domain([0, max])
	      .range([height,0]);
	    

	    var svg = d3.select('#'+region['abbrev'])
	      .attr('width',width)
	      .attr('height',height);


	    // svg.append('text')
	    //   .attr('x',10)
	    //   .attr('y',20)
	    //   .attr('class','state-abbrev')
	    //   .text(region['name']);
	    
	    svg.selectAll('rect')
	      .data(d3.entries(region['total']))
	      .enter()
	      .append('rect')
	      .attr('x',function(d){return x(d.key);})
	      .attr('width',x.rangeBand())
	      .attr('height', function(d){
	        return (height) - y(d.value);
	      })
	      .attr('y', function(d){return y(d.value);})
	      .attr('class',function(d,i){
	        return "col-"+d.key;
	      })
	      .attr('id','bar')
	      .style('fill',baseColor);

	    svg.selectAll('#label-background')
	      .data(d3.entries(region['total']))
	      .enter()
	      .append('rect')
	      .style('fill','white')
	      .attr('x',function(d){return x(d.key) + x.rangeBand()/2;})
	      .attr('y', function(d){ return (y(d.value))-10;})
	      .attr('display','none')
	      .attr('width', function(d){ return x(d.value)})
	      .attr('height',12)
	      .attr('class',function(d) {return 'label-'+ d.key})
	      .attr('id','label-background');

	    svg.selectAll('#label')
	      .data(d3.entries(region['total']))
	      .enter()   
	      .append('text')
	      .attr('x',function(d){return x(d.key) + x.rangeBand()/2;})
	      .attr('y', function(d){ return y(d.value) - 10;})
	      .attr('display','none')
	      .attr('text-anchor','middle')
	      .attr('class',function(d) {return 'label-'+ d.key})
	      .attr('id','label')
	      .text(function(d){ 
	        return format(d.value);
	      });

	      svg.append('rect')
	        .attr('class','overlay')
	        .attr('x',-4)
	        .attr('width',width - 15)
	        .attr('height', height)
	        .style('fill','none')
	        .style('pointer-events','all')
	        .on('mouseover', mouseover)
	        .on('mousemove', mousemove)
	        .on('mouseout', mouseout);
	        

	      d3.selectAll('.label-2004, .label-2013')
	        .style('display','block');


      function mouseover() {
        d3.selectAll('.label-2004, .label-2013')
          .style('display','none');
      }

      function mousemove() {
        d3.selectAll('#bar')
          .style('fill',baseColor);
        d3.selectAll('#label, #label-background')
          .style('display','none')
        var xPos = d3.mouse(this)[0];
        var leftEdges = x.range();
        var width = x.rangeBand();
        var i;
        var years = {};
        _.each(_.range(11),function(i){
          years[leftEdges[i]] = d3.keys(region['total'])[i];
        });

        for(i=0; xPos > (leftEdges[i] + width); i++) {}
        if (leftEdges[i] !== undefined){
          var year = years[leftEdges[i]];
          d3.selectAll('.col-'+year)
            .style('fill',highlightColor);
          d3.selectAll('.label-'+year)
            .style('display','block');
          d3.selectAll('.year')
            .text(year);
        }
        
      }

      function mouseout() {
        d3.selectAll('#bar')
          .style('fill',baseColor);
        d3.selectAll('#label, #label-background')
          .style('display','none');
        d3.selectAll('.label-2004, .label-2013')
          .style('display','block');
        d3.selectAll('.year')
          .html("<span class='left'>2004</span>\
    <span class='right'>2013</span>");
      }
  	}

  	_.each(data, function(d){
  		console.log(d)
  		drawChart(d);
  	});
}