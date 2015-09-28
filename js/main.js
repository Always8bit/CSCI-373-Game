// Display Variables
var stage;
var renderer;
// Object Variables
var tower;
var robot;
var missile;
var equationBox;
var problemGenerator;
var numberLine;
var target;
var launch_button;
var background;
var user_answer;

// Animation Variables
var robotAnimation; // 0 stop, 1 moveToPostion, 2 selfdestruct, 3 attack

/*var gameTimer;
var gameTime = 0; 8
var updateTime; */

var lives;

// Number Line Global Variables
var nl_w = 550;
var nl_h = 1;

// Equation Box Global Variables
var eqb_w = 600;
var eqb_h = 100;

function numberLine_update() {
    numberLine.clear();
    numberLine.lineStyle(2, 0x000000, 1.0);
    numberLine.drawRect(0, 0, nl_w, nl_h);
    for (var i = 0; i <= (problemGenerator.rangeTop-problemGenerator.rangeBottom); i++) {
        var range = (problemGenerator.rangeTop-problemGenerator.rangeBottom);
        numberLine.drawRect((i/range)*nl_w, 0, 1, 10);
        var text = new PIXI.Text((i+problemGenerator.rangeBottom),{font : '16px Arial', fill : 0x000000, align : 'center'});
        text.x = (i/range)*nl_w-4;
        text.y = 20;
        numberLine.addChild(text);
    }
}

function init_numberLine() {
    numberLine = new PIXI.Graphics();
    numberLine.x = 50;
    numberLine.y = 555;
    numberLine_update();
    stage.addChild(numberLine);
}

function numberLine_coordiniates(number) {
    for (var i = 0; i < (problemGenerator.rangeTop-problemGenerator.rangeBottom); i++) {
        var range = (problemGenerator.rangeTop-problemGenerator.rangeBottom);
        var nl_num = i+problemGenerator.rangeBottom;
        var nl_x = (i/range)*nl_w + numberLine.x;
        var nl_y = numberLine.y;
        if (nl_num == number) {
            return {x: nl_x, y: nl_y};
        }
    }
    return -1;
}

// distance formula:
// d = sqrt( (x2 - x1)^2 + (y2 - y1)^2 )
// returns an object with the x and y position and the number
// {x: n, y: n, number: n}
function numberLine_getClosestNumberPosition(x, y) {
    var answers = new Array();
    var range = (problemGenerator.rangeTop-problemGenerator.rangeBottom);
    for (var i = 0; i <= (problemGenerator.rangeTop-problemGenerator.rangeBottom); i++) {
        var nl_num = i+problemGenerator.rangeBottom;
        var nl_x = (i/range)*nl_w + numberLine.x;
        var nl_y = 20 + numberLine.y;
        var d = Math.sqrt( (nl_x - x)*(nl_x - x) + (nl_y - y)*(nl_y - y) );
        answers.push( {distance: d, x: nl_x, y: nl_y, number: nl_num} );
    }
    
    var lowest_index = 0;
    var lowest_distance = answers[0].distance;
    for (var i = 0; i < answers.length; i++) {
        if (answers[i].distance < lowest_distance) {
            lowest_distance = answers[i].distance;
            lowest_index = i;
        }
    }
    if (lowest_distance > 50) {
        return -1;
    }
    return answers[lowest_index];
}


function init_problemGenerator() {
    problemGenerator = {
        rangeBottom: 0,
        rangeTop: 0,
        num1: 0,
        num2: 0,
        answer: 0,
        difficulty: 0,
        generateNewProblem: function() {
            // Difficulty 0
            if (this.difficulty == 0) {
                // Answer ranges from -5 to +5
                this.answer = (Math.floor(Math.random()*10))-5;
                // First number deviates a max of 4 away +/-
                this.num1   = (Math.floor(Math.random()*8))-4;
                // num1 + num2 = answer!
                this.num2   = this.answer-this.num1;
                this.rangeBottom = Math.min(this.answer, this.num1, this.num2)-(Math.floor(Math.random()*2));
                this.rangeTop    = Math.max(this.answer, this.num1, this.num2)+(Math.floor(Math.random()*2));
            }
            // Difficulty 1
            if (this.difficulty == 1) {
                // Answer ranges from -20 to +20
                this.answer = (Math.floor(Math.random()*40))-20;
                // First number deviates a max of 10 away +/-
                this.num1   = (Math.floor(Math.random()*10))-5;
                // num1 + num2 = answer!
                this.num2   = this.answer-this.num1;
                this.rangeBottom = Math.min(this.answer, this.num1, this.num2)-(Math.floor(Math.random()*4));
                this.rangeTop    = Math.max(this.answer, this.num1, this.num2)+(Math.floor(Math.random()*4));
            }
            // Difficulty 2
            if (this.difficulty == 2) {
                // Answer ranges from -40 to +40
                this.answer = (Math.floor(Math.random()*80))-40;
                // First number deviates a max of 16 away +/-
                this.num1   = (Math.floor(Math.random()*80))-8;
                // num1 + num2 = answer!
                this.num2   = this.answer-this.num1;
                this.rangeBottom = Math.min(this.answer, this.num1, this.num2)-(Math.floor(Math.random()*4));
                this.rangeTop    = Math.max(this.answer, this.num1, this.num2)+(Math.floor(Math.random()*4));
            }
        },
        setDifficulty: function(n) {
            if (n < 0) {
                this.difficulty = 0;
            } else if (n > 2) {
                this.difficulty = 2;
            } else {
                this.difficulty = n;
            }
        }
    }
}

