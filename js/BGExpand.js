var JWR = JWR || {};

(function($) {

	function BGExpand() {}
	
	BGExpand.inited = false;
	BGExpand.el = null;
	BGExpand.currentImageName = null;
	BGExpand.canvasWidth = 900;//$(window).width();//900;
	BGExpand.canvasHeight = 720;//$(window).height();//720;
	BGExpand.images = null;

	/*
	 * init
	 * load our images
	*/
	BGExpand.init = function(src) {
		
		console.log('BGExpand:init:' + src);
		
		if(!this.inited) {
			this.inited = false;
			this.el = $('#canvas-wrapper');
			this.images = {};
		}
		
		if(src && src != '') this.loadImage(src);
		
	};
	
	/*
	 * loadImage
	*/
	BGExpand.loadImage = function(src) {
		
		var i, image, nameArr, name;
		
		//console.log('BGExpand:loadImage:' + src);
		
		nameArr = src.split('/');
		name = nameArr[nameArr.length - 1];
		
		console.log(name);
		
		if(this.currentImageName == name) return;
		
		if(this.images[name]) {
			console.log('have '+name+' already');
			this.currentImageName = name;
			this.renderImage(this.images[name])
			return;
		}
		
		image = new Image();
		image.src = src;
		
		this.images[name] = image;
		
		$(image).on('load', this.onImageLoaded.bind(this));
		
	};
	
	/*
	 * onImageLoaded
	*/
	BGExpand.onImageLoaded = function(evt) {
		
		//console.log('BGExpand:onImageLoaded:' +  evt.currentTarget.src);
		
		 var nameArr, name;
		 
		nameArr = evt.currentTarget.src.split('/');
		name = nameArr[nameArr.length - 1];
		
		this.currentImageName = name;
		this.renderImage(this.images[name]);
		
	};
	
	/*
	 * onWrapperClick
	 * render next image
	*/
	BGExpand.onWrapperClick = function() {
		
		this.currentImage++;
		
		if(this.currentImage > this.imageArray.length-1) {
			this.currentImage = 0;
		}
		
		this.renderImage(this.imageArray[this.currentImage]);
	 
	};
	
	/*
	 * getCurrentImage
	*/
	BGExpand.getCurrentImageName = function() {
		console.log('getCurrentImageName:' + this.srcIndex);
		return this.currentImageName;
	};
	
	/*
	 * renderImage
	 * blend image edge into the canvas behind it
	*/
	BGExpand.renderImage = function(image) {
		
		//console.log('BGExpand:renderImage', image);
		
		var canvas = document.createElement('canvas');
		
		canvas.width = this.canvasWidth;
		canvas.height = this.canvasHeight;
		context = canvas.getContext("2d");
			
		var pos = this.centerImage(image.width,image.height,canvas.width,canvas.height);
		
		context.drawImage(image,pos.sx,pos.sy,pos.sw,pos.sh,pos.dx,pos.dy,pos.dw,pos.dh);
		
		var scale = 50;
		var data = context.getImageData(0,0,this.canvasWidth,this.canvasHeight);
		
		this.gradientTop(context, pos.dx,0, pos.dw,pos.dy, pos.dy,scale,data);
		this.gradientBottom(context, pos.dx,pos.dy+pos.dh, pos.dw,this.canvasHeight - (pos.dy+pos.dh),pos.dy+pos.dh-1,scale,data);
		this.gradientLeft(context,0,pos.dy,pos.dx,pos.dh,pos.dx,scale,data);
		this.gradientRight(context,pos.dx+pos.dw,pos.dy,this.canvasWidth-pos.dx-pos.dw,pos.dh,pos.dw+pos.dx-1,scale,data);		
		//this.gradientCorners(context, pos, data);
		this.fillCorners(context, pos, data);
		
		//data = context.getImageData(0,0,this.canvasWidth,this.canvasHeight);
		//var fallback = 'background:' + this.getAverageBgColor(pos, data) + ';';
		//var bgStyles = this.getBgGrad(data, 'top', pos.dh, 0, 50, pos);
		//$('body').attr('style', bgStyles);
		//$('body').attr('style', 'background-color:#00f');
		//this.fadeEdges(canvas,320);
			
		this.el.html(canvas);
		
		//this.el.append('<img src="'+image.src+'" width="'+image.width+'" height="'+image.height+'" style="position:absolute;left:'+pos.dx+'px;top:'+pos.dy+'px;" />');
	
	};
	
	/*
	 * gradientCorners
	*/
	BGExpand.gradientCorners = function(ctx, pos, data) {
		
		var sw = pos.dx;
		var sh = pos.dy;
		
		var hyp = Math.sqrt(sh*sh + sw*sw);
		var angle = Math.asin(sh/hyp);
		var sin = Math.sin(angle);
		var cos = Math.cos(angle);
		var tan = Math.tan(angle);
		
		var xi = tan * sh;
		var yi = sh;
		
		var xi2 = tan * (sh * 2);
		var yi2 = sh * 2;
		
		var hyp2 = Math.sqrt(xi*xi + sh*sh);
		var leg1 = sin * xi;
		var leg2 = hyp2 - leg1;
		
		var x0 = sin * leg2;
		var y0 = cos * leg2;
		
		var hyp3 = Math.sqrt(xi2*xi2 + ((sh*2)*(sh*2)));
		var leg3 = sin * xi2;
		var leg4 = hyp3 -leg3;
		
		var x1 = sin * leg4;
		var y1 = cos * leg4;

		var sx, sy, srcx, srcy, grd, pixel;
		
		for(var i=0; i<4; i++) {
			switch(i) {
				//top left
				case 0:
					sx = 0;
					sy = 0;
					srcx = sw;
					srcy = sh;
					grd = ctx.createLinearGradient(x0, y0, x1, y1);
					break;
				//top right
				case 1:
					sx = pos.dx + pos.dw;
					sy = 0;
					srcx = sx - 1;
					srcy = sh;
					grd = ctx.createLinearGradient(sx + sw - x0, sy + y0, sx + sw - x1, sy + y1);
					break;
				//bottom left
				case 2:
					sx = 0;
					sy = pos.dy + pos.dh;
					srcx = sw;
					srcy = sy - 1;
					grd = ctx.createLinearGradient(x0, sy + sh - y0, x1, sy + sh - y1);
					break;
				//bottom right
				case 3:
				default:
					sx = pos.dx + pos.dw;
					sy = pos.dy + pos.dh;
					srcx = sx - 1;
					srcy = sy - 1;
					grd = ctx.createLinearGradient(sx + sw - x0, sy + sh - y0, sx + sw - x1, sy + sh - y1);
					break;
			}
			
			pixel = JWR.Utils.getPixelObject(data, srcx,  srcy);
			
			grd.addColorStop(0,'rgba(' + pixel.r + ',' + pixel.g + ',' + pixel.b + ',0)');
			grd.addColorStop(.5, 'rgb(' + pixel.r + ',' + pixel.g + ',' + pixel.b + ')');
		
			ctx.fillStyle = grd;
			ctx.fillRect(sx, sy, sw, sh);
		
		}
		
	};
	
	/*
	 * fillCorners
	*/
	BGExpand.fillCorners = function(ctx, pos, data) {
		
		var sw = pos.dx;
		var sh = pos.dy;

		var sx, sy, srcx, srcy;
		
		for(var i=0; i<4; i++) {
			switch(i) {
				//top left
				case 0:
					sx = 0;
					sy = 0;
					srcx = sw;
					srcy = sh;
					break;
				//top right
				case 1:
					sx = pos.dx + pos.dw;
					sy = 0;
					srcx = sx - 1;
					srcy = sh;
					break;
				//bottom left
				case 2:
					sx = 0;
					sy = pos.dy + pos.dh;
					srcx = sw;
					srcy = sy - 1;
					break;
				//bottom right
				case 3:
				default:
					sx = pos.dx + pos.dw;
					sy = pos.dy + pos.dh;
					srcx = sx - 1;
					srcy = sy - 1;
					break;
			}
			
			ctx.fillStyle = JWR.Utils.getPixel(data, srcx, srcy);
			ctx.fillRect(sx, sy, sw, sh);
	
		}
		
	};
	
	/*
	 * fadeEdges
	*/
	BGExpand.fadeEdges = function(canvas,range) {
		
		var radius = (canvas.height>canvas.width) ? canvas.height/2 : canvas.width/2;
		var diff = radius-range;
		var cx = canvas.width/2;
		var cy = canvas.height/2;
		var ctx = canvas.getContext('2d');
		var offset;
		var data = ctx.getImageData(0,0,canvas.width,canvas.height);
		
		for(var i=0; i<canvas.width; i++) {
			
			for(var j=0; j<data.height; j++) {
			
				offset = i * 4 + j * 4 * data.width;
				dx = i - cx;
				dy = j - cy;
				dist = Math.round(Math.sqrt(dx*dx + dy*dy));
				if(dist >= range) {
					//alpha = Math.round(1/((dist-range)/20) * 255);
					alpha = ((radius - dist)/diff) * 255;
					//console.log(alpha);
					data.data[offset + 3] = alpha;
				}
			}
		}
		ctx.putImageData(data,0,0);
	
	};
	
	/*
	 * gradientLeft
	*/  
	BGExpand.gradientLeft = function(ctx,sx,sy,sw,sh,srcx,size,data) {
		
		var position,pixel;
		var grd = ctx.createLinearGradient(sx, sy, sx, sy+sh);
		for(var i=sy; i<sy+sh; i+=size) {
			position = (i-sy) / sh;
			pixel = JWR.Utils.getPixel(data, srcx, i);
			grd.addColorStop(position,pixel);
		}
		grd.addColorStop(1,JWR.Utils.getPixel(data, srcx, sy+sh-1));
		
		ctx.fillStyle = grd;
		ctx.fillRect(sx, sy, sw, sh);
		/*
		//fade edge
		var data = ctx.getImageData(sx,sy,sw/2,sh);
		var offset;
		
		//console.log(sx,sy,sw/2,sh);
		//console.log(data.width, data.height);
		
		for(var i=0; i<data.width; i++) {
			position = (i / data.width) * 255;
			for(var j=0;j<data.height;j++) {
				offset = i*4 + (data.width * 4 * j);
				data.data[offset + 3] = position;
			}
		}
		ctx.putImageData(data,sx,sy);
		*/
	};
	
	/*
	 * gradientRight
	*/  
	BGExpand.gradientRight = function(ctx,sx,sy,sw,sh,srcx,size,data) {
		
		var position,pixel;
		var grd = ctx.createLinearGradient(sx, sy, sx, sy+sh);
		for(var i=sy; i<sy+sh; i+=size) {
			position = (i-sy) / sh;
			pixel = JWR.Utils.getPixel(data, srcx, i);
			grd.addColorStop(position,pixel);
		}
		grd.addColorStop(1,JWR.Utils.getPixel(data, srcx, sy+sh-1));
		
		ctx.fillStyle = grd;
		ctx.fillRect(sx, sy, sw, sh);
		/*
		//fade edge
		var data = ctx.getImageData(sx+sw/2,sy,sw/2,sh);
		var offset;
		
		//console.log(sx+sw/2,sy,sw/2,sh);
		//console.log(data.width, data.height);
		
		for(var i=0; i<data.width; i++) {
			position = ((data.width - i) / data.width) * 255;
			for(var j=0;j<data.height;j++) {
				offset = i*4 + (data.width * 4 * j);
				data.data[offset + 3] = position;
			}
		}
		ctx.putImageData(data,sx+sw/2,sy);
		*/
	};
		
	/*
	 * gradientTop
	*/
	BGExpand.gradientTop = function(ctx,sx,sy,sw,sh,srcy,size,data) {
		
		//console.log(ctx,sx,sy,sw,sh,srcy,size,data);
		
		var position,pixel;
		
		var grd = ctx.createLinearGradient(sx, sy, sx+sw, sy);
			
		for(var i=sx; i<sw+sx; i+=size) {
			position =(i-sx)/sw;
			pixel = JWR.Utils.getPixel(data, i, srcy);
			grd.addColorStop(position, pixel);
		}
		grd.addColorStop(1,JWR.Utils.getPixel(data, sx+sw-1, srcy));
		
		ctx.fillStyle = grd;
		ctx.fillRect(sx, sy, sw, sh);
		/*
		//fade edfe
		var data = ctx.getImageData(sx,sy,sw,sh/2);
		var offset;
		
		//console.log(sx,sy,sw,sh/2);
		//console.log(data.width, data.height);
		
		for(var i=0; i<data.height; i++) {
			position = (i / (data.height)) * 255;
			for(var j=0;j<data.width;j++) {
				offset = j * 4 + i * 4 * data.width;
				data.data[offset + 3] = position;
			}
		}
		ctx.putImageData(data,sx,sy);
		*/
	};
	
	/*
	 * gradientBottom
	*/
	BGExpand.gradientBottom = function(ctx,sx,sy,sw,sh,srcy,size,data) {
		
		//console.log(ctx,sx,sy,sw,sh,srcy,size,data);
		
		var position,pixel;
		
		var grd = ctx.createLinearGradient(sx, sy, sx+sw, sy);
			
		for(var i=sx; i<sw+sx; i+=size) {
			position =(i-sx)/sw;
			pixel = JWR.Utils.getPixel(data, i, srcy);
			grd.addColorStop(position, pixel);
		}
		grd.addColorStop(1,JWR.Utils.getPixel(data, sx+sw-1, srcy));
		
		ctx.fillStyle = grd;
		ctx.fillRect(sx, sy, sw, sh);
		/*
		//fade edge
		var data = ctx.getImageData(sx,sy + sh/2,sw,sh/2);
		var offset;
		
		//console.log(sx,sy + sh/2,sw,sh/2)
		//console.log(data.width, data.height);
		
		for(var i=0; i<data.height; i++) {
			position = ((data.height - i) / data.height) * 255;
			for(var j=0; j<data.width; j++) {
				offset = j * 4 + i * 4 * data.width;
				data.data[offset + 3] = position;
			}
		}
		ctx.putImageData(data,sx,sy + sh/2);
		*/
	};
		
	/*
	 * centerImage
	*/
	BGExpand.centerImage = function(iw,ih,cw,ch) {
		
		var pos = {sx:0,sy:0,sw:iw,sh:ih,dx:'',dy:'',dw:'',dh:''};
		
		if(iw < cw) {
			pos.dx =  Math.round((cw-iw)/2);
			pos.dw = iw;
		}else {
			pos.dx = 0;
			pos.dw = cw;
		}
		
		if(ih < ch) {
			pos.dy = Math.round((ch-ih)/2);
			pos.dh = ih;
		}else {
			pos.dy = 0;
			pos.dh = ch;
		}
		
		return pos;
	
	};
		
	/*
	 * getBgGrad
	*/
	BGExpand.getBgGrad = function(imageData, orientation, dimension, end, scale, pos) {
		
		var bg, first, last, oldWebKit;
		var valueString = '(' + orientation + ',';
		
		if(orientation == 'top') {
		
			oldWebKit = 'background:-webkit-gradient(linear,left top, left bottom,';
			
			//first = JWR.Utils.getPixel(imageData, pos.dx/2, Math.round(pos.dy/2+1));
			
			//console.log(pos.dy/2,first);
			
			//oldWebKit += 'color-stop(0%,'+first+'));';
			//valueString += first  + ' 0%)';
		
			for(var i = Math.round(pos.dy/2)+1; i<pos.dy/2 + pos.dh + pos.dy/2; i += scale) {
				var color = JWR.Utils.getPixel(imageData, pos.dx, i);
				var position = Math.round((i * 100)/(pos.dy/2 + pos.dh + pos.dy/2));
				oldWebKit += 'color-stop(' + position + '%,'+color+'),';
				valueString += color + ' ' + position + '%, ';
				console.log(i,color, position);
			}
		
			last = JWR.Utils.getPixel(imageData, pos.dx/2, pos.dy/2 + pos.dh + pos.dy/2-1);
		
		}else if(orientation == 'left') {
		
			oldWebKit = 'background:-webkit-gradient(linear,left top, right top,';
		
			for(var i = 0; i<dimension; i += scale) {
				var color =  JWR.Utils.getPixel(imageData, i, end);
				var position = Math.round((i * 100)/dimension);
				oldWebKit += 'color-stop(' + position + '%,'+color+'),';
				valueString += color + ' ' + position + '%, ';
			}
		
			last = JWR.Utils.getPixel(imageData, dimension-1, end);
		
		}
		
		console.log(last);
		
		oldWebKit += 'color-stop(100%,'+last+'));';
		valueString += last  + ' 100%)';
	
		var browserArray = ['-moz-linear-gradient',
			'-webkit-linear-gradient',
			'-o-linear-gradient',
			'-ms-linear-gradient',
			'linear-gradient'];
		
		bg = oldWebKit;
		
		for(var i=0;i<browserArray.length;i++) {
			bg += 'background:'+browserArray[i]+valueString+';';
		}
		
		//console.log(bg);
		
		return bg;
		
	};

	/*
	 * getComplementaryBgGrad
	*/
	BGExpand.getComplementaryBgGrad = function(imageData, orientation, dimension, end, scale) {
		
		var bg;
		var last;
		var oldWebKit;
		var valueString = '(' + orientation + ',';
		
		if(orientation == 'top') {
		
			var oldWebKit = 'background:-webkit-gradient(linear,left top, left bottom,';
			
			for(var i = 0; i<dimension; i += scale) {
				var rgb = JWR.Utils.getPixelObject(imageData, end, i);
				var comp = getComplement(rgb);
				var color = 'rgb('+comp.r+','+comp.g+','+comp.b+')'
				var position = Math.round((i * 100)/dimension);
				oldWebKit += 'color-stop(' + position + '%,'+color+'),';
				valueString += color + ' ' + position + '%, ';
			}
			
			last = JWR.Utils.getPixel(imageData, end, dimension-1);
		
		}else if(orientation == 'left') {
		
			var oldWebKit = 'background:-webkit-gradient(linear,left top, right top,';
		
			for(var i = 0; i<dimension; i += scale) {	
				var rgb = JWR.Utils.getPixelObject(imageData, end, i);
				var comp = getComplement(rgb);
				var color = 'rgb('+comp.r+','+comp.g+','+comp.b+')'
				var position = Math.round((i * 100)/dimension);
				oldWebKit += 'color-stop(' + position + '%,'+color+'),';
				valueString += color + ' ' + position + '%, ';
			}
			
			last = JWR.Utils.getPixel(imageData, dimension-1, end);
		
		}
		
		oldWebKit += 'color-stop(100%,'+last+'));';
		valueString += last  + ' 100%)';
	
		var browserArray = ['-moz-linear-gradient',
			'-webkit-linear-gradient',
			'-o-linear-gradient',
			'-ms-linear-gradient',
			'linear-gradient'];
		
		bg = oldWebKit;
		
		for(var i=0;i<browserArray.length;i++) {
			bg += 'background:'+browserArray[i]+valueString+';';
		}
	
		//console.log(bg);
		return bg;
		
	};
		
	/*
	 * getAverageBgColor
	*/
	BGExpand.getAverageBgColor = function(pos,imageData) {
	
		var topLeft,topRight,bottomLeft,bottomRight,r,g,b;

		//console.log(imageData.data.[0]);

		topLeft = JWR.Utils.getPixelObject(imageData, pos.dx, pos.dy);//0,0);
		topRight = JWR.Utils.getPixelObject(imageData, pos.dx + pos.dw, pos.dy);//imageData.width-1,0);
		bottomLeft = JWR.Utils.getPixelObject(imageData, pos.dx, pos.dy + pos.dh);//0,imageData.height-1);
		bottomRight = JWR.Utils.getPixelObject(imageData, pos.dx + pos.dw, pos.dy);//imageData.width-1,imageData.height-1);

		//console.log('getAverageBgColor:'+topLeft.r);
		//console.log('getAverageBgColor:'+topLeft.g);
		//console.log('getAverageBgColor:'+topLeft.b);

		r = Math.round((topLeft.r + topRight.r + bottomLeft.r + bottomRight.r) / 4);
		g = Math.round((topLeft.g + topRight.g + bottomLeft.g + bottomRight.g) / 4);
		b = Math.round((topLeft.b + topRight.b + bottomLeft.b + bottomRight.b) / 4);
	
		/*console.log('rTotal:'+r);
		console.log('r:'+r+' g:'+g+' b:'+b);*/
	
		return "rgb(" + r + "," + g + "," + b + ")";
	
	};
	
	JWR.BGExpand = BGExpand;

}(jQuery));