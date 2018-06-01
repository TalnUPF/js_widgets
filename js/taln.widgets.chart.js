function paintChart(base, result, output, options)
{	
	var chartNum = 1;
	var graphsData = [];
	//For each model
	$.each(base, function(modelNum, value)
	{
		//console.log(value["modelName"]);
		//console.log(value["labels"]);
		
		graphsData[value["modelName"]] = [];
		
		$("#" + output).append(	"<div class='card'>" +
		 							"<div class='card-header' id='heading" + modelNum + "'>" + 
		 								"<button class='btn btn-link collapsed' type='button' data-toggle='collapse' data-target='#collapse" + modelNum + "' aria-expanded='false' aria-controls='collapse" + modelNum + "'>" + value["modelName"] + "</button>" +
		 							"</div>" +
		 							"<div id='collapse" + modelNum + "' class='collapse' aria-labelledby='heading" + modelNum + "' data-parent='#" + output + "'>" + 
										"<div id='" + output + "Model" + modelNum + "'></div>" +
									"</div>" +
								"</div>");
		
		//For each graph
		$.each(value["graphs"], function(k, graph)
		{
			graphsData[value["modelName"]][graph["name"]] = {name:graph["name"], classes:[]};
				
			//For each class
			$.each(value["labels"], function(j, label)
			{
				var graphData = {name:label, features:[]};
				//For each axis
				$.each(graph["axes"], function(l, feature)
				{
					graphData.features.push({axis:feature,value:value[label][feature]});
				});
				graphsData[value["modelName"]][graph["name"]].classes.push(graphData);
			
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
			graphsData[value["modelName"]][graph["name"]].classes.push(graphData);
			
			$("#" + output + "Model" + modelNum).append("<div id='" + output + chartNum + "' style='display: inline-block;'></div>");
			RadarChart(output + chartNum, graphsData[value["modelName"]][graph["name"]], options);
			
			chartNum++;
		});
		
		chartNum++;
	});
	
	
};

var taln = taln || {};
taln.widgets = taln.widgets || {};
taln.widgets.chart = {
	
	loadRadar: function(base, result, output, options){
	
		paintChart(base, result, output, radarChartOptions);
	}
	
};
