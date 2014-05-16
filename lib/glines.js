var glines = {};

(function(gl) {
	
	gl.defaultStyles = {
		horizontal : {
			width : '100%',
			height : '4px',
			position : 'absolute',
			backgroundColor : '#000',
			zIndex : '9999',
			left : '0',
			cursor : 's-resize',
			outline : 'none'
		},

		vertical : {
			width : '4px',
			position : 'absolute',
			backgroundColor : '#000',
			zIndex : '9999',
			top : '0',
			left : '100px',
			cursor : 'w-resize',
			outline : 'none'
		}
	};

	
	gl.counter = -1;

	
	gl.oldOnLoad = window.onload;
	gl.oldOnResize = window.onresize;
	gl.oldMouseMove = document.onmousemove;

	
	gl.getWindowHeight = function() {
		return Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
	}

	
	gl.getWindowWidth = function() {
		return Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth);
	}


	gl.getScrollTop = function() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}

	
	gl.each = function(handler) {
		var lines = document.getElementsByClassName('glines-line');
		for (var i = 0; i < lines.length; i++) {
			handler(i, lines[i]);
		}
	}

	
	gl.checkAxis = function(axis) {
		if (axis == 'h') {
			axis = 'horizontal';
		}

		if (axis == 'v') {
			axis = 'vertical';
		}

		if (axis != 'horizontal' && axis != 'vertical') {
			axis = 'vertical';
		}

		return axis;
	}


	gl.setLineStyle = function(line, customStyle) {
		customStyle = customStyle || {};
		var axis = this.checkAxis( line.axis );
		var resultStyle = this.defaultStyles[ axis ];

		if (axis == 'vertical') {
			resultStyle.height = this.getWindowHeight() + 'px';
		}

		if (axis == 'horizontal') {
			resultStyle.top = this.getScrollTop() + 100 + 'px';
		}

		// overwrite default styles by custom styles
		for (i in customStyle) {
			if (i == 'color') {
				resultStyle['backgroundColor'] = customStyle[ i ];
			} else if (i == 'size') {
				if (axis == 'vertical') {
					resultStyle['width'] = customStyle[ i ];
				} else {
					resultStyle['height'] = customStyle[ i ];
				}
			} else {
				resultStyle[ i ] = customStyle[ i ];
			}
		}

		// apply result styles to line
		for (i in resultStyle) {
			line.style[ i ] = resultStyle[ i ];			
		}
	}


	gl.addLine = function(axis, customStyle) {
		axis = this.checkAxis(axis);

		this.counter++;

		var line = document.createElement('div');

		line.glines = this;
		line.axis = axis;
		line.index = this.counter;
		line.className = 'glines-line';
		line.id = 'glines-line-' + this.counter;
		line.tabIndex = '10000' + this.counter; // hack. focus method will work on div

		this.setLineStyle( line, customStyle );

		
		// hack. custom remove() method for IE
		if ( typeof line.remove == 'undefined' ) {
			line.remove = function() {
				this.parentNode.removeChild( this );
			}
		}

		
		line.onclick = function() {
			this.focus();
		}

		
		line.ondblclick = function() {
			this.remove();
		}

		
		line.ondragstart = function(event) {
			return false;
		}

		
		line.onmousedown = function(event) {
			var self = this;

			if (self.axis == 'vertical') {
				document.onmousemove = function(e) {
					self.style.left = e.pageX + 'px';
				}	
			} else if (self.axis == 'horizontal') {
				document.onmousemove = function(e) {
					self.style.top = e.pageY + 'px';
				}
			}
			
			self.onmouseup = function() {
				document.onmousemove = self.glines.oldMouseMove;
				self.onmouseup = null;
			}

			return false;
		}

		
		line.onkeydown = function(event) {
			var e = window.event ? window.event : event;
			var key = e.keyCode;

			// check if not arrows
			if (key != 37 && key != 38 && key != 39 && key != 40) {
				return true;
			}

			if (this.axis == 'horizontal') {
				var top = parseInt(this.style.top);
				
				if (key == 38) {
					// arrow up
					this.style.top = (--top) + 'px'; 
				} else if (key == 40) { 
					// arrow down
					this.style.top = (++top) + 'px';
				}
			} else if (this.axis == 'vertical') {
				var left = parseInt(this.style.left);
				
				if (key == 37) { 
					// arrow left
					this.style.left = (--left) + 'px'; 
				} else if (key == 39) { 
					// arrow right
					this.style.left = (++left) + 'px';
				}
			}

			return false;
		}

		
		document.body.appendChild( line );
		line.focus();
	}

	
	gl.removeAll = function() {
		// hack. unable to remove items inside this.each circle 
		var elements_to_remove = [];

		this.each(function(ind, el){
			elements_to_remove.push( el );
		});

		for (i in elements_to_remove) {
			elements_to_remove[i].remove();
		}
	}

	
	gl.help = function() {
		console.log('type glines.addLine(\'v\'); to add vertical line');
		console.log('type glines.addLine(\'h\'); to add horizontal line');
		console.log('type glines.addLine(\'v\', { color:\'#f00\', size:\'1px\' }); to add red one-pixel vertical line');
		console.log('single click on line makes it active, so you can move it using mouse or keyboard arrows');
		console.log('use double click on line to remove it, or type glines.removeAll(); to remove all lines');
		console.log('visit http://s6-studio.ru/features/glines/ to get more info');
	}

	
	console.log('glines included.');
	console.log('type glines.help() into console to get API info');


	window.onresize = function() {
		var h = gl.getWindowHeight();
		
		gl.each(function(ind, line) {
			if (line.axis == 'vertical') {
				line.style.height = h + 'px';
			}
		});
	}

})(glines);