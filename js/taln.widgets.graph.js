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

var taln = {};
taln.widgets = {};
taln.widgets.graph = {
	
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
	}
	
};
