/*jslint browser: true, sloppy: true, white: true, quotes: false*/
// jquery's not on the page, so we're going to load this last...
var id = 'chart_wrapper';
var element = document.getElementById(id);
var color = d3.scale.category10();
var mobile_threshold = 500;

var margin = { top: 10, right: 10, bottom: 10, left: 10 };
var id = 'chart_wrapper';

var chart = $('#chart');
var container_width = chart.width();
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var container_height = element.offsetWidth; //wat. no.
var graphic_aspect_width = 16;
var graphic_aspect_height = 7;
var circle, force, labels, keys;
var columns = 3;
var height = 350;
var dot_to_person_ratio = 3;
var radius = 5;
var easing = 'exp';
var ratio_weight = 1;
if (!is_chrome) {
    ratio_weight = 3;
}



if (container_width < mobile_threshold) {
    graphic_aspect_width = 7;
    graphic_aspect_height = 16;
    columns = 1;
    height = 250;
    margin = { top: 10, right: 10, bottom: 10, left: 10 };
    dot_to_person_ratio = 6;
    radius = 3;
    easing = 'linear';
}

dot_to_person_ratio = dot_to_person_ratio * ratio_weight;
d3.select('#legend-row')
    .html("<p><span class='legend'>●</span> " + dot_to_person_ratio + " people</p>");
var width = container_width - margin.left - margin.right;

//we need an 'on resize function.' Got any good listeners?

var svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);

var dataset = [];
var stats = 
[
{"Disposition":"Prison","Count":7,"Type":"Convicted", 'Position': 'Prison'},
{"Disposition":"Jail","Count":79,"Type":"Convicted", 'Position': 'Jail'},
{"Disposition":"Jail and Probation","Count":7,"Type":"Convicted", 'Position': 'Jail'},
{"Disposition":"Time Served","Count":52,"Type":"Convicted", 'Position': 'Jail'},
{"Disposition":"Probation","Count":17,"Type":"Convicted", 'Position': 'Probation'},
{"Disposition":"Fine","Count":685,"Type":"Convicted", 'Position': 'Fine'},
{"Disposition":"Conditional Discharge","Count":88,"Type":"Convicted", 'Position': 'Discharged'},
{"Disposition":"Unconditional Discharge","Count":6,"Type":"Convicted", 'Position':'Discharged'},
{"Disposition": "Convicted-Sentence Pending","Count": 25,"Type": "Convicted", 'Position':'SentencePending'},
{"Disposition":"Diverted and Dismissed","Count":5,"Type":"Dismissed", 'Position': 'Dismissed'},
{"Disposition":"Covered by Another Case","Count":176,"Type":"Other", 'Position': 'Other'},
{"Disposition":"Conditional Dismissal","Count":1409,"Type":"Dismissed", 'Position': 'Dismissed'},
{"Disposition":"Unconditional Dismissal","Count":113,"Type":"Dismissed", 'Position': 'Dismissed'},
{"Disposition":"Other","Count":25,"Type":"Other", 'Position': 'Other'}
];

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


// function buildDismissalChart() {
//     var dismissalChart = d3.select('#dismissed');
//     var svg2 = dismissalChart.append('svg')
//         .attr('width', width)
//         .attr('height', height);
//         .


// }

var labels;
var labels_entered = false;
var format = d3.format(",");
function fade(label) {   
    circle
        .transition()    
            .style("opacity", function(d) {
                if (d.Position == label) {
                    return 1; 
                } 
                else {
                    return .1;
                }
            })
}
function enterLabels() {
    var processed_stats = _(stats).groupBy('Position');
    console.log(processed_stats);
    var out = _(processed_stats).map(function(g, key) {
        return {
            Position: key,
            Count: _(g).reduce(function(m,x) {
                return m + x.Count;
            }, 0)
        }
    })
    console.log(out)
    processed_stats = _.sortBy(out, function(num) { return -num.Count });
    console.log(processed_stats);
    var first_half = processed_stats.slice(0,(processed_stats.length/2))
    var second_half = processed_stats.slice((processed_stats.length/2),processed_stats.length)
    console.log(first_half);
    console.log(second_half);
    function makeit(data, id) {
        labels = d3.select(id).select('tbody').selectAll('tr')
            .data(data);
          labels.enter().append('tr')
            .on('mouseover', function(d) {
                d3.selectAll('tr').classed('active', false);
                d3.select(this).classed('active', true);
                fade(d.Position);
             })
            .on('mouseout', function(d) {
                d3.selectAll('tr').classed('active', false);
                circle
                    .transition()
                    .style('opacity', 1);
            })
            .html(function(d) { return ("<td><span class='" +d.Position+ "'>●</span></td><td>" + format(d.Count) + "</td><td>" + d.Position + "</td>") })
            .style("opacity", 1e-6)
              .transition()
              .duration(2000)
              .style("opacity", 1);
            if (container_width < mobile_threshold) {
                var flipper = false;
                labels.on('click', function(d){
                    circle
                        .transition()
                        .style('opacity', 1);
                    d3.selectAll('tr').classed('active', false);
                    if (flipper == false) {
                        d3.select(this).classed('active', true);
                        fade(d.Position);
                    }
                    flipper = !flipper;
                })
            }
    }

    if (!labels_entered) {
        makeit(first_half, '#table1');
        makeit(second_half, '#table2');
    }
    else {
        $("#labels").show();
    }
}