function init_tower() {
    tower = PIXI.Sprite.fromImage('images/tower.png');
    tower.position.x=-165;
    tower.position.y=261;
    stage.addChild(tower);
}

function init_robot() {
    robot = PIXI.Sprite.fromImage('images/robot.png');
    robot.position.x=50;
    robot.position.y=500;
	robotAnimation = 0;
    stage.addChild(robot);
	
}

function init_missile() {
	missile = PIXI.Sprite.fromImage('images/missile.png');
	missile.position.x=770;
	missile.position.y=225;
	stage.addChild(missile);
}

function missile_moveToPosition(){
	if(missile.y >= -100){
		missile.y -= 7;
	}	
}	

function robot_moveToPosition(){
	if(robot.x <= numberLine_coordiniates(problemGenerator.answer).x-16)
    {
        robot.x += 5;
	}
}

function robot_attack(){
	if(robot.x <= 1000){
		robot.x += 10;
		lives -= 1;
	}
}

function init_missile() {
	missile = PIXI.Sprite.fromImage('images/missile.png');
	missile.position.x=770;
	missile.position.y=225;
	stage.addChild(missile);
}



function equationBox_update() {
    equationBox.clear();
    // background box
    equationBox.beginFill(0x333333, 1.0);
    equationBox.lineStyle(2, 0x000000, 1.0);
    equationBox.drawRect(0, 0, eqb_w, eqb_h);
    // two number boxes
    equationBox.beginFill(0xFFFFFF, 1.0);
    equationBox.drawRect(10, 10, eqb_h-20, eqb_h-20);
    equationBox.drawRect(150, 10, eqb_h-20, eqb_h-20);
    // plus symbol
    equationBox.lineStyle(0, 0x000000, 0.0);
    equationBox.drawRect(117,36,5,30);
    equationBox.drawRect(104,48,30,5);
    var n1 = new PIXI.Text(problemGenerator.num1,{font : '28px Arial', fill : 0x000000, align : 'center'});
    var n2 = new PIXI.Text(problemGenerator.num2,{font : '28px Arial', fill : 0x000000, align : 'center'});
    n1.x = 38;
    n1.y = 35;
    n2.x = 38+144;
    n2.y = 35;
    equationBox.addChild(n1);
    equationBox.addChild(n2);
    init_launch_button();
}

function init_equationbox() {
    equationBox = new PIXI.Graphics();
    equationBox.x = 10;
    equationBox.y = 10;
    equationBox_update();
    stage.addChild(equationBox);
}

function init_target(){
    target = PIXI.Sprite.fromImage('images/target.png');
    target.interactive = true;
    target.buttonMode = true;
    target.anchor.set(0.5);
    target
        // events for drag start
        .on('mousedown', function(event) {
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
        })
        // events for drag end
        .on('mouseup', function() {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
            var snap_object = numberLine_getClosestNumberPosition(this.position.x, this.position.y);
            user_answer = snap_object;
            if (snap_object != -1) {
                this.position.x = snap_object.x;
                this.position.y = snap_object.y-15;
                if (snap_object.number == problemGenerator.answer) {
                    win_screen();
                } else{
                    lose_screen();
              }
            }
        })
        // events for drag move
        .on('mousemove', function() {
            if (this.dragging)
            {
                var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x;
                this.position.y = newPosition.y;
            }
        });
    // move the sprite to its designated position
    target.position.x = 522;
    target.position.y = 90;
    
    stage.addChild(target);
}


  function init_launch_button() {
 /*   launch_button
        //event for clicking the launch button
        .on('click', function(event) {
            this.data = event.data;
			robotAnimation = 1;
            if (problemGenerator.answer == user_answer) 
            {
                //robot explode animate yay
                robotAnimation = 2;
                
            } else {
                robotAnimation = 3;
            }
        })
    
    stage.addChild(launch_button);
   */ 
} 


