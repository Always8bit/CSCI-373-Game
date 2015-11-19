

// Remember to sync before making changes ^o^

// Display Variables
var stage;
var renderer;
var WIDTH = 1000;
var HEIGHT = 600;

// Object Variables
var tower;
var loader;
var robot;
var equationBox;
var problemGenerator;
var numberLine;
var launch_button;
var background;
var user_answer;
var instruction_box;

//music
var audio;
var a_missile;
var a_explosion;
var a_mute_button;

//score
var score = 10000;
var score_text;
var score_text_static;
var time;
var level_num;

var background_b;
var background_f;

//number of wins
var win_count;

// Missile Variables
var missile;
var missileDown;
var missileAnimation; // 0 init, 1 apex and ready to launch down, 2 xplodededed
var missileFlames;

// Target Variables
var target;
var targetSnapped;

// Animation Variables
var robotAnimation; // 0 stop, 1 moveToPostion, 2 atposition, 3 selfdestruct, 4 attack
var robotIntervalVariable;
var robotAnimationFrame;

var lives;

// Number Line Global Variables
var nl_w = 550;
var nl_h = 1;

// Equation Box Global Variables
var eqb_w = 665;
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
    stage.removeChild(numberLine);
    numberLine = new PIXI.Graphics();
    numberLine.x = 50;
    numberLine.y = 555;
    numberLine_update();
    stage.addChild(numberLine);
}

