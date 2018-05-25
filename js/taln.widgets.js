var sig;
var selectedNode = null;
var filter;

function adjustInstance(s) {
	sig = s;
	
	filter = new sigma.plugins.filter(s);
	
	s.bind('clickNode', nodeClickHandler);
	s.bind('clickStage', function(){
		if (selectedNode !== null) {
			filter
				.undo()
				.apply();
			deselectNode(selectedNode);
		}
	});
    applyForces(s);
    s.refresh();
}

function applyForces(s) {
    s.startForceAtlas2({
        worker : true,
        barnesHutOptimize : false,
        edgeWeightInfluence : 1,
        slowDown : 62,
        adjustSizes : false,
        gravity : 1,
        linLogMode: false
    });
}

function selectNode(node){
	selectedNode = node;
}

function deselectNode(node){
	selectedNode = null;
}

function nodeClickHandler(event) {
    var node = event.data.node;
    if (selectedNode === null) {
    	filter
			.neighborsOf(node.id, 'neighbors')
			.apply();
    	
    	selectNode(node);
    } else if (selectedNode === node) {
    	filter
    		.undo()
			.apply();
   
    	deselectNode(node);
    } else {
		filter
			.undo('neighbors')
			.neighborsOf(node.id, 'neighbors')
			.apply();
    	
    	selectNode(node);
    }
}

function paintGraph(data, output, options)
{	
	var graphsData = [];
	//For each model
	$.each(data, function(i, value)
	{
		//console.log(value["modelName"]);
		//console.log(value["labels"]);
		
		graphsData[value["modelName"]] = [];
		
		//For each graph
		$.each(value["graphs"], function(k, graph)
		{
			graphsData[value["modelName"]][graph["name"]] = [];
				
			//For each class
			$.each(value["labels"], function(j, label)
			{
				var graphData = {name:label, features:[]};
				//For each axis
				$.each(graph["axes"], function(l, feature)
				{
					graphData.features.push({axis:feature,value:value[label][feature]});
				});
				graphsData[value["modelName"]][graph["name"]].push(graphData);
			
			});
		});
		
	});
	RadarChart("#" + output, graphsData["revistasTrainBalanced.arff"]["Dependency Features"], options);
	
};

var taln = {};
taln.widgets = {

    submitForm: function(type, url, input, successCallback, output, loadingCallback, endLoadingCallback) {
    	typeof loadingCallback === 'function' && loadingCallback();
		var jqxhr = $.ajax({
				type: type,
				dataType: "json",
				url: url,
				data: {
					"text": input
				}
			})
			.done(function(result) {
				successCallback(result, output);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				var msg = '';
				if (jqXHR.status === 0) {
				    msg = 'Not connect.\n Verify Network.';
				} else if (jqXHR.status == 404) {
				    msg = 'Requested page not found. [404]';
				} else if (jqXHR.status == 500) {
				    msg = 'Internal Server Error [500].';
				} else if (textStatus === 'parsererror') {
				    msg = 'Requested JSON parse failed.';
				} else if (textStatus === 'timeout') {
				    msg = 'Time out error.';
				} else if (textStatus === 'abort') {
				    msg = 'Ajax request aborted.';
				} else {
				    msg = 'Uncaught Error.\n' + jqXHR.responseText;
				}
				alert(msg);
			})
			.always(function(data) {
				typeof endLoadingCallback === 'function' && endLoadingCallback();
			});
    },

    loadBrat: function(result, output){
    	var webFontURLs = [
			'./external/Astloch-Bold.ttf',
			'./external/PT_Sans-Caption-Web-Regular.ttf',
			'./external/Liberation_Sans-Regular.ttf'
		];
    
		Util.embed(
			// id of the div element where brat should embed the visualizations
			output,
			// object containing collection data
			result['data']['collectionData'],
			// object containing document data
			result['data']['documentData'],
			// Array containing locations of the visualization fonts
			webFontURLs
		);
	},
	
	loadGraph: function(result, output){
		if (result['data'] === "") {
			$("#"+output).html("Error: UnsupportedEncodingException");
		} else {
		
			var parser = new DOMParser()
			var graphDom = parser.parseFromString(result['data'], "application/xml");
	
			sigma.parsers.gexf(graphDom,
				{
				renderers: [
				    {
				        container : output,
				        type: 'canvas'
				    }
				],
				settings : {
				    drawEdges : true,
				    //minNodeSize: 1,
				    //maxNodeSize: 30,
				    drawLabels: true,
				    borderSize: 1,
				    //minEdgeSize: 0.1,
				    //maxEdgeSize: 10,
				    //defaultEdgeType: "curvedArrow",
		
				    nodesPowRatio: 1,
				    edgesPowRatio: 0.3,
		
				    //borderSize: 10,
				    defaultNodeBorderColor: "#fff",
				    defaultNodeColor:"#f00",
				    edgeColor: "source",//"default",
				    defaultEdgeColor:"#555",
				    
				    //labelThreshold: 10,
		
				    //labelSize: 'proportional',
				    //labelSizeRatio: 0.7,
				    //defaultLabelSize: 16,
				    
				    drawEdgeLabels: true,
				    //edgeLabelSize: 'proportional',
		
				    defaultLabelColor: "#333",
		
				    defaultLabelHoverColor: "#000",
				    labelHoverColor:"#c00",
				    labelHoverBGColor: "default",
				    defaultHoverLabelBGColor: "#fcc",
		
				    fontStyle: "bold",
				    hoverFontStyle: "bold",
				    activeFontStyle: "bold",
				    
				    labelThreshold: 4,
				        
				    enableEdgeHovering: true,
				    }
				}, adjustInstance);
		}
	},
	
	loadIntensity: function(result, output){
		var words = result['data'];
		
		$("#" + output).html($.map(words, function(w) {
        	return '<span title="' + w.attention + '" style="font-weight:bold; background-color:rgba(0, 0, 255, ' + (w.attention * 0.7) + ')">' + w.word + ' </span>'
        }))
	
	},
	
	loadRadar: function(result, output){
	
		paintGraph(result, output, radarChartOptions);
	}
	
};

