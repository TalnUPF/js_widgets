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
