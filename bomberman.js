//Classe construtor para o personagem principal
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

//Funções para calcular aonde as paredes ficam no mapa, não ficando aleatóriamente jogadas
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

//Classe construtor para a bomba
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
class PlusBomba {
    constructor(x,y,largura,altura,imagem){
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.imagem = imagem;
    }
}

PlusBomba.prototype.metadeLargura = function(){
    return this.largura/2
}
PlusBomba.prototype.metadeAltura = function(){
    return this.altura/2
}
PlusBomba.prototype.centroX = function(){
    return this.x + this.metadeLargura();
}
PlusBomba.prototype.centroY = function(){
    return this.y + this.metadeAltura();
}

//FUNÇÕES
//Para chamar todas as funções
function loop (){ 
    window.requestAnimationFrame(loop,tela);
    desenha();                          
    atualiza();                         
    mudarFase();                //Função para mudar de fase
    //console.log();
}

function atualiza(){
    //Condições para movimentar o personagem principal
    //Esquerda
    if(mvLeft && !mvRight && !mvDown && !mvUp){
        boneco.x -= velocidade;                         //Velocidade contínuo
        boneco.imgY = tamanhoImg + boneco.altura * 2;   //Animação
    }
    //Direita
    if(mvRight && !mvLeft && !mvDown && !mvUp){
        boneco.x += velocidade;
        boneco.imgY = tamanhoImg + boneco.altura * 1;
    }
    //Cima
    if(mvUp && !mvDown){
        boneco.y -= velocidade;
        boneco.imgY = tamanhoImg + boneco.altura * 0;
    }
    //Baixo
    if(mvDown && !mvUp){
        boneco.y += velocidade;
        boneco.imgY = 0 + 0 * 2;
    } 
    //Condição para mudar a imagem enquanto anda, fazendo a animação.
    if(mvLeft || mvRight || mvUp || mvDown){
        boneco.contadorAnim++;

        if(boneco.contadorAnim >= 60){
            boneco.contadorAnim = 0;
        }

        boneco.imgX = Math.floor(boneco.contadorAnim/15) * boneco.largura;
    } 

    //Caso fique parado
    else{
        boneco.imgX = 0;
        boneco.contadorAnim = 0;
    }


    //COLISÕES

    var arrayExplosoes = [...arrayExplosaoB, ...arrayExplosaoC, ...arrayExplosaoD, ...arrayExplosaoE];
    //Colisões das paredes
    for(let i in paredes){
        let prd = paredes[i];
        colisao(boneco,prd);
    }
    //Colisões das paredes destrutivas(Cacto, tronco...)
    for (let i in paredesD) {
        let prd = paredesD[i];
        colisao(boneco, prd);
    }

    for(let i2 in inimigos){
        let ini = inimigos[i2]
        for(let i in paredes) {
            let prd = paredes[i]
            colisao(ini,prd);
        }
    }   
     for(let i2 in inimigos){
        let ini = inimigos[i2]
        for(let i in paredesD) {
            let prd = paredesD[i]
            colisao(ini,prd);
        }
    }      


    //Colisões dos inimigos
    for(let i2 in inimigos){
        let ini = inimigos[i2]
        for(let i in arrayExplosoes) {
            let exp = arrayExplosoes[i]
            colisao2(ini,exp);
            if(colidiu){
                colidiu = false;
                inimigos.splice(i2,1);
            }
        } 
    }
    //Colisão da bomba
    for (let i in bombas) {
        let prd = bombas[i];
        if(boneco.x > bomba.x+45 || boneco.x < bomba.x-25 || boneco.y > bomba.y+45 || boneco.y < bomba.y-25){
            colisao(boneco, prd);    
        }  
    }
    //Colisão da bomba com o inimigo
    for (let i in bombas) {
        let prd = bombas[i];
        colisao(inimigo, prd);    
    }


    //Colisões diferentes
    for(let i in arrayExplosoes) {
        let prd = arrayExplosoes[i];
        colisao2(boneco, prd);
        
    }
    //Condição  para o contador de vida do personagem principal
    if(colidiu){
        if(tempo>500){
            vidas --;    
            tempo = 0;
        }
        colidiu = false;
    }

    for (let i in inimigos) {
        let ini = inimigos[i];
      
        colisao2(ini,boneco);
        if(colidiu){
            if(tempo>500){
                vidas --;    
                tempo = 0;
            }
            colidiu = false;
        }
    }
    tempo ++;
   
    //Pegar os PowerUps
    for(let i in powerUpExplosao){
        let pwu = powerUpExplosao[i];
        colisao2(boneco,pwu);
        if(colidiu){
            tE ++;    
            pwUR = undefined;
            colidiu = false;
            powerUpExplosao.splice(i,1);
            powerUpOnOff = false;
        }
    }

    for(let i in powerUpBombas){
        let pwB = powerUpBombas[i];
        colisao2(boneco,pwB);
        if(colidiu){
            numeroDeBombas ++;    
            pwUR = undefined;
            colidiu = false;
            powerUpBombas.splice(i,1);
            powerUpOnOff = false;
        }
    }
    
    //MOVIMENTAÇÃO DO INIMIGOS  

    tempoInimigo += 1;
    if(tempoInimigo === 60){
        tempoInimigo = 0; 
        yorX =  Math.floor(Math.random() * 4);  //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        yorX1 =  Math.floor(Math.random() * 4);  //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        yorX2 =  Math.floor(Math.random() * 4);  //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        yorX3 =  Math.floor(Math.random() * 4);  //Número aléatorio de 0 a 3, definindo a direção do inimigo;
    }
    if(inimigos.length > 0){    
        direcaoIni(inimigo,yorX);

        direcaoIni(inimigo2,yorX1);

        direcaoIni(inimigo3,yorX2);

        direcaoIni(inimigo4,yorX3);
    }

    
    mostrarVida.textContent = ("Vidas: "+vidas);    //Mostrar vida do personagem principal
}