function numberLine_coordiniates(number) {
    for (var i = 0; i <= (problemGenerator.rangeTop-problemGenerator.rangeBottom); i++) {
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
                // Answer ranges from -3 to +3
                this.answer = (Math.floor(Math.random()*6))-3;
                // First number deviates a max of 3 away +/-
                this.num1   = (Math.floor(Math.random()*6))-3;
                // num1 + num2 = answer!
                if (this.num1 < 2 && this.num1 >= 0) {
                    this.num1 = 2;
                }
                if (this.num1 > -2 && this.num1 < 0) {
                    this.num1 = -2;
                }
                this.num2   = this.answer-this.num1;
                this.rangeBottom = Math.min(this.answer, this.num1, this.num2)-(Math.floor(Math.random()*2));
                this.rangeTop    = Math.max(this.answer, this.num1, this.num2)+(Math.floor(Math.random()*2));
            }
            // Difficulty 1
            if (this.difficulty == 1) {
                // Answer ranges from -6 to +6
                this.answer = (Math.floor(Math.random()*12))-6;
                // First number deviates a max of 4 away +/-
                this.num1   = (Math.floor(Math.random()*8))-4;
                // num1 + num2 = answer!
                if (this.num1 < 2 && this.num1 >= 0) {
                    this.num1 = 2;
                }
                if (this.num1 > -2 && this.num1 < 0) {
                    this.num1 = -2;
                }

                this.num2   = this.answer-this.num1;
                this.rangeBottom = Math.min(this.answer, this.num1, this.num2)-(Math.floor(Math.random()*4));
                this.rangeTop    = Math.max(this.answer, this.num1, this.num2)+(Math.floor(Math.random()*4));
            }
            // Difficulty 2
            if (this.difficulty == 2) {
                // Answer ranges from -8 to +8
                this.answer = (Math.floor(Math.random()*20))-10;
                // First number deviates a max of 5 away +/-
                this.num1   = (Math.floor(Math.random()*12))-6;
                // num1 + num2 = answer!
                if (this.num1 < 4 && this.num1 >= 0) {
                    this.num1 = 4;
                }
                if (this.num1 > -4 && this.num1 < 0) {
                    this.num1 = -4;
                }
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
    stage.removeChild(tower);
    tower = PIXI.Sprite.fromImage('images/tower.png');
    tower.position.x=-165;
    tower.position.y=261;
	lives = 3;
    stage.addChild(tower);
}

// function between launches
function soft_reset() {
    if (win_count == 15)
        return;
    // check if you've lost
    if (lives <= 0) {
        lose_screen();
        return;
    }
    if (lives == 3) {
        init_tower();
    }
    problemGenerator.generateNewProblem();
    init_numberLine();
    init_equationbox();
    init_launch_button();
    init_mute_button(560, 25);
    init_target();
    init_robot();
    init_missileDown();
    lives_left();
	init_missile();
    init_score();
    init_levelnum();
    score_update();
}

function lives_left(){
    if (lives == 2) tower.texture = PIXI.loader.resources.tower1.texture;
    if (lives == 1) tower.texture = PIXI.loader.resources.tower2.texture;
    if (lives == 0) tower.texture = PIXI.loader.resources.tower3.texture;
}

function init_robot() {
    robot = PIXI.Sprite.fromImage('images/robot/idle/1.png');
    robot.position.x=-50;
    robot.position.y=500;
	robotAnimation = 0;
    robotAnimationFrame = 0;
    stage.addChild(robot);
    clearInterval(robotIntervalVariable);
    robotIntervalVariable = setInterval(robot_animationIdle, 200);
}


function robot_moveToPosition(){
	if(robot.x <= numberLine_coordiniates(problemGenerator.answer).x-10)
    {
        robot.x += 8;
	} else if (robotAnimation == 1) {
        robotAnimation = 2;
        setTimeout(function() {
            a_missile.pause();
            a_missile.currentTime = 0.0;
            a_missile.play();
        }, 100);
    }
}

function robot_attack(){
	if(robot.x <= 800){
		robot.x += 8;
    }
    if(robot.x >= 800) {
        lives--;
        robotAnimation = 3;
    }
}

function cloudGenerator(height, speed, scale) {
    var cloud = new PIXI.Sprite(PIXI.loader.resources.cloud.texture);
    cloud.anchor.set(0.5, 0.5);
    cloud.position.x = Math.random()*1300;
    cloud.position.y = height;
    cloud.scale.set(scale, scale);
    setInterval(function() {
        cloud.position.x += speed;
        var left_edge = cloud.position.x - (cloud.width/2);
        if (left_edge > 1000)
            cloud.position.x = 0 - (cloud.width/2);
    }, 20);
    return cloud;   
}

function robot_selfDestruct(){
	stage.removeChild(robot);
    a_explosion.pause();
    a_explosion.currentTime = 0.0;
    a_explosion.play();
    var explodeeee = new PIXI.Sprite.fromImage('images/explosion.png');
    explodeeee.anchor.set(0.5, 1.0);
    explodeeee.position.x = robot.position.x;
    explodeeee.position.y = robot.position.y+58;
    var exp_alpha = setInterval(function() {
        explodeeee.alpha -= 0.02;
    }, 20);
    setTimeout(function() {
        clearInterval(exp_alpha);
        stage.removeChild(explodeeee);
    }, 2500);
    stage.addChild(explodeeee);
}

function robot_animationIdle() {
    robot.texture = PIXI.Texture.fromImage("images/robot/idle/" + robotAnimationFrame + ".png");
    robotAnimationFrame++;
    robotAnimationFrame = robotAnimationFrame%2;
}

function init_missile() {
    stage.removeChild(missile);
	missile = PIXI.Sprite.fromImage('images/missile.png');
	missile.position.x=770;
	missile.position.y=95;
	stage.addChild(missile);
    missileAnimation = 0;
    missileFlames = animatedFlames(40, 135);
    missileFlames.alpha = 0.0;
    missile.addChild(missileFlames);
    missile.addChild(PIXI.Sprite.fromImage('images/missile.png'));
}

// returns a flame sprite that animates
function animatedFlames(x, y) {
    var flames = PIXI.Sprite.fromImage('images/flame/0.png');
    var flameFrame = 0;
    setInterval(function() {
        flames.texture = PIXI.Texture.fromImage("images/flame/" + flameFrame + ".png");
        flameFrame++;
        flameFrame = flameFrame%3;
    }, 100);
    flames.anchor.set(0.5, 0.0);
    flames.position.x = x;
    flames.position.y = y;
    return flames;
}

function init_missileDown(){
    stage.removeChild(missileDown);
	missileDown = PIXI.Sprite.fromImage('images/missile.png');
	missileDown.rotation = 600;
	missileDown.position.x=500;
	missileDown.position.y=-100;
	missileDown.position.x=500;
	missileDown.position.y=-200;
    missileDown.anchor.set(0.5);
    missileDown.rotation = 3.14159;
	stage.addChild(missileDown);
}

/* Moves the missile off screen*/
function missile_moveOffscreen(){
    missileFlames.alpha = 1.0;
	if (missile.y >= -600){
		missile.y -= (95-missile.y+5)/17.5;
	} else if (missileAnimation == 0) {
        missileAnimation = 1;
    }
}	

/* Animates the missile downward movement*/
function missileDown_moveOnscreen(){    
	if (missileDown.y <= 700){
		missileDown.y += (missileDown.y+200+25)/20;
	} else if (missileDown.y > 700 && problemGenerator.answer != user_answer.number && missileAnimation != 0){
		robotAnimation = 4;
	} else if (missileDown.y > 700 && problemGenerator.answer == user_answer.number && missileAnimation != 0){
		robotAnimation = 3;
        increment_score();
        win_count++;
        if (win_count == 5) {
            problemGenerator.setDifficulty(1);
            background_b.texture = PIXI.Texture.fromImage("images/backgroundbackground.png");
            lives = 3;
            setTimeout(function() {
                audio.src = 'music/level2.mp3'
                audio.play();
            }, 1000);
        } else if (win_count == 10) {
            problemGenerator.setDifficulty(2);
            background_b.texture = PIXI.Texture.fromImage("images/backgroundsky_night.png");
            lives = 3;
            setTimeout(function() {
                audio.src = 'music/level3.mp3'
                audio.play();
            }, 1000);
        }
        if (win_count == 15) {
            setTimeout(init_winScreen, 500);
        }
    } else if (missileAnimation == 1) {
        missileAnimation = 2;
    }
    
    if (missileDown.y > 700)
        missileAnimation = 0;
    

}	

/* Updates the equationBox with a new equation */
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
    init_mute_button(560, 25);
}

