var stage;
var renderer;

window.onload = function(){
    renderer = PIXI.autoDetectRenderer(1000, 600,{backgroundColor : 0xEEEEEE});
    document.getElementById('game_wrapper').appendChild(renderer.view);
    // create the root of the scene graph
    stage = new PIXI.Container();
    // start animating
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // render the container
    renderer.render(stage);
}
