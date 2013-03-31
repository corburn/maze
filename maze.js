/**
 * Required:
 * The input to your program is the included maze image. The start of the maze
 * is indicated by a green square and the end of the maze is represented with a
 * red square. Provide a user interface to allow a user to traverse the maze.
 * Solutions could consist of text based, web based, 2D, 3D, or any other
 * interesting interaction modality.
 *
 * Optional:
 * Provide a meaningful hint when requested by the user.
 * Generate a maze, randomly or based on interesting material, which can be used
 * as input to this program. The more interesting the maze, the more points given.
 */

/**
 * TODO
 */
(function() {			// define everything in a scoping function instead of clobbering window
    var canvas;			// maze canvas element
    var ctx;			// canvas context
    var img;			// maze image
    //var worker;		// TODO
    //var threaded = true;	// TODO

    var w = 4;			// width of marker
    var h = 4;			// height of marker
    var x = 5;			// marker x position
    var y = 7;			// marker y postion
    var dx = w + w;		// how much x is changed when an arrow key is pressed
    var dy = h + h;		// how much y is changed when an arrow key is pressed

    var path = [];		// path taken through maze

    var marker = "Purple";	// marker color
    var trail = "Yellow";	// trail color

    var Direction = {"left":0,"up":1,"right":2,"down":3};
	// exit coordinates TODO evaluate instead of static
    var Exit = {"x":797,"y":799};

    /**
     * START
     *
     * The program starts when the maze loads.
     */
    img = new Image();
    img.src = "maze.png";
    img.onload = function() {
        // Initialize pathfinder worker
        //if(typeof(Worker)!=="undefined") {
        //    worker = new Worker('worker.js');
        //} else {
        //    alert("Hints disabled: Your browser does not support Web Workers.");
        //    threaded = false;
        //}

        // Initialize canvas
        canvas = document.getElementById('maze');
        ctx = canvas.getContext('2d');

        // Scale canvas to maze
        canvas.width = this.width;
        canvas.height = this.height;
        // Draw maze
        ctx.drawImage(img,0,0);

        // Listen for arrow keys
        window.addEventListener('keydown',doKeyDown,true);
    }

    /**
     * compare returns true if the pixel is the same color as the rgba array.
     * rgba = [red,green,blue,alpha]
     */
    var compare = function(pixel,rgba) {
	return pixel[0] === rgba[0] && pixel[1] === rgba[1] && pixel[2] === rgba[2] && pixel[3] === rgba[3];
    }

    /**
     * doKeyDown moves the marker when an arrow key is pressed
     * or requests a hint.
     */
    var doKeyDown = function(evt) {
        hint(false);	// Hide hint on next keypress
        switch (evt.keyCode) {
        case 38:	// Up arrow was pressed
            move(Direction["up"], trail);
            break;
        case 40:	// Down arrow was pressed
            move(Direction["down"], trail);
            break;
        case 37:	// Left arrow was pressed
            move(Direction["left"], trail);
            break;
        case 39:	// Right arrow was pressed
            move(Direction["right"], trail);
            break;
        case 72:	// 'h' was pressed
            hint(true);
            break;
        }
    }

    /**
     * draw the marker at the current position.
     */
    var draw = function(color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x,y,w,h);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * hint toggles hint.
     *
     * @param show display hint when true
     */
    var hint = function(show) {
        var msg;
        if(show) {
            var tmpTrail = trail;
            tremaux(Direction["up"]);
	    trail = tmpTrail;
            msg = "TODO";
        } else {
            msg = "";
        }
        document.getElementById("hint").value = msg;
    }

    /**
     * isWall returns true if there is a maze wall in the given direction.
     *
     * @param direction the direction to check for a wall
     */
    var isWall = function(direction) {
        var gap = 2; // gap between marker and wall
        switch(direction) {
        case Direction["up"]:
            var pixel = ctx.getImageData(x, y - gap, 1, 1).data;
            break;
        case Direction["down"]:
            var pixel = ctx.getImageData(x, y + h + gap, 1, 1).data;
            break;
        case Direction["left"]:
            var pixel = ctx.getImageData(x - gap, y, 1, 1).data;
            break;
        case Direction["right"]:
            var pixel = ctx.getImageData(x + w + gap, y, 1, 1).data;
            break;
        default:
            console.log("isWaLL: " + direction + " is an invalid direction");
            return;
        }
        // Return true if pixel is black
        return compare(pixel,[0,0,0,255]);
        //return false; // TODO Disable collision detection for debugging
    }

    /**
     * move the marker in the given direction if there is no maze border or wall
     * in the way.
     *
     * @param direction the direction to move
     * @param trail a CSS color value, gradient, or pattern object describing
     * the trail to leave behind
     */
    var move = function(direction, trail) {
        // Leave a trail of previous markers
        draw(trail);
        switch(direction) {
        case Direction["up"]:
            if (y - dy > 0 && !isWall(direction)) {
                y -= dy;
            }
            break;
        case Direction["down"]:
            if (y + h + dy < canvas.width && !isWall(direction)) {
                y += dy;
            }
            break;
        case Direction["left"]:
            if (x - dx > 0 && !isWall(direction)) {
                x -= dx;
            }
            break;
        case Direction["right"]:
            if (x + w + dx < canvas.width && !isWall(direction)) {
                x += dx;
            }
            break;
        default:
            console.log("move: " + direction + " is an invalid direction");
            return;
        }

        // Record path taken through the maze
        // TODO: reduce potential array length by only recording when the current
        // position is different from the previous position. They would be the same
        // if a wall was in the way.
	// TODO Move this to doKeyDown function
        path.push(x);
        path.push(y);

        // Draw the marker a different color so it can be distinguished from the trail
        draw(marker);
    }

    /**
     * Tremaux's maze solving algorithm. A direction is chosen and the path is marked
     * with one color if this is the first traversal, or a second color if this is
     * the second traversal. At intersections, a path that hasn't been taken is chosen.
     * If there is no unmarked path and the current path has only been marked once,
     * turn around. Otherwise, choose a path with the fewest marks. Paths marked exactly
     * once lead back to the start.
     *
     * @param direction the direction to start tracing
     */
    var tremaux = function(direction) {
        var markedOnce = function(pixel) {
            return compare(pixel,[0,255,0,255]);
        }
        var markedTwice = function(pixel) {
            return compare(pixel,[255,0,0,255]);
        }
	var onceTrail = "Green";			// first traversal color
	var twiceTrail = "Red";				// second traversal color
        var relativeL = (direction + 4 - 1) % 4;	// relative left
        var relativeR = (direction + 4 + 1) % 4;	// relative right

        // Base case: stop tracing at the maze exit
        if(x === Exit['x'] && y === Exit['y']) return;
        while(!isWall(direction)) {
            move(direction, onceTrail);
        }
	if(isWall(relativeL)){}


        alert("");
    }

})();
