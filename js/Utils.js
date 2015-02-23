var JWR = JWR || {};

(function($) {

	function Utils() {}
	
	/*
	* componentToHex
	*/
	Utils.componentToHex = function(c)  {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	};
	
	/*
	 * rgbToHex
	 *  convert hex format to a rgb color
	*/
	Utils.rgbToHex = function(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	};


Utils.clearCanvas = function(context, canvas) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	var w = canvas.width;
	canvas.width = 1;
	canvas.width = w;
	context.fillStyle = '#ffffff';
	context.fillRect(0,0,width,height);
}

Utils.draw = function() {
	var pt = getPixelTotal(imageData,x,y);
	if(pt < 50){pt=60;}
	context.lineWidth = Math.round(pt/60);
	//context.strokeStyle = '#ff0000';
	context.strokeStyle = getPixel(imageData,x,y);
	context.beginPath();
	context.moveTo(x-scale,y-scale);
	//console.log(imageTotals[cnt].x);
	context.lineTo(x,y);
	//context.arc(x + scale/2, y + scale/2, scale/2, 0, Math.PI*2, false);
	context.stroke();
	cnt++;
	if(cnt % (width/scale) == 0) {
		x = 0;
		y += scale;
	}else {
		x += scale;
	}
	if(cnt >= (width/scale) * (height/scale)) {//(width * height)/scale) {
		console.log('stop');
		clearInterval(interval);
	}
}
	
Utils.draw2 = function() {
	context.fillStyle = getPixel(imageData,x,y);
	context.beginPath();
	context.arc(x + scale/2, y + scale/2, scale/2, 0, Math.PI*2, false);
	context.fill();
	cnt++;
	if(cnt % (width/scale) == 0) {
		x = 0;
		y += scale;
	}else {
		x += scale;
	}
	if(cnt >= (width/scale) * (height/scale)) {//(width * height)/scale) {
		console.log('stop');
		clearInterval(interval);
	}
}

Utils.parseImageData = function()
{
	var x,y,pt;
	for(x=0;x<canvas.width; x+= scale)
	{
		for(y=0;y<canvas.height;y+= scale)
		{
			pt = getPixelTotal(imageData,x,y);
			if(pt<255)
			{
				var pto = new Object();
				pto.x = x;
				pto.y = y;
				//pto.t = pt;
				//console.log(pto.x);
				imageTotals.push(pto);
			}
		}
	}
}

Utils.pixellate = function(size) {
	var x, y;
	for(x = 0; x < canvas.width; x += size) {
		for(y = 0; y < canvas.height; y += size) {
			context.fillStyle = getPixel(imageData, x, y);
			context.fillRect(x, y, size, size);
		}
	}
}

Utils.getPixelTotal = function(imageData, x, y) {
	var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
	r = imageData.data[offset];
	g = imageData.data[offset + 1];
	b = imageData.data[offset + 2];
	a = imageData.data[offset + 3];
	return r + g + b;
}

Utils.getPixel = function(imageData, x, y) {
	var r, g, b, a, offset = x * 4 + y * 4 * imageData.width;
	r = imageData.data[offset];
	g = imageData.data[offset + 1];
	b = imageData.data[offset + 2];
	a = imageData.data[offset + 3];
	//return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	return "rgb(" + r + "," + g + "," + b + ")";
}

Utils.getPixelObject = function(imageData, x, y) {
		var r, g, b, a, obj = new Object(), offset = x * 4 + y * 4 * imageData.width;
		rd = imageData.data[offset];
		gd = imageData.data[offset + 1];
		bd = imageData.data[offset + 2];
		ad = imageData.data[offset + 3];
		obj = {r:rd,g:gd,b:bd,a:ad};
		return obj;
		//return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
 Utils.getComplement = function(rgb)
{
temprgb = rgb;
temphsv=RGB2HSV(temprgb);
temphsv.hue=HueShift(temphsv.hue,180.0);
temprgb=HSV2RGB(temphsv);
return temprgb;
}

// complement
/*temprgb=thisrgb;
temphsv=RGB2HSV(temprgb);
temphsv.hue=HueShift(temphsv.hue,180.0);
temprgb=HSV2RGB(temphsv);*/

Utils.RGB2HSV = function(rgb) {
hsv = new Object();
max=max3(rgb.r,rgb.g,rgb.b);
dif=max-min3(rgb.r,rgb.g,rgb.b);
hsv.saturation=(max==0.0)?0:(100*dif/max);
if (hsv.saturation==0) hsv.hue=0;
else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
if (hsv.hue<0.0) hsv.hue+=360.0;
hsv.value=Math.round(max*100/255);
hsv.hue=Math.round(hsv.hue);
hsv.saturation=Math.round(hsv.saturation);
return hsv;
}

// RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
// which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
Utils.HSV2RGB = function(hsv) {
var rgb=new Object();
if (hsv.saturation==0) {
		rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
} else {
		hsv.hue/=60;
		hsv.saturation/=100;
		hsv.value/=100;
		i=Math.floor(hsv.hue);
		f=hsv.hue-i;
		p=hsv.value*(1-hsv.saturation);
		q=hsv.value*(1-hsv.saturation*f);
		t=hsv.value*(1-hsv.saturation*(1-f));
		switch(i) {
		case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
		case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
		case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
		case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
		case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
		default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
		}
		rgb.r=Math.round(rgb.r*255);
		rgb.g=Math.round(rgb.g*255);
		rgb.b=Math.round(rgb.b*255);
}
return rgb;
}

Utils.min3 = function(a,b,c) { return (a<b)?((a<c)?a:c):((b<c)?b:c); } 
Utils.max3 = function(a,b,c) { return (a>b)?((a>c)?a:c):((b>c)?b:c); }
Utils.HueShift = function(h,s) { h+=s; while (h>=360.0) h-=360.0; while (h<0.0) h+=360.0; return h; }

	JWR.Utils = Utils;

}(jQuery));