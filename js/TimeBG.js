var JWR = JWR || {};

(function($) {

	function TimeBG() {}
	
	TimeBG.inited = false;
	TimeBG.display = null;
	TimeBG.updateID = null;
	TimeBG.stop1 = {r:0, g:10, b:0};
	TimeBG.stop2 = {r:0, g:150, b:200};
	
	TimeBG.init = function() {
		
		console.log('TimeBG:init');
		
		if(!this.inited) {
			this.inited = true;
			this.display = $('#time-bg-display');
			var d = new Date();
			this.stop1.r = Math.round((( d.getHours() ) / 24) * 180);
			this.updateID = setInterval( this.updateDisplay.bind(this), 1000 );
			this.updateDisplay();
		}
	
	};
	
	TimeBG.updateDisplay = function() {
		
		var d = new Date();
		this.display.text(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
		this.updateBG();
		
	};
	
	TimeBG.updateBG = function() {
		
		var d = new Date();
		this.stop1.b = Math.round((d.getMinutes() / 60) * 180);
		this.stop2.r = Math.round((Math.abs(30 -  d.getSeconds()) / 30) * 255);
				
		var wbk = 'background:-webkit-gradient(linear,left top, left bottom,';
		var vs = '(top,';
		
		wbk += 'color-stop(0%, rgb(' + 
			this.stop1.r + ',' + 
			this.stop1.g + ',' + 
			this.stop1.b + ')),';
			
		vs += 'rgb(' + 
			this.stop1.r + ',' +
			this.stop1.g + ',' +
			this.stop1.b + ') 0%, ';
			
		wbk += 'color-stop(100%, rgb(' + 
			this.stop2.r + ',' + 
			this.stop2.g + ',' + 
			this.stop2.b + ')));';
			
		vs += 'rgb(' + 
			this.stop2.r + ',' +
			this.stop2.g + ',' +
			this.stop2.b + ') 100%)';
		
		var browsers = ['-moz-linear-gradient',
			'-webkit-linear-gradient',
			'-o-linear-gradient',
			'-ms-linear-gradient',
			'linear-gradient'];
		
		bg = wbk;
		
		for(var i=0;i<browsers.length;i++) {
			bg += 'background:' + browsers[i] + vs + ';';
		}
		
		//console.log(bg);
		
		//$('body').attr('style', bg);
		$('#header').attr('style', bg);
		
	};

	JWR.TimeBG = TimeBG;

}(jQuery));