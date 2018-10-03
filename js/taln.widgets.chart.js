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

var chartsDataVar;
var optionsVar;

function paintCharts(chartsData, output, options)
{	
	chartsDataVar = chartsData;
	optionsVar = options;
	//For each model
	Object.keys(chartsData).forEach(function (modelKey, modelNum) 
	{
		var model = chartsData[modelKey];
		var headerId = "heading" + modelNum;
		var bodyId = "collapse" + modelNum;
		var modelId = output + "Model" + modelNum;
		$("#" + output).append(	"<div class='card'>" +
		 							"<div class='card-header' id='" + headerId + "'>" + 
		 								"<button class='btn btn-link collapsed' type='button' data-toggle='collapse' data-target='#" + bodyId + "' aria-expanded='false' aria-controls='" + bodyId + "'>" + modelKey + "</button>" +
		 							"</div>" +
		 							"<div id='" + bodyId + "' class='collapse' aria-labelledby='" + headerId + "' data-parent='#" + output + "'>" + 
										"<div id='" + modelId + "'></div>" +
									"</div>" +
								"</div>" +
								"<script>" + 
									"$('#" + bodyId + "').on('show.bs.collapse', function () {" +
										"paintChart('" + output + "', '" + modelNum + "', '" + modelKey + "');" +
									"});" +

									"$('#" + bodyId + "').on('hidden.bs.collapse', function () {" +
										"$('#" + modelId + "').empty();" +
									"});" +
								"</script>");
		
	});
	
	
};

function paintChart(output, modelNum, modelKey)
{	
	var model = chartsDataVar[modelKey];
	//For each graph
	var chartNum = 1;
	Object.keys(model).forEach(function (graphKey, graphNum) 
	{
		var graph = model[graphKey];
		$("#" + output + "Model" + modelNum).append("<div id='" + output + modelNum + chartNum + "' style='display: inline-block;'></div>");
		taln.widgets.chart.loadRadar(graph, output + modelNum + chartNum, optionsVar);
		
		chartNum++;
	});
}

var taln = taln || {};
taln.widgets = taln.widgets || {};
taln.widgets.chart = {
	
	loadRadar: function(chartData, output, options){
		RadarChart(output, chartData, options);
	}
	
};
