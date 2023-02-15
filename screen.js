export const renderStartScreen = (canvas) => {
    canvas.enableMouseOver(50)

    // Background
    let startBackground = new createjs.Shape();
    startBackground.graphics.beginFill("black").drawRect(0, 0, 960, 640);
    const startBackgroundWidth = startBackground.graphics.command.w
    const startBackgroundHeight = startBackground.graphics.command.h

    // Jack of Spades
    let backCard = new createjs.Bitmap("assets/img/cards/back01.gif")
    backCard.scaleX = 3
    backCard.scaleY = 3
    backCard.x = startBackgroundWidth/2 - (backCard.getBounds().width*3/2)
    backCard.y = startBackgroundHeight/1.8 - (backCard.getBounds().height*3/2)

    // Jack of Spades
    let jack = new createjs.Bitmap("assets/img/cards/11s.gif")
    jack.scaleX = 3
    jack.scaleY = 3
    jack.x = startBackgroundWidth/2 - (jack.getBounds().width*3/2)
    jack.y = startBackgroundHeight/1.8 - (jack.getBounds().height*3/2)

    // Ace of Spades
    let ace = new createjs.Bitmap("assets/img/cards/01s.gif")
    ace.scaleX = 3
    ace.scaleY = 3
    ace.x = startBackgroundWidth/2 - (ace.getBounds().width*3/2) - 40
    ace.y = startBackgroundHeight/1.8 - (ace.getBounds().height*3/2) + 20
    ace.rotation = -25

    // Title Text
    let TitleText = new createjs.Text("8 Bit Blackjack", "40px Press Start", "red")
    TitleText.textAlign = "center";
    TitleText.textBaseline = "middle";
    TitleText.x = startBackgroundWidth/2;
    TitleText.y = startBackgroundHeight/4;

    // Credit Text
    let creditText = new createjs.Text("CREATED BY CHUCK CHOI", "20px Press Start", "white")
    creditText.textAlign = "center";
    creditText.textBaseline = "middle";
    creditText.x = startBackgroundWidth/2;
    creditText.y = startBackgroundHeight/1.1;

    // Start Button
    let startButton = new createjs.Text("START GAME", "20px Press Start", "red")
    startButton.textAlign = "center";
    startButton.textBaseline = "middle";
    startButton.x = startBackgroundWidth/2;
    startButton.y = startBackgroundHeight/1.25;
    startButton.addEventListener("mouseover", () => {
        startButton.color = "white"
        canvas.update()
    })
    startButton.addEventListener("mouseout", () => {
        startButton.color = "red"
        canvas.update()
    })
    startButton.addEventListener("click", () => {
        canvas.addChild(ace, jack, creditText)
        canvas.removeChild(startButton)
        canvas.update()
    })
    
    canvas.addChild(startBackground,backCard, TitleText, startButton)
    canvas.update()
}