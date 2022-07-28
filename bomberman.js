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
class Bomba {
    constructor(x, y, largura, altura, imagem, tempoDeDetonacao = 3000) {
        this.y = y;
        this.x = x;
        this.largura = largura;
        this.altura = altura;
        this.imagem = imagem;
        this.momentoCriacao = new Date();
        this.tempoDeDetonacao = 3000; 
    }
}    


var tela = document.querySelector("canvas");
var ctx = tela.getContext("2d");

//teclas
var LEFT=37, UP=38, RIGHT=39, DOWN=40, SPACE=32;

//movimento
var mvLeft = mvUp = mvRight = mvDown = bomb = false;
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
var bombas = [];
var xBomba = undefined;
var yBomba= undefined;         
var sprites = [];
var paredes = [];
var paredesD = [];
var imagemBomba = new Image();
imagemBomba.src ="https://opengameart.org/sites/default/files/styles/medium/public/Bomb_anim0001.png";
var bomba;

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
            var paredeD = new Sprite(x, y, 50, 50, imagemParedeD)
            paredesD.push(paredeD);
        }
        
        paredes.push(parede);
        
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
            xBomba = Math.floor(boneco.centroX()/50)*50; 
            yBomba = Math.floor(boneco.centroY()/50)*50;
            bomba = new Bomba(xBomba,yBomba,50,50,imagemBomba);
            bombas.push(bomba);
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

//funções 
function loop (){
    window.requestAnimationFrame(loop,tela);
    atualiza();
    desenha();
    //console.log(xBomba+ " "+yBomba);
    console.log(bombas);
    //console.log(sprites);
    
    
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
    for(let i in paredes){
        let prd = paredes[i];
        colisao(boneco,prd);
    }
    for (let i in paredesD) {
       let prd = paredesD[i];
       colisao(boneco, prd);
    }
    
}

function desenha() {
    var x;
    var y;
    ctx.clearRect(0,0,tela.width,tela.height);
    for(var i in sprites){
        var spr = sprites[i];
        ctx.drawImage(spr.imagem,spr.x, spr.y, spr.largura, spr.altura); 
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
   


    
    if(bombas.length<1000){ 
        for(var i = 0; i<bombas.length; i++){
            var bmb = bombas[i]
                ctx.drawImage(bmb.imagem,bmb.x,bmb.y,bmb.largura,bmb.altura);
            if(((new Date())-bombas[i].momentoCriacao)>bombas[i].tempoDeDetonacao){
                bombas.shift();
            }    
        }  
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


loop();

//imagemParede.src = "https://imgur.com/EkleLlt.png";

/*ctx.clearRect(xBomba,yBomba,50,50);
bomb = false;
xBomba = undefined;
yBomba = undefined;*/
  
//ctx.drawImage(imagemBoneco,x,y,50,50);
