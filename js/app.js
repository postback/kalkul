//document.ready at the bottom of this file starts it all up
var app = {
	count : 30,//The number of exercises generated, default
	table : [],
	selection : [],
	container : null,
	columns : 3,
	upto : 10,
	timetrialIsRunning : false,
	timetrialIndex : 0,
	timetrialShowSolutions : false,
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

			app.selection = app.generate();
			app.renderAll();
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
			app.setupTimetrial();
		});

		$('#closetimetrial').click(function(e){
			$('#settingsform').show();
			$('header').show();
			$('#clockpanel').hide();
			$('#pauseclock').hide();
			$('#restartclock').hide();

			app.closeTimetrial();
		});

		$('#startclock').click(function(e){
			$('#pauseclock').show();
			$('#startclock').hide();
			$('#closetimetrial').hide();

			app.startClock();
		});

		$('#pauseclock').click(function(e){
			$('#closetimetrial').show();
			$('#pauseclock').hide();
			$('#startclock').show();

			app.pauseClock();
		});

		$('#restartclock').click(function(e){
			app.setupTimetrial();
		})

		$('#tableofall').click(function(e){
			if($(this).is(':checked')){
				$('#tableof option').removeAttr('selected');
			}
		});

		$('#tableof').click(function(e){
			if($(this).find('option:selected')){
				$('#tableofselection').prop('checked',true);
				$('#tableofall').prop('checked',false);
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
		var filtered = [];

		if($('#tableofall:checked').length <= 0){
			var tableof = $('#tableof').val();
			for (var i = this.table.length-1; i >= 0; i--) {
				var left = this.table[i].left.toString();
				if($.inArray(left,tableof) > -1){
					filtered.push(this.table[i]);
				}
			}
		}else{
			for (var i = this.table.length-1; i >= 0; i--) {
				filtered.push(this.table[i]);
			}
		}

		var result = [];
		for (var i = 0, index; i < app.count; ++i) {
			if(filtered.length <= 0){
				break;//No more candidates left
			}
			index = Math.floor(Math.random() * filtered.length);
			result.push(filtered[index]);
			app.removeItem(filtered,filtered[index]);
		}
		return result;
	},
	renderAll : function(){
		var output = '';
		app.showAs = (app.getSelectedTypes() == 'division' ? 'division' : 'multiplication');

		for(var i in app.selection){
			var item = app.selection[i];
			output += app.renderOneExercise(item);
		}

		$(output).appendTo(this.container);
	},
	renderOneExercise : function(exercise){
		var output = '<div';

		var columnWidth = 12;
		if(!app.timetrialIsRunning){

			columnWidth = (12/app.columns)
		}

		output += ' class="col-md-' + columnWidth.toString() + '"';
		output += ' data-solution="';
		if(app.showAs == 'division'){
			output += exercise.left + '">';
			output += exercise.solution + ' : ' + exercise.left + ' = ' + '<span style="display:none;" class="solution">' + exercise.right + '</span>';
		}else{
			output += exercise.solution + '">';
			output += exercise.right + ' x ' + exercise.left + ' = ' + '<span style="display:none;" class="solution">' + exercise.solution + '</span>';
		}
		output += '</div>';

		if(app.getSelectedTypes() == 'both' && app.showAs == 'multiplication'){
			 app.showAs = 'division';
		}else if(app.getSelectedTypes() == 'both' && app.showAs == 'division'){
			app.showAs = 'multiplication';
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
	setupTimetrial : function(){
		app.selection = app.generate();
		$('#exercise').html('');
		this.container.html('');
		$('#settingsform').hide();
		$('header').hide();
		$('#clockpanel').show();

		$('#pauseclock').hide();
		$('#closetimetrial').show();
		$('#restartclock').hide();
		$('#startclock').show();

		app.showAs = (app.getSelectedTypes() == 'division' ? 'division' : 'multiplication');
	},
	startClock : function(){
		app.timetrialShowSolutions = $('#showsolution').is(':checked');
		app.timetrialIsRunning = true;
		app.timetrialIndex = 0;
		app.showNextTimetrialExercise();
	},
	closeTimetrial : function(){
		app.timetrialIsRunning = false;
	},
	pauseClock : function(){
		app.timetrialIsRunning = false;

		clearTimeout(app.timeout);
	},
	stopClock : function(){
		app.timetrialIsRunning = false;

		clearTimeout(app.timeout);

		$('#pauseclock').hide();
		$('#closetimetrial').show();
		$('#restartclock').show();
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
	},
	showNextTimetrialExercise : function(){
		//end of series
		if(app.timetrialIndex == app.selection.length){
			$('#exercise').html('');
			app.stopClock();
			return;
		}

		var item = app.selection[app.timetrialIndex];
		app.timetrialIndex++;

		output = app.renderOneExercise(item);
		$('#exercise').html(output);

		if(app.timetrialShowSolutions){
			//Show the solution
			app.timeout = setTimeout(function(){app.showSolution()},$('#seconds').val() * 1000);
		}else{
			//Show next exercise after the pre-defined time
			app.timeout = setTimeout(function(){app.showNextTimetrialExercise()},$('#seconds').val() * 1000);
		}
	},
	showSolution : function(){
		$('#exercise .solution').show();

		//Show the next exercise
		app.timeout = setTimeout(function(){app.showNextTimetrialExercise()},($('#seconds').val()/2) * 1000);
	}
}

$(document).ready(function(){
	app.init();
});