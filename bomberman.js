 class Sprite {
    constructor(x, y, largura, altura, imagem) {
        this.y = y;
        this.x = x;
        this.largura = largura;
        this.altura = altura;
        this.imagem = imagem;
    }
}
Sprite.prototype.metadeLargura = function(){
    return this.largura/2
}
Sprite.prototype.metadeAltura = function(){
    return this.altura/2
}
Sprite.prototype.centroX = function(){
    return this.x + this.metadeLargura();
}
Sprite.prototype.centroY = function(){
    return this.y + this.metadeAltura();
}



var tela = document.querySelector("canvas");
var ctx = tela.getContext("2d");

//teclas
var LEFT=37, UP=38, RIGHT=39, DOWN=40, SPACE=32;

//movimento
var mvLeft = mvUp = mvRight = mvDown = bomba = false;
var velocidade = 2;
//arrays
var mapa = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,2,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,2,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]         
]
var x;
var y;
var xBomba;
var yBomba;         
var sprites = [];
var paredes = [];
var paredesD = [];
for(var linhas in mapa){
    for(var colunas in mapa[linhas]){
        var bloco = mapa[linhas][colunas];
        if(bloco === 1){
            x = colunas*50;
            y = linhas*50;
            var parede = new Sprite(x,y,50,50,imagemBoneco);
        }
        if(bloco === 2){
            x = colunas*50
            y = linhas*50
            var paredeD = new Sprite(x,y,50,50,imagemParedeD)
        }
        
        paredes.push(parede);
        paredesD.push(paredeD);
    }  
} 
//entradas
window.addEventListener("keydown",function (e){
    var key = e.keyCode;
    switch(key){
        case LEFT:
            mvLeft = true;
            break;
        case UP:
            mvUp = true;
            break;
        case RIGHT:
            mvRight = true;
            break;
        case DOWN:
            mvDown = true;
            break;
        case SPACE:
            bomba = true;
            xBomba = Math.floor(boneco.centroX()/50)*50; 
            yBomba = Math.floor(boneco.centroY()/50)*50;
            this.setTimeout(pararBomba,3000); // usando timeout para fazer a bomba desaparecer.
            break;           
    }
    
}, false)
window.addEventListener("keyup",function (e){
    var key = e.keyCode;
    switch (key){
        case LEFT:
            mvLeft = false;
            break;
        case UP:
            mvUp = false;
            break;
        case RIGHT:
            mvRight = false;
            break;
        case DOWN:
            mvDown = false;
            break; 
                
    }

}, false)

//objetos
var imagemBoneco = new Image();
imagemBoneco.src ="https://art.pixilart.com/c5e4d357e30cf9d.png";
var boneco = new Sprite(100,100,40,40,imagemBoneco);
sprites.push(boneco);

var imagemParede = new Image();
imagemParede.src = "https://imgur.com/EkleLlt.png";

var imagemParedeD = new Image();
imagemParedeD.src = "https://imgur.com/C46n8aY.png";

var imagemBomba = new Image();
imagemBomba.src = "https://opengameart.org/sites/default/files/styles/medium/public/Bomb_anim0001.png"
//funções 
function loop (){
    window.requestAnimationFrame(loop,tela);
    atualiza();
    desenha();
    console.log("X = "+boneco.x+" Centro = "+ boneco.centroX())
   
}

function atualiza(){
    if(mvLeft && !mvRight && !mvDown && !mvUp){
        boneco.x -= velocidade;
    }
    if(mvRight && !mvLeft && !mvDown && !mvUp){
        boneco.x += velocidade;
    }
    if(mvUp && !mvDown){
        boneco.y -= velocidade;
    }
    if(mvDown && !mvUp){
        boneco.y += velocidade;
    }

  

    //colisões
    for(var i in paredes){
        var prd = paredes[i];
        colisao(boneco,prd);
    }
     for(var i2 in paredesD){
        var prd2 = paredesD[i2];
        colisao(boneco,prd);
    }
    
}



function desenha() {
    var x;
    var y;
    ctx.clearRect(0,0,tela.width,tela.height);
    for(var i in sprites){
        var spr = sprites[i];
        ctx.drawImage(imagemBoneco,spr.x, spr.y, spr.largura, spr.altura); 
    }

    for(var linhas in mapa){
        for(var colunas in mapa[linhas]){
            var bloco = mapa[linhas][colunas];
            if(bloco === 1){
                x = colunas*50;
                y = linhas*50;
                ctx.drawImage(imagemParede,x,y,50,50);
            }
            if(bloco === 2){
                x = colunas*50;
                y = linhas*50;
                ctx.drawImage(imagemParedeD,x,y,50,50);
            }
        }
    }
   
    if(bomba){
        ctx.drawImage(imagemBomba,xBomba,yBomba,50,50);
    }
}

function colisao(r1,r2){
    var catX = r1.centroX() - r2.centroX();
    var catY = r1.centroY() - r2.centroY();

    //soma das metades
    var smMetadeLargura = r1.metadeLargura() + r2.metadeLargura();
    var smMetadeAltura = r1.metadeAltura() + r2.metadeAltura();

    if(Math.abs(catX) < smMetadeLargura && Math.abs(catY) < smMetadeAltura){
        var diferencaX = smMetadeLargura - Math.abs(catX);
        var diferencaY = smMetadeAltura - Math.abs(catY);

        if(diferencaX >= diferencaY){//colisão por cima ou por baixo
            if(catY > 0){//por cima
                r1.y += diferencaY;
            } else {
                r1.y -= diferencaY;
            }
        } else {// colisão pela esquerda ou direita
            if(catX > 0){//pela esquerda
                r1.x += diferencaX;
            } else {
                r1.x -= diferencaX;
            }
        }
    }

}
// Função para deixar a variável da bomba false, para ser usada no setTimeOut.
function pararBomba(){
    bomba = false;
}

loop();

//imagemParede.src = "https://imgur.com/EkleLlt.png";

   
//ctx.drawImage(imagemBoneco,x,y,50,50);
