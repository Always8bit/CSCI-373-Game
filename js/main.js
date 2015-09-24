// Display Variables
var stage;
var renderer;
// Object Variables
var tower;
var robot;
var equationBox;
var problemGenerator;

/*var gameTimer;
var gameTime = 0; 8
var updateTime; */

function init_problemGenerator() {
    problemGenerator = {
        rangeBottom: 0,
        rangeTop: 0,
        num1: 0,
        num2: 0,
        answer: 0,
        difficulty: 0,
        generateNewProblem: function() {
            // code logic
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
    tower.position.x=800;
    tower.position.y=300;
    stage.addChild(tower);
}

function init_robot() {
    robot = PIXI.Sprite.fromImage('images/robot.png');
    robot.position.x=-50;
    robot.position.y=500;
    stage.addChild(robot);
}

function init_equationbox() {
    equationBox = PIXI.Sprite.fromImage('images/EquationBox.png');
	equationBox.position.x=500;
	equationBox.position.y=100;
	stage.addChild(equationBox);    
    equationText = PIXI.Text(problemGenerator.num1 + " + " + problemGenerator.num2, 
        {font: "24px Arial", fill: 0x000000});
}

window.onload = function(){
    renderer = PIXI.autoDetectRenderer(1000, 600,{backgroundColor : 0xEEEEEE});
    document.getElementById('game_wrapper').appendChild(renderer.view);
    // create the root of the scene graph
    stage = new PIXI.Container();
    // init stage
    init_problemGenerator();
    init_tower();
    init_robot();
    init_equationbox();
    // start animating
    animate();

}



function animate() {
    requestAnimationFrame(animate);

    // render the container
    renderer.render(stage);
}
