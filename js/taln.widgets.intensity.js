function contrast(r, g, b) {
	return ((r*0.299 + g*0.587 + b*0.114) > 149) ? '#000000' : '#ffffff';
}

var taln = taln || {};
taln.widgets = taln.widgets || {};
taln.widgets.intensity = {

	randomIntensity: function(text, output){
		var words = text.split(/\s+/)
		$("#" + output).html($.map(words, function(w) {
			var intensity = Math.random().toFixed(2);
	    	return '<span title="' + intensity + '" style="font-weight:normal; color:black; background-color:rgba(0, 0, 255, ' + (intensity * 0.7) + ')">' + w + ' </span>'
	    }))
	},
	
	loadIntensity: function(result, output){
		var words = result['data'];
		
		$("#" + output).html($.map(words, function(w) {
        	return '<span title="' + w.attention + '" style="font-weight:normal; color:black; background-color:rgba(0, 0, 255, ' + (w.attention * 0.7) + ')">' + w.word + ' </span>'
        }))
	
	},
	
	loadIntensity2: function(data, output){
		
		var text = data.text;
		var spans = data.spans;
		
		var result = "";
		var lastSpan = 0;
		result  += $.map(spans, function(span) {
			if(span.start < lastSpan) return;
		
			var partialResult = "";
			var spanText = text.substring(span.start, span.end);
			if (span.start > lastSpan) {
				var missingText = text.substring(lastSpan, span.start);
				partialResult += missingText;
			
			}
			var r = g = 0;
			var	b = 255;
			var threshold = 0.70;
			if (span.relevance <= threshold){
				r = g = (1 - span.relevance / threshold) * 200;
			} else {
				b = (1 - (span.relevance-threshold) / (1-threshold)) * 155 + 100;
			}
			partialResult += '<span title="' + span.relevance + '" style="font-size:' + (span.relevance * 0.2 + 0.9) + 'em; font-weight:normal; color:' + contrast(r, g, b) + '; background-color:rgb(' + r + ', ' + g + ', ' + b + ')">' + spanText + '</span>';

			lastSpan = span.end;
	    	return partialResult;
    	}).join('')
    	if (lastSpan < text.length) {
    		result += text.substring(lastSpan, text.length);
    	}
        $("#" + output).html(result);
	
	}
	
};