/* Create the Box for equations using PIXI graphics */
function init_equationbox() {
    stage.removeChild(equationBox);
    equationBox = new PIXI.Graphics();
    equationBox.x = 10;
    equationBox.y = 10;
    equationBox_update();
    stage.addChild(equationBox);
}

function init_target(){
    stage.removeChild(target);
    targetSnapped = 0;
    target = PIXI.Sprite.fromImage('images/target.png');
    target.interactive = true;
    target.buttonMode = true;
    target.anchor.set(0.5);
    target
        // events for drag start
        .on('mousedown', function(event) {
            if (robotAnimation == 0) {
                this.data = event.data;
                this.alpha = 0.5;
                this.dragging = true;
            }
        })
        // events for drag end
        .on('mouseup', function() {
            if (robotAnimation == 0) {
                this.alpha = 1;
                this.dragging = false;
                // set the interaction data to null
                this.data = null;
                var snap_object = numberLine_getClosestNumberPosition(this.position.x, this.position.y);
                user_answer = snap_object;
                if (snap_object != -1) {
                    this.position.x = snap_object.x;
                    this.position.y = snap_object.y-15;
                    targetSnapped = 1;
                } else {
                    targetSnapped = 0;
                }
            }
        })
        // events for drag move
        .on('mousemove', function() {
            if (robotAnimation == 0) {
                if (this.dragging)
                {
                    var newPosition = this.data.getLocalPosition(this.parent);
                    this.position.x = newPosition.x;
                    this.position.y = newPosition.y;
                }
            }
        });
    // move the sprite to its designated position
    target.position.x = 585;
    target.position.y = 75;
    target.anchor.set(0.5);
    stage.addChild(target);
}

  //initializes the launch sequence
  function init_launch_button() {
          //create launch button
        stage.removeChild(launch_button);
        launch_button = buttonGenerator(275, 40, 220, 60, 0xCC0000, 5, 0.3, 'images/launch.png', launch_activate);
        stage.addChild(launch_button);
    }

   function launch_activate() {
       //move robot to the right answer
       if (targetSnapped == 1 && robotAnimation == 0) {
            missileDown.x = target.x;
            robotAnimation = 1;
            clearInterval(time);
            time = 0;
        }
    }



