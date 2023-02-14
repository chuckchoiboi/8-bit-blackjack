const init = () => {
    let stage = new createjs.Stage("gameCanvas");
    stage.enableMouseOver(50)

    // Background
    let background = new createjs.Shape();
    background.graphics.beginFill("black").drawRect(0, 0, 960, 640);
    const backgroundWidth = background.graphics.command.w
    const backgroundHeight = background.graphics.command.h

    // Jack of Spades
    let backCard = new createjs.Bitmap("assets/img/cards/back01.gif")
    backCard.scaleX = 3
    backCard.scaleY = 3
    backCard.x = backgroundWidth/2 - (backCard.getBounds().width*3/2)
    backCard.y = backgroundHeight/1.8 - (backCard.getBounds().height*3/2)

    // Jack of Spades
    let jack = new createjs.Bitmap("assets/img/cards/11s.gif")
    jack.scaleX = 3
    jack.scaleY = 3
    jack.x = backgroundWidth/2 - (jack.getBounds().width*3/2)
    jack.y = backgroundHeight/1.8 - (jack.getBounds().height*3/2)

    // Ace of Spades
    let ace = new createjs.Bitmap("assets/img/cards/01s.gif")
    ace.scaleX = 3
    ace.scaleY = 3
    ace.x = backgroundWidth/2 - (ace.getBounds().width*3/2) - 40
    ace.y = backgroundHeight/1.8 - (ace.getBounds().height*3/2) + 20
    ace.rotation = -25

    // Title Text
    let TitleText = new createjs.Text("8 Bit Blackjack", "40px Press Start", "red")
    TitleText.textAlign = "center";
    TitleText.textBaseline = "middle";
    TitleText.x = backgroundWidth/2;
    TitleText.y = backgroundHeight/4;

    // Start Button
    let startButton = new createjs.Text("START GAME", "20px Press Start", "red")
    startButton.textAlign = "center";
    startButton.textBaseline = "middle";
    startButton.x = backgroundWidth/2;
    startButton.y = backgroundHeight/1.25;
    startButton.addEventListener("mouseover", () => {
        startButton.color = "white"
        stage.update()
    })
    startButton.addEventListener("mouseout", () => {
        startButton.color = "red"
        stage.update()
    })
    startButton.addEventListener("click", () => {
        stage.addChild(ace, jack)
        stage.update()
    })

    // Credit Text
    let creditText = new createjs.Text("CREATED BY CHUCK CHOI", "20px Press Start", "white")
    creditText.textAlign = "center";
    creditText.textBaseline = "middle";
    creditText.x = backgroundWidth/2;
    creditText.y = backgroundHeight/1.1;
    
    stage.addChild(background,backCard, TitleText, startButton, creditText)
    stage.update()
}