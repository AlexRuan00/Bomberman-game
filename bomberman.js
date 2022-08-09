class Sprite {
    constructor(x, y, largura, altura, imagem, tempoDeExplosao = 2000) {
        this.y = y;
        this.x = x;
        this.largura = largura;
        this.altura = altura;
        this.imagem = imagem;
        this.imgX = 0;
        this.imgY = 0;
        this.contadorAnim = 0;
        this.momentoCriacao = new Date();
        this.tempoDeExplosao = 500;
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
    desenha();
    atualiza();
    
    
    console.log(tempo);
}

function atualiza(){
    if(mvLeft && !mvRight && !mvDown && !mvUp){
        boneco.x -= velocidade;
        boneco.imgY = tamanhoImg + boneco.altura * 2;
    }
    if(mvRight && !mvLeft && !mvDown && !mvUp){
        boneco.x += velocidade;
        boneco.imgY = tamanhoImg + boneco.altura * 1;
    }
    if(mvUp && !mvDown){
        boneco.y -= velocidade;
        boneco.imgY = tamanhoImg + boneco.altura * 0;
    }
    if(mvDown && !mvUp){
        boneco.y += velocidade;
        boneco.imgY = 0 + 0 * 2;
    } 

    if(mvLeft || mvRight || mvUp || mvDown){
        boneco.contadorAnim++;

        if(boneco.contadorAnim >= 60){
            boneco.contadorAnim = 0;
        }

        boneco.imgX = Math.floor(boneco.contadorAnim/15) * boneco.largura;
    } else{
        boneco.imgX = 0;
        boneco.contadorAnim = 0;
    }

    //colisões de bloqueio
    var arrayExplosoes = [...arrayExplosaoB, ...arrayExplosaoC, ...arrayExplosaoD, ...arrayExplosaoE];
    for(let i in paredes){
        let prd = paredes[i];
        colisao(boneco,prd);
        colisao(inimigo,prd);
    }

    for (let i in paredesD) {
        let prd = paredesD[i];
        colisao(boneco, prd);
        colisao(inimigo,prd);
    }
    for (let i in arrayExplosoes) {
        let prd = arrayExplosoes[i];
        //colisao2(boneco, prd);
        colisao2(inimigo,prd);
        if(colidiu){
            colidiu = false;
            inimigo.x = 900;
        }
    }
    for (let i in bombas) {
        let prd = bombas[i];
        if(boneco.x > bomba.x+45 || boneco.x < bomba.x-25 || boneco.y > bomba.y+45 || boneco.y < bomba.y-25){
            colisao(boneco, prd);    
        }  
    }
    for (let i in bombas) {
        let prd = bombas[i];
        colisao(inimigo, prd);    
    }


    //Colisões diferentes
    for(let i in arrayExplosoes) {
        let prd = arrayExplosoes[i];
        colisao2(boneco, prd);
        
    }
    if(colidiu){
        if(tempo>500){
            vidas --;    
            tempo = 0;
        }
        colidiu = false;
    }

    colisao2(inimigo,boneco);
    tempo ++;
    if(colidiu){
        if(tempo>500){
            vidas --;    
            tempo = 0;
        }
        colidiu = false;
    }


    for(let i2 in paredes){
        let prdD = paredes[i2]
        for(let i in arrayExplosaoD) {
            let prd = arrayExplosaoD[i]
            colisao2(prdD,prd);
            if(colidiu){
                colidiu = false;
                arrayExplosaoD.splice(i,10);
                
            }
        } 
    }
    for(let i2 in paredes){
        let prdD = paredes[i2]
        for(let i in arrayExplosaoB) {
            let prd = arrayExplosaoB[i]
            colisao2(prdD,prd);
            if(colidiu){
                colidiu = false;
                arrayExplosaoB.splice(i,10);
                
            }
        } 
    }
    for(let i2 in paredes){
        let prdD = paredes[i2]
        for(let i in arrayExplosaoE) {
            let prd = arrayExplosaoE[i]
            colisao2(prdD,prd);
            if(colidiu){
                colidiu = false;
                arrayExplosaoE.splice(i,10);
                
            }
        } 
    }
    for(let i2 in paredes){
        let prdD = paredes[i2]
        for(let i in arrayExplosaoC) {
            let prd = arrayExplosaoC[i]
            colisao2(prdD,prd);
            if(colidiu){
                colidiu = false;
                arrayExplosaoC.splice(i,10);
                
            }
        } 
    }

    //Pegar os PowerUps
    for(let i in powerUpExplosao){
        let pwu = powerUpExplosao[i];
        colisao2(boneco,pwu);
        if(colidiu){
            if(tempoE>500){
                tE ++;    
                tempoE = 0;
            }
            colidiu = false;
            powerUpExplosao.splice(i,1);
            powerUpOnOff = false;
        }
    }    
    /*colisao2(boneco,powerUpE);
    if(colidiu){
        if(tempoE>500){
            tE ++;    
            tempoE = 0;
        }
        colidiu = false;
        powerUpExplosao.pop();
        powerUpOnOff = false;
    }*/
    
    //Movimentação do Inimigo    

    tempoInimigo += 1;


    //condição para a cada 120 segundos, o inimigo mudar de direção.
    if(tempoInimigo === 60){
        tempoInimigo = 0;
        yorX = Math.floor(Math.random() * 4);   //Número aléatorio de 1 a 4, definindo a direção do inimigo
    }

   //Para a esquerda
   if(yorX === 0){
        inimigo.x -= 0.8;
        inimigo.imgY = tamanhoImg + inimigo.altura * 2;
        //inimigo.y = 0;
    }

    //Para a direita
    if(yorX === 1){
        inimigo.x += 0.8;
        inimigo.imgY = tamanhoImg + inimigo.altura * 1;
        //inimigo.y = 0;
            
    }

    //Para cima
    if(yorX === 2){
        inimigo.y -= 0.8;
        inimigo.imgY = tamanhoImg + inimigo.altura * 0;
        //inimigo.x = 0;
    }

    //Para baixo
    if(yorX === 3){
        inimigo.y += 0.8;
        inimigo.imgY = 0 + 0 * 2;
        //inimigo.x = 0;
    }
    if(yorX === 0 || yorX === 1 || yorX === 2 || yorX === 3){
        inimigo.contadorAnim++;

        if(inimigo.contadorAnim >= 60){
            inimigo.contadorAnim = 0;
        }

        inimigo.imgX = Math.floor(inimigo.contadorAnim/15) * inimigo.largura;
    } else{
        inimigo.imgX = 0;
        inimigo.contadorAnim = 0;
        }

    mostrarVida.textContent = ("Vidas: "+vidas);

}

//Função para desenhar tudo na tela.
function desenha() {
    var x;
    var y;
    ctx.clearRect(0,0,tela.width,tela.height); //Limpando a tela.

    //Personagem e inimigos
    for(var i in sprites){
        var spr = sprites[i];
        if(spr != boneco){
            ctx.drawImage(
                spr.imagem,
                spr.imgX,spr.imgY,spr.largura,spr.altura,
                spr.x,spr.y,spr.largura,spr.altura
                ) ;
        }
    }
    
    if(tempo < 500 && tempo%20 === 0){
       teste = !teste;
    }  
    if(tempo>500){
        teste = true;
    }
    if(teste){
       ctx.drawImage(
        imagemBoneco,
        boneco.imgX,boneco.imgY,boneco.largura,boneco.altura,
        boneco.x,boneco.y,boneco.largura,boneco.altura
        ) ; 
    }
    
   

    //Desenhar as paredes
    for(i = 0; i<paredes.length; i++){
       var prd = paredes[i];
       ctx.drawImage(prd.imagem,prd.x,prd.y,prd.largura,prd.altura);  
   }
   for(i = 0; i<paredesD.length; i++){
       var prd = paredesD[i];
       ctx.drawImage(prd.imagem,prd.x,prd.y,prd.largura,prd.altura);  
   }



    //Desenhando a bomba e criando explosão da bomba.
    for(var i = 0; i<bombas.length; i++){ //Varrendo o array de bombas
        var bmb = bombas[i];
        ctx.drawImage(bmb.imagem,bmb.x,bmb.y,bmb.largura,bmb.altura);
        var fogoColidiuD = false;
        var fogoColidiuB = false;
        var fogoColidiuE = false;
        var fogoColidiuC = false;
        if(((new Date())-bombas[i].momentoCriacao)>bombas[i].tempoDeDetonacao){ 
            for(var i=0; i<50*tE ; i=i+50){
                explosao = new Sprite(bmb.x+i,bmb.y,bmb.largura,bmb.altura,imagemExplosao);
                if(!fogoColidiuD){
                    arrayExplosaoD.push(explosao);
                }
                for(let i2 in paredesD){
                    let prdD = paredesD[i2]
                    for(let i in arrayExplosaoD) {
                        let prd = arrayExplosaoD[i]
                        colisao2(prdD,prd);
                        if(colidiu){
                            fogoColidiuD = true;
                            colidiu = false;
                            arrayExplosaoD.splice(i,10);
                            paredesD.splice(i2,1);
                            
                        }   
                    } 
                }
            }    
            for(var i=50; i<50*tE ; i=i+50){
                explosao = new Sprite(bmb.x,bmb.y+i,bmb.largura,bmb.altura,imagemExplosao);
                if(!fogoColidiuB){
                    arrayExplosaoB.push(explosao);
                }
                for(let i2 in paredesD){
                    let prdD = paredesD[i2]
                    for(let i in arrayExplosaoB) {
                        let prd = arrayExplosaoB[i]
                        colisao2(prdD,prd);
                        if(colidiu){
                            fogoColidiuB = true;
                            colidiu = false;
                            arrayExplosaoB.splice(i,10);
                            paredesD.splice(i2,1);
                        }   
                    } 
                }

            }
            
            for(var i=50; i<50*tE ; i=i+50){
                explosao = new Sprite(bmb.x-i,bmb.y,bmb.largura,bmb.altura,imagemExplosao);
                if(!fogoColidiuE){
                    arrayExplosaoE.push(explosao);
                }
                for(let i2 in paredesD){
                    let prdD = paredesD[i2]
                    for(let i in arrayExplosaoE) {
                        let prd = arrayExplosaoE[i]
                        colisao2(prdD,prd);
                        if(colidiu){
                            fogoColidiuE = true;
                            colidiu = false;
                            arrayExplosaoE.splice(i,10);
                            paredesD.splice(i2,1);
                        }   
                    } 
                }
            }     
            for(var i=50; i<50*tE ; i=i+50){
                explosao = new Sprite(bmb.x,bmb.y-i,bmb.largura,bmb.altura,imagemExplosao);
                if(!fogoColidiuC){
                    arrayExplosaoC.push(explosao);
                }  
                for(let i2 in paredesD){
                    let prdD = paredesD[i2]
                    for(let i in arrayExplosaoC) {
                        let prd = arrayExplosaoC[i]
                        colisao2(prdD,prd);
                        if(colidiu){
                            fogoColidiuC = true;
                            colidiu = false;
                            arrayExplosaoC.splice(i,10);
                            paredesD.splice(i2,1);
                        }   
                    } 
                }
            }
            bombas.shift();
        }    
    }  
    for(i = 0; i<arrayExplosaoB.length; i++){
        var exp = arrayExplosaoB[i];
        ctx.drawImage(exp.imagem,exp.x,exp.y,exp.largura,exp.altura); 
        if(((new Date())-arrayExplosaoB[i].momentoCriacao)>arrayExplosaoB[i].tempoDeExplosao){
            arrayExplosaoB.shift();
        }
    }
    for(i = 0; i<arrayExplosaoE.length; i++){
        var exp = arrayExplosaoE[i];
        ctx.drawImage(exp.imagem,exp.x,exp.y,exp.largura,exp.altura);
        if(((new Date())-arrayExplosaoE[i].momentoCriacao)>arrayExplosaoE[i].tempoDeExplosao){
            arrayExplosaoE.shift();
        } 
    }
    for(i = 0; i<arrayExplosaoC.length; i++){
        var exp = arrayExplosaoC[i];
        ctx.drawImage(exp.imagem,exp.x,exp.y,exp.largura,exp.altura); 
        if(((new Date())-arrayExplosaoC[i].momentoCriacao)>arrayExplosaoC[i].tempoDeExplosao){
            arrayExplosaoC.shift();
        }
    }        
    for(i = 0; i<arrayExplosaoD.length; i++){
        var exp = arrayExplosaoD[i];
        ctx.drawImage(exp.imagem,exp.x,exp.y,exp.largura,exp.altura);
        if(((new Date())-arrayExplosaoD[i].momentoCriacao)>arrayExplosaoD[i].tempoDeExplosao){
            arrayExplosaoD.shift();
        }
    }   
    
    //Desenhando os powerups
    for(var i in powerUpExplosao){
        if(powerUpOnOff){
            var pue = powerUpExplosao[i];
            ctx.drawImage(pue.imagem,pue.x,pue.y,pue.largura,pue.altura)
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

function colisao2(r1,r2){
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
                colidiu = true;
            } else {
                colidiu = true;
            }
        } else {// colisão pela esquerda ou direita
            if(catX > 0){//pela esquerda
                colidiu = true;
            } else {
                colidiu = true;
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
var velocidade = 4;
var yorX;
var x;
var y;

var teste = true;
var tempo = 1000;
var tempoE = 1000;
var tamanhoImg = 30;
var xBomba = undefined;
var yBomba= undefined;  
var bomba;
var powerUpOnOff = true;
var tE = 3;
var colidiu = false;
var tempoInimigo = 0;           //Tempo para o inimigo se manter numa direção em um determinado tempo
var fase = 1;
var mostrarVida = document.getElementById("vida");
var vidas = 5;

//Definindo imagens.
var imagemBoneco = new Image();
imagemBoneco.src ="spriteporco/porcosheet.png";

var imagemCercaCB = new Image();
imagemCercaCB.src ="img/pngcercaCB.png";

var imagemCercaED = new Image();
imagemCercaED.src ="img/pngcercaED.png";

var imagemCercaCanto1 = new Image();
imagemCercaCanto1.src ="img/pngcercaCanto1.png";

var imagemCercaCanto2 = new Image();
imagemCercaCanto2.src ="img/pngcercaCanto2.png";

var imagemCercaCanto3 = new Image();
imagemCercaCanto3.src ="img/pngcercaCanto3.png";

var imagemCercaCanto4 = new Image();
imagemCercaCanto4.src ="img/pngcercaCanto4.png";

var imagemPedra = new Image();
imagemPedra.src = "img/pngrocha.png";

var imagemTronco = new Image();
imagemTronco.src = "img/pngmadera.png";

var imagemBomba = new Image();
imagemBomba.src ="img/pngbomba.png";

var imagemExplosao = new Image();
imagemExplosao.src = "img/pngexplosao.png";

var pueImagem = new Image();
pueImagem.src = "img/powerupexplosao.png";

var imagemInimigo = new Image();
imagemInimigo.src ="spriteporco/lobinhosheet.png";


//Arrays
var powerUpExplosao = [];
var bombas = [];
var sprites = [];
var spritesInimigo = [];
var paredes = [];
var paredesD = [];
var arrayExplosaoD = [];
var arrayExplosaoB = [];
var arrayExplosaoE = [];
var arrayExplosaoC =[];
//Array em forma de matriz para desenharmos o mapa.

if(fase === 1){
    var mapa = [ 
    [4,2,2,2,2,2,2,2,2,2,2,2,2,2,5],
    [1,0,0,0,0,7,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,7,0,7,0,0,0,0,0,0,1],
    [1,0,0,0,0,7,0,0,0,0,8,0,0,0,1],
    [1,0,0,0,8,8,0,7,0,0,0,0,0,0,1],
    [1,7,0,0,7,8,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,7,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,8,8,0,8,8,8,0,8,8,8,0,0,0,1],
    [1,8,8,0,8,8,0,8,8,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,7,0,0,8,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [3,2,2,2,2,2,2,2,2,2,2,2,2,2,6]         
    ]
}

//Lógica para varrer o vetor da matriz do mapa.
for(var linhas in mapa){
    for(var colunas in mapa[linhas]){
        var bloco = mapa[linhas][colunas];
        if(bloco === 1){
            x = colunas*50;
            y = linhas*50;
            var parede1 = new Sprite(x,y,50,50,imagemCercaED);
            paredes.push(parede1);
        }
        if(bloco === 2){
            x = colunas*50;
            y = linhas*50;
            var parede2 = new Sprite(x,y,50,50,imagemCercaCB);
            paredes.push(parede2);
        }
        if(bloco === 3){
            x = colunas*50;
            y = linhas*50;
            var parede3 = new Sprite(x,y,50,50,imagemCercaCanto1);
            paredes.push(parede3);
        }
        if(bloco === 4){
            x = colunas*50;
            y = linhas*50;
            var parede4 = new Sprite(x,y,50,50,imagemCercaCanto2);
            paredes.push(parede4);
        }
        if(bloco === 5){
            x = colunas*50;
            y = linhas*50;
            var parede5 = new Sprite(x,y,50,50,imagemCercaCanto3);
            paredes.push(parede5);
        }
        if(bloco === 6){
            x = colunas*50;
            y = linhas*50;
            var parede6 = new Sprite(x,y,50,50,imagemCercaCanto4);
            paredes.push(parede6);
        }

        if(bloco === 7){
            x = colunas*50
            y = linhas*50
            var parede7 = new Sprite(x, y, 50, 50, imagemPedra)
            paredes.push(parede7);
        }
        if(bloco === 8){
            x = colunas*50
            y = linhas*50
            var parede8 = new Sprite(x, y, 50, 50, imagemTronco)
            paredesD.push(parede8);
        }
    }  
} 


//Declarando objetos.
var boneco = new Sprite(100,100,30,30,imagemBoneco);
sprites.push(boneco);

var powerUpE = new Sprite(500,500,30,30,pueImagem);
powerUpExplosao.push(powerUpE);

//Comentário
var inimigo = new Sprite(200,200,30,30,imagemInimigo);
sprites.push(inimigo);

//Chamando a função loop pela primeira vez para que ela se repita sozinha logo em seguida. 
loop();