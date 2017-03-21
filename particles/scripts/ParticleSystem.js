/*jslint browser: true, white: true */
/*global Random */

//------------------------------------------------------------------
//
// This is the particle system use by the game code
//
//------------------------------------------------------------------
function ParticleSystem(spec, graphics) {
	'use strict';
	var that = {},
		nextName = 1,	// unique identifier for the next particle
		particles = {};	// Set of all active particles

	var x = spec.center.x, y = spec.center.y;

	//------------------------------------------------------------------
	//
	// This creates one new particle
	//
	//------------------------------------------------------------------
	that.create = function() {
		var dir = Random.nextCircleVector();
		var rot;
		if (dir.x<0) {
			rot = Math.PI*dir.x - Math.PI*dir.y;
		}
		else {
			rot = Math.PI*dir.x + Math.PI*dir.y;
		}
		var p = {
				fill: 'rgba('+Math.floor(Math.random()*100)+', '+Math.floor(Math.random()*100)+', '+Math.floor(Math.random()*100)+', .5)',
				stroke: 'rgba(0, 0, 0, 1)',
				width: Math.floor(Math.random()*200),
				height: 5,
				position: {x: spec.center.x, y: spec.center.y},
				direction: dir,
				speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev)+1000, // pixels per second
				rotation: rot,
				lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
				alive: 0	// How long the particle has been alive, in seconds
			};
		//
		// Assign a unique name to each particle
		particles[nextName++] = p;
	};
	
	//------------------------------------------------------------------
	//
	// Update the state of all particles.  This includes removing any that have exceeded their lifetime.
	//
	//------------------------------------------------------------------
	that.update = function(elapsedTime) {
		var removeMe = [],
			particle;
			
		//
		// We work with time in seconds, elapsedTime comes in as milliseconds
		elapsedTime = elapsedTime / 1000;
		
		Object.getOwnPropertyNames(particles).forEach(function(value, index, array) {
			particle = particles[value];
			//
			// Update how long it has been alive
			particle.alive += elapsedTime;
			
			//
			// Update its position
			particle.position.x += (elapsedTime * particle.speed * particle.direction.x);
			particle.position.y += (elapsedTime * particle.speed * particle.direction.y);
			
			//
			// Rotate proportional to its speed
			// particle.rotation += particle.speed / 500;
			
			//
			// If the lifetime has expired, identify it for removal
			if (particle.alive > particle.lifetime) {
				removeMe.push(value);
			}
		});
		
		//
		// Remove all of the expired particles
		for (particle = 0; particle < removeMe.length; particle++) {
			delete particles[removeMe[particle]];
		}
		removeMe.length = 0;
	};
	
	//------------------------------------------------------------------
	//
	// Render all particles
	//
	//------------------------------------------------------------------
	that.render = function() {
		Object.getOwnPropertyNames(particles).forEach( function(value, index, array) {
			var particle = particles[value];
			graphics.drawRectangle(particle);
		});
	};
	
	return that;
}
