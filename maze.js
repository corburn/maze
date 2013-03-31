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

        //pathFinder();

        // Listen for arrow keys
        window.addEventListener('keydown',doKeyDown,true);
    }

    /**
     * doKeyDown moves the marker when an arrow key is pressed.
     */
    var doKeyDown = function(evt) {
        // Draw previous markers blue
        draw("Blue");
        switch (evt.keyCode) {
        case 38:  /* Up arrow was pressed */
            if (y - dy > 0) {
                y -= dy;
            }
            break;
        case 40:  /* Down arrow was pressed */
            if (y + h + dy < img.width) {
                y += dy;
            }
            break;
        case 37:  /* Left arrow was pressed */
            if (x - dx > 0) {
                x -= dx;
            }
            break;
        case 39:  /* Right arrow was pressed */
            if (x + w + dx < img.width) {
                x += dx;
            }
            break;
        }
        // Draw the marker purple
        draw("Purple");
    }

    /**
     * draw draws the marker at the current position.
     */
    var draw = function(color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x,y,w,h);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * TODO
     */
    var pathFinder = function() {
        // check 2 pixels away
        // if wall in front check right for wall
        // if wall right check left for wall
        // if wall left turn around
        // advance
	var dir = "up";
        var pixels = ctx.getImageData(0,0,canvas.width,canvas.height).data;
        while(true) {
            switch(dir) {
            case "up":
		    console.log(pixels[x][y]);
                break;
            case "down":
                break;
            case "left":
                break;
            case "right":
                break;
	    default:
		return;
            }
        }
    }

})();
