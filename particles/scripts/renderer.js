/*jslint browser: true, white: true */
/*global CanvasRenderingContext2D, requestAnimationFrame, console, MyGame */

// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------
var MyGame = {};

// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');

	//------------------------------------------------------------------
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	//
	//------------------------------------------------------------------
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	//------------------------------------------------------------------
	//
	// Public function that allows the client code to clear the canvas.
	//
	//------------------------------------------------------------------
	function clear() {
		context.clear();
	}
	
	//------------------------------------------------------------------
	//
	// This is a rectangle drawing function, rendering according to the spec.
	//
	//------------------------------------------------------------------
	function drawRectangle(spec) {
		context.save();
		context.translate(spec.position.x + spec.width / 2, spec.position.y + spec.height / 2);
		context.rotate(spec.rotation);
		context.translate(-(spec.position.x + spec.width / 2), -(spec.position.y + spec.height / 2));
		
		context.fillStyle = spec.fill;
		context.fillRect(spec.position.x, spec.position.y, spec.width, spec.height);
		
		context.strokeStyle = spec.stroke;
		context.strokeRect(spec.position.x, spec.position.y, spec.width, spec.height);

		context.restore();
	}

	return {
		clear : clear,
		drawRectangle : drawRectangle
	};
}());

//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MyGame.main = (function(graphics) {
	'use strict';

	console.log('game initializing...');
	
	//
	// Define a sample particle system to demonstrate its capabilities
	var particles = ParticleSystem( {
				center: {x: 650, y: 300},
				speed: {mean: 50, stdev: 25},
				lifetime: {mean: 4, stdev: 1} 
			},
			graphics),
		lastTimeStamp = performance.now();
	
	//------------------------------------------------------------------
	//
	// Update the particles
	//
	//------------------------------------------------------------------
	function update(elapsedTime) {
		var particle;
		//
		// Tell the existing particles to update themselves
		particles.update(elapsedTime);
		
		//
		// Generate some new particles
		for (particle = 0; particle < 1; particle++) {
			particles.create();
		}
	}
	
	//------------------------------------------------------------------
	//
	// Render the particles
	//
	//------------------------------------------------------------------
	function render() {
		
		graphics.clear();
		particles.render();
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		var elapsedTime = (time - lastTimeStamp);
		
		update(elapsedTime);
		lastTimeStamp = time;
		
		render();
		
		requestAnimationFrame(gameLoop);
	};

	requestAnimationFrame(gameLoop);
}(MyGame.graphics));
