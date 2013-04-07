/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Maze uses an HTML5 canvas to draw a maze image and provide an interface for
 * users to navigate the maze using arrow keys. The user can request a hint by
 * pressing 'h'.
 *
 * Maze has two primary design flaws. The first is that it makes several assumptions
 * about the maze image such as the location of the beginning and end as well as the
 * width and shape of the passages. Second, it does not use a data structure. This
 * makes the current implementation simple, but fragile and difficult to extend.
 *
 * @author Jason Travis
 */
(function() {
    // preprocessed solution path
    var solution = [2,2,2,2,3,0,0,0,3,2,3,3,3,2,3,3,0,1,0,0,3,2,3,3,3,0,3,2,3,3,3,2,1,1,1,1,2,2,2,1,2,1,2,1,2,3,2,3,0,0,3,0,3,0,3,0,1,0,3,3,3,3,3,2,1,1,1,2,2,2,2,3,3,2,1,2,3,2,1,1,0,0,1,0,0,1,2,2,1,2,3,3,2,1,2,3,2,1,1,2,3,3,3,0,3,3,2,2,1,2,3,3,2,2,2,1,0,1,2,1,0,0,0,1,1,1,0,1,0,0,1,0,3,0,1,1,1,2,1,2,1,1,1,0,3,0,3,0,0,1,1,0,1,0,3,0,1,1,2,2,2,3,2,2,1,2,2,3,2,3,2,2,3,3,2,2,2,1,1,2,2,3,3,3,0,0,3,2,2,3,0,0,0,1,0,0,3,2,3,0,3,2,2,2,1,2,2,3,0,3,2,3,2,3,3,2,2,2,3,2,2,2,3,3,0,1,0,3,3,0,0,1,1,0,3,0,0,0,3,2,3,3,2,2,1,2,2,2,2,3,3,2,2,2,3,0,0,0,3,3,3,2,1,1,2,2,3,3,2,1,1,1,2,2,2,3,0,0,3,2,3,0,3,0,0,3,2,3,0,3,0,0,3,2,3,0,0,3,2,2,2,1,1,2,1,2,3,2,1,2,3,3,0,3,3,0,0,0,3,3,2,3,0,0,1,1,0,1,0,3,3,2,3,0,3,0,0,0,1,1,1,2,2,1,1,1,1,2,1,0,1,1,2,2,2,1,0,0,0,1,1,1,0,3,0,1,0,0,1,2,1,0,0,0,0,3,2,2,3,3,3,3,0,1,0,3,3,3,2,3,0,0,1,1,1,1,1,0,0,3,2,3,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,3,2,2,3,0,3,0,0,1,0,1,1,0,3,0,0,0,3,3,0,0,3,2,3,0,0,3,3,3,3,3,2,2,3,0,3,0,3,2,3,0,3,3,3,2,2,3,3,2,3,3,2,3,3,0,1,0,1,1,0,0,3,2,3,0,3,3,2,3,0,3,3,3,3,2,2,3,2,1,2,2,3,0,3,2,2,1,1,2,1,0,0,1,0,3,0,0,1,2,1,2,2,1,0,1,2,1,1,2,2,3,0,3,3,2,1,2,3,2,1,2,1,0,1,0,1,1,0,1,0,1,2,2,1,0,1,2,2,2,2,3,0,0,3,2,3,2,1,2,1,1,1,0,0,0,0,0,0,0,0,1,0,0,1,2,1,1,1,1,0,0,1,2,1,0,1,2,2,1,2,3,2,1,1,2,2,3,2,3,2,3,0,0,0,3,2,2,3,0,3,0,3,0,3,2,3,2,1,1,2,2,2,2,2,2,1,2,3,3,3,0,3,2,3,3,2,3,0,3,3,2,2,2,1,0,1,2,1,1,2,2,2,2,3,2,3,2,3,3,0,1,0,0,3,3,3,0,1,1,0,3,0,0,3,2,3,2,3,3,3,3,2,3,2,1,2,2,3,0,3,0,0,3,2,2,2,1,2,2,2,1,2,3,2,3,0,0,0,0,3,3,0,0,1,0,0,3,3,3,2,2,3,2,1,2,3,2,3,0,0,3,0,0,0,3,2,3,2,2,1,2,3,2,3,0,0,0,3,0,0,1,1,0,1,1,1,2,1,0,1,1,1,0,1,2,1,1,0,3,0,3,0,0,0,0,3,0,3,2,3,2,3,0,3,3,0,0,3,3,2,1,2,2,2,1,0,1,2,2,2,2,3,3,3,0,1,0,3,3,2,3,2,1,2,3,3,2,3,2,3,0,0,1,0,1,0,3,0,1,0,3,3,0,3,2,3,0,3,2,2,3,2,1,1,0,1,1,2,3,2,3,3,3,3,0,3,0,3,0,1,1,0,0,0,3,0,0,3,2,2,3,2,3,3,3,0,0,0,0,3,0,1,1,1,2,1,0,1,1,2,1,1,1,0,0,3,3,0,3,0,3,3,0,1,1,1,2,1,2,1,0,1,2,2,2,2,1,2,1,0,1,0,3,3,0,0,0,0,0,0,0,3,3,2,2,1,2,3,3,0,3,0,3,2,3,0,3,2,3,3,2,2,2,2,3,3,3,0,0,3,3,0,0,1,2,1,0,0,1,1,0,3,3,3,3,2,3,3,2,2,1,2,3,2,3,2,2,2,3,2,2,3,2,3,0,0,3,2,2,3,3,2,1,1,1,1,2,3,2,3,2,3,0,3,0,3,3,0,1,0,3,3,3,3,2,2,2,1,1,1,1,2,2,3,3,0,3,2,3,2,3,0,0,0,0,3,2,3,2,1,2,2,2,1,1,2,2,1,0,1,2,1,0,1,0,0,1,0,1,1,1,1,2,2,3,0,3,2,2,2,2,3,3,0,3,2,2,1,1,1,1,2,1,0,1,0,3,0,1,1,2,1,0,0,1,0,1,0,0,1,0,0,0,3,0,3,2,3,2,3,0,3,0,1,1,0,3,0,1,1,0,0,1,2,1,1,2,2,1,2,2,2,2,2,2,1,2,3,2,2,1,2,2,3,2,1,2,1,1,0,3,0,0,1,2,1,2,2,2,1,1,1,0,0,0,1,2,2,1,2,3,2,3,3,2,1,2,2,2,1,1,0,0,3,0,1,1,2,2,1,1,0,1,0,1,0,3,0,0,3,2,2,3,3,0,0,0,3,0,1,0,3,3,0,1,1,1,2,1,1,1,2,3,2,1,2,1,2,1,2,2,3,2,3,2,1,2,3,2,1,2,3,2,3,2,3,3,3,3,0,3,3,0,3,2,2,1,2,3,3,0,0,0,3,2,2,3,2,1,2,1,2,2,3,3,2,1,1,1,0,1,2,2,3,3,2,3,2,3,3,0,0,3,0,1,0,0,0,0,3,0,1,0,1,0,3,3,3,3,0,0,1,2,1,1,1,1,0,1,0,1,0,3,0,3,2,3,3,3,0,1,0,3,0,3,3,3,2,1,2,3,2,1,2,3,2,2,2,2,2,2,2,1,1,1,2,2,3,3,0,3,2,2,2,1,1,2,2,3,0,3,3,0,0,3,0,1,0,3,0,3,3,3,3,2,3,0,0,1,0,3,3,2,2,3,3,2,1,1,2,2,2,2,3,3,3,2,1,1,2,1,1,0,0,1,1,0,0,0,1,1,2,3,2,1,1,2,3,2,1,1,1,2,3,3,3,2,2,3,0,0,0,3,2,3,2,3,3,2,2,2,3,0,0,0,3,0,3,3,2,3,0,0,1,0,3,0,1,1,0,0,0,0,0,1,0,1,0,0,3,0,1,1,1,2,3,2,1,1,1,0,1,0,1,2,1,0,0,1,0,3,3,0,3,0,1,1,2,1,0,0,3,0,0,0,1,2,1,0,1,0,3,3,3,3,3,2,3,2,2,3,3,2,3,0,0,3,2,2,2,3,2,2,3,2,3,3,0,0,0,1,0,3,3,2,2,3,2,2,3,2,3,2,2,3,3,3,3,2,1,1,1,1,2,2,1,2,3,2,1,1,0,1,1,0,0,3,3,0,1,1,0,0,0,1,1,2,2,2,3,2,2,2,2,3,3,2,2,2,2,2,2,3,2,2,2,3,2,2,1,1,0,1,0,1,0,3,0,1,1,2,2,1,2,3,2,3,2,2,2,3,3,3,3,2,1,2,1,0,1,1,1,2,1,0,1,2,2,1,2,2,3,2,3,0,3,2,3,2,1,1,1,1,1,1,0,0,0,3,0,0,1,1,2,1,0,1,2,2,1,0,0,1,2,2,2,1,2,2,3,2,1,1,2,1,2,3,2,3,2,2,1,2,1,1,2,1,2,1,2,2,3,3,3,3,0,3,2,2,1,1,2,2,2,3,3,0,1,0,3,3,2,2,3,2,3,3,0,0,0,3,2,2,3,0,3,3,2,1,2,2,2,3,2,2,2,2,2,3,2,3,3,2,3,3,0,0,3,3,2,2,2,1,2,2,3,0,3,3,2,2,3,3,3,2,3,0,3,2,2,1,1,2,3,3,3,0,0,0,3,2,3,2,2,3,2,1,1,2,3,3,2,2,1,1,1,1,0,1,2,2,2,3,0,3,2,3,3,3,2,2];
    // maze canvas element
    var canvas = document.getElementById('maze');
    // canvas context
    var ctx = canvas.getContext('2d');
    // maze image
    var maze = new Image();

    // Direction enum
    var Direction = {"left":0,"up":1,"right":2,"down":3};
    // start coordinates
    var Start = {"x":5,"y":7};
    // exit coordinates
    var Exit = {"x":797,"y":799};

    // size of marker
    var m = 4;
    // marker x position
    var x = Start['x'];
    // marker y postion
    var y = Start['y'];
    // how much x is changed when an arrow key is pressed
    var dx = m + m;
    // how much y is changed when an arrow key is pressed
    var dy = m + m;
    // marker color
    var marker = "Purple";
    // trail color
    var trail = "Yellow";
    // rgba wall color
    var wallColor = [0,0,0,255];

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
     *
     * @param pixel a pixel object
     * @param rgba an array representing a color using rgba values
     * rgba = [red,green,blue,alpha]
     * @return true if pixel is the same color
     */
    var compare = function(pixel,rgba) {
        return pixel[0] === rgba[0] && pixel[1] === rgba[1] && pixel[2] === rgba[2] && pixel[3] === rgba[3];
    }

    /**
     * doKeyDown moves the marker when an arrow key is pressed
     * or requests a hint when 'h' is pressed.
     *
     * @param evt the event passed by the event listener
     */
    var doKeyDown = function(evt) {
        var direction = null;

        // Hide hint on next keypress
        hint(false);
        switch (evt.keyCode) {
        case 38:	// Up arrow was pressed
            direction = Direction["up"];
            break;
        case 40:	// Down arrow was pressed
            direction = Direction["down"];
            break;
        case 37:	// Left arrow was pressed
            direction = Direction["left"];
            break;
        case 39:	// Right arrow was pressed
            direction = Direction["right"];
            break;
        case 72:	// 'h' was pressed
            hint(true);
            break;
        }
        // If an arrow key was pressed and the marker moved
        if(direction != null && move(direction)) {
            if(direction == solution[0]) {
                // If it was in the correct direction remove it from the solution path
                solution.shift();
            } else {
                // else add the opposite direction to the solution path
                solution.unshift((direction+2)%4);
            }
        }
    }

    /**
     * draw the marker at the current position.
     *
     * @param color the marker color
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
     * @return pixel at the relative position
     */
    var getPixel = function(direction, gap) {
        var pixel;
        switch(direction) {
        case Direction["up"]:
            pixel = ctx.getImageData(x, y - gap, 1, 1).data;
            break;
        case Direction["down"]:
            pixel = ctx.getImageData(x, y + (m - 1) + gap, 1, 1).data;
            break;
        case Direction["left"]:
            pixel = ctx.getImageData(x - gap, y, 1, 1).data;
            break;
        case Direction["right"]:
            pixel = ctx.getImageData(x + (m - 1) + gap, y, 1, 1).data;
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
        if(show) {
            var direction = "Error: Invalid direction";
            document.getElementById("hint").value = "Calculating hint...";
            // Calculate path from current position to exit
            //solution = tremaux();
            //console.log(solution.toString());
            // Restore canvas state
            //x = Start['x'];
            //y = Start['y'];
            //ctx.drawImage(maze,0,0);
            //draw(marker);
            //path.forEach(move);
            // Parse next solution direction to a string
            switch(solution[0]) {
            case Direction["up"]:
                direction = "up";
                break;
            case Direction["down"]:
                direction = "down";
                break;
            case Direction["left"]:
                direction = "left";
                break;
            case Direction["right"]:
                direction = "right";
                break;
            }
            // Display hint
            document.getElementById("hint").value = direction;
        } else {
            // Hide hint
            document.getElementById("hint").value = "";
        }
    }

    /**
     * isWall returns true if there is a maze wall in the given direction.
     *
     * @param direction the direction to check for a wall
     * @return true if the pixel is black
     */
    var isWall = function(direction) {
        var gap = 2; // gap between marker and wall
        var pixel = getPixel(direction, gap);
        // Return true if pixel is black
        return compare(pixel,wallColor);
    }

    /**
     * move the marker in the given direction if there is no wall in the way.
     *
     * @param direction the direction to move
     * @return true if move successful
     */
    var move = function(direction) {
        // Cannot move, there is a wall
        if(isWall(direction)) return false;

        // Leave a trail of previous markers
        draw(trail);

        // Move the marker
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
            return false;
        }

        // Draw the marker a different color so it can be distinguished from the trail
        draw(marker);
        return true;
    }

    /**
     * Tremaux's maze solving algorithm. A direction is chosen and the path is marked
     * with one color if this is the first traversal, or a second color if this is
     * the second traversal. At intersections, a path that hasn't been taken is chosen.
     * If there is no unmarked path and the current path has only been marked once,
     * turn around. Otherwise, choose a path with the fewest marks. Paths marked exactly
     * once lead back to the start.
     *
     * @return solution path
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
        // an arbitrary starting direction
        var direction = Direction["up"];
        // solution path
        var solution = [];
        // the pixel we're checking to see if the path has been marked
        var pixel;

        // Redraw the maze so nothing interferes with the search
        ctx.drawImage(maze,0,0);

        // Search until we find the exit
        while(x !== Exit['x'] || y !== Exit['y']) {
            // Leave a trail of paths explored.
            trail = onceTrail;
            // Check all directions twice. The first check finds unexplored paths.
            // The second check finds the way back to the solution path, marking
            // the path as a dead end.
            for(var i = 0; i < 8; i++) {
                direction = (direction + i) % 4;
                if(isWall(direction)) continue;
                pixel = getPixel(direction, m + 1);
                // Find unexplored paths
                if(!markedOnce(pixel) && !markedTwice(pixel)) break;
                // On the second check, find a path that hasn't been marked as a dead end
                if(i > 3 && !markedTwice(pixel)) break;
            }
            // If retracing path, mark it as a dead end and remove it from the solution array
            if(markedOnce(pixel)) {
                trail = twiceTrail;
                solution.pop();
            } else {
                // Add the current path to the solution
                solution.push(direction);
            }
            move(direction);
        }
        // Redraw maze and replay solution path
        //x = Start['x'];
        //y = Start['y'];
        //ctx.drawImage(maze,0,0);
        //solution.forEach(move);
        return solution;
    }

    /**
     * rightHand solves the maze using the Right Hand Rule algorithm.
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
