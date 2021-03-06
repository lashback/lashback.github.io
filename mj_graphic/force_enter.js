/*jslint browser: true, sloppy: true, white: true*/
// jquery's not on the page, so we're going to load this last...

function marijuana_chart(wrapper) {
    
    /********
     * Globals
     ********/
    
    var data, circle, force, labels, keys;
    var mobile_threshold = 450;
    var active_step = 'step0';
    
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var is_IE = navigator.userAgent.toLowerCase().indexOf('MSIE') > -1;
    
    // these are set in calculate_user_settings
    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
        container,
        container_width,
        width,
        height,
        dot_to_person_ratio,
        radius,
        easing,
        ratio_weight,
        charge,
        mobile_height_weight,
        graph_height;
    
    var svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height);
    
    /********
     * Variables to update on resize
     ********/
    
    function calculate_user_settings() {
        container = $(wrapper);
        container_width = container.width();
        width = container_width;

        mobile_height_weight = .9;
        dot_to_person_ratio = 4;
        radius = 5;
        easing = 'quad';
        ratio_weight = 1;
        charge = -5;
        
        svg.attr('width', width).attr('height', height);
        if (container_width < mobile_threshold) {
            radius = 2.5;
            charge = -1;
            graph_height = (height / 5) * 4;
            ratio_weight = 2;
            mobile_height_weight = 1;
        }
        dot_to_person_ratio = dot_to_person_ratio * ratio_weight;
        
        if (!is_chrome && !is_IE) {
            dot_to_person_ratio = 8;
        }

        height = $(window).height()*mobile_height_weight;
        graph_height = (height / 7) * 5;
        $(container).height(height);
    }
    calculate_user_settings();
    
    /********
     * Bring in the data
     ********/
    
    var dataset = [];
    var stats = [
        {
            "Disposition":"Prison",
            "Count":7,
            "Type":"Convicted",
            'Position': 'Jail and prison'
        },
        {
            "Disposition":"Jail",
            "Count":79,
            "Type":"Convicted",
            'Position': 'Jail and prison'
        },
        {
            "Disposition":"Jail and Probation",
            "Count":7,
            "Type":"Convicted",
            'Position': 'Jail and prison'
        },
        {
            "Disposition":"Time Served",
            "Count":52,
            "Type":"Convicted",
            'Position': 'Jail and prison'
        },
        {
            "Disposition":"Probation",
            "Count":17,
            "Type":"Convicted",
            'Position': 'Probation'
        },
        {
            "Disposition":"Fine",
            "Count":685,
            "Type":"Convicted",
            'Position': 'Fine'
        },
        {
            "Disposition":"Conditional Discharge",
            "Count":88,
            "Type":"Convicted",
            'Position': 'Discharged'
        },
        {
            "Disposition":"Unconditional Discharge",
            "Count":6,
            "Type":"Convicted",
            'Position':'Discharged'
        },
        {
            "Disposition": "Convicted-Sentence Pending",
            "Count": 25,
            "Type": "Convicted",
            'Position':'Sentence Pending'
        },
        {
            "Disposition":"Diverted and Dismissed",
            "Count":5,
            "Type":"Dismissed",
            'Position': 'Dismissed'
        },
        {
            "Disposition":"Covered by Another Case",
            "Count":176,
            "Type":"Other",
            'Position': 'Covered by<br> another case'
        },
        {
            "Disposition":"Conditional Dismissal",
            "Count":1409,
            "Type":"Dismissed",
            'Position': 'Dismissed'
        },
        {
            "Disposition":"Unconditional Dismissal",
            "Count":113,
            "Type":"Dismissed",
            'Position': 'Dismissed'
        },
        {
            "Disposition":"Other",
            "Count":25,
            "Type":"Convicted",
            'Position': 'Other'
        }
    ];

    var dismissals = [
        {"Percent":0.5317258883,"Year":2004},
        {"Percent":0.5299710624,"Year":2005},
        {"Percent":0.5015604102,"Year":2006},
        {"Percent":0.4935389746,"Year":2007},
        {"Percent":0.4807953005,"Year":2008},
        {"Percent":0.522131888,"Year":2009},
        {"Percent":0.5028985507,"Year":2010},
        {"Percent":0.4916488223,"Year":2011},
        {"Percent":0.5179467387,"Year":2012},
        {"Percent":0.5668151448,"Year":2013}
    ];

    var labels_entered = false;
    var format = d3.format(",");
    
    d3.select('#legend-row')
        .html("<p><span class='legend'>●</span> represents about " + dot_to_person_ratio + ' people</p>');

    
    function fade(label) {
        circle.transition()
            .style("opacity", function(d) {
                if (d.Position === label) { return 1; }
                else { return 0.1; }
            });
    }

    function highlight(label) {
        if (active_step !== 'step0' && active_step !== 'step1' && active_step !== 'step7') {
            var opposite = circle.filter(function(d) {
                var flag = true;
                label.forEach(function(key) {
                    if (d.Position === key) {
                       flag = false;
                    }
                });
                return !flag;
            });
            opposite
                .transition()
                    .delay(100)
                    .duration(1000)
                    .style('fill', '#0075c0');
        }
                
    } // /highlight
    
    function enterLabels() {
        var processed_stats = _(stats).groupBy('Position');
        var out = _(processed_stats).map(function(g, key) {
            return {
                Position: key,
                Count: _(g).reduce(function(m,x) {
                    return m + x.Count;
                }, 0)
            };
        });
        
        processed_stats = _.sortBy(out, function(num) { return -1*num.Count; });
        
        var first_half = processed_stats.slice(0,(processed_stats.length/2));
        var second_half = processed_stats.slice((processed_stats.length/2),
            processed_stats.length);
        
        function makeit(data, id) {
            labels = d3.select(id).select('tbody').selectAll('tr')
                .data(data);
            labels.enter().append('tr')
                .on('mouseover', function(d) {
                    circle
                        .transition()
                        .duration(100)
                        .style('opacity', 1);
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
                .html(function(d) { return "<td><span class='" +d.Position+ "'>●</span></td><td><strong>" + format(d.Count) + "</strong></td><td>" + d.Position + "</td>"; })
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
                    if (flipper === false) {
                        d3.select(this).classed('active', true);
                        fade(d.Position);
                    }
                    
                    flipper = !flipper;
                });
            }
        } // /makeit

        if (!labels_entered) {
            makeit(first_half, '#table1');
            makeit(second_half, '#table2');
        }
        else {
            $("#labels").show();
        }
    } // /enterLabels

    function make_data() {
        dataset = [];
        var i = 0;
        stats = _.sortBy(stats, function(d) { return d.Count; });
        _(stats).each(function(disp, key) {
            var count = Math.round((disp.Count) / dot_to_person_ratio);
            var j = 0;
            while (j++ < count) {
                var new_line = {id: i, 'Disposition': disp.Disposition, 'Type': disp.Type, 'Position': disp.Position};
                dataset.push(new_line);
                i++;
            }
        });
    }
    
    function make_focii(data, step) {
        var foci = {};
        foci.All = {x: width / 2, y: graph_height};
        return foci;
    }
    
    // helper function:
    // try to get key from dict. if key's not there, return els.
    function try_get(dict, key, els) {
        
        if(_(dict).has(key)) {
            return dict[key];
        }
        if(els) return els;
    }
    
    function fill(d) {
        var default_color = '#8bc34a';
        if (active_step == 'step0') {
            return default_color;
        }
        else if (active_step == 'step1') {
            colors = {
               'Convicted': '#68C3FF',
               'Other': '#AAA'
            };
            return try_get(colors, d.Type, default_color);
        }
        else if (active_step != 'step7') {
            colors = {
                'Convicted': '#68C3FF'
            };
            return try_get(colors, d.Type, default_color);
        }
        else {
            colors = {
                // 'Prison': '#024687',
                'Jail and prison': '#0065ae',
                'Probation': '#738ffe',
                'Fine': '#afbfff',
                'Discharged': '#d0d9ff',
                'Sentence Pending': '#68C3FF',
                'Other': '#AAA',
                'Covered by<br> another case': '#AAA',
                'Dismissed': '#8bc34a'
            };
            return try_get(colors, d.Position, colors.default);
        }
        return default_color;
    }

    function filter_data(data) {
        var filtered = data;
        step_filters = {
            'step2': ['Jail and prison', 'Probation', 'Other', 'Sentence Pending', 'Discharged', 'Fine'],
            'step3': ['Jail and prison', 'Probation', 'Other', 'Sentence Pending', 'Discharged'],
            'step4': ['Jail and prison', 'Probation', 'Other', 'Sentence Pending'],
            'step5': ['Jail and prison', 'Other', 'Sentence Pending'],
            'step6': ['Jail and prison']
        };
        
        if (_(step_filters).has(active_step)) {
            filtered = _.filter(data, function(d) {
                return _.contains(step_filters[active_step], d.Position);
            });
        }
        return filtered;
    }
    
    var data;
    
    make_data();
    
    function draw_chart(step) {
        svg
            .attr('width', width)
            .attr('height', height);
        
        //get the right data for this step
        data = filter_data(dataset);
        
        // this doesn't do much anymore because there's only one focus,
        // but it's useful for the future
        var foci = make_focii(data, step);
        
        // bind the data to circle
        circle = svg.selectAll('.dot')
            .data(data, function(d) {return d.id;});
        
        //clean up old values
        circle
            .style('filter', 'none');

        // store the center. this would be useful if we had multiple foci.
        center = foci.All;
        
        //magichappens here.
        function tick(e) {
            //k tells us the strength of the tick, basically.
            var k = 0.09 * e.alpha;
            
            circle
                .attr('cx', function(d) {
                    d.x += (center.x - d.x) * k;
                    return d.x;
                })
                .attr('cy', function(d) {
                    d.y += (center.y - d.y) * k;
                    return d.y;
                });
        }
        
        //initialize the force layout
        force = d3.layout.force()
            .nodes(data)
            .friction(0.93)
            .charge(charge) // repel
            .gravity(0)
            .size([width, height])
            .theta(1) // makes render less slow
            .on('tick', tick);
        force.start();
        
        // This freezes the dots half way through re-entering.
        // It looks sort of cool but probably is too browser-specific.
        
        // if (active_step === 'step7') {
        //     setTimeout(function() {
        //         force.stop();
        //     }, 100);
        // }
        
        //enter circles
        circle.enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', function(d) {
                var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                return (Math.random() * (width / 2) * plusOrMinus * 10);
            })
            .attr('cy', function(d) {
                var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                return (Math.random() * (height / 2) * plusOrMinus * 10);
            })
            .attr('opacity', 1)
            .attr('r', radius)
            .style('fill', fill);
        // update. Transition the color change.
        circle
            .attr('opacity', 1)
            .attr('r', radius)
            .transition()
                .duration(500)
                .style('fill', fill);
        // exit
        circle.exit()
            .transition()
                .duration(100)
                .attr('r', radius)
                .attr('opacity', 0.7)
                .attr('stroke', '0px')
            .transition()
                .duration(2000)
                .ease(easing)
                .attr('cx', function(d) {
                    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                    var new_val = d.x + plusOrMinus * (Math.random() * width);
                    var distance_from_center = (center.x - d.x)
                    d.x = distance_from_center < 0 ? (d.x += width * 0.01) : (d.x -= d.x * 0.01);
                    // d.x += (center.x - d.x) * .1;
                    //pick a corner
                    // d.x = Math.random() < 0.5 ? (width / 4) : (3 * width / 4);
                    // d.x = center.x + (plusOrMinus * (Math.random() * 30));
                    return new_val;
                })
                .attr('cy', function(d) {
                    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                    var distance_from_center = (center.y - d.y)
                    d.y = distance_from_center < 0 ? (d.y += height * 0.01) : (d.y -= height * 0.01);
                    // d.y = Math.random() < 0.5 ? (height / 4) : (3 * height / 4);
                    // d.y = center.y + (plusOrMinus * (Math.random() * 30));
                    return (Math.random() * height) - height;
                })
            .remove();
        
        var labels = {'step0': [],
        'step1': ['Jail', 'Prison', 'Probation', 'Sentence Pending', 'Discharged', 'Fine'],
        'step2': ['Fine'],
        'step3': ['Discharged'],
        'step4': ['Probation'],
        'step5': ['Sentence Pending', 'Other'],
        'step6': ['Jail and prison'],
        };
        
        highlight(labels[active_step]);

    } // draw_chart
    
    function switchStep(newStep) {
      d3.selectAll('.step-link').classed('active', false);
      d3.select('#' + newStep).classed('active', true);
    }
    
    function switchAnnotation(newStep) {
        d3.selectAll('.annotation-step')
            .style('display', 'none')
            .style('opacity', 0.0);

        d3.select('#' + newStep + '-annotation')
            .style('display', 'block')
            .transition().delay(100).duration(300)
                .style('opacity', 1);
    }
    
    if (active_step === 'step0') {
        $('#previous').hide();
    }
    d3.select('#next')
        .on('click', function(e) {
            force.stop();
            step_no = +active_step.charAt(4);
            active_step = 'step' + (++step_no);
            if (step_no === 1) {
                $('#previous').show();
            } else if (step_no === 7) {
                $('#next').hide();
                $('#startOver').show();
                
                enterLabels();
                
                labels_entered = true;
            }
            draw_chart(active_step);
            switchStep(active_step);
            switchAnnotation(active_step);
        });
    d3.select('#startOver')
        .on('click', function(e) {
            active_step = 'step0';
            $('#previous').hide();
            $('#next').toggle();
            $('#startOver').toggle();
            draw_chart(active_step);
            switchStep(active_step);
            switchAnnotation(active_step);
        });
    d3.select('#previous')
        .on('click', function(e) {
            force.stop();
            step_no = +active_step.charAt(4);
            active_step = 'step' + (--step_no);
            if (step_no === 0) {
                $('#previous').hide();
                
            }
            else if (step_no === 1) {
                $('#startOver').hide();
            } else if (step_no === 6) {
                $('#startOver').hide();
                $('#next').show();
            }
            draw_chart(active_step);
            switchStep(active_step);
            switchAnnotation(active_step);
        });
    
    switchAnnotation(active_step);
    draw_chart(active_step);

    /*****
     * EVENT LISTENERS
     *****/
    
    $(window).on('resize', function() {
        force.stop();
        calculate_user_settings();
        _.throttle(draw_chart(active_step), 100);
    });
}
