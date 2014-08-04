function marijuana_chart() {
    var mobile_threshold = 450,
        margin = { top: 20, right: 20, bottom: 20, left: 20 },
        chart = $('#chart_wrapper'),
        container_width = chart.width(),
        graphic_aspect_width = 16,
        graphic_aspect_height = 7,
        circle, force, labels, keys,
        columns = 3,
        height = 350,
        dot_to_person_ratio = 3,
        radius = 5,
        easing = 'exp',
        ratio_weight = 1;

    dot_to_person_ratio = dot_to_person_ratio * ratio_weight;

    var dataset = [];
    var stats = [
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
    
    var canvas = d3.select('#chart').append('canvas')
        .attr('width', width)
        .attr('height', height);
    var force = d3.layout.force()
        .size([width, height]);
    function buildChart() {

        force
            .nodes(data)
    }