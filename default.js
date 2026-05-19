let tree1="https://codehs.com/uploads/94feec5ba51d7de723be84d149e78901";
let tree2="https://codehs.com/uploads/c269e9e20176a5d0a784cb2f310a9c4c";
let char1="https://codehs.com/uploads/040b887d0d274bb6818c21369e1a681f";
let cloud1="https://codehs.com/uploads/e1fdcceb9c0c3c7c287f2e70ac3270be";

let grass="https://codehs.com/uploads/67aea4a9a95be128c4faebb5adebd882";

let coinImg="https://codehs.com/uploads/df1388252f9a1557a4296403973044de";


//use the up arrow to jump

let tree;
let obstacles=[];
let spawnTimer=0;
const SPAWN_THRESHOLD=15;
let chance=5;
let obstacleSpeed=-5;
const SPEED_INC=-0.1;
let INC_TIME=1800;

let cloud;
let clouds=[];
let cloudSpeed=-1;
let grasses=[];
let gras;

let coins=[];
let coinCount=0;
let coinText;
let hasExtraLife=false;
let buyButton;
let buyText;
let canBuyLife=false;

var char;
let dy=0;
let isJumping=false;
const gravity=1.3;
const jumpForce=-16;

let points=0;
let score;

let startButton;
let buttonText;
let gameStarted = false;

function main() {
    showStartScreen();
}

function setUpGame() {
    background(); // Ensure background is redrawn after removeAll()
    
    setTimer(spawnCloud, 5000);
    setTimer(moveCloud, 20);
    
    addCharacter();
    setUpScore();
    setUpCoinTracker();
    
    keyDownMethod(handleInput);
    mouseDownMethod(handleMouseInput);
    
    setTimer(spawnCoin,2000);
    setTimer(moveCoin,20);
    setTimer(applyGravity, 20);
    setTimer(updateScore, 100);
    setTimer(spawnChance, 50);
    setTimer(moveObstacles, 20);
    setTimer(increaseDifficulty, INC_TIME);
    setTimer(collisions, 20);
}
function setUpCoinTracker(){
    coinText=new Text("Coins: ");
    coinText.setColor("white");
    coinText.setPosition(getWidth()-110,30);
    add(coinText);
}
function spawnCoin(){
    let coinX,coinY; 
    let safeSpawn = true;
    let minDistance = 100; 
    if(points>1000){
        coinX = getWidth() + 50;
        coinY = getHeight() / 2 - 25; 
        for (let i = 0; i < obstacles.length; i++) {
            let tree = obstacles[i];
            let distance = Math.abs(coinX - tree.getX());
        
            if (distance < minDistance) {
            safeSpawn = false;
            break; 
            }
        }
    }

    if (safeSpawn) {
        let coin = new WebImage(coinImg);
        coin.setSize(25, 25);
        coin.setPosition(coinX, coinY);
        add(coin);
        coins.push(coin);
    }
}
function moveCoin(){
    for(let i=0;i<coins.length;i++){
        let coin=coins[i];
        coin.move(obstacleSpeed,0);
        if (coin.getX() < -coin.getWidth()) {
            remove(coin);
            coins.splice(i, 1);
            i--;
        }
    }
}
function showStartScreen() {
    background();
    
    let back = new Rectangle(300, 150);
    back.setPosition(50, 200);
    back.setColor("blue");
    add(back);
    
    let t = new Text("Cloud Jumper", "30pt Impact");
    t.setPosition(getWidth() / 2 - 120, getHeight() / 2 + 10);
    t.setColor(Color.yellow);
    add(t);
    
    startButton = new Rectangle(140, 60);
    startButton.setPosition(getWidth() / 2 - 70, getHeight() / 2 + 30);
    startButton.setColor(Color.red);
    add(startButton);

    buttonText = new Text("START", "20pt Arial");
    buttonText.setPosition(getWidth() / 2 - 40, getHeight() / 2 + 70);
    buttonText.setColor(Color.white);
    add(buttonText);

    mouseMoveMethod(handleHover);
    mouseDownMethod(startGame);
}

function handleHover(e) {
    if (gameStarted) {
        return;
    }
    
    if (e.getX() > startButton.getX() && 
        e.getX() < startButton.getX() + startButton.getWidth() &&
        e.getY() > startButton.getY() && 
        e.getY() < startButton.getY() + startButton.getHeight()) {
        
        startButton.setColor("green");
    } else {
        startButton.setColor("red");
    }
    if (canBuyLife && buyButton != null) {
        if (getElementAt(e.getX(), e.getY()) == buyButton) {
            buyButton.setColor(Color.orange);
        } else {
            buyButton.setColor(Color.green);
        }
    }
}

