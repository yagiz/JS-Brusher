window.onload = function() 
{
	startRendering();
};

var c;
var ctx;
var imageData;
var imageWidth;
var imageHeigth;
var maxDistance;
var imageURL = "assets/image.jpg"
var _mousePosition;
var lines = [];
var lineCount = 200;

function startRendering()
{
	c = document.getElementById("canvas");
    ctx = c.getContext("2d");
	c.style.backgroundColor = 'rgba(158, 167, 184, 0.2)';

    var img = new Image();

    img.onload = function () {

    	imageWidth = img.naturalWidth
    	imageHeigth = img.naturalHeight

    	canvas.width  = imageWidth;
    	canvas.height = imageHeigth;

		var a = imageWidth
		var b = imageHeigth

		maxDistance = Math.sqrt( a*a + b*b );


        ctx.drawImage(img, 0, 0);
        imageData = ctx.getImageData(0,0,imageWidth,imageHeigth);
        ctx.fillStyle="#ffffff";
        ctx.fillRect(0,0,imageWidth,imageHeigth);
        
        createLines();
        addMouseEvent();
        setTimeout(renderer,1);
    }

	img.src = imageURL;
}

function createLines()
{
	for(var i=0; i<lineCount; i++)
	{
		lines.push(new Line());
	}
}

function getMousePos(canvas, evt) 
{
	var rect = canvas.getBoundingClientRect();
    return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
}

function addMouseEvent()
{
	c.addEventListener('mousemove', function(evt) {
        _mousePosition = getMousePos(c, evt);
    }, false);
}

function renderer()
{
	if(_mousePosition)
	{
		for(var i=0; i<lineCount; i++)
		{
			lines[i].setMousePosition(ctx,imageData,_mousePosition)
		}
	}
	setTimeout(renderer, 0.1);
}




function Line () 
{
	this.previousPosition = {x:0,y:0};
	this.velocityPosition = {x:0,y:0};
	this.actualPosition = {x:0,y:0};
	this.friction = Math.random()*0.8;
	this.first = true

	this.setMousePosition = function(ctx,imageData,mousePosition)
	{

		if (this.first)
		{
			this.actualPosition.x = mousePosition.x;
			this.actualPosition.y = mousePosition.y;
				
			this.previousPosition.x = this.actualPosition.x;
    		this.previousPosition.y = this.actualPosition.y;

    		this.first = false;
		}
		
		this.actualPosition.x += (mousePosition.x - this.actualPosition.x) * this.friction;
		this.actualPosition.y += (mousePosition.y - this.actualPosition.y) * this.friction;


		var colorPointX = (this.actualPosition.x + this.previousPosition.x) * 0.5;
		var colorPointY = (this.actualPosition.y + this.previousPosition.y) * 0.5;

		var rgbColor = getRGBAt(imageData,colorPointX,colorPointY);

		var a = this.previousPosition.x - this.actualPosition.x
		var b = this.previousPosition.y - this.actualPosition.y

		var distance = Math.sqrt( a*a + b*b );

		if(rgbColor)
		{
			ctx.beginPath();
		    ctx.moveTo(this.previousPosition.x,this.previousPosition.y);
		    ctx.lineTo(this.actualPosition.x,this.actualPosition.y);

		    ctx.strokeStyle = "rgba("+rgbColor.r+","+rgbColor.g+","+rgbColor.b+",0.1)";
		    ctx.lineWidth = distance/maxDistance*200;
		    ctx.lineCap = 'round';
		    ctx.stroke();
		}

    	this.previousPosition.x = this.actualPosition.x;
    	this.previousPosition.y = this.actualPosition.y;
	}
}




function random()
{
	return Math.random() - 0.5;
}

function getRGBAt(imageData,x,y)
{

	//return {r:Math.floor(Math.random()*255),g:Math.floor(Math.random()*255),b:Math.floor(Math.random()*255)};

	x = Math.ceil(x);
	y = Math.ceil(y);

	if(x<=imageData.width && y<=imageData.height)
	{
		var indexStart = y*imageData.width;
		var index = indexStart + x;

		var red = imageData.data[((imageData.width * y) + x) * 4];
        var green = imageData.data[((imageData.width * y) + x) * 4 + 1];
        var blue = imageData.data[((imageData.width * y) + x) * 4 + 2];

		return {r:red,g:green,b:blue};
	}

	return null;
}