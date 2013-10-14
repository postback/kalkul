//document.ready at the bottom of this file starts it all up
var app = {
	count : 30,//The number of exercises generated, default
	table : [],
	container : null,
	columns : 3,
	upto : 10,
	timetrial : false,
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
			app.renderAll(selection);
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

		$('#start').click(function(e){
			var selection = app.generate();
			app.timetrial(selection);
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
		var filtered = [];
		var tableof = $('#tableof').val();

		if($('#tableof').val() != 0){
			for (var i = this.table.length-1; i >= 0; i--) {
				var left = this.table[i].left.toString();
				if($.inArray(left,tableof) > -1){
					filtered.push(this.table[i]);
				}
			}
		}

		var selection = [];
		for (var i = 0, index; i < app.count; ++i) {
			if(filtered.length <= 0){
				break;//No more candidates left
			}
			index = Math.floor(Math.random() * filtered.length);
			selection.push(filtered[index]);
			app.removeItem(filtered,filtered[index]);
		}
		return selection;
	},
	renderAll : function(selection){
		var output = '';
		var showAs = (app.getSelectedTypes() == 'division' ? 'division' : 'multiplication');

		for(var i in selection){
			var item = selection[i];
			output += app.renderOneExercise(item);
		}

		$(output).appendTo(this.container);
	},
	renderOneExercise : function(exercise){
		output = '<div';
		output += ' class="col-md-' + (12/app.columns) + '"';
		output += ' data-solution="';
		if(showAs == 'division'){
			output += item.left + '">';
			output += item.solution + ' : ' + item.left + ' = ' + '<span style="display:none;" class="solution">' + item.right + '</span>';
		}else{
			output += item.solution + '">';
			output += item.right + ' x ' + item.left + ' = ' + '<span style="display:none;" class="solution">' + item.solution + '</span>';
		}
		output += '</div>';

		if(getSelectedTypes() == 'both' && showAs == 'multiplication'){
			  = 'division';
		}else if(getSelectedTypes() == 'both' && showAs == 'division'){
			showAs = 'multiplication';
		}

		return output;
	},
	getSelectedTypes : function(){
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

		return selectedTypes;
	},
	timetrial : function(selection){
		$('#settingsform').hide();
		$('header').hide();
		$('#clockpanel').show();

		//Set all clock buttons
		$('#stopclock').click(function(e){
			$('#settingsform').show();
			$('header').show();
			$('#clockpanel').hide();
			$('#pauseclock').hide();
			$('#restartclock').hide();

			app.timetrial = false;
		});

		$('#startclock').click(function(e){
			$('#pauseclock').show();
			$('#startclock').hide();
			$('#stopclock').hide();

			app.timetrial = true;
		});

		$('#pauseclock').click(function(e){
			$('#startclock').show();
			$('#pauseclock').hide();
			$('#stopclock').show();

			app.timetrial = false;
		});
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