/*jslint browser: true, sloppy: true, white: true */
// jquery's not on the page, so we're going to load this last...
var id = 'chart_wrapper';
var element = document.getElementById(id);
var color = d3.scale.category10();
var mobile_threshold = 500;

var margin = { top: 10, right: 10, bottom: 10, left: 10 };
var id = 'chart_wrapper';

var chart = $('#chart');
var container_width = chart.width();

var container_height = element.offsetWidth; //wat. no.
var graphic_aspect_width = 16;
var graphic_aspect_height = 7;
var circle, force, labels, keys;
var columns = 3;
var height = 350;
var dot_to_person_ratio = 3;
var radius = 5;
if (container_width < mobile_threshold) {
    graphic_aspect_width = 7;
    graphic_aspect_height = 16;
    columns = 1;
    height = 250;
    margin = { top: 10, right: 10, bottom: 10, left: 10 };
    dot_to_person_ratio = 6;
    radius = 3;
}
d3.select('#legend-row')
    .html("<p><span class='legend'>●</span> " + dot_to_person_ratio + " people</p>");
var width = container_width - margin.left - margin.right;

//we need an 'on resize function.' Got any good listeners?

var svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);

var dataset= [];
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
//{"Disposition":"Covered by Anotehr Case","Count":176,"Type":"Other", 'Position': 'Other'},
{"Disposition":"Conditional Dismissal","Count":1409,"Type":"Dismissed", 'Position': 'Dismissed'},
{"Disposition":"Unconditional Dismissal","Count":113,"Type":"Dismissed", 'Position': 'Dismissed'}];
// {"Disposition":"Other","Count":25,"Type":"Other", 'Position': 'Other'},

var labels;
var labels_entered = false;
var format = d3.format(",");
function fade(label) {   
    circle
        .transition()    
            .style("opacity", function(d) {
                if (d.Disposition == label) {
                    return 1; 
                } 
                else {
                    return .1;
                }
            })
}
function enterLabels() {
//     template_html = $("#labelTemplate").html();
//     template = _.template(template_html);
//     $container = $("#container");
//     ;
//     var table_header = '';
//     $container.append(table_header);
//     _(stats).each(function(element, index, list) {
//         $container.append(template(element));
//     $container.append('</tbody></table>');
    
//   });
// }
    stats = _.sortBy(stats, function(num) { return -num.Count })
    
    if (!labels_entered) {
    labels = d3.select("#labels").select('tbody').selectAll("tr")
        .data(stats);
      labels.enter().append("tr")
        .on('mouseover', function(d) {
            d3.selectAll('tr').classed('active', false);
            d3.select(this).classed('active', true);
            fade(d.Disposition);
         })
        .on('mouseout', function(d){
            d3.selectAll('tr').classed('active', false);
            circle
                .transition()
                .style('opacity', 1);
        })
        .html(function(d) { return ("<td><span class='" +d.Position+ "'>●</span></td><td>" + format(d.Count) + "</td><td>" + d.Disposition + "</td>") })
        .style("opacity", 1e-6)
          .transition()
          .duration(1000)
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
                    fade(d.Disposition);
                }
                flipper = !flipper;
                console.log(flipper)
            })
        }
        
 }};


function make_data() {
    // random times
    var i = 0;
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
    var column_counter = 1;
    var row_counter = 1;
    var foci_keys = _.pluck(data, 'Position');
    //this does the fu
    foci_keys = _.uniq(foci_keys, true);
    var number_of_foci_needed = foci_keys.length;
    // console.log('foci_keys');
    // console.log(foci_keys);
    var number_of_rows_needed = Math.ceil(number_of_foci_needed / columns);
    // console.log('Number of rows:');
    // console.log(number_of_rows_needed);
    var column_width = width / columns;
    var row_height = height / number_of_rows_needed;
    var foci = {};
    // if (step == 'step2') {
    //     foci.Convicted = {x: (width / 6) * 1, y: (height / 2) * 1};
    //     foci.Dismissed = {x: (width / 6) * 5, y: ((height / 2) * 1)};
    // }
    // else {
    foci.All = {x: width / 2, y: height / 2};
    // }
    // console.log('These are the foci:');
    // console.log(foci);
    return foci;
}