function win_screen() {
    var win_text = new PIXI.Text("You win!",{font : '28px Arial', fill : 0x000000, align : 'center'});
    win_text.x = 440;
    win_text.y = 240;
    stage.addChild(win_text);
}

function lose_screen(){
    var lose_text = new PIXI.Text("You Lose!", {font: '28px Arial', fill: 0x000000, align : 
'center'});
    lose_text.x = 440;
    lose_text.y = 240;
    stage.addChild(lose_text);
}


function init_instructions() {
    var basicText = new PIXI.Text('Place the target on the correct number on the numberline', {font : '23px Arial', fill : 0x000000, align : 'center'});
    basicText.x = 20;
    basicText.y = 115;
    stage.addChild(basicText);
}

function init_background() {
    background = PIXI.Sprite.fromImage('images/background1.png');
    background.x = 0;
    background.y = 0;
    stage.addChild(background);
}


function buttonGenerator(x, y, width, height, color, elevation, speed, text, clickedFunction) {
    var button = new PIXI.Graphics();
    var button_top_gfx = new PIXI.Graphics();
    var button_bottom = new PIXI.Graphics();
    
    var interval_variable; 
    
    button_top_gfx.beginFill(color, 1.0);
    button_bottom.beginFill(buttonGenerator_darknessHalved(color), 1.0);
    button_top_gfx.drawRect(0, 0, width, height);
    button_bottom.drawRect(0, 0, width, height);
        
    var button_top_tex = button_top_gfx.generateTexture();
    var button_top = new PIXI.Sprite(button_top_tex);

    var text_gfx = new PIXI.Text(text,{font : '28px Arial', fill : 0x000000, align : 'center'});
    text_gfx.x = 0;
    text_gfx.y = 0;
    button_top.addChild(text_gfx);
    
    button.addChild(button_bottom);
    button.addChild(button_top);
    button_top.x = 0-elevation;
    button_top.y = 0-elevation;
    button_bottom.x = 0;
    button_bottom.y = 0;
    button.x = x;
    button.y = y;
    button_top.interactive = true;
    button_top.buttonMode = true;
    button_top
    .on('mousedown', function(event) {
        clearInterval(interval_variable);
        interval_variable = setInterval(function(){
            var range = elevation - button_top.x;
            range *= speed;
            button_top.x += range;
            button_top.y += range;
            if (Math.round(button_top.x) == 0) {
                clearInterval(interval_variable); 
            }
            if (button_top.x > 0) {button_top.x = 0;}
            if (button_top.y > 0) {button_top.y = 0;}
        }, 20);
    })
    .on('mouseup', function(event) {
        button_top.x = 0;
        button_top.y = 0;
        clearInterval(interval_variable);
        interval_variable = setInterval(function(){
            var range = button_top.x - elevation;
            range *= speed;
            button_top.x += range;
            button_top.y += range;
            if (Math.round(button_top.x) < -elevation) {
                clearInterval(interval_variable); 
                button_top.x = -elevation;
                button_top.y = -elevation;
            }
        }, 20);
        clickedFunction();
    });
    return button;
}

function buttonGenerator_darknessHalved(color) {
    var red   = (color >>> 16)&0xFF;
    var green = (color >>>  8)&0xFF;
    var blue  = (color >>>  0)&0xFF;
    red   = Math.floor(red/2);
    green = Math.floor(green/2);
    blue  = Math.floor(blue/2);
    red   = (red   << 16)&0xFF0000;
    green = (green <<  8)&0x00FF00;
    blue  = (blue  <<  0)&0x0000FF;
    return red|green|blue;
}

window.onload = function(){
    renderer = PIXI.autoDetectRenderer(1000, 600,{backgroundColor : 0xEEEEEE});
    document.getElementById('game_wrapper').appendChild(renderer.view);
    // create the root of the scene graph
    stage = new PIXI.Container();
    // init stage
    init_background();
    init_problemGenerator();
    problemGenerator.setDifficulty(0);
    problemGenerator.generateNewProblem();
    init_numberLine();
    init_tower();
	init_missile();
    init_robot();
    init_equationbox();
    init_numberLine();
    init_target();
    init_instructions();

    // start animating

    stage.addChild(buttonGenerator(500, 300, 100, 50, 0xAAAAFF, 5, 0.3, "test", function () {
        console.log("hey nice");
    }));

    animate();

}

function animate() {
    requestAnimationFrame(animate);
	missile_moveToPosition();
	robot_moveToPosition();
	robot_attack();
    // render the container
    renderer.render(stage);
}
