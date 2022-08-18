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
//Funções para ajudar no cálculo das colisões gerais
Sprite.prototype.metadeLargura = function(){
    return this.largura/2 //Define a metade da largura
}
Sprite.prototype.metadeAltura = function(){
    return this.altura/2 //Define a metade da altura
}
Sprite.prototype.centroX = function(){
    return this.x + this.metadeLargura(); //Define x do centro
}
Sprite.prototype.centroY = function(){
    return this.y + this.metadeAltura(); //Define y do centro
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


//Função para chamar todas as funções e para se auto repetir.
function loop (){ 
    window.requestAnimationFrame(loop,tela);
    if(!pause){
        closePause()
        desenha();                          
        atualiza();                         
        mudarFase();
        if(fase === 5){
        abreCreditos();

    }
    }
    if(pause){
        showPause()
    }
    console.log(fase);
}
 function showPause() { //Função para chamar o pause na tela
    var element = document.getElementById("pause");
    element.classList.add("show-pause");
}

    function closePause() { //Função tirar o pause da tela
        var element = document.getElementById("pause");
        element.classList.remove("show-pause");
    }

    function abreCreditos() { //Função para abrir os créditos
        var creditos = document.getElementById("creditos");
        creditos.style.display = "block";
        var rolagem = document.querySelector('.marquee');
        rolagem.start();
        location.reload();
    }

function atualiza(){ //Função geral para atualizar a tela, inclui principalmente as movimentações e colisões. 
    if(vidas <= 0){
        location.reload();
        alert("Game over");
    }
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

    var arrayExplosoes = [...arrayExplosaoB, ...arrayExplosaoC, ...arrayExplosaoD, ...arrayExplosaoE]; //array geral de todas as explosões
    
    /////////////Colisões de bloqueio/////////////

    //Paredes com boneco
    for(let i in paredes){ //For usado para varrer um array e comparar cada elemento dele e isso vale para os outros for abaixo.
        let prd = paredes[i];
        colisao(boneco,prd); //chamando a função "colisao" que bloqueia um objeto de andar sobre o outro
    }
    //Paredes destrutivas com boneco
    for (let i in paredesD) {
        let prd = paredesD[i];
        colisao(boneco, prd);
    }
    //Paredes com inimigos, estrutura com 2 for para comparar cada elemento entre 2 arrays diferentes
    for(let i2 in inimigos){ //1° for
        let ini = inimigos[i2]
        for(let i in paredes) { //2° for 
            let prd = paredes[i]
            colisao(ini,prd);
        }
    }
    //Paredes destrutivas com inimigos   
    for(let i2 in inimigos){
        let ini = inimigos[i2]
        for(let i in paredesD) {
            let prd = paredesD[i]
            colisao(ini,prd);
        }
    }      

    //Paredes com Boss da fase 4 
    for(let i2 in rodrigoBoss){
        let bos = rodrigoBoss[i2]
        for(let i in paredes) {
            let prdbos = paredes[i]
            colisao(bos,prdbos);
        }
    }   
    //Paredes destrutivas com Boss da fase 4 
    for(let i2 in rodrigoBoss){
        let bos = rodrigoBoss[i2]
        for(let i in paredesD) {
            let prdbos = paredesD[i]
            colisao(bos,prdbos);
        }
    }      

    //Bomba com o boneco
    for (let i in bombas) {
        let prd = bombas[i];
        if(boneco.x > bomba.x+45 || boneco.x < bomba.x-25 || boneco.y > bomba.y+45 || boneco.y < bomba.y-25){
            colisao(boneco, prd);    
        }  
    }
    //Bomba com o inimigo
    for(let i2 in inimigos){
        let ini = inimigos[i2]
        for(let i in bombas) {
            let bmb = bombas[i]
            colisao(ini,bmb);
        }
    }
    //Bomba com Boss da fase 4
    for (let i in bombas) {
        let prd = bombas[i];
        colisao(bossRodrigo, prd);    
    }
    //Bomba com paredes destrutivas
    for(let i2 in bombas){
        let ini = bombas[i2]
        for(let i in paredesD) {
            let prd = paredesD[i]
            colisao(ini,prd);
        }
    }
    //Bomba com paredes 
    for(let i2 in bombas){
        let ini = bombas[i2]
        for(let i in paredes) {
            let prd = paredes[i]
            colisao(ini,prd);
        }
    }

     /////////////Colisões de diferentes(exemplo: para fazer o boneco perder vida se encostar no inimigo)/////////////

    detectarColisoes(inimigos,arrayExplosoes); //Chamando função que detecta colisão e apaga um inimigo caso encoste na explosão
    
    //Colisão para dar dano no boss
    for(let i3 in rodrigoBoss){
        let bos = rodrigoBoss[i3]
        for(let i in arrayExplosoes) {
            let expB = arrayExplosoes[i]
            colisao2(bos,expB); //chamando a função "colisao2", que diferente da outra função de colisão essa apenas identifica se houve colisão sem bloquer os objetos
            if(colidiu){ //caso a variável "colidiu" retorne true da função "colisao2"
                contadorodrigo +=1;
                colidiu = false; //Resetando o valor true da variável colidiu
                if(contadorodrigo == 130){
                    rodrigoBoss.splice(i3,1);
                }
            }
        } 
    }
    //Colisão para dar dano no boneco através das explosões
    for(let i in arrayExplosoes) {
        let prd = arrayExplosoes[i];
        colisao2(boneco, prd);
    }
    //Condição  para o contador de vida do personagem principal
    if(colidiu){
        if(tempo>500){ //Lógica para o boneco ficar um tempo imortal depois de tomar dano
            vidas --;    
            tempo = 0; 
        }
        colidiu = false;
    }
    if(rodrigoBoss.length > 0){
        colisao2(rodrigoBoss[0],boneco); //Colisão para o boss dar dano no boneco
        if(colidiu){
            if(tempo>500){
                vidas -=2;    
                tempo = 0;
            }
            colidiu = false;
        }
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
    tempo ++;//Variável tempo que fica incrementando enquanto a função "atualiza" é chamada dentro da função "loop"
    
    //Colisão para pegar os PowerUps de explosão
    for(let i in powerUpExplosao){
        let pwu = powerUpExplosao[i];
        colisao2(boneco,pwu);
        if(colidiu){
            tE ++;   //Variável que aumenta o Tamanho da Explosão 
            pwUR = undefined; //Resetando o valor aleatório que define qual power up aparece ou não
            colidiu = false; 
            powerUpExplosao.splice(i,1); //removendo especificamente o power up que colidiu com o boneco
            powerUpOnOff = false;
        }
    }
    //Colisão para pegar os PowerUps de bombas
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
    //Colisão para pegar os PowerUps de velocidade
    for(let i in powerUpVelocidade){
        let pwV = powerUpVelocidade[i];
        colisao2(boneco,pwV);
        if(colidiu){
            if(velocidade < 4.5){
                if(bloqueador){
                    contadorVel = velocidade + 0.5;
                    velocidade = velocidade + 0.5;
                }
            }   
            pwUR = undefined;
            colidiu = false;
            powerUpVelocidade.splice(i,1);
            powerUpOnOff = false;
        }
    }
    //Colisão para pegar os debuff de maçã
    for(let i in powerDebuffMacas){
        let pwD = powerDebuffMacas[i];
        colisao2(boneco,pwD);
        if(colidiu){
            var cont = 0;
            if(tempoD>500 && velocidade > 1|| cont < 3 && velocidade > 1){ //Lógica para diminuir a velocidade do boneco ao pegar o debuff
                velocidade --;
                tempoD = 0;
                cont ++;
                bloqueador = false;
            }   
            pwUR = undefined;
            colidiu = false;
            powerDebuffMacas.splice(i,1);
            powerUpOnOff = false;
        }
    }
    tempoD++;
    if(tempoD==500){
        bloqueador = true;
        velocidade = contadorVel;
    }
    //Colisão para pegar os PowerUps de vida
    for(let i in powerUpMacas){
        let pwM = powerUpMacas[i];
        colisao2(boneco,pwM);
        if(colidiu){
            vidas ++;    
            pwUR = undefined;
            colidiu = false;
            powerUpMacas.splice(i,1);
            powerUpOnOff = false;
        }
        
    }

    
    //MOVIMENTAÇÃO ALEATÓRIA DOS INIMIGOS

    tempoInimigo += 1;
    if(tempoInimigo === 60){
        tempoInimigo = 0; 
        numAleatorio =  Math.floor(Math.random() * 4);    //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio1 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio2 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio3 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio4 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio5 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio51 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio52 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio53 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio54 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio55 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio6 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio7 =  Math.floor(Math.random() * 4);   //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio10 =  Math.floor(Math.random() * 4);  //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio11 =  Math.floor(Math.random() * 4);  //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio12 =  Math.floor(Math.random() * 4);  //Número aléatorio de 0 a 3, definindo a direção do inimigo;
        numAleatorio13 =  Math.floor(Math.random() * 4);  //Número aléatorio de 0 a 3, definindo a direção do inimigo;
    }
    if(inimigos.length > 0){   
        //fase1 
        direcaoIni(inimigo,numAleatorio);
        direcaoIni(inimigo2,numAleatorio1);
        direcaoIni(inimigo3,numAleatorio2);
        direcaoIni(inimigo4,numAleatorio3);
        //fase 2
        if(fase === 2){
            direcaoIni(inimigo5,numAleatorio4);
            direcaoIni(inimigo6,numAleatorio5);
            direcaoIni(inimigo7,numAleatorio6);
            direcaoIni(inimigo8,numAleatorio7);
            direcaoIni(inimigo51,numAleatorio51);
            direcaoIni(inimigo52,numAleatorio52);
            direcaoIni(inimigo53,numAleatorio53);
            direcaoIni(inimigo54,numAleatorio54);
            direcaoIni(inimigo55,numAleatorio55);
        }

        //fase 3
        if(fase === 3){
            direcaoIni(inimigo11,numAleatorio12);
            direcaoIni(inimigo9,numAleatorio10);
            direcaoIni(inimigo10,numAleatorio11);
            direcaoIni(inimigo12,numAleatorio13);
        }    

         //fase 4
         if(fase === 4){

            direcaoIni(yeti,numAleatorio12);
            direcaoIni(yeti2,numAleatorio10);
            direcaoIni(yeti3,numAleatorio11);
            direcaoIni(yeti4,numAleatorio13);
        } 
    }

    if(inimigos.length === 0 && portas.length<1 && rodrigoBoss.length === 0){ //Condição para aparecer a porta
        porta = new Sprite(350,450,50,50,imagemPorta);
        portas.push(porta);
    } if(inimigos.length > 0){
        portas = [];
    }

    //Movimentação do Boss da 4 fase
    tempoBoss += 1;
    if(tempoBoss === 60){
        tempoBoss = 0; 
        BossX =  Math.floor(Math.random() * 4);  //Número aléatorio de 0 a 3, definindo a direção do inimigo;
    }
    if(rodrigoBoss.length >= 0 && fase === 4){    
        direcaoIni(bossRodrigo,BossX);
    }

    

    mostrarVida.textContent = (vidas);    //Mostrar vida do personagem principal
    mostrarBombas.textContent = (numeroDeBombas); //Mostrar as bombas do personagem principal
}

function bombaChutar(){
    //estruturas condicionais que controla as variaveis booleanas que ativam o deslizar da bomba
    if((bomba.x > boneco.x + 25) && (chute === true) && (deslizarCima === false) && (deslizarBaixo === false) && (deslizarEsquerda === false)){
        deslizarCima = false;
        deslizarBaixo = false;
        deslizarEsquerda = false;
        deslizarDireita = true;
    }else if((bomba.x < boneco.x - 25) && (chute === true) && (deslizarDireita === false) && (deslizarBaixo === false) && (deslizarCima === false)){
        deslizarCima = false;
        deslizarBaixo = false;
        deslizarEsquerda = true;
        deslizarDireita = false;
    }else if((bomba.y > boneco.y + 25) && (chute === true) && (deslizarBaixo === false) && (deslizarDireita === false) && (deslizarEsquerda === false)){
        deslizarCima = true;
        deslizarBaixo = false;
        deslizarEsquerda = false;
        deslizarDireita = false;
    }else if((bomba.y < boneco.y - 25) && (chute === true) && (deslizarCima === false) && (deslizarDireita === false) && (deslizarEsquerda === false)){
        deslizarCima = false;
        deslizarBaixo = true;
        deslizarEsquerda = false;
        deslizarDireita = false;
    }
    //estruturas condicionais que fazem a bomba deslizar se ativadas
    if((deslizarDireita === true) && (bomba.x < 650)){
        bomba.x += velocidade;
    }else if((deslizarEsquerda === true) && (bomba.x > 50)){
        bomba.x -= velocidade;
    }else if((deslizarCima === true) && (bomba.y < 650)){
        bomba.y += velocidade;
    }else if((deslizarBaixo === true) && (bomba.y > 50)){
        bomba.y -= velocidade;
    }
}


//SOBRE O MODAL
// //função do modal
// function apagaModal() {
//     contaClick += 1;

//     if(contaClick === 1){ // se clicar uma vez, troca a mensagem
//         mensagem = "Pressione 'espaço' para soltar as bombas, mate todos os inimigos para poder passar de fase, Boa sorte! OINK OINK";
//         document.getElementById("mensagem_porco").innerHTML = mensagem;
//     }
//     if(contaClick === 2){
//         document.querySelector(".modal").style.display = "none" ;
//         mensagem = "Oink oink, parabéns, você chegou a segunda fase e está beem quente, vamos acabar com essas múmias e passar";
//         document.getElementById("mensagem_porco").innerHTML = mensagem;   
//     }

//     if(contaClick === 3){
//         abreModal();
//        mensagem = "Vamos correr para poder sair logo desse deserto";
//         document.getElementById("mensagem_porco").innerHTML = mensagem; 
//     }
//     if(contaClick === 4){
//         document.querySelector(".modal");
//         modal1.style.display = 'none';
//      }
//     if(contaClick === 5){

//     alteraImagem("imagem/rodrigoMonstro.png") // puxou a função com o parâmetro imagem e jogou a imagem achada no link
// }

// }

// function abreModal(){
//     document.querySelector(".modal").style.display = "block"
// }
// //funçao de alterar a imagem do modal

// function alteraImagem (img) { //caminho da imagem 
// document.querySelector("#modal_2").src = img

// }


function desenha() { //Função para desenhar tudo na tela

    //condições para escolher a imagem de fundo de cada fase
    if(fase === 1){
        document.getElementById("jogo").style.backgroundImage = "url('https://i.imgur.com/N0Y3SFj.jpg')";   
    }
    if(fase === 2){
        document.getElementById("jogo").style.backgroundImage = "url('https://w7.pngwing.com/pngs/644/969/png-transparent-texture-mapping-opengameart-org-gimp-tile-paper-sand-texture-brown-isometric-graphics-in-video-games-and-pixel-art.png')";   
    }
    if(fase === 3){
        document.getElementById("jogo").style.backgroundImage = "url('img/pngcha03.png')";   
    }
    if(fase === 4){
        document.getElementById("jogo").style.backgroundImage = "url('https://media.istockphoto.com/photos/texture-of-blue-paper-picture-id945663596?k=20&m=945663596&s=612x612&w=0&h=f6Zhyxp4rZAYn98qoPYnglSai6BefKLSKtgO576wQFo=')";   
    }
    
    if(fase !== 5){
        document.querySelector('.marquee').stop();
    }
    var x;
    var y;
    ctx.clearRect(0,0,tela.width,tela.height); //Limpando a tela.

    //Desenha os inimigos
    for(var i in inimigos){
        var spr = inimigos[i];
        ctx.drawImage(
            spr.imagem,
            spr.imgX,spr.imgY,spr.largura,spr.altura,
            spr.x,spr.y,spr.largura,spr.altura
            ) ;
    }
    //Desenha o boss
    for(var i in rodrigoBoss){
        var boss4 = rodrigoBoss[i];
        ctx.drawImage(
            boss4.imagem,
            boss4.imgX,boss4.imgY,boss4.largura,boss4.altura,
            boss4.x,boss4.y,boss4.largura,boss4.altura
            ) ;
    }
    
    //Lógica para fazer o boneco piscar na tela enquanto está imortal
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
                        //essas variaveis resetam a movimentação da bomba caso elas não estivessem aqui
            //a bomba sempre iria "nascer" deslizando
            deslizarDireita = false;
            deslizarEsquerda = false;
            deslizarCima = false;
            deslizarBaixo = false;
            chute = false
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

    for(var i in powerUpVelocidade){
        var puv = powerUpVelocidade[i];
        ctx.drawImage(puv.imagem,puv.x,puv.y,puv.largura,puv.altura);
    }

    for(var i in powerUpMacas){
        var pum = powerUpMacas[i];
        ctx.drawImage(pum.imagem,pum.x,pum.y,pum.largura,pum.altura);
    }

    for(var i in powerDebuffMacas){
        var pdm = powerDebuffMacas[i];
        ctx.drawImage(pdm.imagem,pdm.x,pdm.y,pdm.largura,pdm.altura);
    }

    //Desenhando a porta
    if(portas.length === 1){
        ctx.drawImage(portas[0].imagem,portas[0].x,portas[0].y,portas[0].largura,portas[0].altura);
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

//Colisão entre 2 objetos
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
                pwUR = Math.floor(Math.random()*50);
                if(pwUR == 5 || pwUR == 35){
                    powerUpOnOff = true;
                    var powerUpE = new Sprite(paredesD[i2].x,paredesD[i2].y,30,30,pueImagem);
                    powerUpExplosao.push(powerUpE);
                }
                if(pwUR == 11 || pwUR == 27){
                    powerUpOnOff = true;
                    var novoPUBomba = new PlusBomba(paredesD[i2].x,paredesD[i2].y,30,30,imagemPUpB);
                    powerUpBombas.push(novoPUBomba);
                }
                if(pwUR == 17 && fase >=2 || pwUR == 33 && fase >=2){
                    powerUpOnOff = true;
                    var powerUpVel = new Sprite(paredesD[i2].x,paredesD[i2].y,30,30,imagemPUVel);
                    powerUpVelocidade.push(powerUpVel);
                }
                if(pwUR == 14 && fase >= 3){
                    powerUpOnOff = true;
                    var powerMacas = new Sprite(paredesD[i2].x,paredesD[i2].y,30,30,imagemPUMaca);
                    powerUpMacas.push(powerMacas);                        
                }
                if(pwUR == 45 && fase >= 3){
                    powerUpOnOff = true;
                    var debuffMaca = new Sprite(paredesD[i2].x,paredesD[i2].y,30,30,imagemDebuffMaca);
                    powerDebuffMacas.push(debuffMaca);
                }
                paredesD.splice(i2,1);
            }
            if(ob1 === inimigos){
                inimigos.splice(i2,1)
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
        case PP:
        pause = !pause;
        break;
        case UP:
        mvUp = true;
            //Caso o personagem clique para cima estando dentro da porta, é passado para a proxima fase.
            if(portas.length === 1){
                colisao2(boneco,porta);
            }
            
            if(colidiu && inimigos.length === 0 && rodrigoBoss.length === 0){
                colidiu = false;
                paredes = [];
                paredesD = [];    
                fase ++;
                rodou = false;
                boneco.x = 100;
                boneco.y = 100;
            }
            break;
            case RIGHT:
            mvRight = true;
            break;
            case DOWN:
            mvDown = true;
            break;
            case C:
            if(fase === 4){
                chute = true;
            }
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
                    setInterval(bombaChutar, 20);
                }
                /* Validação para verificar se a última bomba colocada tem a mesma localização da nova bomba.
                Só será colocada uma nova bomba se as coordenadas forem diferentes. Foi feito usando o array das bombas,
                pegando a última posição das bombas, comparando 3 vezes, na primeira para não ser colocada no mesmo lugar,
                na segunda para conseguir botar em linha(mesmo x) e em coluna(no mesmo y) e na última para colocar na diagonal.
                */
                if(((((bombas[bombas.length-1].x) === bomba.x) && ((bombas[bombas.length-1].y) != bomba.y)) || 
                    (((bombas[bombas.length-1].y) === bomba.y) && ((bombas[bombas.length-1].x) != bomba.x))) || 
                    ((bombas[bombas.length-1].y) != bomba.y) && ((bombas[bombas.length-1].x) != bomba.x)){  
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
        [1,0,0,8,0,8,0,8,0,8,0,8,0,0,1],
        [1,0,7,8,7,8,7,8,7,8,7,8,7,0,1],
        [1,8,8,8,8,8,8,8,8,8,8,8,8,8,1],
        [1,0,7,8,7,8,0,0,0,8,7,8,7,0,1],
        [1,8,8,8,8,8,8,8,8,8,8,8,8,8,1],
        [1,0,7,8,0,8,7,8,7,8,0,8,7,0,1],
        [1,8,8,8,0,8,8,8,8,8,0,8,8,8,1],
        [1,0,7,8,0,8,7,8,7,8,0,8,7,0,1],
        [1,8,8,8,8,8,8,8,8,8,8,8,8,8,1],
        [1,0,7,8,7,8,0,0,0,8,7,8,7,0,1],
        [1,8,8,8,8,8,8,8,8,8,8,8,8,8,1],
        [1,0,7,8,7,8,7,8,7,8,7,8,7,0,1],
        [1,0,0,8,0,8,0,8,0,8,0,8,0,0,1],
        [3,2,2,2,2,2,2,2,2,2,2,2,2,2,6]         
        ]
    }
    
    //Fase 2: Deserto
    if(fase === 2){
       mapa = [ 
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
       [1,1,1,8,0,8,8,8,8,8,8,8,1,1,1],
       [1,1,0,8,0,8,0,8,0,0,0,0,1,1,1],
       [1,8,0,8,0,8,0,0,0,0,0,0,0,0,1],
       [1,8,0,0,8,8,0,8,0,0,0,0,0,0,1],
       [1,8,8,8,8,8,0,0,0,0,0,0,0,0,1],
       [1,0,0,0,0,0,0,8,0,0,0,0,0,0,1],
       [1,1,1,8,1,1,1,1,1,1,1,8,1,1,1],
       [1,1,1,8,1,1,1,1,1,1,1,0,1,1,1],
       [1,8,8,0,8,8,8,0,8,8,8,0,0,0,1],
       [1,8,8,8,8,8,0,8,8,0,0,0,0,0,1],
       [1,0,8,8,0,0,0,0,0,0,0,0,0,0,1],
       [1,1,1,8,0,0,0,8,0,0,8,0,1,1,1],
       [1,1,1,8,0,0,0,0,0,0,0,0,1,1,1],
       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]         
       ]
       inimigofases++;


       if(inimigofases === 1){
        inimigos.push(inimigo5,inimigo6,inimigo7,inimigo8,inimigo51,inimigo52,inimigo53,inimigo54,inimigo55);
        
    }
}  
if(fase === 3){
    mapa = [ 
    [4,2,2,2,2,2,2,2,2,2,2,2,2,2,5],
    [1,0,0,0,3,0,8,3,8,8,8,0,3,0,1],
    [1,0,3,8,0,0,0,3,3,8,3,3,0,0,1],
    [1,8,3,8,3,8,3,3,0,8,0,8,8,3,1],
    [1,0,0,3,8,8,3,8,3,0,0,0,3,0,1],
    [1,8,8,3,8,8,3,3,3,0,0,8,0,8,1],
    [1,3,8,0,3,0,3,8,8,8,3,8,8,0,1],
    [1,0,0,3,0,8,8,8,3,3,3,3,0,0,1],
    [1,0,0,8,3,0,0,3,8,0,3,8,8,0,1],
    [1,8,8,0,8,8,8,0,8,8,8,0,0,0,1],
    [1,8,8,0,8,8,0,8,8,0,0,8,3,3,1],
    [1,3,3,8,0,8,3,0,0,8,3,8,8,8,1],
    [1,0,0,3,0,0,3,8,0,0,8,8,0,0,1],
    [1,0,8,8,0,3,0,8,0,8,8,0,0,0,1],
    [7,2,2,2,2,2,2,2,2,2,2,2,2,2,6]        

    ]
    inimigosFases3++;


    if(inimigosFases3 === 1){

        inimigos.push(inimigo9,inimigo10,inimigo11,inimigo12);
    }
}

if(fase === 4){
    mapa = [ 
    [10,10,10,9,9,9,9,9,9,9,9,9,10,10,10],
    [10,10,9,13,0,0,0,13,13,0,13,13,10,10,10],
    [10,9,0,0,0,13,0,0,0,0,0,0,9,9,10],
    [10,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
    [10,0,12,0,0,0,0,0,0,0,0,13,0,0,10],
    [10,13,0,0,0,0,0,0,0,0,0,0,0,0,10],
    [10,0,0,0,0,0,12,12,12,0,0,0,13,0,10],
    [10,13,0,0,0,12,11,11,11,12,0,13,0,0,10],
    [10,13,13,0,0,13,11,11,0,0,0,0,13,0,10],
    [10,0,13,0,0,0,13,0,0,0,0,0,0,0,10],
    [10,0,0,0,0,0,0,0,0,0,0,13,0,0,10],
    [10,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
    [10,10,10,0,0,0,0,0,0,12,0,0,10,10,10],
    [10,10,10,13,13,10,10,10,0,0,13,0,10,10,10],
    [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]         
    ]

    inimigosFases4++;


    if(inimigosFases4 === 1){
        inimigos.push(yeti, yeti2, yeti3, yeti4);
        rodrigoBoss.push(bossRodrigo);
    }
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
                if(bloco === 1 && fase === 3){
                    x = colunas*50;
                    y = linhas*50;
                    var parede1 = new Sprite(x,y,50,50,torreV);
                    paredes.push(parede1);
                }
                if(bloco === 2 && fase === 1){
                    x = colunas*50;
                    y = linhas*50;
                    var parede2 = new Sprite(x,y,50,50,imagemCercaCB);
                    paredes.push(parede2);
                }
                if(bloco === 2 && fase === 3){
                    x = colunas*50;
                    y = linhas*50;
                    var parede2 = new Sprite(x,y,50,50,torreH);
                    paredes.push(parede2);
                }    
                if(bloco === 3 && fase === 1){
                    x = colunas*50;
                    y = linhas*50;
                    var parede3 = new Sprite(x,y,50,50,imagemCercaCanto1);
                    paredes.push(parede3);
                }
                if(bloco === 3 && fase === 3){
                    x = colunas*50;
                    y = linhas*50;
                    var parede3 = new Sprite(x,y,50,50,pedra);
                    paredes.push(parede3);
                }
                if(bloco === 4 && fase === 1){
                    x = colunas*50;
                    y = linhas*50;
                    var parede4 = new Sprite(x,y,50,50,imagemCercaCanto2);
                    paredes.push(parede4);
                }
                if(bloco === 4 && fase === 3){
                    x = colunas*50;
                    y = linhas*50;
                    var parede4 = new Sprite(x,y,50,50,pontaEsCima);
                    paredes.push(parede4);
                }    
                if(bloco === 5 && fase === 1){
                    x = colunas*50;
                    y = linhas*50;
                    var parede5 = new Sprite(x,y,50,50,imagemCercaCanto3);
                    paredes.push(parede5);
                }
                if(bloco === 5 && fase === 3){
                    x = colunas*50;
                    y = linhas*50;
                    var parede5 = new Sprite(x,y,50,50,pontaDiCima);
                    paredes.push(parede5);
                }
                if(bloco === 6 && fase === 1){
                    x = colunas*50;
                    y = linhas*50;
                    var parede6 = new Sprite(x,y,50,50,imagemCercaCanto4);
                    paredes.push(parede6);
                }
                if(bloco === 6 && fase === 3){
                    x = colunas*50;
                    y = linhas*50;
                    var parede6 = new Sprite(x,y,50,50,pontaDiBaixo);
                    paredes.push(parede6);
                }
                if(bloco === 7 && fase === 1){
                    x = colunas*50
                    y = linhas*50
                    var parede7 = new Sprite(x, y, 50, 50, imagemPedra)
                    paredes.push(parede7);
                }
                if(bloco === 7 && fase === 3){
                    x = colunas*50
                    y = linhas*50
                    var parede7 = new Sprite(x, y, 50, 50, pontaEsBaixo)
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
                if(bloco === 8 && fase === 3){
                    x = colunas*50
                    y = linhas*50
                    var parede8 = new Sprite(x, y, 50, 50, vidro)
                    paredesD.push(parede8);
                }
               //Paredes Fase 4 - Gelo
               if(bloco === 9 && fase === 4){
                x = colunas*50
                y = linhas*50
                var parede9 = new Sprite(x, y, 50, 50, imagemGelo)
                paredes.push(parede9);     
            }
            if(bloco === 10 && fase === 4){
                x = colunas*50
                y = linhas*50
                var parede10 = new Sprite(x, y, 50, 50, imagemGelo2)
                paredes.push(parede10);
            }
            if(bloco === 11 && fase === 4){
                x = colunas*50
                y = linhas*50
                var parede11 = new Sprite(x, y, 50, 50, imagemLago)
                paredes.push(parede11);
            }
            if(bloco === 12 && fase === 4){
                x = colunas*50
                y = linhas*50
                var parede12 = new Sprite(x, y, 50, 50, imagemLago2)
                paredes.push(parede12);
            }
              //Paredes Fase 4 - Quebraveis
              if(bloco === 13 && fase === 4){
                x = colunas*50
                y = linhas*50
                var parede13 = new Sprite(x, y, 50, 50, imagemQuebrag)
                paredesD.push(parede13);     
            }

        } 
            rodou = true;     //Para não ficar recriando sem parar, só recriando quando for false. 
        } 
    }
}    



var tela = document.querySelector("canvas");
var ctx = tela.getContext("2d");

//teclas
var LEFT=37, UP=38, RIGHT=39, DOWN=40, SPACE=32, PP = 80,C = 67;

//movimento
var mvLeft = mvUp = mvRight = mvDown = bomb = false;
var velocidade = 1;
var contadorVel;
var bloqueador = true;
var numAleatorio;
var numAleatorio1;
var numAleatorio2;
var numAleatorio3;
var numAleatorio4;
var numAleatorio5;
var numAleatorio51;
var numAleatorio52;
var numAleatorio53;
var numAleatorio54;
var numAleatorio55;
var numAleatorio6;
var numAleatorio7;
var numAleatorio10; 
var numAleatorio11; 
var numAleatorio12; 
var numAleatorio13;
var pwUR;
var x;
var y;
var inimigosFases3 = 0;
var inimigosFases4 = 0;
var BossX;

var deslizarDireita = false;   //Variavel que controla o deslizar da bomba quando chutada(fase 4)
var deslizarEsquerda = false;  //Variavel que controla o deslizar da bomba quando chutada(fase 4)
var deslizarCima = false;      //Variavel que controla o deslizar da bomba quando chutada(fase 4)
var deslizarBaixo = false;     //Variavel que controla o deslizar da bomba quando chutada(fase 4)
var chute = false;             //Variavel que controla a ação de chutar a bomba
var pause = false;
var fogoColidiuD = false;
var fogoColidiuB = false;
var fogoColidiuE = false;
var fogoColidiuC = false;
var rodou = false;              //Variavel para sempre desenhar as paredes quando for chamada
var podeMorrer = true;          //Quando atingido, o personagem fica piscando, ficando tambem imortal
var tempo = 1000;               //Tempo do personagem, quando ele é atingido, ele recebe valo inferior a 1000
var tempoE = 1000;              //Tempo da explosão da bomba
var tempoD = 1000;
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
var vidas = 5;                  //Quantidade de vidas inciais
var mostrarBombas = document.getElementById("bombas"); 
var porta;
var inimigofases = 0;
var tempoBoss = 0;
var contadorodrigo = 0;

//PARA O MODAL
// var contaClick = 0;
// var mensagem = 'OINK OINK, Bem vindo jogador, agora começa a nossa aventura juntos'; 
//     document.getElementById("mensagem_porco").innerHTML = mensagem;



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

//imagens mapa 3
var torreH = new Image ();
torreH.src = "imgFase3/torreh.png";

var torreV = new Image ();
torreV.src = "imgFase3/torrev.png";

var pontaEsCima = new Image ();
pontaEsCima.src = "imgFase3/pontaesquerdacima.png";

var pontaDiCima = new Image ();
pontaDiCima.src = "imgFase3/pontadireitacima.png";

var pontaDiBaixo = new Image ();
pontaDiBaixo.src = "imgFase3/pontadireitabaixo.png";

var pontaEsBaixo = new Image ();
pontaEsBaixo.src = "imgFase3/pontaesquerdabaixo.png";

var vidro = new Image ();
vidro.src = "imgFase3/barril.png";

var pedra = new Image ();
pedra.src = "imgFase3/espedra.png";

//imagens fase 4
var imagemGelo = new Image();
imagemGelo.src = "https://imgur.com/cIIPEIw.png";

var imagemGelo2 = new Image();
imagemGelo2.src = "https://imgur.com/LQ6Ob6s.png";

var imagemLago = new Image();
imagemLago.src = "https://imgur.com/obS6ftg.png";

var imagemLago2 = new Image();
imagemLago2.src = "https://imgur.com/Gyh7MAJ.png";

var imagemQuebrag = new Image();
imagemQuebrag.src = "https://imgur.com/VgLdIqj.png";


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

var imagemPUVel = new Image();
imagemPUVel.src = "img/imagemPUVel.png"

var imagemPUMaca = new Image();
imagemPUMaca.src = "img/pngmaca.png";

var imagemDebuffMaca = new Image();
imagemDebuffMaca.src = "img/pngmacaruim.png";

//imagem do inimigo fase 1(lobo)
var imagemInimigo = new Image();
imagemInimigo.src ="spriteporco/lobinhosheet.png";

//imagem do inimigo fase 3(guerreiro azul)
var imagemguerreiroA = new Image();
imagemguerreiroA.src ="spriteporco/guerreirosheet.png";

//imagem do inimigo fase 3(guerreiro vermelho)
var imagemguerreiroV = new Image();
imagemguerreiroV.src ="spriteporco/guerreiro2sheet.png";

//imagem do inimigo fase 2(mumia)
var imagemInimigoM = new Image();
imagemInimigoM.src ="spriteporco/mumiasheet.png";


//imagem da porta, para passar de fase
var imagemPorta = new Image();
imagemPorta.src ="img/porta.png";

//imagem do inimigo fase 4(yeti)
var imagemYeti = new Image();
imagemYeti.src ="https://imgur.com/HZvcZT4.png";

//Imagem Boss Rodrigo
var imagemBossRodrigo = new Image();
imagemBossRodrigo.src = "https://imgur.com/hxs2pTE.png"



//Arrays
var powerUpExplosao = [];   //qunatidade da explosão após o powerUp
var powerUpBombas = [];
var powerUpVelocidade = [];
var powerUpMacas = [];
var powerDebuffMacas = [];

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
var portas = [];
var rodrigoBoss =[];        //para Boss


//Declarando objetos.
var boneco = new Sprite(100,100,30,30,imagemBoneco);
sprites.push(boneco);

//variavel do powerUp, tendo a posição inicial dela

//variavel do inimigo, tendo a posição inicial dela
var inimigo = new Sprite(200,400,30,30,imagemInimigo);
var inimigo2 = new Sprite(400,250,30,30,imagemInimigo);
var inimigo3 = new Sprite(400,550,30,30,imagemInimigo);
var inimigo4 = new Sprite(500,400,30,30,imagemInimigo);
inimigos.push(inimigo,inimigo2,inimigo3,inimigo4);

//Inimigos fase 2
var inimigo5 = new Sprite(400,250,30,30,imagemInimigoM);
var inimigo51 = new Sprite(450,250,30,30,imagemInimigoM);
var inimigo52 = new Sprite(500,300,30,30,imagemInimigoM);
var inimigo53 = new Sprite(550,150,30,30,imagemInimigoM);
var inimigo54 = new Sprite(500,150,30,30,imagemInimigoM);
var inimigo55 = new Sprite(550,100,30,30,imagemInimigoM);
var inimigo6 = new Sprite(200,150,30,30,imagemInimigoM);
var inimigo7 = new Sprite(400,550,30,30,imagemInimigoM);
var inimigo8 = new Sprite(600,600,30,30,imagemInimigoM);


//inimigos fase 3
var inimigo9 = new Sprite(200,200,30,30,imagemguerreiroA);
var inimigo10 = new Sprite(600,100,30,30,imagemguerreiroV);
var inimigo11 = new Sprite(100,600,30,30,imagemguerreiroA);
var inimigo12 = new Sprite(600,600,30,30,imagemguerreiroV);

//inigmigos fase 4
var yeti = new Sprite(350,100,30,30,imagemYeti);
var yeti2 = new Sprite(500,500,30,30,imagemYeti);
var yeti3 = new Sprite(150,150,30,30,imagemYeti);
var yeti4 = new Sprite(510,400,30,30,imagemYeti);
var bossRodrigo = new Sprite(630,130,30,30,imagemBossRodrigo);


loop(); //Chamando a função loop pela primeira vez para que ela se repita sozinha logo em seguida. 