var active_step = 'step0';
function fill(d) {
    var default_color = '#1b7837';
    if (active_step == 'step0') {
        return default_color;
    }
    if (active_step == 'step1') {
        if (d.Type == 'Convicted') {
            return '#762a83';
            }
        else if (d.Type == 'Other') {
            return '#f7f7f7';
            }
        else return default_color;
        }
    else {
            if (d.Position == 'Prison') {
                return '#762a83';
            }
            else if (d.Position == 'Jail')
                {
                return '#9970ab';
            }
            else if (d.Position == 'Probation') {
                return '#c2a5cf'
            }
            else if (d.Position == 'Fine') {
                return '#e7d4e8';
            }
            else if (d.Position == 'Discharged') {
                return '#a6dba0';
            }
            else if (d.Position == 'SentencePending') {
                return '#d9f0d3';
            }   
            else if (d.Position == 'Other') {
                return '#f7f7f7';
            }
    }
    // return color(d.Disposition);
    return default_color;
}
// Nonetheless, there's 
// Somewhere along the way. 
// There's some refining. 
// Make it as BOb?
// what about showing a flow on a day-by-day basis
//Try the day thing. Feed in a day, a month, a year...
//Tell Bob's story. If we knew about it
// the only reason previous loophole. Have them enter. Fall from one

function build_narrative(active_step, data) {
    var narrative = d3.select('#narrative');
    // narrative.enter(
    //     )
    // .text(
    //     function (d) { 
    //         return//
    //     }
    //     )

}

//step1: all
//step2: all but separated
//step3: Convicted
//step4: convic
function filter_data(data) {
        var filtered;
        if (active_step == 'step0' || active_step == 'step1' || active_step == 'step6') {
            filtered = data;
        }

        // else if (active_step == 'step2') {
        //     //reject 'other'
        //     filtered = _.reject(data, function(d) {
        //     //var flag = 0;
        //     if (d.Type == 'Other') {
        //         return Boolean(true);
        //     }
        //     else {
        //         return Boolean(false);
        //         }
        //     });
        // }
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
        //console.log(raw);
        data = [];
        data = filter_data(dataset);


        //var uniques = _.uniq(data);
        //uniques won't work because we gave it all fucking indices fuck. 
        //sort by count so we have the largest first.
        //uniques = _.sortBy(uniques, function(num) { return num.Count});

        var foci = make_focii(data, step);
        circle = svg.selectAll('.dot')
            .data(data, function(d) {return d.id;});
        function tick(e) 
        {
            //we need a way to keep this from falling too low.
            //if (e.alpha 
            // if (step == 'step3' || step == 'step4'){
            //     var k = 5 * e.alpha;
            // }
            // else {
            var k = .2 * e.alpha; 
            data.forEach(function(d) {
                var center = foci.All; //= {x: width / 2, y: height/2};
                    // //if (step != 'step2') {
                    //     center = foci.All;
                    // //}
                    // //else {
                    //     if (d.Type == 'Dismissed') {
                    //         center = foci.Dismissed;
                    //     }
                    //     else {
                    //         center = foci.Convicted;
                    //     }
                    // }
                capture = d;
                // d.y += (center.y - d.y) * k;
                // d.x += (center.x - d.x) * k;
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

        // var tip = d3.tip()
        //   .attr('class', 'd3-tip')
        //   .offset([-10, 0])
        //   .html(function(d) {
        //     return "<span style='color:#fff'>" + d.Disposition + "</span><strong>" + d.Count +"</strong> people";
        //   });

        force = d3.layout.force()
            .nodes(data)
            .charge(-6) // repel
            .gravity(0)
            .size([width, height])
            .on('tick', tick);

        if (container_width < mobile_threshold) {
            force.charge(-3);
        }
        force.start();
        
        circle.enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', radius)
            .style('fill', fill)
            .style("opacity", 1)
            .attr('cx', -10)
            .attr('cy', -10);
        // update. Transition the color change.
        circle
            .style("opacity", 1)
            .transition()
                .delay(100)
                .duration(1000)
                .style('fill', fill);

        // exit
    
        circle.exit()
            //first choice: explode!!!        
            .transition()
                .duration(2000)
                .ease('exp')
                //.style("opacity", .5)
                .attr('cx', function(d){
                    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                    return d.cx + (Math.random()*width * plusOrMinus*100);
                })
                .attr('cy', function(d){
                    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                    return d.cy + (Math.random()* height * plusOrMinus*100);  
                })
            //just fall!
            // .transition()
            //     //.delay(100)
            //     .duration(2000)
            //     .ease('quad')
            // //     .attr('cx', function(d) {
            // //         //if it's t
            // //         var distance_from_center = d.cx - (width/2);

            // //         return (distance_from_center*width);
            // //     }) //don't change the x attribute and it just goes buhbye
            // // .transition()
            //     .attr('cy', height + 6000)



                //wrapup, remove the nodes. Byebye
            .remove();
        // if (step == 'step6') {
            
        // }
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
            $('.narrative').slideUp();
            enterLabels();
            $('#labels').slideDown()
            labels_entered = true;

            
        }
        else if (active_step == 'step6') {
            active_step = 'step0';

            $('#labels').slideUp();
            $('.narrative').slideDown();
            $('#previous').hide()
        }
        draw_chart(active_step);
        switchStep(active_step);
        switchAnnotation(active_step);

    });

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
            $('#labels').slideUp();
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