//Função para desenhar tudo na tela.
function desenha() {

    //condições para escolher a imagem de fundo de cada fase
    if(fase === 1){
        document.getElementById("jogo").style.backgroundImage = "url('https://i.imgur.com/N0Y3SFj.jpg')";   
    }
    if(fase === 2){
        document.getElementById("jogo").style.backgroundImage = "url('https://w7.pngwing.com/pngs/644/969/png-transparent-texture-mapping-opengameart-org-gimp-tile-paper-sand-texture-brown-isometric-graphics-in-video-games-and-pixel-art.png')";   
    }
    
    var x;
    var y;
    ctx.clearRect(0,0,tela.width,tela.height); //Limpando a tela.

    //Personagem e inimigos
    for(var i in inimigos){
        var spr = inimigos[i];
            ctx.drawImage(
                spr.imagem,
                spr.imgX,spr.imgY,spr.largura,spr.altura,
                spr.x,spr.y,spr.largura,spr.altura
                ) ;
    }
    
    if(tempo < 500 && tempo%20 === 0){
       podeMorrer = !podeMorrer;
    }  
    if(tempo>500){
        podeMorrer = true;
    }
    if(podeMorrer){
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
   //Desenhar as paredes destrutivas
   for(i = 0; i<paredesD.length; i++){
       var prd = paredesD[i];
       ctx.drawImage(prd.imagem,prd.x,prd.y,prd.largura,prd.altura);  
   }
    //Desenhando a bomba e criando explosão da bomba.
    for(var i = 0; i<bombas.length; i++){ //Varrendo o array de bombas
        var bmb = bombas[i];
        ctx.drawImage(bmb.imagem,bmb.x,bmb.y,bmb.largura,bmb.altura);
        fogoColidiuD = false;
        fogoColidiuB = false;
        fogoColidiuE = false;
        fogoColidiuC = false;
        if(((new Date())-bombas[i].momentoCriacao)>bombas[i].tempoDeDetonacao){ 
            for(var i=0; i<50*tE ; i=i+50){
                explosao = new Sprite(bmb.x+i,bmb.y,bmb.largura,bmb.altura,imagemExplosao);
                if(!fogoColidiuD){
                    arrayExplosaoD.push(explosao);
                }
                detectarColisoes(paredesD,arrayExplosaoD);
                detectarColisoes(paredes,arrayExplosaoD);
            }    
            for(var i=50; i<50*tE ; i=i+50){
                explosao = new Sprite(bmb.x,bmb.y+i,bmb.largura,bmb.altura,imagemExplosao);
                if(!fogoColidiuB){
                    arrayExplosaoB.push(explosao);
                }
                detectarColisoes(paredesD,arrayExplosaoB);
                detectarColisoes(paredes,arrayExplosaoB);
            }
            
            for(var i=50; i<50*tE ; i=i+50){
                explosao = new Sprite(bmb.x-i,bmb.y,bmb.largura,bmb.altura,imagemExplosao);
                if(!fogoColidiuE){
                    arrayExplosaoE.push(explosao);
                }
                detectarColisoes(paredesD,arrayExplosaoE);
                detectarColisoes(paredes,arrayExplosaoE);
            }     
            for(var i=50; i<50*tE ; i=i+50){
                explosao = new Sprite(bmb.x,bmb.y-i,bmb.largura,bmb.altura,imagemExplosao);
                if(!fogoColidiuC){
                    arrayExplosaoC.push(explosao);
                }  
                detectarColisoes(paredesD,arrayExplosaoC);
                detectarColisoes(paredes,arrayExplosaoC);
            }
            bombas.shift();
        }    
    }  

    //Desenho de cada direção da explosão da bomba
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
        var pue = powerUpExplosao[i];
        ctx.drawImage(pue.imagem,pue.x,pue.y,pue.largura,pue.altura);
     }

    for(var i in powerUpBombas){
        var pub = powerUpBombas[i];
        ctx.drawImage(pub.imagem,pub.x,pub.y,pub.largura,pub.altura);
    }

    //Desenhando a porta
    if(inimigos.length === 0 && paredesD.length === 0){
        ctx.drawImage(porta.imagem,porta.x,porta.y,porta.largura,porta.altura);
    }
}

