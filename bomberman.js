class Sprite {
    constructor(x, y, largura, altura, imagem, tempoDeExplosao = 2000) {
        this.y = y;
        this.x = x;
        this.largura = largura;
        this.altura = altura;
        this.imagem = imagem;
        this.momentoCriacao = new Date();
        this.tempoDeExplosao = 2000;
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
Bomba.prototype.metadeLargura = function(){
    return this.largura/2
}
Bomba.prototype.metadeAltura = function(){
    return this.altura/2
}
Bomba.prototype.centroX = function(){
    return this.x + this.metadeLargura();
}
Bomba.prototype.centroY = function(){
    return this.y + this.metadeAltura();
}  

//Funções
function loop (){ 
    window.requestAnimationFrame(loop,tela);
    atualiza();
    desenha();
    console.log(arrayExplosao);
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
    for (let i in bombas) {
        let prd = bombas[i];
        if(boneco.x > bomba.x+40 || boneco.x < bomba.x-30 || boneco.y > bomba.y+40 || boneco.y < bomba.y-30){
            colisao(boneco, prd);    
        }  
    }
}

function desenha() {
    var x;
    var y;
    ctx.clearRect(0,0,tela.width,tela.height); //Limpando a tela.

    for(var i in sprites){
        var spr = sprites[i];
        ctx.drawImage(spr.imagem,spr.x, spr.y, spr.largura, spr.altura); 
    }
    //Lógica para varrer o vetor da matriz do mapa.
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
   
    for(var i = 0; i<bombas.length; i++){
        var bmb = bombas[i];
        ctx.drawImage(bmb.imagem,bmb.x,bmb.y,bmb.largura,bmb.altura);
        
        if(((new Date())-bombas[i].momentoCriacao)>bombas[i].tempoDeDetonacao){
            for(var i3=0; i3<50*3 ; i3=i3+50){
                explosao1 = new Sprite(bmb.x+i3,bmb.y,bmb.largura,bmb.altura,imagemExplosao);
                if(i3 > 0){
                    explosao2 = new Sprite(bmb.x-i3,bmb.y,bmb.largura,bmb.altura,imagemExplosao);
                    explosao3 = new Sprite(bmb.x,bmb.y+i3,bmb.largura,bmb.altura,imagemExplosao);
                    explosao4 = new Sprite(bmb.x,bmb.y-i3,bmb.largura,bmb.altura,imagemExplosao);
                    arrayExplosao.push(explosao2);
                    arrayExplosao.push(explosao3);
                    arrayExplosao.push(explosao4);
                }    
                arrayExplosao.push(explosao1);
                
            }
            bombas.shift();
        }    
    }  

    for(i2 = 0; i2<arrayExplosao.length; i2++){
        var exp = arrayExplosao[i2];
        
          ctx.drawImage(exp.imagem,exp.x,exp.y,exp.largura,exp.altura);  
        
        if(((new Date())-arrayExplosao[i2].momentoCriacao)>arrayExplosao[i2].tempoDeExplosao){
            arrayExplosao.shift();
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

//Entradas
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
            if(bombas.length<2){
            xBomba = Math.floor(boneco.centroX()/50)*50; 
            yBomba = Math.floor(boneco.centroY()/50)*50;
            bomba = new Bomba(xBomba,yBomba,50,50,imagemBomba);
            bombas.push(bomba);
            
            break; 
            }
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


var tela = document.querySelector("canvas");
var ctx = tela.getContext("2d");

//teclas
var LEFT=37, UP=38, RIGHT=39, DOWN=40, SPACE=32;

//movimento
var mvLeft = mvUp = mvRight = mvDown = bomb = false;
var velocidade = 2;

var x;
var y;
var xBomba = undefined;
var yBomba= undefined;  
var bomba;
var explosao1;
var explosao2;
var explosao3;
var explosao4;

//Arrays
var bombas = [];
var sprites = [];
var paredes = [];
var paredesD = [];
var arrayExplosao = [];
//Array em forma de matriz para desenharmos o mapa.
var mapa = [ 
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
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

//Lógica para varrer o vetor da matriz do mapa.
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

//Definindo imagens.
var imagemBoneco = new Image();
imagemBoneco.src ="https://art.pixilart.com/c5e4d357e30cf9d.png";

var imagemParede = new Image();
imagemParede.src = "https://imgur.com/EkleLlt.png";

var imagemParedeD = new Image();
imagemParedeD.src = "https://imgur.com/C46n8aY.png";

var imagemBomba = new Image();
imagemBomba.src ="https://opengameart.org/sites/default/files/styles/medium/public/Bomb_anim0001.png";

var imagemExplosao = new Image();
imagemExplosao.src = "http://static.everypixel.com/ep-pixabay/1558/7758/3940/19731/15587758394019731930-explosion.jpg";

//Declarando objetos.
var boneco = new Sprite(100,100,40,40,imagemBoneco);
sprites.push(boneco);

//Chamando a função loop pela primeira vez para que ela se repita sozinha logo em seguida. 
loop();