let stage

const init = () => {
    stage = new createjs.StageGL("gameCanvas");

    let background = new createjs.Shape();
    background.graphics.beginStroke('brown').beginFill("green").drawRect(0, 0, 480, 320);
    background.x = 0;
    background.y = 0;
    background.name = "background";
    background.cache(0, 0, 480, 320);

    stage.addChild(background);

    stage.update();
}