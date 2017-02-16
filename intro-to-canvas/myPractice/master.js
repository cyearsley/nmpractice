'use strict';
console.log("master.js loaded!");

var Player = function (pData) {
	///////////////////////////////////////////
	var Key = {
		_pressed: {},

		LEFT: 65,
		UP: 87,
		RIGHT: 68,
		DOWN: 83,
		
		isDown: function(keyCode) {
		  	return this._pressed[keyCode];
		},
		
		onKeydown: function(event) {
			// console.log("key on down!");
		  	this._pressed[event.keyCode] = true;
		},
		
		onKeyup: function(event) {
			console.log("key on up! - ", event);
			delete this._pressed[event.keyCode];
		}
	};

	window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
	/////////////////////////////////////////////

	var canvas = $('#canvas-main')[0];
	var context = canvas.getContext('2d');
	var me = this;
	var ready = false;
	var image = new Image();
	CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

	image.onload = function () {
		ready = true;
	};

	image.src = pData.imageSrc;

	this.move = function (direction) {
		console.log("DIRECTION! ", "." + direction + ".");
		if (direction == 'right') {
			pData.x += 3;
		}
		if (direction == 'down') {
			pData.y += 3;
		}
		if (direction == 'left') {
			pData.x -= 3;
		}
		if (direction == 'up') {
			pData.y -= 3;
		}
	};

	this.update = function () {

		if (Key.isDown(Key.UP)) this.move('up');
		if (Key.isDown(Key.LEFT)) this.move('left');
		if (Key.isDown(Key.DOWN)) this.move('down');
		if (Key.isDown(Key.RIGHT)) this.move('right');
	
	};

	// window.addEventListener('keydown', this.move);

	this.draw = function () {

		//context.save() Pushes the current state onto the stack.
		//context.restore() Pops the top state on the stack, restoring the context to that state.

		if (ready) {
			context.save();

			context.translate(pData.x - pData.w/2, pData.y - pData.h/2);
			context.drawImage(image, pData.x, pData.y, pData.w, pData.h);

			context.restore();
		}
	}

	this.clear = function () {
		context.clear();
	}
};

var MyGame = function () {
	window.requestAnimationFrame(_gameLoop);
	var player = new Player({imageSrc: 'shield-img.jpg', x: 0, y: 0, w: 100, h: 100});
	var _gameData = {
		previousTimestamp: 0
	};

	function _update () {
		player.update();
	}

	function _render () {
		player.clear();

		player.draw();
	}

	function _gameLoop (currentTimestamp) {
		_gameData.previousTimestamp = currentTimestamp;

		_update();

		_render();

		window.requestAnimationFrame(_gameLoop);
	}
};

$(function () {
	// var player = new Player();
	var mygame = new MyGame();
});