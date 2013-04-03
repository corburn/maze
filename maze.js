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
(function() {

    // TODO
    // Check for web worker support
    if(typeof(Worker)==="undefined") {
        alert("Your browser does not support web workers");
        return;
    }

    // maze canvas element
    var canvas = document.getElementById('maze');
    // canvas context
    var ctx = canvas.getContext('2d');
    // maze image
    var maze = new Image();
    // TODO
    var worker = new Worker("worker.js");

	// size of marker
	var m = 4;
    // marker x position
    var x = 5;
    // marker y postion
    var y = 7;
    // how much x is changed when an arrow key is pressed
    var dx = m + m;
    // how much y is changed when an arrow key is pressed
    var dy = m + m;
    // path taken through maze
    var path = [];
    // marker color
    var marker = "Purple";
    // trail color
    var trail = "Green";
    // Direction enum
    var Direction = {"left":0,"up":1,"right":2,"down":3};
    // exit coordinates
    // TODO evaluate instead of static
    var Exit = {"x":797,"y":799};

    /**
     * START
     *
     * The program starts when the maze loads.
     */
    maze.src = "maze.png";
    maze.onload = function() {
        // Scale canvas to maze
        canvas.width = this.width;
        canvas.height = this.height;
        // Draw maze
        ctx.drawImage(maze,0,0);
        // Draw marker
        draw(marker);
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
     * or requests a hint when 'h' is pressed.
     */
    var doKeyDown = function(evt) {
        hint(false);	// Hide hint on next keypress
        switch (evt.keyCode) {
        case 38:	// Up arrow was pressed
            move(Direction["up"]);
            break;
        case 40:	// Down arrow was pressed
            move(Direction["down"]);
            break;
        case 37:	// Left arrow was pressed
            move(Direction["left"]);
            break;
        case 39:	// Right arrow was pressed
            move(Direction["right"]);
            break;
        case 72:	// 'h' was pressed
            hint(true);
            break;
        }

        // Record path taken through the maze
        // TODO: reduce potential array length by only recording when the current
        // position is different from the previous position. They would be the same
        // if a wall was in the way.
        //path.push(x);
        //path.push(y);
    }

    /**
     * draw the marker at the current position.
     */
    var draw = function(color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x,y,m,m);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * getPixel returns the pixel 'gap' pixels from the marker in the given direction.
     *
     * @param direction the direction to check
     * @param gap the number of pixels from the marker
     */
    var getPixel = function(direction, gap) {
        // TODO document the use of ctx to draw debugging pixels
        ctx.beginPath();
        switch(direction) {
        case Direction["up"]:
            ctx.fillStyle = "Green";
            var pixel = ctx.getImageData(x, y - gap, 1, 1).data;
            ctx.rect(x+1,y-gap,1,1);
            break;
        case Direction["down"]:
            ctx.fillStyle = "Orange";
            var pixel = ctx.getImageData(x, y + (m - 1) + gap, 1, 1).data;
            ctx.rect(x+1,y+m-1+gap,1,1);
            break;
        case Direction["left"]:
            ctx.fillStyle = "Red";
            var pixel = ctx.getImageData(x - gap, y, 1, 1).data;
            ctx.rect(x-gap,y+1,1,1);
            break;
        case Direction["right"]:
            ctx.fillStyle = "Blue";
            var pixel = ctx.getImageData(x + (m - 1) + gap, y, 1, 1).data;
            ctx.rect(x+m-1+gap,y+1,1,1);
            break;
        default:
            console.log("isWaLL: " + direction + " is an invalid direction");
            return;
        }
        ctx.closePath();
        ctx.fill();
        return pixel;
    }


    /**
     * hint toggles hint.
     *
     * @param show display hint when true
     */
    var hint = function(show) {
        var msg;
        if(show) {
            tremaux();
            //rightHand();
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
        var pixel = getPixel(direction, gap);
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
    var move = function(direction) {
		// 
		if(isWall(direction)) return;

        // Leave a trail of previous markers
        draw(trail);
        switch(direction) {
        case Direction["up"]:
            y -= dy;
            break;
        case Direction["down"]:
            y += dy;
            break;
        case Direction["left"]:
            x -= dx;
            break;
        case Direction["right"]:
            x += dx;
            break;
        default:
            console.log("move: " + direction + " is an invalid direction");
            return;
        }

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
     */
    var tremaux = function() {
		// markedOnce returns true if the pixel is marked with the first traversal color
        var markedOnce = function(pixel) {
            return compare(pixel,[0,128,0,255]);
        }
		// markedTwice returns true if the pixel is marked with the second traversal color
        var markedTwice = function(pixel) {
            return compare(pixel,[255,0,0,255]);
        }
        // first traversal color
        var onceTrail = "rgba(0,128,0,255)";;
        // second traversal color
        var twiceTrail = "rgba(255,0,0,255)";
        var direction = Direction["up"];
        var pixel;

		// Search until we find the exit
        while(x !== Exit['x'] || y !== Exit['y']) {
			// Leave a trail of paths explored.
            trail = onceTrail;
			// Check all directions twice. The first check finds unexplored paths.
			// The second check finds the way back to the solution path, marking
			// the area behind us as a dead end.
            for(var i = 0; i < 8; i++) {
                direction = (direction + i) % 4;
                if(isWall(direction)) continue;
                pixel = getPixel(direction, m + 1);
				// Find unexplored paths
                if(!markedOnce(pixel) && !markedTwice(pixel)) break;
				// 
                if(i > 3 && !markedTwice(pixel)) break;
            }
            if(markedOnce(pixel)) {
                trail = twiceTrail;
                path.pop();
            } else {
            	path.push(direction);
			}
            move(direction);
        }
        ctx.drawImage(maze,0,0);
		x = 5;
		y = 7;
		path.forEach(move);
    }

    /**
     * rightHand solves the maze using the Right Hand Rule algorithm.
     * The Right Hand Rule fails if it hits a circular path.
     */
    var rightHand = function() {
        direction = Direction["up"];
        relativeR = Direction["right"];
        // Search until we find the exit
        while(x !== Exit['x'] || y !== Exit['y']) {
            // While there's nothing in the way and a wall to the right, move forward
            if(!isWall(direction) && isWall(relativeR)) {
                move(direction);
                continue;
            }
            // Move forward in the first open path to the right, left, or back
            for(var i = 1; i < 4; i++) {
                direction = (direction + i) % 4;
                if(isWall(direction)) {
                    continue;
                }
                relativeR = (direction + 1) % 4;
                move(direction);
                break;
            }
        }
    }

})();
