function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function shrinkNumber(number) {
  if (number/1000 > 1) {
   return Math.round((parseFloat(number)/1000.00)*10) / 10 +"k";
  }
  return number;
}



var averages = {"2001":1256,"2002":1370,"2003":1612,"2004":1859,"2005":2296,"2006":2770,"2007":2932,"2008":3130,"2009":3435,"2010":3295,"2011":3299};

var data = [{"fips":"01","abbrev":"Ala.","postal_code":"AL","name":"Alabama","numbers":{"2001":973,"2002":1013,"2003":1030,"2004":1393,"2005":1783,"2006":2245,"2007":2389,"2008":2715,"2009":2834,"2010":3148,"2011":3285}},{"fips":"02","abbrev":"Alaska","postal_code":"AK","name":"Alaska","numbers":{"2001":388,"2002":315,"2003":1713,"2004":801,"2005":782,"2006":853,"2007":1050,"2008":1130,"2009":1076,"2010":932,"2011":1086}},{"fips":"04","abbrev":"Ariz.","postal_code":"AZ","name":"Arizona","numbers":{"2001":861,"2002":1372,"2003":1202,"2004":1095,"2005":1202,"2006":1245,"2007":1364,"2008":1328,"2009":1283,"2010":1259,"2011":1190}},{"fips":"05","abbrev":"Ark.","postal_code":"AR","name":"Arkansas","numbers":{"2001":840,"2002":554,"2003":541,"2004":638,"2005":650,"2006":1068,"2007":1262,"2008":1342,"2009":1344,"2010":1384,"2011":1540}},{"fips":"06","abbrev":"Calif.","postal_code":"CA","name":"California","numbers":{"2001":892,"2002":1055,"2003":1171,"2004":1481,"2005":1971,"2006":2141,"2007":2306,"2008":2670,"2009":3284,"2010":3633,"2011":3926}},{"fips":"08","abbrev":"Colo.","postal_code":"CO","name":"Colorado","numbers":{"2001":268,"2002":331,"2003":348,"2004":424,"2005":505,"2006":498,"2007":477,"2008":605,"2009":669,"2010":577,"2011":662}},{"fips":"09","abbrev":"Conn.","postal_code":"CT","name":"Connecticut","numbers":{"2001":3678,"2002":3630,"2003":3981,"2004":4250,"2005":3721,"2006":3454,"2007":3497,"2008":4325,"2009":4492,"2010":3992,"2011":3862}},{"fips":"10","abbrev":"Del.","postal_code":"DE","name":"Delaware","numbers":{"2001":869,"2002":1120,"2003":1466,"2004":1470,"2005":2364,"2006":2543,"2007":2788,"2008":3064,"2009":3522,"2010":3711,"2011":3813}},{"fips":"11","abbrev":"D.C.","postal_code":"DC","name":"District of Columbia","numbers":{"2001":91,"2002":196,"2003":245,"2004":308,"2005":415,"2006":437,"2007":401,"2008":540,"2009":695,"2010":775,"2011":683}},{"fips":"12","abbrev":"Fla.","postal_code":"FL","name":"Florida","numbers":{"2001":407,"2002":529,"2003":723,"2004":679,"2005":863,"2006":1108,"2007":1158,"2008":1254,"2009":1485,"2010":1548,"2011":1451}},{"fips":"13","abbrev":"Ga.","postal_code":"GA","name":"Georgia","numbers":{"2001":575,"2002":595,"2003":650,"2004":691,"2005":855,"2006":1064,"2007":1247,"2008":1604,"2009":2163,"2010":2918,"2011":4169}},{"fips":"15","abbrev":"Hawaii","postal_code":"HI","name":"Hawaii","numbers":{"2001":261,"2002":282,"2003":273,"2004":331,"2005":493,"2006":577,"2007":557,"2008":559,"2009":700,"2010":600,"2011":604}},{"fips":"16","abbrev":"Idaho","postal_code":"ID","name":"Idaho","numbers":{"2001":218,"2002":353,"2003":253,"2004":294,"2005":303,"2006":381,"2007":435,"2008":527,"2009":586,"2010":529,"2011":607}},{"fips":"17","abbrev":"Ill.","postal_code":"IL","name":"Illinois","numbers":{"2001":988,"2002":1154,"2003":1246,"2004":1332,"2005":1529,"2006":1798,"2007":1872,"2008":1955,"2009":2164,"2010":2194,"2011":2197}},{"fips":"18","abbrev":"Ind.","postal_code":"IN","name":"Indiana","numbers":{"2001":716,"2002":988,"2003":1235,"2004":1654,"2005":2320,"2006":2854,"2007":3164,"2008":3606,"2009":4490,"2010":5069,"2011":5632}},{"fips":"19","abbrev":"Iowa","postal_code":"IA","name":"Iowa","numbers":{"2001":190,"2002":179,"2003":220,"2004":259,"2005":295,"2006":383,"2007":391,"2008":382,"2009":417,"2010":418,"2011":465}},{"fips":"20","abbrev":"Kan.","postal_code":"KS","name":"Kansas","numbers":{"2001":443,"2002":367,"2003":437,"2004":449,"2005":471,"2006":587,"2007":612,"2008":682,"2009":706,"2010":739,"2011":632}},{"fips":"21","abbrev":"Ky.","postal_code":"KY","name":"Kentucky","numbers":{"2001":1042,"2002":1636,"2003":2281,"2004":2807,"2005":3100,"2006":3955,"2007":3967,"2008":4331,"2009":5083,"2010":5024,"2011":4891}},{"fips":"22","abbrev":"La.","postal_code":"LA","name":"Louisiana","numbers":{"2001":1382,"2002":1136,"2003":1209,"2004":1055,"2005":1201,"2006":1715,"2007":1543,"2008":1658,"2009":1798,"2010":1752,"2011":1654}},{"fips":"23","abbrev":"Me.","postal_code":"ME","name":"Maine","numbers":{"2001":1444,"2002":1146,"2003":1607,"2004":1747,"2005":2529,"2006":2516,"2007":2711,"2008":2716,"2009":2888,"2010":2628,"2011":2268}},{"fips":"24","abbrev":"Md.","postal_code":"MD","name":"Maryland","numbers":{"2001":385,"2002":438,"2003":528,"2004":589,"2005":637,"2006":696,"2007":646,"2008":766,"2009":956,"2010":1095,"2011":1175}},{"fips":"25","abbrev":"Mass.","postal_code":"MA","name":"Massachusetts","numbers":{"2001":5438,"2002":5714,"2003":5837,"2004":6747,"2005":7752,"2006":7457,"2007":7284,"2008":7801,"2009":8383,"2010":7616,"2011":7444}},{"fips":"26","abbrev":"Mich.","postal_code":"MI","name":"Michigan","numbers":{"2001":689,"2002":738,"2003":886,"2004":942,"2005":1091,"2006":1303,"2007":1461,"2008":1747,"2009":1838,"2010":1997,"2011":2150}},{"fips":"27","abbrev":"Minn.","postal_code":"MN","name":"Minnesota","numbers":{"2001":235,"2002":277,"2003":289,"2004":337,"2005":427,"2006":454,"2007":403,"2008":456,"2009":486,"2010":595,"2011":573}},{"fips":"28","abbrev":"Miss.","postal_code":"MS","name":"Mississippi","numbers":{"2001":852,"2002":528,"2003":669,"2004":473,"2005":488,"2006":836,"2007":941,"2008":1087,"2009":1221,"2010":1473,"2011":1467}},{"fips":"29","abbrev":"Mo.","postal_code":"MO","name":"Missouri","numbers":{"2001":436,"2002":429,"2003":434,"2004":493,"2005":555,"2006":733,"2007":754,"2008":858,"2009":818,"2010":832,"2011":858}},{"fips":"30","abbrev":"Mont.","postal_code":"MT","name":"Montana","numbers":{"2001":164,"2002":203,"2003":378,"2004":394,"2005":346,"2006":416,"2007":642,"2008":587,"2009":580,"2010":668,"2011":669}},{"fips":"31","abbrev":"Neb.","postal_code":"NE","name":"Nebraska","numbers":{"2001":263,"2002":229,"2003":280,"2004":395,"2005":388,"2006":471,"2007":396,"2008":421,"2009":525,"2010":533,"2011":558}},{"fips":"32","abbrev":"Nev.","postal_code":"NV","name":"Nevada","numbers":{"2001":421,"2002":503,"2003":504,"2004":569,"2005":649,"2006":526,"2007":647,"2008":670,"2009":673,"2010":705,"2011":641}},{"fips":"33","abbrev":"N.H.","postal_code":"NH","name":"New Hampshire","numbers":{"2001":1166,"2002":1301,"2003":1921,"2004":2383,"2005":2697,"2006":2232,"2007":3111,"2008":3493,"2009":3659,"2010":2797,"2011":3106}},{"fips":"34","abbrev":"N.J.","postal_code":"NJ","name":"New Jersey","numbers":{"2001":1795,"2002":2182,"2003":3214,"2004":3654,"2005":4624,"2006":5656,"2007":5915,"2008":6383,"2009":7683,"2010":8689,"2011":10063}},{"fips":"35","abbrev":"N.M.","postal_code":"NM","name":"New Mexico","numbers":{"2001":350,"2002":340,"2003":369,"2004":529,"2005":626,"2006":685,"2007":793,"2008":797,"2009":823,"2010":989,"2011":1033}},{"fips":"36","abbrev":"N.Y.","postal_code":"NY","name":"New York","numbers":{"2001":1027,"2002":1018,"2003":1079,"2004":1194,"2005":1442,"2006":1604,"2007":1789,"2008":1945,"2009":2003,"2010":2090,"2011":2203}},{"fips":"37","abbrev":"N.C.","postal_code":"NC","name":"North Carolina","numbers":{"2001":805,"2002":1268,"2003":1583,"2004":1911,"2005":2269,"2006":2657,"2007":2661,"2008":2776,"2009":2754,"2010":2661,"2011":2771}},{"fips":"38","abbrev":"N.D.","postal_code":"ND","name":"North Dakota","numbers":{"2001":234,"2002":193,"2003":245,"2004":313,"2005":295,"2006":357,"2007":400,"2008":494,"2009":360,"2010":507,"2011":521}},{"fips":"39","abbrev":"Ohio","postal_code":"OH","name":"Ohio","numbers":{"2001":1351,"2002":1417,"2003":1593,"2004":1840,"2005":2262,"2006":2862,"2007":3308,"2008":3647,"2009":3945,"2010":3733,"2011":3558}},{"fips":"40","abbrev":"Okla.","postal_code":"OK","name":"Oklahoma","numbers":{"2001":480,"2002":502,"2003":494,"2004":492,"2005":602,"2006":678,"2007":688,"2008":748,"2009":837,"2010":902,"2011":922}},{"fips":"41","abbrev":"Ore.","postal_code":"OR","name":"Oregon","numbers":{"2001":604,"2002":640,"2003":587,"2004":548,"2005":672,"2006":605,"2007":596,"2008":692,"2009":731,"2010":720,"2011":753}},{"fips":"42","abbrev":"Pa.","postal_code":"PA","name":"Pennsylvania","numbers":{"2001":1987,"2002":1988,"2003":2270,"2004":2681,"2005":3242,"2006":3811,"2007":4310,"2008":5222,"2009":6647,"2010":7925,"2011":7867}},{"fips":"44","abbrev":"R.I.","postal_code":"RI","name":"Rhode Island","numbers":{"2001":4513,"2002":4661,"2003":7465,"2004":4632,"2005":4947,"2006":8239,"2007":9261,"2008":8709,"2009":8688,"2010":7484,"2011":7641}},{"fips":"45","abbrev":"S.C.","postal_code":"SC","name":"South Carolina","numbers":{"2001":1334,"2002":1653,"2003":2158,"2004":2970,"2005":4221,"2006":6137,"2007":6765,"2008":7085,"2009":8117,"2010":9162,"2011":9400}},{"fips":"46","abbrev":"S.D.","postal_code":"SD","name":"South Dakota","numbers":{"2001":166,"2002":237,"2003":271,"2004":327,"2005":399,"2006":477,"2007":661,"2008":938,"2009":871,"2010":923,"2011":1058}},{"fips":"47","abbrev":"Tenn.","postal_code":"TN","name":"Tennessee","numbers":{"2001":1795,"2002":2332,"2003":2986,"2004":2915,"2005":3343,"2006":3983,"2007":4185,"2008":4598,"2009":5118,"2010":5758,"2011":5730}},{"fips":"48","abbrev":"Tex.","postal_code":"TX","name":"Texas","numbers":{"2001":2329,"2002":2219,"2003":2747,"2004":3445,"2005":4329,"2006":5651,"2007":5673,"2008":5143,"2009":5146,"2010":3981,"2011":2461}},{"fips":"49","abbrev":"Utah","postal_code":"UT","name":"Utah","numbers":{"2001":280,"2002":358,"2003":300,"2004":438,"2005":422,"2006":395,"2007":334,"2008":368,"2009":467,"2010":472,"2011":526}},{"fips":"50","abbrev":"Vt.","postal_code":"VT","name":"Vermont","numbers":{"2001":1990,"2002":2320,"2003":3008,"2004":3263,"2005":4055,"2006":3565,"2007":3271,"2008":3056,"2009":4061,"2010":3120,"2011":3502}},{"fips":"51","abbrev":"Va.","postal_code":"VA","name":"Virginia","numbers":{"2001":713,"2002":1002,"2003":1277,"2004":1671,"2005":2115,"2006":2535,"2007":2936,"2008":3398,"2009":3795,"2010":4061,"2011":4566}},{"fips":"53","abbrev":"Wash.","postal_code":"WA","name":"Washington","numbers":{"2001":582,"2002":845,"2003":968,"2004":681,"2005":705,"2006":663,"2007":698,"2008":1045,"2009":1083,"2010":973,"2011":984}},{"fips":"54","abbrev":"W.Va.","postal_code":"WV","name":"West Virginia","numbers":{"2001":2310,"2002":3681,"2003":5119,"2004":4833,"2005":5170,"2006":5897,"2007":7066,"2008":7727,"2009":9421,"2010":9238,"2011":8797}},{"fips":"55","abbrev":"Wis.","postal_code":"WI","name":"Wisconsin","numbers":{"2001":358,"2002":403,"2003":481,"2004":507,"2005":616,"2006":675,"2007":730,"2008":806,"2009":814,"2010":839,"2011":806}},{"fips":"56","abbrev":"Wyo.","postal_code":"WY","name":"Wyoming","numbers":{"2001":210,"2002":142,"2003":212,"2004":324,"2005":240,"2006":242,"2007":302,"2008":387,"2009":535,"2010":460,"2011":522}}];
//sort data by most recent results - do this when generating json
// var states = _.sortBy(data, function(state){
//   return state['numbers']['2011'] * (-1);
// });
var nation = {"abbrev":"Nat'l Avg.","fips":"US","postal_code":"US","name":"National Average","numbers": averages};

