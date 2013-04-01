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

	// width of marker
    var w = 4;
	// height of marker
    var h = 4;
	// marker x position
    var x = 5;
	// marker y postion
    var y = 7;
	// how much x is changed when an arrow key is pressed
    var dx = w + w;
	// how much y is changed when an arrow key is pressed
    var dy = w + w;
	// path taken through maze
    var path = [];
	// marker color
    var marker = "Purple";
	// trail color
    var trail = "Yellow";
    var Direction = {"left":0,"up":1,"right":2,"down":3};
	// exit coordinates TODO evaluate instead of static
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

		console.log(ctx.getImageData(0,0,maze.width,maze.height));
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
     * getPixel returns the pixel 'gap' pixels from the marker in the given direction.
     *
     * @param direction the direction to check
     * @param gap the number of pixels from the marker
     */
    var getPixel = function(direction, gap) {
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
            var tmpTrail = trail;
            //tremaux(Direction["up"]);
            rightHand();
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
        while(x !== Exit['x'] && y !== Exit['y']) {
            while(!isWall(direction)) {
                move(direction);
            }
            if(isWall(relativeL)) {}


            alert("");
        }
    }

    /**
     * TODO
     */
    var rightHand = function() {
        direction = Direction["up"];
        relativeR = Direction["right"];
        while(x !== Exit['x'] && y !== Exit['y']) {
            if(isWall(relativeR) && !isWall(direction)) {
                move(direction);
                console.log("isWall(R): " + isWall(relativeR) + " !isWall(direction): " + !isWall(direction));
                continue;
            }
            for(i=1; i<4; i++) {
                direction = (direction + i) % 4;
                if(isWall(direction)) {
                    continue;
                }
                relativeR = (direction + 1) % 4;
                move(direction);
                break;
            }
        }
        console.log("done");
    }

})();