//Função para usar como calculo das colisões
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
function detectarColisoes(ob1,ob2){

   for(let i2 in ob1){
        let prdD = ob1[i2]
        for(let i in ob2) {
            let prd = ob2[i]
            colisao2(prdD,prd);
            if(colidiu){
                colidiu = false;
                ob2.splice(i,10);
                if(ob2 === arrayExplosaoD){
                    fogoColidiuD = true;
                }
                if(ob2 === arrayExplosaoB){
                    fogoColidiuB = true;
                }
                if(ob2 === arrayExplosaoE){
                    fogoColidiuE = true;
                }
                if(ob2 === arrayExplosaoC){
                    fogoColidiuC = true;
                }
                if(ob1 === paredesD){
                    pwUR =  Math.floor(Math.random() * 20);
                    if(pwUR == 0 || pwUR == 15){
                        powerUpOnOff = true;
                        var powerUpE = new Sprite(paredesD[i2].x,paredesD[i2].y,30,30,pueImagem);
                        powerUpExplosao.push(powerUpE);
                    }
                    if(pwUR == 5 || pwUR == 11){
                        powerUpOnOff = true;
                        var novoPUBomba = new PlusBomba(paredesD[i2].x,paredesD[i2].y,30,30,imagemPUpB);
                        powerUpBombas.push(novoPUBomba);
                    }
                    paredesD.splice(i2,1);
                }
            }
        } 
    }


}
function direcaoIni(iniObj,numAleatorio){
        //condição para a cada 120 segundos, o inimigo mudar de direção.
        

       //Para a esquerda
       if(numAleatorio === 0){
            iniObj.x -= 0.8;
            iniObj.imgY = tamanhoImg + iniObj.altura * 2;
        }

        //Para a direita
        if(numAleatorio === 1){
            iniObj.x += 0.8;
            iniObj.imgY = tamanhoImg + iniObj.altura * 1;           
        }

        //Para cima
        if(numAleatorio === 2){
            iniObj.y -= 0.8;
            iniObj.imgY = tamanhoImg + iniObj.altura * 0;
        }

        //Para baixo
        if(numAleatorio === 3){
            iniObj.y += 0.8;
            iniObj.imgY = 0 + 0 * 2;
        }

        //Condição para a animação do personagem
        if(numAleatorio === 0 || numAleatorio === 1 || numAleatorio === 2 || numAleatorio === 3){
            iniObj.contadorAnim++;

            if(iniObj.contadorAnim >= 60){
                iniObj.contadorAnim = 0;
            }

            iniObj.imgX = Math.floor(iniObj.contadorAnim/15) * iniObj.largura;
        } else{
            iniObj.imgX = 0;
            iniObj.contadorAnim = 0;
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
            //Caso o personagem clique para cima estando dentro da porta, é passado para a proxima fase.
            colisao2(boneco,porta)
            if(colidiu && inimigos.length === 0 && paredesD.length === 0){
                colidiu = false;
                paredes = [];
                paredesD = [];    
                fase = 2;
                rodou = false;
                boneco.x = 100;
                boneco.y = 100;
                porta.x = 900;
            }
            break;
        case RIGHT:
            mvRight = true;
            break;
        case DOWN:
            mvDown = true;
            break;
        //Botão usado para criar bombas.
        case SPACE:
            //Validação para verificar o número de bombas que pode ser colocada.
            if(bombas.length<numeroDeBombas){
                //Variável usada pegando o centroX do boneco para deixar a bomba no centro do bloco. 
                xBomba = Math.floor(boneco.centroX()/50)*50; 
                //Variável usada pegando o centroY do boneco para deixar a bomba no centro do bloco.
                yBomba = Math.floor(boneco.centroY()/50)*50;
                //Objeto bomba sendo adicionado a uma váriavel.
                bomba = new Bomba(xBomba,yBomba,50,50,imagemBomba);
                //Validação para colocar a primeira bomba.
                if(bombas.length<1){
                    bombas.push(bomba);
                }
                /* Validação para verificar se a última bomba colocada tem a mesma localização da nova bomba.
                Só será colocada uma nova bomba se as coordenadas forem diferentes. Foi feito usando o array das bombas,
                pegando a última posição das bombas, comparando 3 vezes, na primeira para não ser colocada no mesmo lugar,
                na segunda para conseguir botar em linha(mesmo x) e em coluna(no mesmo y) e na última para colocar na diagonal.
                */
                if(((((bombas[bombas.length-1].x) === bomba.x) && ((bombas[bombas.length-1].y) != bomba.y)) || (((bombas[bombas.length-1].y) === bomba.y) && ((bombas[bombas.length-1].x) != bomba.x))) || ((bombas[bombas.length-1].y) != bomba.y) && ((bombas[bombas.length-1].x) != bomba.x)){  
                    bombas.push(bomba);       
                    break; 
                }
            }
    }
}, false);



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

