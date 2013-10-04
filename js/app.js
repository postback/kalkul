//document.ready at the bottom of this file starts it all up
var app = {
	count : 30,//The number of exercises generated, default
	table : [],
	container : null,
	columns : 3,
	upto : 10,
	init : function(){
		this.prepare();

		$('#generate').click(function(){
			app.count = $('#count').val();
			app.container.empty();
			
			//Columns
			app.columns = app.shouldBeBetweenOneAndTen($('#columns').val(),3);
			$('#columns').val(app.columns);

			app.upto = app.shouldBeBetweenOneAndTen($('#upto').val(),10);
			$('#upto').val(app.upto);

			var selection = app.generate();
			app.render(selection);
		});

		$('#print').click(function(){
			window.print();
		});

		$('#solutions').click(function(e){
			$('.solution').toggle();

			var button = $(e.currentTarget);
			if(button.val() == 'Show solutions'){
				button.val('Hide solutions');
			}else{
				button.val('Show solutions');
			}
		});
	},
	prepare : function(){
		var left = 1;
		var right = 1;
		var end = 10;
		var index = 0;

		while(left <= end){
			while(right <= end){
				this.table[index] = {solution : left * right, left : left, right : right};
				right++;
				index++;
			}
			left++;
			right = 1;//reset
		}

		this.container = $('#container');
	},
	generate : function(){
		var clone = this.table.slice(0);

		if(app.upto < 10){
			for (var i = clone.length-1; i >= 0; i--) {
				if(clone[i].left > app.upto){
					app.removeItem(clone,clone[i]);
				}
			}
		}

		var selection = [];
		for (var i = 0, index; i < app.count; ++i) {
			if(clone.length <= 0){
				break;//No more candidates left
			}
			index = Math.floor(Math.random() * clone.length);
			selection.push(clone[index]);
			app.removeItem(clone,clone[index]);
		}
		return selection;
	},
	render : function(selection){		
		//Suboptimal, needs better solution for mixing methods
		var selectedTypes = '';
		if($('#division').is(':checked')){
			selectedTypes = 'division';
		}
		
		if($('#multiplication').is(':checked')){
			if(selectedTypes == 'division'){
				selectedTypes = 'both';
			}else{
				selectedTypes = 'multiplication';
			}
		}

		var output = '';
		var showAs = (selectedTypes == 'division' ? 'division' : 'multiplication');

		for(var i in selection){
			var item = selection[i];
			output += '<div';
			output += ' class="columns-' + app.columns + '"';
			output += ' data-solution="';
			if(showAs == 'division'){
				output += item.left + '">';
				output += item.solution + ' : ' + item.right + ' = ' + '<span style="display:none;" class="solution">' + item.left + '</span>';
			}else{
				output += item.solution + '">';
				output += item.left + ' x ' + item.right + ' = ' + '<span style="display:none;" class="solution">' + item.solution + '</span>';
			}
			output += '</div>';

			if(selectedTypes == 'both' && showAs == 'multiplication'){
				showAs = 'division';
			}else if(selectedTypes == 'both' && showAs == 'division'){
				showAs = 'multiplication';
			}
		}

		$(output).appendTo(this.container);
	},
	shouldBeBetweenOneAndTen : function(value,defaultValue){
		if(isNaN(value) || value < 0 || value > 10){
			value = defaultValue;
		}
		return value;
	},
	removeItem : function(array, item){
		for(var i in array){
			if(array[i]==item){
				array.splice(i,1);
				break;
			}
		}
	}
}

$(document).ready(function(){
	app.init();
});