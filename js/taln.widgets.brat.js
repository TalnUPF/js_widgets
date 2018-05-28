var taln = {};
var taln.widgets = {};
taln.widgets.brat = {

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
	}
	
};

