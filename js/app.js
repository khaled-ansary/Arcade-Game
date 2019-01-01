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
    }

    // checks en enemy's collision with player
    checkCollision() {
        var playerBox = {x: player.x, y: player.y, width: 50, height: 40};
        var enemyBox = {x: this.x, y: this.y, width: 60, height: 70};
        // Check for collisions, if playerBox intersects enemyBox, we have one
        if (playerBox.x < enemyBox.x + enemyBox.width &&
            playerBox.x + playerBox.width > enemyBox.x &&
            playerBox.y < enemyBox.y + enemyBox.height &&
            playerBox.height + playerBox.y > enemyBox.y)  {
            console.log('collision');
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

        this.wall = {left: 101, right: 402, top: 0, bottom: 383};
        this.move = {x: 101, y: 83};
    }

    // Update method for Player
    update() {

    }
    
    // renders the player
    render() {        
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /*
    * handles input for the player
    */
    handleInput(key) {

        switch (key) {
            case "left":
                //check for wall, otherwise move left
                if (this.x > this.wall.left) {
                    this.x -= this.move.x;
                }
                break;
            case "right":
                //check for wall, otherwise move right
                if (this.x < this.wall.right) {
                    this.x += this.move.x;
                }
                break;
            case "up":
                //check if player reached top of water, if so call success function,
                // otherwise move up
                if (this.y < this.wall.top) {
                    canvas.inceaseScore();
                    canvas.completeLevel();
                } else {
                    this.y -= this.move.y;
                }
                break;
            case "down":
                //check for bottom, otherwise move down
                if (this.y < this.wall.bottom) {
                    this.y += this.move.y;
                }
                break;
        }
    }
        
    /*
    * resets the player to default position
    */
    reset(){
        this.x = 202.5;
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
                40: 'down'
            };
            player.handleInput(allowedKeys[e.keyCode]);
        });

    }
    
    /*
    * updates the on screen score display
    */
    updateDisplay() {
        scoreDiv.innerHTML = 'Your Score ' + score;
    }

    /**
     * score increase
     */
    inceaseScore() {
        score += 1;
        this.updateDisplay();
    }

    /**
     * decrease score
     */
    decreaseScore() {
        score -= 1;
        if(score < 1){
            score = 0;
        }
        this.updateDisplay();
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
    
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
const player = new Player(0, 0, 50);

canvasDiv = document.getElementsByTagName('canvas')[0];
scoreDiv = document.createElement('div');
document.body.insertBefore(scoreDiv, canvasDiv);
// set score
let score = 0;
const canvas = new Canvas(canvasDiv, scoreDiv, player, score);
canvas.initListener();
canvas.updateDisplay();
canvas.completeLevel();




