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
var LEFT=37, UP=38, RIGHT=39, DOWN=40;

//movimento
var mvLeft = mvUp = mvRight = mvDown = false;
var velocidade = 4;
//arrays
var mapa = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]
         
var sprites = [];
var paredes = [];
for(var linhas in mapa){
    for(var colunas in mapa[linhas]){
        var bloco = mapa[linhas][colunas];
        if(bloco === 1){
            var x = colunas*50;
            var y = linhas*50;
            var parede = new Sprite(x,y,50,50,imagemBoneco);
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
var boneco = new Sprite(100,100,50,50,imagemBoneco);
sprites.push(boneco);

var imagemParede = new Image();
imagemParede.src = "https://imgur.com/EkleLlt.png";

//funções 
function loop (){
    window.requestAnimationFrame(loop,tela);
    atualiza();
    desenha();
    
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

    //boneco.x = Math.max(50, Math.min((tela.width - 50) - boneco.largura, boneco.x));
    //boneco.y = Math.max(50, Math.min((tela.height - 50)- boneco.altura, boneco.y));

    //colisões
    for(var i in paredes){
        var prd = paredes[i];
        colisao(boneco,prd);
    }
    
}

function desenha() {
    ctx.clearRect(0,0,tela.width,tela.height);
    for(var i in sprites){
        var spr = sprites[i];
        ctx.drawImage(imagemBoneco,spr.x, spr.y, spr.largura, spr.altura); 
    }

    for(var linhas in mapa){
        for(var colunas in mapa[linhas]){
            var bloco = mapa[linhas][colunas];
            if(bloco === 1){
                var x = colunas*50;
                var y = linhas*50;
                ctx.drawImage(imagemParede,x,y,50,50);
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

loop();

//imagemParede.src = "https://imgur.com/EkleLlt.png";

   
//ctx.drawImage(imagemBoneco,x,y,50,50);