function make_data() {
    // random times
    var i = 0;
    // var weedline = {id: i, 'Disposition': 'leaf', 'Type': 'leaf', 'Position': 'leaf'}
    // dataset.push(weedline);
    // i++;
    stats = _.sortBy(stats, function(d) { return d.Count});
    _(stats).each(function(disp, key) {
        var count = Math.ceil((disp.Count) / dot_to_person_ratio); //all of them is like waaaaay too much
        var j = 0;
        while (j++ < count) {
            var new_line = {id: i, 'Disposition': disp.Disposition, 'Type': disp.Type, 'Position': disp.Position};
            dataset.push(new_line);
            i++;
        }
    });
};
make_data();
//console.log(dataset);
function make_focii(data, step) {
    var foci = {};
    foci.All = {x: width / 2, y: height / 2};
    return foci;
}

var active_step = 'step0';
function fill(d) {
    var default_color = '#7B9984';
    if (active_step == 'step0') {
        return default_color;
    }
     if (active_step == 'step1') {
         if (d.Type == 'Convicted') {
             return '#7F3ECC';
             }
         else if (d.Type == 'Other') {
             return '#7B9984';
             }
         else return '#3C9455';
         
         }
    else {
            if (d.Position == 'Prison') {
                return '#7F3ECC';
            }
            else if (d.Position == 'Jail')
                {
                return '#7F3ECC';
            }
            else if (d.Position == 'Probation') {
                return '#E7A7FF'
            }
            else if (d.Position == 'Fine') {
                return '#64A34C';
            }
            else if (d.Position == 'Discharged') {
                return '#3C9455';
            }
            else if (d.Position == 'SentencePending') {
                return '#7B9984';
            }   
            else if (d.Position == 'Other') {
                return '#7B9984';
            }
    }
    return default_color;
}

function filter_data(data) {
        var filtered;
        if (active_step == 'step0' || active_step == 'step1' || active_step == 'step6') {
            filtered = data;
        }
        else if (active_step == 'step2') {
            filtered = _.filter(data, function(d) {
               //var flag = 0;
               //cut out dismissed
                if (d.Type == 'Convicted') {
                    return Boolean(true);
                }
                else {
                    return Boolean(false);
                }
            });
        }
        else if (active_step == 'step3') {
            //cut down not fined
            filtered = _.filter(data, function(d) {
               //var flag = 0;
                if (d.Type == 'Convicted' && d.Disposition != 'Fine') {
                    return Boolean(true);
                }
                else {
                    return Boolean(false);
                }
            });
        }
        else if (active_step == 'step4') {
            //cut down to not discharged
            filtered = _.filter(data, function(d) {
               //var flag = 0;
               //cut out 
                if (d.Position == 'Jail' || d.Position == 'Prison' || d.Position == 'Probation' || d.Position == 'SentencePending') {
                    return Boolean(true);
                }
                else {
                    return Boolean(false);
                }
            });
        }
        else if (active_step == 'step5') {
            //Not probated or pending
            filtered = _.filter(data, function(d) {
               //var flag = 0;
                if (d.Position == 'Jail' || d.Position == 'Prison') {
                    return Boolean(true);
                }
                else {
                    return Boolean(false);
                }
            });
        }
        else if (active_step == 'step6') {
            //Not probated
            filtered = _.filter(data, function(d) {
               //var flag = 0;
                if (d.Position == 'Jail' || d.Position == 'Prison') {
                    return Boolean(true);
                }
                else {
                    return Boolean(false);
                }
            });
        }
        return filtered;
}
var data;
var capture;
var center; 

        
function draw_chart(step) {

        var i = 0;
        data = [];
        data = filter_data(dataset);
        var foci = make_focii(data, step);
        circle = svg.selectAll('.dot')
            .data(data, function(d) {return d.id;});
        function tick(e) 
        {

            var k = .2 * e.alpha; 
            data.forEach(function(d) {
                var center = foci.All; 
                capture = d;
                d.y += (center.y - d.y) * k;
                d.x += (center.x - d.x) * k;
            });
            circle
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; });
        }
        data.forEach(function(d) {
             d.cx = -5;
             d.cy = -5;
        });

        force = d3.layout.force()
            .nodes(data)
            .charge(-6) // repel
            .gravity(0)
            .size([width, height])
            .on('tick', tick);

        if (container_width < mobile_threshold) {
            force
                .charge(-3);

        }

        if (!is_chrome) {
            force
                //.chargeDistance(50)
                //.charge(-10)
                .theta(1);
        }
        force.start();
        

        circle.enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', radius)
            .style('fill', fill)
            
            .attr('cx', -10)
            .attr('cy', -10);
        // update. Transition the color change.
        circle
            
            .transition()
                .delay(100)
                .duration(1000)
                .style('fill', fill);

        // exit
    
        circle.exit()
            //first choice: explode!!!        
            .transition()
                .duration(2000)
                .ease(easing)
                //.style("opacity", .5)
                .attr('cx', function(d){
                    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                    return d.cx + (Math.random()*width * plusOrMinus*100);
                })
                .attr('cy', function(d){
                    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                    return d.cy + (Math.random()* height * plusOrMinus*100);  
                })
                //wrapup, remove the nodes. Byebye
            .remove();
    }