function startGame(e) {
    let element = getElementAt(e.getX(), e.getY());
    
    if (!gameStarted && (element == startButton || element == buttonText)) {
        gameStarted = true;
        removeAll();
        setUpGame();
        return;
    }
    if (canBuyLife && (element == buyButton || element == buyText)) {
        revivePlayer();
    }
}
//----------------TREE FUNCTIONS-------------
function spawnChance(){
    spawnTimer++;
    if(spawnTimer>=SPAWN_THRESHOLD){
           let num=Randomizer.nextInt(1,100);
        if(num<chance){
            let clusterSize=Randomizer.nextInt(1,3);
            
            for(let i=0;i<clusterSize;i++){
                let offset=i*20;
                addTree(offset);
            }
            spawnTimer=0;
        }
    }
    
}
function addTree(offset){
    tree = new WebImage(tree1);
    tree.setSize(30,40);
    tree.setPosition(getWidth()+offset, getHeight() / 2 - 40);
    add(tree);
    
    obstacles.push(tree);
    
}
function moveObstacles(){
    for(var i=0; i<obstacles.length; i++){
        let tree = obstacles[i];
        tree.move(obstacleSpeed,0);
        
        if (tree.getX() < -tree.getWidth()) {
            remove(tree);
            obstacles.splice(i, 1);
            i--; 
        }
        
    }
}
function increaseDifficulty(){
    obstacleSpeed+=SPEED_INC;
}
//---------BACKGROUND----------
function background(){
    let sky=new Rectangle(getWidth(),getHeight()/2);
    sky.setPosition(0,0);
    sky.setColor("lightblue");
    add(sky);
    
    let ground=new Rectangle(getWidth(),getHeight()/2);
    ground.setPosition(0,getHeight()/2);
    ground.setColor("green");
    add(ground);
    
}
function spawnCloud(){
    let size = Randomizer.nextInt(25,50);
    let cloudY=Randomizer.nextInt(20,50);
    
    cloud=new WebImage(cloud1);
    cloud.setSize(size*2,size)
    cloud.setPosition(getWidth(),cloudY);
    add(cloud);
    clouds.push(cloud);
}
function moveCloud(){
    for(let i=0;i<clouds.length;i++){
        let c=clouds[i];
        c.move(cloudSpeed,0);
        
        if(c.getX()+c.getWidth()<0){
            remove(c);
            clouds.splice(i,1);
            i--;
        }
    }
}
function setUpScore(){
    score= new Text("0");
    score.setColor("white");
    score.setPosition(10,30);
    add(score);
}
function updateScore(){
    points+=1;
    score.setText(points);
}

//----------CHARACTER FUNCTIONS-----------------
function addCharacter(){
    char=new WebImage(char1);
    char.setSize(40,40);
    char.setPosition(getWidth()/4,getHeight()/2-30);
    add(char);
}
function handleInput(e){
    if (e.keyCode == Keyboard.UP && !isJumping) {
        dy = jumpForce;
        isJumping = true;
    }
}
function handleMouseInput(e){
    if (gameStarted && !isJumping) {
        dy = jumpForce;
        isJumping = true;
    }
}
function applyGravity(){
    if(isJumping){
        char.move(0,dy);
        dy+=gravity;
        
        let groundLevel=getHeight()/2-30;
        
        if (char.getY()>=groundLevel){
            char.setPosition(char.getX(), groundLevel); 
            dy = 0;
            isJumping = false;
        }
    }
}