function lose_screen(){
    //var lose_text = new PIXI.Text("You Lose!", {font: '28px Arial', fill: 0x000000, align : 
//'center'});
  //  lose_text.x = 440;
    //lose_text.y = 240;
    //stage.addChild(lose_text);
    clearInterval(time);
    score = 10000;
    var lose = PIXI.Sprite.fromImage('images/lose.png');
    lose.anchor.set(0.5);
    lose.x = WIDTH/2;
    lose.y = HEIGHT/2;
    stage.addChild(lose);
    //main menu button at end of game
     stage.addChild(buttonGenerator(375, 350, 250, 60, 0xCC0000, 5, 0.3,'images/startover.png', function() {
        win_count = 0;
        audio.src = "music/level1.mp3";
        audio.play();
        game_button();
     }));
    //start over button
    stage.addChild(buttonGenerator(375, 450, 250, 60, 0xCC0000, 5, 0.3,'images/back.png', function () {
        win_count = 0;
        audio.src = "music/loader.mp3";
        audio.play();
        start_screen();
    }));
}


function init_background() { 
    stage.removeChild(background_b);
    stage.removeChild(background_f);
    
    if (problemGenerator.difficulty == 0) {
        background_b = PIXI.Sprite.fromImage('images/backgroundsky_day.png');
    } else if (problemGenerator.difficulty == 1) {
        background_b = PIXI.Sprite.fromImage('images/backgroundbackground.png');
    } else {
        background_b = PIXI.Sprite.fromImage('images/backgroundsky_night.png');        
    }
    
    background_f = PIXI.Sprite.fromImage('images/backgroundforeground.png');
    background_b.x = 0;
    background_b.y = 0;
    background_f.x = 0;
    background_f.y = 0;
    stage.addChild(background_b);
    init_clouds();
    stage.addChild(background_f);
}


function buttonGenerator(x, y, width, height, color, elevation, speed, what, clickedFunction) {
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

    var text_gfx = new PIXI.Sprite.fromImage(what);
    text_gfx.anchor.set(0.5); 
    text_gfx.x = width/2;
    text_gfx.y = height/2;
    
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
    beginning_of_game();
    
}

function beginning_of_game() {

    stage = new PIXI.Container();
    win_count = 0;
    
    audio = new Audio("music/loader.mp3");
    audio.loop = true;
    audio.volume = 0.45;
    audio.play();
    
    a_missile = new Audio("snd/missile.mp3");
    a_missile.volume = 0.4;
    a_explosion = new Audio("snd/explode.mp3");
    a_explosion.volume = 0.6;
    
    // preload textures to prevent popping
    loader = PIXI.loader
    loader = PIXI.loader
            .add('cloud', 'images/clouds.png')
			.add('tower0', 'images/tower.png')
			.add('tower1', 'images/tower2.png')
			.add('tower2', 'images/tower3.png')
			.add('tower3', 'images/tower4.png')
			.load();
    
    
    init_problemGenerator();
    init_background();
    init_numberLine();
    init_tower();
	lives_left();
    init_equationbox();
    init_numberLine();
    init_target();
    init_robot();
    start_screen();
    
    setInterval(function() {
        requestAnimationFrame(animate);
    }, 15);
}

