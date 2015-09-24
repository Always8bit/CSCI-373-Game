var stage;
var renderer;
var equationText;

var tower;
var robot;
var equationBox;
var numOne = -7;
var numTwo = 8;

window.onload = function(){
    renderer = PIXI.autoDetectRenderer(1000, 600,{backgroundColor : 0xEEEEEE});
    document.getElementById('game_wrapper').appendChild(renderer.view);
    // create the root of the scene graph
    stage = new PIXI.Container();
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
    // start animating
    animate();
    
    equationText = PIXI.Text(numOne "+" numTwo, [Arial])
}



function animate() {
    requestAnimationFrame(animate);

    // render the container
    renderer.render(stage);
}