function collisions(){
    let bufferX = 20;
    let bufferY = 5;
    
    let rightCenter = getElementAt(char.getX() + char.getWidth()-bufferX, char.getY() + char.getHeight()/2);
    let rightTop = getElementAt(char.getX() + char.getWidth() - bufferX, char.getY());
    let rightBottom = getElementAt(char.getX() + char.getWidth() - bufferX, char.getY() + char.getHeight()-bufferY);
    let leftBottom = getElementAt(char.getX() + bufferX, char.getY() + char.getHeight());

    let testPoints=[rightTop,rightBottom,leftBottom,rightCenter];
    
    for(let i=0;i<testPoints.length;i++){
        let obj=testPoints[i];
        
        if (obj != null && obj != char && !clouds.includes(obj)) {
            if (coins.includes(obj)) {
                collectCoin(obj);
                break;
            }
            handleDeath(); 
            break;
        }
    }
}
function collectCoin(coinObj){
    remove(coinObj);
    
    let index=coins.indexOf(coinObj);
    if(index>-1){
        coins.splice(index,1);
    }
    coinCount++;
    
    coinText.setText("Coins: " + coinCount);
    
    if (coinCount >= 3) {
        coinText.setColor(Color.yellow);
    }
}
function handleDeath(){
    if(coinCount>=3){
        coinCount-=3;
        coinText.setText("Coins: "+coinCount);
        coinText.setColor("white");
        
        char.setPosition(getWidth()/4,50);
        dy=0;
        isJumping=true;
        
        for(let i=0;i<obstacles.length;i++){
            remove(obstacles[i]);
        }
        
        obstacles=[];
    }else{
        actualGameOver();
    }
}
function revivePlayer(){
    coinCount -= 3;
    canBuyLife = false;
    
    removeAll(); 
    
    background();
    addCharacter();
    setUpScore();
    setUpCoinTracker();
    
    score.setText(points);
    coinText.setText("Coins: " + coinCount);
    
    char.setPosition(getWidth() / 4, 50);
    dy = 0;
    isJumping = true;
    obstacles = [];
    coins = [];
    
    setTimer(applyGravity, 20);
    setTimer(updateScore, 100);
    setTimer(spawnChance, 50);
    setTimer(moveObstacles, 20);
    setTimer(collisions, 20);
    setTimer(spawnCloud, 5000);
    setTimer(moveCloud, 20);
    setTimer(spawnCoin, 1000);
    setTimer(moveCoin, 20);
}
function gameOver(){
    stopTimer(applyGravity);
    stopTimer(spawnChance);
    stopTimer(moveObstacles);
    stopTimer(collisions);
    stopTimer(updateScore);
    stopTimer(spawnCloud);
    stopTimer(moveCloud);
    stopTimer(spawnCoin);
    stopTimer(moveCoin);
    
    let back=new Rectangle(300,150);
    back.setPosition(50,200);
    back.setColor("blue");
    add(back);
    
    var t = new Text("GAME OVER", "30pt Impact");
    t.setPosition(getWidth()/2 - 120, getHeight()/2+10);
    t.setColor(Color.red);
    add(t);
    
    var finalScore= new Text("Final Score: "+points,"20pt Impact");
    finalScore.setPosition(getWidth()/2-90,getHeight()/2 + 60);
    finalScore.setColor("white");
    add(finalScore);
}
function stopAllTimers(){
    stopTimer(applyGravity);
    stopTimer(spawnChance);
    stopTimer(moveObstacles);
    stopTimer(collisions);
    stopTimer(updateScore);
    stopTimer(spawnCloud);
    stopTimer(moveCloud);
    stopTimer(spawnCoin);
    stopTimer(moveCoin);
}
function actualGameOver(){
    stopAllTimers();
    
    //button was never implimented
    
    let back=new Rectangle(300,200);
    back.setPosition(50,150);
    back.setColor("blue");
    add(back);
    
    var t = new Text("GAME OVER", "30pt Impact");
    t.setPosition(getWidth()/2 - 120, getHeight()/2-20);
    t.setColor(Color.red);
    add(t);
    
    var finalScore= new Text("Final Score: "+points,"20pt Impact");
    finalScore.setPosition(getWidth()/2-90,getHeight()/2 + 60);
    finalScore.setColor("white");
    add(finalScore);
    
    if(coinCount>=3){
        canBuyLife=true;
        buyButton = new Rectangle(160, 50);
        buyButton.setPosition(getWidth() / 2 - 80, getHeight() / 2 + 60);
        buyButton.setColor(Color.green);
        add(buyButton);

        buyText = new Text("BUY LIFE (3¢)", "15pt Arial");
        buyText.setPosition(getWidth() / 2 - 70, getHeight() / 2 + 92);
        buyText.setColor(Color.white);
        add(buyText);
    } else {
        let noCoins = new Text("Not enough coins!", "12pt Arial");
        noCoins.setPosition(getWidth() / 2 - 60, getHeight() / 2 + 80);
        noCoins.setColor("white");
        add(noCoins);
    }
}

main();