function animate() {
    
	if(robotAnimation == 1){
        robot_moveToPosition();
	} else if (robotAnimation == 2) {
        missile_moveOffscreen();
    } else if(robotAnimation == 3){
		robot_selfDestruct();
        robotAnimation = 5;
        lives_left();
	} else if(robotAnimation == 4){
		robot_attack();
	} else if (robotAnimation == 5) {
        setTimeout(soft_reset, 1000);
        robotAnimation = 6;
    }
    
    if (missileAnimation == 1) {
        missileDown_moveOnscreen();
    }
    // render the container
    renderer.render(stage);
}

function init_clouds() {
    // cloudGenerator height speed scale
    stage.addChild(cloudGenerator(000, 1, 1));
    stage.addChild(cloudGenerator(070, .8, .8));
    stage.addChild(cloudGenerator(140, 0.6, .5));
    stage.addChild(cloudGenerator(190, 0.4, .4));
    }

function game_button(){
    audio.src = 'music/level1.mp3'
    audio.play();
    stage = new PIXI.Container();
    init_problemGenerator();
    problemGenerator.setDifficulty(0);
    problemGenerator.generateNewProblem();
    init_background();
    init_missileDown();
    init_numberLine();
    init_tower();
	lives_left();
	init_missile();
    init_equationbox();
    init_numberLine();
    init_target();
    init_robot();
    init_launch_button();
    init_mute_button(560, 25);
    score_update();
    init_score();
    init_levelnum();
}

function start_screen(){
    stage = new PIXI.Container();
    problemGenerator.difficulty = 1; // background dusk
    init_background();
  
    tower = PIXI.Sprite.fromImage('images/tower.png');
    tower.position.x=-165;
    tower.position.y=261;
	lives = 3;
    stage.addChild(tower);
    
   
    robot.position.x= 100;
    robot.position.y=505;
    stage.addChild(robot);
    
    title_card = PIXI.Sprite.fromImage("images/titlecard.png");
    title_card.x = 75;
    title_card.y = 40;
    stage.addChild(title_card);
    
    /*color for font is (start color: #B2B6B8 & end color:#5D5F61)
    fount at http://cooltext.com/Logo-Design-Skate
    font size depends on length of word
    */
    stage.addChild(buttonGenerator(300, 280, 195, 60, 0xCC0000, 5, 0.3,'images/start.png', game_button));
    
    stage.addChild(buttonGenerator(240, 370, 325, 50, 0xCC0000, 5, 0.3,'images/inst.png', init_instructions));
    
    init_mute_button(930, 568);
}

/* Screen for instructions 
   Void function that creates a box with text instructions
*/
function init_instructions(){
    stage = new PIXI.Container();
    //Same Background
    background = PIXI.Sprite.fromImage('images/background1.png');
    background.x = 0;
    background.y = 0;
    stage.addChild(background);
    
  
    tower = PIXI.Sprite.fromImage('images/tower.png');
    tower.position.x=-165;
    tower.position.y=261;
	lives = 3;
    stage.addChild(tower);
    
   
    robot.position.x= 800;
    robot.position.y=250;
    stage.addChild(robot);
    
    instruction_box = new PIXI.Graphics();
    instruction_box.x = 15;
    instruction_box.y = 25;
    
    stage.addChild(instruction_box);
    
    instruction_box.beginFill(0x555444, 1.0);
    instruction_box.lineStyle(2, 0x000000, 1.0);
    instruction_box.drawRect(0, 0, 650, 500);
    
    //instructions
    var text = new PIXI.Text('[-- Your Goal --]\n A horde of robots are coming to destroy your base. You must solve \n the equation at the top of the screen in order to launch a missile \n and destroy the oncoming fleet!\n\nThere are 3 levels with 5 problems in each one.\nSolve them all to declare victory over the robots!\n\n[-- How to Play --]\n  Once the player clicks on the "Start" Button, the game will begin. \n Click and drag the red target onto the correct answer \n on the number line and click the "launch" button.',{font : '24px Impact', fill : 0xEEE9E9, align : 'center'});
    text.style.strokeThickness = 4;
    text.style.stroke = "black";
    //positions of the text instructions

    text.x = 14;
    text.y = 100;
    
    stage.addChild(buttonGenerator(700, 150, 300, 50, 0xCC0000, 5, 0.3,'images/back.png', start_screen));

    stage.addChild(text);
}

