var stage;
var renderer;
var equationText;
/*var gameTimer;
var gameTime = 0; 8
var updateTime; */
var


window.onload = function(){
    renderer = PIXI.autoDetectRenderer(1000, 600,{backgroundColor : 0xEEEEEE});
    document.getElementById('game_wrapper').appendChild(renderer.view);
    // create the root of the scene graph
    stage = new PIXI.Container();
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
