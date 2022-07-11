
class Sprite {
    constructor(x, y, largura, altura, imagem) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.imagem = imagem;
    }

    desenhar(ctx) {
        if (this.imagem) {
            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
        } else {
            ctx.strokeRect(this.x, this.y, this.largura, this.altura);
        }
    }
}            

function boneco(){  

    let imagemBoneco = new Image();
    imagemBoneco.src ="https://art.pixilart.com/c5e4d357e30cf9d.png";
    ctx.drawImage(imagemBoneco,x,y,50,50);

    //ctx.rect(x,y,50,50);
    //ctx.stroke();

    for (let parede of paredes) {
        parede.desenhar(ctx);
    }
}

function campo() {  
    ctx.fillRect(0, 0, 750, 750);
    ctx.fillStyle = "white";
    
}


function atualizaTela() { 
    campo();
    boneco();
    //criaParede();
    //check()
}
function leDoTeclado(evento) { 
    
    if(evento.keyCode == 38) {
        y -= 10;
    } else if (evento.keyCode == 40) {
        y += 10
    } else if (evento.keyCode == 37) {
        x -= 10;
    } else if (evento.keyCode == 39) {
        x += 10;
    }
}

/*function check(){ 
    var rect1 = {x: x, y: y, width: 30, height: 30}
    var rect2 = {x: posicaoP, y: posicaoP, width: 50, height: 50}
    
    if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y) {

        colidiu = true;
    } else {
        colidiu = false;
    }
}

function criaParede(){
    parede.src = "https://imgur.com/EkleLlt.png";
    ctx.drawImage(parede, posicaoP,posicaoP, tP, tP);
}*/
var imagemParede = new Image();
imagemParede.src = "https://imgur.com/EkleLlt.png";

var paredes = [];
//for left
for(let i = 0; i<750; i= i+50){
    paredes.push(new Sprite(0,i,50,50,imagemParede));
}
//for top
for(let i = 0; i<750; i= i+50){
    paredes.push(new Sprite(i,0,50,50,imagemParede));
}
//for right
for(let i = 0; i<750; i= i+50){
    paredes.push(new Sprite(700,i,50,50,imagemParede));
}
//for bottom
for(let i = 0; i<750; i= i+50){
    paredes.push(new Sprite(i,700,50,50,imagemParede));
}






var colidiu = false;
var posicaoP = 300;
var tela = document.querySelector("canvas"); 
var ctx = tela.getContext("2d"); 
var x = 237.5; 
var y = 287.5;  
var intervalo = setInterval(atualizaTela, 120); 
document.onkeydown = leDoTeclado; 