/* set interval usage */



function init_winScreen(){
    stage = new PIXI.Container();
    //Same Background
    
    background = PIXI.Sprite.fromImage('images/backgroundsky_night.png');
    background.x = 0;
    background.y = 0;
    stage.addChild(background);
    
    background2 = PIXI.Sprite.fromImage('images/backgroundforeground.png');
    background2.x = 0;
    background2.y = 0;
    stage.addChild(background2);
    
  
    tower = PIXI.Sprite.fromImage('images/tower.png');
    tower.position.x=-165;
    tower.position.y=261;
	lives = 3;
    stage.addChild(tower);
	
	win = PIXI.Sprite.fromImage('images/youwin.png');
	win.position.x=300;
	win.position.y=75;
	stage.addChild(win);
    
	var text = new PIXI.Text("Score: " + score,{font : '32px Impact', fill: 0xEEE9E9, align : 'center'});
    text.style.strokeThickness = 5;
    text.style.stroke = "black";
    text.x = 417;
    text.y = 180;
    
    clearInterval(time);
    score = 10000;
	
	stage.addChild(buttonGenerator(380, 240, 250, 50, 0xCC0000, 5, 0.3,'images/replay.png', function() {
        win_count = 0;
        audio.src = "music/level1.mp3";
        audio.play();
        game_button();
    }));
    stage.addChild(buttonGenerator(380, 340, 250, 50, 0xCC0000, 5, 0.3,'images/back.png', function() {
        win_count = 0;
        audio.src = "music/loader.mp3";
        audio.play();
        start_screen();
    }));

    stage.addChild(text);
}

// score stuff
function score_update(){
    time = setInterval(reduce_score, 50);      
}

function reduce_score() {
    score -= 1;
    score_text.text = score;
}

function decrement_score(){
    score = score - 500;
    score_text.text = score;
}
 
function increment_score(){
    score = score + 500;
    score_text.text = score;
}

function init_levelnum() {
    stage.removeChild(level_num);
    var level = 1;
    if (win_count >= 5)
        level = 2;
    if (win_count >= 10)
        level = 3;
    level_num = new PIXI.Text("Level: " + level + "-" + ((win_count%5) + 1),{font: '34px Impact', fill: 0xAAAAAA, align: 'left'});
    level_num.x = 10;
    level_num.y = 110;
    level_num.style.stroke = "black";
    level_num.style.strokeThickness = 4;
    stage.addChild(level_num);
}

function init_mute_button(x, y) {
    stage.removeChild(a_mute_button)
    a_mute_button = buttonGenerator(x, y, 58, 22, 0xCC0000, 3, 0.3, 'images/mute.png', function() {
        if (audio.volume == 0.0) {
            audio.volume = 0.45;
            a_missile.volume = 0.4;
            a_explosion.volume = 0.6;
        } else {
            audio.volume = 0.0;
            a_missile.volume = 0.0;
            a_explosion.volume = 0.0;
        }
    });
    stage.addChild(a_mute_button);
}
    

function init_score(){
    stage.removeChild(score_text);
    stage.removeChild(score_text_static);
    score_text = new PIXI.Text(score,{font: '42px Impact', fill: 0xCC0000, align: 'left'});
	score_text.x = 105;
	score_text.y = 145;
    score_text_static = new PIXI.Text("SCORE: ",{font: '32px Impact', fill: 0xCC0000, align: 'center'});
	score_text_static.x = 10;
	score_text_static.y = 155;
    score_text_static.style.stroke = "black";
    score_text_static.style.strokeThickness = 3;
    score_text.style.stroke = "black";
    score_text.style.strokeThickness = 3;
    stage.addChild(score_text_static);
    stage.addChild(score_text);
}


