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

    var trail = "Blue";
    var marker = "Purple";

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
     * doKeyDown moves the marker when an arrow key is pressed
     */
    var doKeyDown = function(evt) {
        switch (evt.keyCode) {
        case 38:  // Up arrow was pressed
            move("up");
            break;
        case 40:  // Down arrow was pressed
            move("down");
            break;
        case 37:  // Left arrow was pressed
            move("left");
            break;
        case 39:  // Right arrow was pressed
            move("right");
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
     * isWall returns true if there is a maze wall in the given direction.
     */
    var isWall = function(direction) {
        var gap = 2; // gap between marker and wall
        switch(direction) {
        case "up":
            var pixel = ctx.getImageData(x, y - gap, 1, 1).data;
            break;
        case "down":
            var pixel = ctx.getImageData(x, y + h + gap, 1, 1).data;
            break;
        case "left":
            var pixel = ctx.getImageData(x - gap, y, 1, 1).data;
            break;
        case "right":
            var pixel = ctx.getImageData(x + w + gap, y, 1, 1).data;
            break;
        default:
            console.log("isWaLL: " + direction + " is an invalid direction");
            break;
        }
	// Return true if pixel is black
        return pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 255;
    }

    /**
     * move the marker in the given direction if there is no wall in the way.
     */
    var move = function(direction) {
	    // Draw the previous marker blue
        draw(trail);
        switch(direction) {
        case "up":
            if (y - dy > 0 && !isWall("up")) {
                y -= dy;
            }
            break;
        case "down":
            if (y + h + dy < canvas.width && !isWall("down")) {
                y += dy;
            }
            break;
        case "left":
            if (x - dx > 0 && !isWall("left")) {
                x -= dx;
            }
            break;
        case "right":
            if (x + w + dx < canvas.width && !isWall("right")) {
                x += dx;
            }
            break;
        default:
            console.log("move: " + direction + " is an invalid direction");
            break;
        }
	// Draw the marker purple
	draw(marker);
    }

    /**
     * TODO
     */
    var tremaux = function(dir) {
        if(!isWall(dir)) {
            //move(dir);
        } else {
            switch(dir) {
            case "up":
                dir = "right";
                break;
            case "right":
                dir = "left"
                      break;
            case "left":
                dir = "down";
                break;
            case "down":
                dir = "up";
                break;
            default:
                console.log("pathFinder: " + dir + " is an invalid direction");
                break;
            }
        }
        pathFinder(dir);
    }

})();