data.push(nation);

// var states = data;

var chartTmpl = _.template(
  "<div class='spark-wrap'>\
    <div class='state-name'><%=abbrev%></div>\
    <svg class='graphic' id='fips-<%=fips%>'></svg>\
    <div class='year'>\
    <span class='left'>2001</span>\
    <span class='right'>2011</span>\
    </div>\
    <div class='name'><%=name%></div>\
    <div class='last'><%=numbers['2011']%></div>\
  </div>"
  );




// var url = window.location.href.split('#')[1];



$(function(){

  var html = "";
  var url = window.location.href.split('#')[1];

  if (url == "" || url == undefined){
     _.each(data,function(record){
      html += chartTmpl(record);
    });    
  } else {
    var urls = url.split('&');
    var selectedStates = [];
    _.each(urls,function(state){
      var thisState = _.findWhere(data,{postal_code:state});
      selectedStates.push(thisState);
      html += chartTmpl(thisState);
    });
  }


  $('#charts-wrapper').html(html);
  
  $('#fips-US').parent().addClass('first_static');

  var baseColor = '#bbc9d0';
  var highlightColor = '#e2e2e2';
  var lineColor = '#FF8D00';
  var width = parseInt((d3.select('.graphic').style('width')).replace(/px/,""));
  var height = parseInt((d3.select('.graphic').style('height')).replace(/px/,""));
  

  function drawChart(state) {
    var x = d3.scale.ordinal()
      .domain(d3.keys(state['numbers']))
      .rangeRoundBands([15, width-15],0.2);

    var y = d3.scale.linear()
      .domain([0,15100])
      .range([height,0]);

    var dragBehavior = d3.behavior.drag()
      .on('dragstart',dragstart)
      .on('dragend',dragend)
      .on('drag',drag);

    var line = d3.svg.line()
      .x(function(d){ return x(parseInt(d.key)) + x.rangeBand() / 2;})
      .y(function(d){return y(d.value)});

    var svg = d3.select('#fips-'+state['fips'])
      .attr('width',width)
      .attr('height',height);

    svg.append('text')
      .attr('x',10)
      .attr('y',20)
      .attr('class','state-abbrev')
      .text(state['abbrev']);
    
    svg.selectAll('rect')
      .data(d3.entries(state['numbers']))
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
      .data(d3.entries(state['numbers']))
      .enter()
      .append('rect')
      .style('fill','white')
      .attr('x',function(d){return x(d.key)-10;})
      .attr('y', function(d){ return (y(d.value))-25;})
      .attr('display','none')
      .attr('width', function(d){
        return ("$" + shrinkNumber(d.value)).length * 6;
      })
      .attr('height',12)
      .attr('class',function(d) {return 'label-'+ d.key})
      .attr('id','label-background');

    svg.selectAll('#label')
      .data(d3.entries(state['numbers']))
      .enter()   
      .append('text')
      .attr('x',function(d){return x(d.key)-10;})
      .attr('y', function(d){ return (y(d.value))-15;})
      .attr('display','none')
      .attr('class',function(d) {return 'label-'+ d.key})
      .attr('id','label')
      .text(function(d){ 
        return "$" + shrinkNumber(d.value);
      });

      svg.append("path")
        .datum(d3.entries(averages))
        .attr('d',line)
        .style('fill','none')
        .style('stroke',lineColor);

      svg.append('rect')
        .attr('class','overlay')
        .attr('x',-4)
        .attr('width',width - 15)
        .attr('height', height + 18)
        .style('fill','none')
        .style('pointer-events','all')
        .on('mouseover',mouseover)
        .on('mousemove',mousemove)
        .on('mouseout',mouseout)
        .call(dragBehavior);

      d3.selectAll('.label-2001, .label-2011')
        .style('display','block');


      function mouseover() {
        d3.selectAll('.label-2001, .label-2011')
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
          years[leftEdges[i]] = d3.keys(averages)[i];
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
        d3.selectAll('.label-2001, .label-2011')
          .style('display','block');
        d3.selectAll('.year')
          .html("<span class='left'>2001</span>\
    <span class='right'>2011</span>");
      }


      function dragstart() {
        d3.event.sourceEvent.stopPropagation();
        d3.selectAll('.label-2001, .label-2011')
          .style('display','none');
        drag();
      }

      function drag() {
        d3.selectAll('#bar')
          .style('fill',baseColor);
        d3.selectAll('#label, #label-background')
          .style('display','none')
        var xPos = d3.touches(this)[0][0];
        var leftEdges = x.range();
        var width = x.rangeBand();
        var i;
        var years = {};
        _.each(_.range(11),function(i){
          years[leftEdges[i]] = d3.keys(averages)[i];
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

      function dragend(){
        d3.selectAll('#bar')
          .style('fill',baseColor);
        d3.selectAll('#label, #label-background')
          .style('display','none');
        d3.selectAll('.label-2001, .label-2011')
          .style('display','block');
        d3.selectAll('.year')
          .html("<span class='left'>2001</span>\
            <span class='right'>2011</span>");
      }



  }


  $( "#charts-wrapper" ).isotope({
      itemSelector: '.spark-wrap',
      layoutMode: 'fitRows',
      getSortData: {
        last: function(ele) {
          if ($(ele).hasClass('first_static')) {
            return -11000;
          }
          return +($(ele).find('.last').text())*(-1);
        },
        state: function(ele) {
          if ($(ele).hasClass('first_static')) {
            return -1;
          }
          return $(ele).find('.name').text().replace(/ /g,'');
        }
      }
    });

  $("#charts-wrapper").isotope({sortBy:'last'});
//actually draw charts
  if (url == "" || url == undefined) {
    _.each(data,function(state){
      drawChart(state);
    }); 
  } else {
    _.each(selectedStates,function(state){
      drawChart(state);
    });
  }



  $('#last').on('click',function(){
    $("#charts-wrapper").isotope({sortBy:'last'});
    $('#last').addClass('active');
    $('#state').removeClass('active');
  });

  $('#state').on('click',function(){
    $("#charts-wrapper").isotope({sortBy:'state'});
    $('#state').addClass('active');
    $('#last').removeClass('active');
  });




});