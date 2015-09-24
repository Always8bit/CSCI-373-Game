var stage;
var renderer;
var equationText;
/*var gameTimer;
var gameTime = 0; 8
var updateTime; */

var tower;
var robot;
var equationBox;

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

window.onload = function(){
    renderer = PIXI.autoDetectRenderer(1000, 600,{backgroundColor : 0xEEEEEE});
    document.getElementById('game_wrapper').appendChild(renderer.view);
    // create the root of the scene graph
    stage = new PIXI.Container();
<<<<<<< HEAD
    // init stage
    init_tower();
    init_robot;
=======
	tower = PIXI.Sprite.fromImage('images/tower.png');
    tower.position.x=800;
    tower.position.y=300;
    stage.addChild(tower);
	robot = PIXI.Sprite.fromImage('images/robot.png');
	robot.position.x=-50;
	robot.position.y=500;
	stage.addChild(robot);
    equationBox = PIXI.Sprite.fromImage('images/EquationBox.png');
	equationBox.position.x=500;
	equationBox.position.y=100;
	stage.addChild(equationBox);
>>>>>>> origin/master
    // start animating
    animate();
    
/* //create a timer for future use
    gameTimer = setInterval(updateTime, 1000);*/

}



function animate() {
    requestAnimationFrame(animate);

    // render the container
    renderer.render(stage);
}