//Caso nenhum botão fique apertado, o personagem principal para de se movimentar continuamente.
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

//Função para mudar de fase
function mudarFase(){
    //Array em forma de matriz para desenharmos o mapa, cada numero sendo um bloco diferente
    //Fase 1: Fazenda

    if(fase === 1){
        mapa = [ 
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
    
    //Fase 2: Deserto
    if(fase === 2){
     mapa = [ 
     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
     [1,1,1,0,0,8,0,0,0,0,0,0,1,1,1],
     [1,1,0,0,0,8,0,8,0,0,0,0,1,1,1],
     [1,0,0,0,0,8,0,0,0,0,0,0,0,0,1],
     [1,0,0,0,8,8,0,8,0,0,0,0,0,0,1],
     [1,8,0,0,8,8,0,0,0,0,0,0,0,0,1],
     [1,0,0,0,0,0,0,8,0,0,0,0,0,0,1],
     [1,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
     [1,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
     [1,8,8,0,8,8,8,0,8,8,8,0,0,0,1],
     [1,8,8,0,8,8,0,8,8,0,0,0,0,0,1],
     [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
     [1,1,1,0,0,0,0,8,0,0,8,0,1,1,1],
     [1,1,1,0,0,0,0,0,0,0,0,0,1,1,1],
     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]         
     ]
 }

    //Lógica para criar as paredes do mapa
    if(!rodou){
        for(var linhas in mapa){
            for(var colunas in mapa[linhas]){
                var bloco = mapa[linhas][colunas];

                /*Cada condição é uma parede com imagem diferente, mantendo dois tipos: 
                - paredes destrutivas(paredesD) 
                - paredes fixas(paredes)*/

                //Paredes fixas
                if(bloco === 1 && fase === 1){
                    x = colunas*50;
                    y = linhas*50;
                    var parede1 = new Sprite(x,y,50,50,imagemCercaED);
                    paredes.push(parede1);          //Fazendo push em paredes, para paredes fixas
                }
                if(bloco === 1 && fase === 2){
                    x = colunas*50;
                    y = linhas*50;
                    var parede1 = new Sprite(x,y,50,50,imagemEgito);
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

                //Paredes Destrutivas
                if(bloco === 8 && fase === 1){
                    x = colunas*50
                    y = linhas*50
                    var parede8 = new Sprite(x, y, 50, 50, imagemTronco)
                    paredesD.push(parede8);             //Fazendo push em paredesD, para paredes destrutivas
                }
                if(bloco === 8 && fase === 2){
                    x = colunas*50
                    y = linhas*50
                    var parede8 = new Sprite(x, y, 50, 50, imagemEgitoD)
                    paredesD.push(parede8);
                }
            } 
            rodou = true;     //Para não ficar recriando sem parar, só recriando quando for false. 
        } 
    }
}


var tela = document.querySelector("canvas");
var ctx = tela.getContext("2d");

//teclas
var LEFT=37, UP=38, RIGHT=39, DOWN=40, SPACE=32;

//movimento
var mvLeft = mvUp = mvRight = mvDown = bomb = false;
var velocidade = 4;
var yorX;
var yorX1;
var yorX2;
var yorX3;
var pwUR;
var x;
var y;

var fogoColidiuD = false;
var fogoColidiuB = false;
var fogoColidiuE = false;
var fogoColidiuC = false;
var rodou = false;              //Variavel para sempre desenhar as paredes quando for chamada
var podeMorrer = true;          //Quando atingido, o personagem fica piscando, ficando tambem imortal
var tempo = 1000;               //Tempo do personagem, quando ele é atingido, ele recebe valo inferior a 1000
var tempoE = 1000;              //Tempo da explosão da bomba
var tamanhoImg = 30;            //Tamanho da imagem do personagem
var xBomba = undefined;         //posição da bomba horizontalmente
var yBomba= undefined;          //posição da bomba verticalmente
var bomba;
var powerUpOnOff = true;        
var tE = 2;                     //Tamanho da explosão, inicialmente 3 blocos
var numeroDeBombas = 1; 
var colidiu = false;            
var tempoInimigo = 0;           //Tempo para o inimigo se manter numa direção em um determinado tempo
var fase = 1;                   //Fase inicial
var mostrarVida = document.getElementById("vida");          //Contator de vida
var vidas = 3;                  //Quantidade de vidas inciais


//DEFININDO IMAGENS.

//imagem do personagem principal(porco)
var imagemBoneco = new Image();
imagemBoneco.src ="spriteporco/porcosheet.png";

//imagem paredes fase 1(cercado)
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

//imagem parede fase 1
var imagemPedra = new Image();
imagemPedra.src = "img/pngrocha.png";

var imagemTronco = new Image();
imagemTronco.src = "img/pngmadera.png";

//imagem parede fase 2

var imagemEgito = new Image();
imagemEgito.src = "imgfase2/Egito.png";

var imagemEgitoD = new Image();
imagemEgitoD.src = "imgfase2/EgitoD.png";


//imagem da Bomba

var imagemBomba = new Image();
imagemBomba.src ="img/pngbomba.png";

//imagem da explosão
var imagemExplosao = new Image();
imagemExplosao.src = "img/pngexplosao.png";

//imagem do powerUp
var pueImagem = new Image();
pueImagem.src = "img/powerupexplosao.png";

var imagemPUpB = new Image();
imagemPUpB.src = "img/imagemPowerUpBomba.png";

//imagem do inimigo fase 1(lobo)
var imagemInimigo = new Image();
imagemInimigo.src ="spriteporco/lobinhosheet.png";

//imagem da porta, para passar de fase
var imagemPorta = new Image();
imagemPorta.src ="https://imgur.com/Ou9w4gH.png";

//Arrays
var powerUpExplosao = [];   //qunatidade da explosão após o powerUp
var powerUpBombas = [];
var bombas = [];            //Quantidade de bomba
var sprites = [];           //para os personagens
var paredes = [];           //para as paredes fixas
var paredesD = [];          //para as paredes destrutivas
var arrayExplosaoD = [];    //explosao para a direita
var arrayExplosaoB = [];    //explosao para a baixo
var arrayExplosaoE = [];    //explosao para a esquerda
var arrayExplosaoC =[];     //explosao para cima
var mapa = [];              //mapas para a quantidade de fase
var inimigos = [];          //para os inimigos

//Declarando objetos.
var boneco = new Sprite(100,100,30,30,imagemBoneco);
sprites.push(boneco);

//variavel do powerUp, tendo a posição inicial dela

//variavel do inimigo, tendo a posição inicial dela
var inimigo = new Sprite(200,200,30,30,imagemInimigo);
var inimigo2 = new Sprite(600,100,30,30,imagemInimigo);
var inimigo3 = new Sprite(100,600,30,30,imagemInimigo);
var inimigo4 = new Sprite(600,600,30,30,imagemInimigo);
inimigos.push(inimigo,inimigo2,inimigo3,inimigo4);

//variavel da porta, tendo a posição inicial dela
var porta = new Sprite(400,400,50,50,imagemPorta);
sprites.push(porta);

loop(); //Chamando a função loop pela primeira vez para que ela se repita sozinha logo em seguida. 