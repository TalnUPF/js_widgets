function paintChart(data, output, options)
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

var taln = taln || {};
taln.widgets = taln.widgets || {};
taln.widgets.chart = {
	
	loadRadar: function(result, output){
	
		paintChart(result, output, radarChartOptions);
	}
	
};
