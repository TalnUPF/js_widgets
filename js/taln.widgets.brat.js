function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hslToRgb(h, s, l){
    var r, g, b;
	
	h = h/360;
	s = s/100;
	l = l/100; 
	
    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hslToHex(h, s, l){
	var rgb = hslToRgb(h, s, l);
	return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function conceptsToBrat(text, result, type)
{
    var max = 0;
    var min = 0;
    $.each(result, function(entityNum, entity)
	{
		if(entity.score > max) {
			max = entity.score;
		}
		/*if(entity.score < min) {
			min = entity.score;
		}*/
	});


    var createdEntityTypes = [];
    
    var output = { data: {documentData: {}, collectionData: {}} };
    
    var documentData = { text: text, entities: [], relations: []};
    var collectionData = {entity_types: []};
    $.each(result, function(entityNum, entity)
	{
		var entityData = [];
		entityData.push("E" + entityNum);
		entityData.push(entity.score);
		
		var offsets = [];
		var offset = [];
		offset.push(entity.begin);
		offset.push(entity.end);
		offsets.push(offset)
		
		entityData.push(offsets);
		documentData.entities.push(entityData);
		
		if(!createdEntityTypes.includes(entity.score)) {
			var factor = entity.score /max;
			
			entityType = {type: entity.score, labels: [entity.score], bgColor: hslToHex(166, 68, 100 - 50 * factor), borderColor: "darken"};
			collectionData.entity_types.push(entityType);
			createdEntityTypes.push(entity.score);
		}
	});
	
	output.data.documentData = documentData;
	output.data.collectionData = collectionData;
	
	return output;
}

function babelnetToBrat(text, result)
{
	/*"relation_types": [
        {
            "type": "Anaphora",
            "labels": [ "Anaphora", "Ana" ],
            "dashArray": "3,3",
            "color": "purple",
            "args": [
                {
                    "role": "From",
                    "targets": [ "Person" ]
                },
                {
                    "role": "To",
                    "targets": [ "Person" ]
                }
            ]
        }
    ],
    
    "relations": [
        [
            "R1",
            "Anaphora",
            [ [ "From", "T2" ], [ "To", "T1" ] ]
        ]
    ],*/
    
    var createdEntityTypes = [];
    
    var output = { data: {documentData: {}, collectionData: {}} };
    
    var documentData = { text: text, entities: [], relations: []};
    var collectionData = {entity_types: []};
    $.each(result["all"], function(entityNum, entity)
	{
		var entityData = [];
		entityData.push("E" + entityNum);
		entityData.push(entity.id);
		
		var offsets = [];
		var offset = [];
		offset.push(entity.begin);
		offset.push(entity.end);
		offsets.push(offset)
		
		entityData.push(offsets);
		documentData.entities.push(entityData);
		
		if(!createdEntityTypes.includes(entity.id)) {
			entityType = {type: entity.id, labels: [entity.id], bgColor: getRandomColor(), borderColor: "darken"};
			collectionData.entity_types.push(entityType);
			createdEntityTypes.push(entity.id);
		}
	});
	
	output.data.documentData = documentData;
	output.data.collectionData = collectionData;
	
	return output;
}

function nerToBrat(text, result)
{
    var createdEntityTypes = [];
    
    var output = { data: {documentData: {}, collectionData: {}} };
    
    var documentData = { text: text, entities: [], relations: []};
    var collectionData = {entity_types: []};
    $.each(result["all"], function(entityNum, entity)
	{
		var entityData = [];
		entityData.push("E" + entityNum);
		entityData.push(entity.type);
		
		var offsets = [];
		var offset = [];
		offset.push(entity.begin);
		offset.push(entity.end);
		offsets.push(offset)
		
		entityData.push(offsets);
		documentData.entities.push(entityData);
		
		if(!createdEntityTypes.includes(entity.type)) {
			entityType = {type: entity.type, labels: [entity.type], bgColor: getRandomColor(), borderColor: "darken"};
			collectionData.entity_types.push(entityType);
			createdEntityTypes.push(entity.type);
		}
	});
	
	output.data.documentData = documentData;
	output.data.collectionData = collectionData;
	
	return output;
}

function dbpediaToBrat(text, result)
{
    var createdEntityTypes = [];
    
    var output = { data: {documentData: {}, collectionData: {}} };
    
    var documentData = { text: text, entities: [], relations: []};
    var collectionData = {entity_types: []};
    $.each(result["all"], function(entityNum, entity)
	{
		var entityData = [];
		entityData.push("E" + entityNum);
		entityData.push(entity.uri);
		
		var offsets = [];
		var offset = [];
		offset.push(entity.begin);
		offset.push(entity.end);
		offsets.push(offset)
		
		entityData.push(offsets);
		documentData.entities.push(entityData);
		
		if(!createdEntityTypes.includes(entity.uri)) {
			var uriCore = entity.uri.substring(entity.uri.lastIndexOf("/") + 1, entity.uri.length);
		
			entityType = {type: entity.uri, labels: [uriCore], bgColor: getRandomColor(), borderColor: "darken"};
			collectionData.entity_types.push(entityType);
			createdEntityTypes.push(entity.uri);
		}
	});
	
	output.data.documentData = documentData;
	output.data.collectionData = collectionData;
	
	return output;
}

function radicalizationToBrat(text, result)
{
    var createdEntityTypes = [];
    
    var output = { data: {documentData: {}, collectionData: {}} };
    
    var documentData = { text: text, entities: [], relations: []};
    var collectionData = {entity_types: []};
    $.each(result, function(entityNum, entity)
	{
		var entityData = [];
		entityData.push("E" + entityNum);
		entityData.push(entity.wordCategory);
		
		var offsets = [];
		var offset = [];
		offset.push(entity.begin);
		offset.push(entity.end);
		offsets.push(offset)
		
		entityData.push(offsets);
		documentData.entities.push(entityData);
		
	});
	output.data.documentData = documentData;
	
	var warType = {type: "WAR_WORD", labels: ["War"], bgColor: "#444444", fgColor: "#ffffff", borderColor: "darken"};
	var enemyType = {type: "ENEMY_WORD", labels: ["Enemy"], bgColor: "#dc3912", borderColor: "darken"};
	var emotionType = {type: "EMOTION_WORD", labels: ["Emotion"], bgColor: "#0099c6", borderColor: "darken"};
	var religionType = {type: "RELIGIOUS_WORD", labels: ["Religious"], bgColor: "#109618", borderColor: "darken"};
	var victoryType = {type: "VICTORY_WORD", labels: ["Victory"], bgColor: "#ffff00", borderColor: "darken"};
	collectionData.entity_types.push(warType);
	collectionData.entity_types.push(enemyType);
	collectionData.entity_types.push(emotionType);
	collectionData.entity_types.push(religionType);
	collectionData.entity_types.push(victoryType);
	output.data.collectionData = collectionData;
	
	return output;
}

var taln = taln || {};
taln.widgets = taln.widgets || {};
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

