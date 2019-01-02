class Enemy{
    
    constructor(x, y, speed) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started
        this.x = x;
        this.y = y;
        this.speed = speed;

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';

        // Enemy running area
        this.ENEMY_START_X = -50;
        this.ENEMY_END_X = 505; 
        this.ENEMY_SPEED = 100 + Math.floor(Math.random() * 222);


    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update (dt){

         // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x = this.x + this.speed * dt;
        if (this.x >= this.ENEMY_END_X) {
            this.x = this.ENEMY_START_X;
            this.speed = this.ENEMY_SPEED;
        }
        this.checkCollision();
    }

    
    // Draw the enemy on the screen, required method for game
    render() {

        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.fillStyle = "white";
        ctx.font = "16px Comic Sans MS";
        ctx.fillText(`Score: ${score}`, 100, 70);
        ctx.fillText(`time: ${timeModel.min} mins ${timeModel.sec} sec` , 200, 70);

        // if score reach the win score, it will give a message and 
        // hold the game
        // we can restart the game by press 'enter'
        if (score >= MAX_SCORE) {
            ctx.fillStyle = "green";
            ctx.font = "20px Comic Sans MS";
            ctx.fillText(`You win the Game with Score: ${score}`, 141, 200);
            ctx.fillText(`time takes: ${timeModel.min} mins ${timeModel.sec} sec` , 141, 225);
            canvas.clearTimer();
            timeModel.isStop = true;   
        }
    }

    // checks en enemy's collision with player
    checkCollision() {
        var playerBox = {x: player.x, y: player.y, width: 50, height: 40};
        var enemyBox = {x: this.x, y: this.y, width: 60, height: 70};
        // Check for collisions, if playerBox intersects enemyBox, score decrease by 1
        // and the setset the player and enemies
        if (playerBox.x < enemyBox.x + enemyBox.width &&
            playerBox.x + playerBox.width > enemyBox.x &&
            playerBox.y < enemyBox.y + enemyBox.height &&
            playerBox.height + playerBox.y > enemyBox.y)  {
            this.resetGame();
            canvas.decreaseScore();
        }
    } 
    
     /*
    * resets the game in case of collision
    */
    resetGame() {
        player.reset();
        this.score = 0;
        allEnemies = [];
        allEnemies.push(
            new Enemy(0, Math.random() * 150 + 50, Math.random() * 100 + 40),
            new Enemy(0, Math.random() * 150 + 70, Math.random() * 100 + 60)
        );
    }
}

class Player{
    
    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.
    constructor(x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = 'images/char-boy.png';

        this.wall = {left: 101, right: 402, top: 0, bottom: 383, middle: 202.5};
        this.move = {x: 101, y: 83};
    }

    // Update method for Player
    update() {

    }
    
    // renders the player
    render() {        
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        if(timeModel.isStop)
        {
            ctx.fillStyle = "blue";
            ctx.font = "16px Comic Sans MS";
            ctx.fillText(`press "enter" to restart the Game` , 141, 255);
            ctx.fillText(`use arrow keys to move ` , 141, 275);
        }
    }

    /*
    * handles input for the player
    */
    handleInput(key) {

        switch (key) {
            case "left":
                //check for wall, otherwise move left
                if (this.x > this.wall.left && !timeModel.isStop) {
                    this.x -= this.move.x;
                }
                break;
            case "right":
                //check for wall, otherwise move right
                if (this.x < this.wall.right && !timeModel.isStop) {
                    this.x += this.move.x;
                }
                break;
            case "up":
                //check if player reached top of water, if so call success function,
                // otherwise move up
                if (this.y < this.wall.top && !timeModel.isStop) {
                    canvas.inceaseScore();
                    canvas.completeLevel();
                } else if(!timeModel.isStop) {
                    this.y -= this.move.y;
                }
                break;
            case "down":
                //check for bottom, otherwise move down
                if (this.y < this.wall.bottom && !timeModel.isStop) {
                    this.y += this.move.y;
                }
                break;
            
            case "start":
                // enter to start/restart the game   
                if (timeModel.isStop) {
                    addDiv.innerHTML = '';             
                    timeModel.isStop = false;
                    canvas.setTimer();
                    canvas.completeLevel();
                    score = 0;
                    break;    
                }                
        }
    }
        
    /*
    * resets the player to default position
    */
    reset(){
        this.x = this.wall.middle;
        this.y = this.wall.bottom;
    }
}


class Canvas {

    initListener(){
        // This listens for key presses and sends the keys to your
        // Player.handleInput() method. You don't need to modify this.
        document.addEventListener('keyup', function(e) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down',
                13: 'start'
            };
            player.handleInput(allowedKeys[e.keyCode]);
        });

    }

    /**
     * score increase
     */
    inceaseScore() {
        score += 1;
    }

    /**
     * decrease score
     */
    decreaseScore() {
        score -= 1;
        if(score < 1){
            score = 0;
        }
    }
    
    /*
    * complete level successfully (reached water)
    */
    completeLevel() {
        player.reset();
        if (score % 2 == 0 && allEnemies.length < 4) {
            allEnemies.push(new Enemy(0, Math.random() * 160 + 50, Math.random() * 90 + 70));
        }
    }

    /**
     * set timer 
     * */ 
    setTimer(){
        
        interval = setInterval(function() {
            timeModel.sec++;
            if (timeModel.sec === 60) {
                timeModel.min++;
                timeModel.sec = 0;
            }
            if (timeModel.min >= 60) {
                timeModel.hr++;
                timeModel.min = 0;
            }
        }, 1000);

        return interval;
    }
    
    /**
     * clear timer
     */
    clearTimer(){
        clearInterval(interval);
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
const timeModel = {min: 0, sec: 0, hr: 0, isStop: true};
let interval;
const player = new Player(0, 0, 50);
player.reset();

canvasDiv = document.getElementsByTagName('canvas')[0];
addDiv = document.createElement('div');
document.body.insertBefore(addDiv, canvasDiv);
// set score
let score = 0;
const MAX_SCORE = 10;
const canvas = new Canvas();
canvas.initListener();





