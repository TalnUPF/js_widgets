var taln = taln || {};
taln.widgets = taln.widgets || {};
taln.widgets.intensity = {
	
	loadIntensity: function(result, output){
		var words = result['data'];
		
		$("#" + output).html($.map(words, function(w) {
        	return '<span title="' + w.attention + '" style="font-weight:bold; background-color:rgba(0, 0, 255, ' + (w.attention * 0.7) + ')">' + w.word + ' </span>'
        }))
	
	}
	
};