function switchStep(newStep)
{
  d3.selectAll(".step-link").classed("active", false);
  d3.select("#" + newStep).classed("active", true);
}
function switchAnnotation(newStep)
{
    d3.selectAll(".annotation-step")
        .style("display", "none")
        .style("opacity", 0.0);

    d3.select("#" + newStep + "-annotation")
        .style("display", "block")
        .transition().delay(100).duration(300)
          .style("opacity", 1);
}

d3.select('#next')
    .on('click', function(e) {
        force.stop();
        //this should just iterate through an array
        if (active_step == 'step0') {
            $('#previous').show()
            $("#next").show()
            $('#startOver').hide()
            active_step = 'step1';
        }
        else if (active_step == 'step1') {

            active_step = 'step2';
        }
        else if (active_step == 'step2') {
            active_step = 'step3';
        }
        else if (active_step == 'step3') {
            active_step = 'step4';
        }
        else if (active_step == 'step4') {
            active_step = 'step5';
        }
        else if (active_step == 'step5') {
            active_step = 'step6';
            enterLabels();
            $('#previous').hide()
            $("#next").hide()
            $('#startOver').show()
            // d3.select('#labels')
            //     .style('display', 'inline-block')
            //     .style('width', '40%')
            // d3.select('#chart')
            //     .style('display', 'inline-block')
            //     .style('width', '40%')
            // container_width = chart.width();
            // width = container_width - margin.left - margin.right;
            // svg
            //   .attr('width', width)
            //   .attr('height', height);
            
            labels_entered = true;            
        }
        draw_chart(active_step);
        switchStep(active_step);
        switchAnnotation(active_step);

    });
d3.select('#startOver')
    .on('click', function(e) {
        active_step = 'step0';

            $('#previous').toggle()
            $("#next").toggle()
            $('#startOver').toggle()


        draw_chart(active_step);
        switchStep(active_step);
        switchAnnotation(active_step);
    })
d3.select('#previous')
    .on('click', function(e) {
        
        force.stop();
        //this should just iterate through an array
        if (active_step == 'step1') {
            $('#previous').hide();
            active_step = 'step0';
        }
        else if (active_step == 'step2') {
            active_step = 'step1';
        }
        else if (active_step == 'step3') {
            active_step = 'step2';
        }
        else if (active_step == 'step4') {
            active_step = 'step3';
        }
        else if (active_step == 'step5') {
            active_step = 'step4';
        }
        else if (active_step == 'step6') {
            $("#labels").hide()

                
            active_step = 'step5';
        }
     //   else if (active_step == 'step6') {
       //     active_step = 'step0';
        //}        
        draw_chart(active_step);
        switchStep(active_step);
        switchAnnotation(active_step);

    });    
if (active_step == 'step0') {
    
}
else {
    
}
switchAnnotation(active_step);
draw_chart(active_step);

//
// EVENT LISTENERS
//

$(window).on("resize", function() {
    var chart = $('#chart');
    container_width = chart.width();
    width = container_width - margin.left - margin.right;
    draw_chart(active_step);
});