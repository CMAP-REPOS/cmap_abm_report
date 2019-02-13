// OBSERVE TAB CHANGE
jQuery(".nav-tabs a").on("shown.bs.tab", function () {
    var data = jQuery(this).data();
    if (data.chart !== undefined) {
        chart.validateSize();
    }
});

var myConfig = {
    "type":"chord",
    "options":{
        "radius":"90%"
    },
    "plotarea": {
      "margin": "dynamic"
    },
    "series":[
        {
            "values":[6637,5700,4789,2771],
            "text":"A"
        },
        {
            "values":[7737,2691,2202,7006],
            "text":"B"
        },
        {
            "values":[8574,9898,4084,1765],
            "text":"C"
        },
        {
            "values":[5309,1602,8395,2908],
            "text":"D"
        }
    ]
};
 
zingchart.render({ 
	id : 'myChart', 
	data : myConfig, 
});