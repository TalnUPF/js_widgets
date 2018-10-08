function resultToTagCloud(result)
{
	var wordsData = [];	
	if (result != null) {
		$.each(result["all"], function(entityNum, entity)
		{
			var word = {word: entity.tag, weight:entity.weight};
			wordsData.push(word);
		});
	}
	return wordsData;
}

var taln = taln || {};
taln.widgets = taln.widgets || {};
taln.widgets.tagcloud = {

    loadTagCloud: function(data, target){
		target.jQWCloud({
		  //data
		  words: data,
		
		  // title
		  title: 'JQ WOrd Cloud',
		  // min/max font size
		  minFont: 10,
		  maxFont: 50,
		  // font offset
		  fontOffset: 8,
		  // shows the algorithm of creating the word cloud
		  showSpaceDIV: false,
		  // Enables the vertical alignment of words
		  verticalEnabled: true,
		  // color
		  cloud_color: null,
		  // font family
		  cloud_font_family: "Arial, Courier New",
		  // color of covering divs
		  spaceDIVColor: 'white',
		  // left padding of words
		  padding_left: null,
		  // classes with space to be applied on each word
		  word_common_classes: null,//"tagCloudWord",
		  word_mouseEnter :function(){
			$(this).css("text-decoration","underline");
		  },
		  word_mouseOut :function(){
			$(this).css("text-decoration","none");	
		  }
		});
	},
	
	loadTagCloud2: function(data, target){
		//<a href="#" rel='4'><span>C++</span></a>
	
		for(var i = 0; i < data.length; i++) {
			var entity = data[i];
			target.append('<a href="#" rel="' + entity.weight + '"><span>' + entity.word + '</span></a>');
		}
		
		$('#' + target[0].id + " a").tagcloud({
			size: {
			  start: 10,
			  end: 38,
			  unit: "px"
			},
			color: {
			  start: '#a0a050',
			  end: '#f04040'
			}
		});
	}
	
};

