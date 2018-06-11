function profilinigToChart(base, result)
{
	var chartsData = {};
	//For each model
	$.each(base, function(modelNum, value)
	{
		
		chartsData[value["modelName"]] = {};
		
		//For each graph
		$.each(value["graphs"], function(k, graph)
		{
			chartsData[value["modelName"]][graph["name"]] = {name:graph["name"], classes:[]};
				
			//For each class
			$.each(value["labels"], function(j, label)
			{
				var graphData = {name:label, features:[]};
				//For each axis
				$.each(graph["axes"], function(l, feature)
				{
					graphData.features.push({axis:feature,value:value[label][feature]});
				});
				chartsData[value["modelName"]][graph["name"]].classes.push(graphData);
			
			});
			
			var resultData = result["features"];
			var predictionsData = result["Predictions"];
			var modelPrecition;
			for (var i = 0; i < predictionsData.length; i++) {
				var prediction = predictionsData[i];
				if(prediction.modelName == value["modelName"]) {
					modelPrecition = prediction.prediction;
					break;
				}
			}
			
			var graphData = {name:"Prediction: " + modelPrecition, features:[]};
			//For each axis
			$.each(graph["axes"], function(l, feature)
			{
				if (resultData[feature] != null) {
					graphData.features.push({axis:feature,value:resultData[feature].value});
				} else {
					graphData.features.push({axis:feature,value:0});
				}
			});
			chartsData[value["modelName"]][graph["name"]].classes.push(graphData);
		});
		
	});
	
	return chartsData;
};

function paintCharts(chartsData, output, options)
{	
	var chartNum = 1;
	//For each model
	Object.keys(chartsData).forEach(function (modelKey, modelNum) 
	{
		var model = chartsData[modelKey];
		$("#" + output).append(	"<div class='card'>" +
		 							"<div class='card-header' id='heading" + modelNum + "'>" + 
		 								"<button class='btn btn-link collapsed' type='button' data-toggle='collapse' data-target='#collapse" + modelNum + "' aria-expanded='false' aria-controls='collapse" + modelNum + "'>" + modelKey + "</button>" +
		 							"</div>" +
		 							"<div id='collapse" + modelNum + "' class='collapse' aria-labelledby='heading" + modelNum + "' data-parent='#" + output + "'>" + 
										"<div id='" + output + "Model" + modelNum + "'></div>" +
									"</div>" +
								"</div>");
		
		//For each graph
		Object.keys(model).forEach(function (graphKey, graphNum) 
		{
			var graph = model[graphKey];
			$("#" + output + "Model" + modelNum).append("<div id='" + output + chartNum + "' style='display: inline-block;'></div>");
			taln.widgets.chart.loadRadar(graph, output + chartNum, options);
			
			
			chartNum++;
		});
		
		chartNum++;
	});
	
	
};

var taln = taln || {};
taln.widgets = taln.widgets || {};
taln.widgets.chart = {
	
	loadRadar: function(chartData, output, options){
		RadarChart(output, chartData, options);
	}
	
};
