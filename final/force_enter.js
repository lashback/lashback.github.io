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

if (container_width < mobile_threshold) {
    graphic_aspect_width = 7;
    graphic_aspect_height = 16;
    columns = 1;
    height = 250;
    margin = { top: 10, right: 10, bottom: 10, left: 10 };
    dot_to_person_ratio = 5;
}
d3.select('#legend-row')
    .html("<h4><span class='legend'>●</span> represents " + dot_to_person_ratio + " people</h4>");
var width = container_width - margin.left - margin.right;

//we need an 'on resize function.' Got any good listeners?

var svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);

var dataset = [];
var stats = 
[{"Disposition": "Convicted-Sentence Pending","Count": 25,"Type": "Convicted", 'Position':'Sentence Pending'},
{"Disposition":"Diverted and Dismissed","Count":5,"Type":"Dismissed", 'Position': 'Dismissed'},
//{"Disposition":"Covered by Another Case","Count":176,"Type":"Other", 'Position': 'Other'},
{"Disposition":"Dismissed-ACD","Count":1409,"Type":"Dismissed", 'Position': 'Dismissed'},
{"Disposition":"Dismissed-Not ACD","Count":113,"Type":"Dismissed", 'Position': 'Dismissed'},
//{"Disposition":"Other","Count":25,"Type":"Other", 'Position': 'Other'},
{"Disposition":"Prison","Count":7,"Type":"Convicted", 'Position': 'Prison'},
{"Disposition":"Jail","Count":79,"Type":"Convicted", 'Position': 'Jail'},
{"Disposition":"Time Served","Count":52,"Type":"Convicted", 'Position': 'Jail'},
{"Disposition":"Jail+Probation","Count":7,"Type":"Convicted", 'Position': 'Jail'},
{"Disposition":"Probation","Count":17,"Type":"Convicted", 'Position': 'Probation'},
{"Disposition":"Fine","Count":685,"Type":"Convicted", 'Position': 'Fine'},
{"Disposition":"Cond Discharge","Count":88,"Type":"Convicted", 'Position': 'Discharged'},
{"Disposition":"Uncond Discharge","Count":6,"Type":"Convicted", 'Position':'Discharged'}];

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
    var default_color = '#7AA25C';
    if (active_step == 'step0') {
        return default_color;
    }
    if (active_step == 'step1') {
        if (d.Type == 'Convicted') {
            return '#EE9586';
            }
        else if (d.Type == 'Other') {
            return '#AAAAAA';
            }
        else return default_color;
        }
    else {
            if (d.Position == 'Jail')
                {
                return '#D84B2A';
            }
            else if (d.Position == 'Prison') {
                return '#8B250D';
            }
            else if (d.Position == 'Fine') {
                return '#725A44';
            }
            else if (d.Position == 'Discharged') {
                return '#4C4758';
            }
            else if (d.Position == 'Sentence Pending') {
                return '#4C4758';
            }
            else if (d.Position == 'Probation') {
                return '#58668B'
            }
            else if (d.Position == 'Other') {
                return '#AAAAAA';
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
                if (d.Position == 'Jail' || d.Position == 'Prison' || d.Position == 'Probation' || d.Position == 'Sentence Pending') {
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
            .attr('r', 3)
            .style('fill', fill)
            .attr('cx', -10)
            .attr('cy', -10);
        // update. Transition the color change.
        circle
            .transition()
                .delay(400)
                .duration(1250)
                .style('fill', fill);

        // exit
        circle.exit()
            .transition()
                .delay(400)
                .duration(2000)
                .ease('quad')
                //.attr('cx', width / 2) //don't change the x attribute and it just goes buhbye
                .attr('cy', height + 300)
            .remove();
        if (step == 'step6') {
            var circle_selection;
            var tooltip;

            if (container_width >= mobile_threshold) {
            circle
                .on('mouseover', function(d) {
                    tooltip = d3.select('#tooltip');
                    circle_selection = circle.filter(function(e) {
                        if (e.Disposition === d.Disposition) {
                            return true; }
                        else {
                            return false;
                        }
                    });
                    circle_selection
                         .transition()
                             .duration(200)
                            .style('fill', function(d) { return d3.rgb(getComputedStyle(this, null).getPropertyValue("fill")).brighter();})
                            // .style('stroke-width', '2px')
                            // .style('stroke', '#333');
                    tooltip
                        .html(function() {
                            return '<h3>' + d.Disposition + ': <span>' + circle_selection[0].length + '</h3>';
                        })
                })
                .on('mouseout', function(d) {
                    circle_selection
                        .transition()
                            .duration(400)
                            .style('fill', fill)
                            //.style('stroke', '0px')
                });
            }
            else {
                circle
                    .on('click', function(d) {
                        tooltip.html('');

                        tooltip = d3.select('#tooltip');
                        circle_selection
                            .transition()
                                .duration(400)
                                .style('fill', fill);
                        circle_selection = circle.filter(function(e) {
                            if (e.Disposition === d.Disposition) {
                                return true; }
                            else {
                                return false;
                            }
                        });
                        circle_selection
                             .transition()
                                 .duration(200)
                                .style('fill', function(d) { return d3.rgb(getComputedStyle(this, null).getPropertyValue("fill")).brighter();})
                        tooltip
                            .html(function() {
                                return '<h3>' + d.Disposition + ': <span>' + circle_selection[0].length + '</h3>';
                            });
                })
            }

        }
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
        }
        else if (active_step == 'step6') {
            active_step = 'step0';
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
            active_step = 'step5';
        }
     //   else if (active_step == 'step6') {
       //     active_step = 'step0';
        //}        
        draw_chart(active_step);
        switchStep(active_step);
        switchAnnotation(active_step);

    });    

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
