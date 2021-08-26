const jogo = {}
function processarJogo() {
    criarElementosNaTela()
    tocarMusica()
    jogo.temporizador = setInterval(executarLooping, 30)
}

//=================
//Criar elementos na tela
//=================
function criarElementosNaTela() {
    $(".inicio").hide()
    $(".fundo-jogo").append("<div class='jogador animacao-jogador'</div>")
    $(".fundo-jogo").append("<div class='aliado animacao-aliado'</div>")
    $(".fundo-jogo").append("<div class='helicoptero-inimigo animacao-helicoptero-inimigo'</div>")
    $(".fundo-jogo").append("<div class='caminhao'</div>")
    $(".fundo-jogo").append("<div class='placar'</div>")
    $(".fundo-jogo").append("<div class='energia'</div>")
}

//=================
//Sons do Jogo
//=================
const musicaJogo = document.querySelector('.som-musica-fundo')
const somDisparo = document.querySelector('.som-disparo')
const somExplosao = document.querySelector('.som-explosao')
const somGameover = document.querySelector('.som-gameover')
const somAliadoPerdido = document.querySelector('.som-aliado-perdido')
const somAliadoResgatado = document.querySelector('.som-aliado-resgatado')

function tocarMusica() {
    musicaJogo.addEventListener('ended', () => {
        musicaJogo.currentTime = 0
        musicaJogo.play()
    }, false)

    musicaJogo.play()
}

//=================
//Game looping
//=================
function executarLooping() {
    moverFundo()
    moverHelicopteroInimigo()
    moverCaminhao()
    moverJogador()
    moverAliado()
    detectarColisoes()
    mostrarPlacar()
    atualizarEnergia()
}

//=================
//Movimentações:
//=================
function moverFundo() {
    const posicaoFundo = parseInt($(".fundo-jogo").css("background-position"))
    $(".fundo-jogo").css("background-position", posicaoFundo - 1)
}


const pressionarTecla = []
const tecla = {
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    ESPACO: 32
}

$(document).keydown(function (e) {
    pressionarTecla[e.which] = true
})

$(document).keyup(function (e) {
    pressionarTecla[e.which] = false
})

function moverJogador() {
    let topoJogador = parseInt($('.jogador').css("top"))
    let direitaJogador = parseInt($('.jogador').css("left"))

    if (pressionarTecla[tecla.W]) {
        $(".jogador").css("top", topoJogador - 10)

        if (topoJogador <= 0) {
            $(".jogador").css("top", topoJogador + 10)
        }
    }

    if (pressionarTecla[tecla.A]) {
        $(".jogador").css("left", direitaJogador - 10)

        if (direitaJogador <= 0) {
            $(".jogador").css("left", direitaJogador + 10)
        }
    }

    if (pressionarTecla[tecla.S]) {
        $(".jogador").css("top", topoJogador + 10)

        if (topoJogador >= 434) {
            $(".jogador").css("top", topoJogador - 10)
        }
    }

    if (pressionarTecla[tecla.D]) {
        $(".jogador").css("left", direitaJogador + 10)

        if (direitaJogador >= 680) {
            $(".jogador").css("left", direitaJogador - 10)
        }
    }

    if (pressionarTecla[tecla.ESPACO]) {
        criarProjetil()
    }
}

let posicaoY = parseInt(Math.random() * 334)
let velocidadeHelicopteroInimigo = 5
function moverHelicopteroInimigo() {
    let posicaoX = parseInt($('.helicoptero-inimigo').css('left'))
    $(".helicoptero-inimigo").css('left', posicaoX - velocidadeHelicopteroInimigo)
    $(".helicoptero-inimigo").css('top', posicaoY)

    if (posicaoX <= 0) {
        posicaoY = parseInt(Math.random() * 334)
        $(".helicoptero-inimigo").css('left', 694)
        $(".helicoptero-inimigo").css('top', posicaoY)
    }
}

let velocidadeCaminhao = 3
function moverCaminhao() {
    let posicaoX = parseInt($('.caminhao').css('left'))
    $(".caminhao").css('left', posicaoX - velocidadeCaminhao)

    if (posicaoX <= 0) {
        $(".caminhao").css('left', 775)
    }
}

function moverAliado() {
    let posicaoX = parseInt($('.aliado').css('left'))
    $(".aliado").css('left', posicaoX + 1)

    if (posicaoX > 906) {
        $('.aliado').css('left', 0)
    }
}

//=================
//disparo do projétil
//=================
let podeAtirar = true
function criarProjetil() {

    if (podeAtirar === true) {
        somDisparo.play()
        podeAtirar = false

        let jogadorX = parseInt($('.jogador').css('left'))
        let jogadorY = parseInt($('.jogador').css('top'))
        let disparoX = jogadorX + 190
        let disparoY = jogadorY + 43
        $('.fundo-jogo').append("<div class='projetil'></div>")
        $('.projetil').css('left', disparoX)
        $('.projetil').css('top', disparoY)

        var moverProjetil = window.setInterval(moverProjetil, 30)
    }

    function moverProjetil() {
        let posicaoX = parseInt($('.projetil').css('left'))
        $('.projetil').css('left', posicaoX + 15)

        if (posicaoX > 900) {
            window.clearInterval(moverProjetil)
            $('.projetil').remove()
            podeAtirar = true
        }
    }
}

//=================
//Colisões
//=================
function detectarColisoes() {
    let colisaoJogadorHelicopteroInimigo = ($(".jogador").collision($(".helicoptero-inimigo")))
    let colisaoJogadorCaminhao = ($(".jogador").collision($(".caminhao")))
    let colisaoProjetilHelicopteroInimigo = ($(".projetil").collision($(".helicoptero-inimigo")))
    let colisaoProjetilCaminhao = ($(".projetil").collision($(".caminhao")))
    let colisaoJogadorAliado = ($(".jogador").collision($(".aliado")))
    let colisaoAliadoCaminhao = ($(".aliado").collision($(".caminhao")))

    if (colisaoJogadorHelicopteroInimigo.length > 0) {
        somExplosao.play()
        energiaAtual--

        let helicopteroInimigoX = parseInt($('.helicoptero-inimigo').css('left'))
        let helicopteroInimigoY = parseInt($('.helicoptero-inimigo').css('top'))
        explodirHelicopteroInimigo(helicopteroInimigoX, helicopteroInimigoY)

        posicaoY = parseInt(Math.random() * 334)
        $('.helicoptero-inimigo').css('left', 694)
        $('.helicoptero-inimigo').css('top', posicaoY)
    }

    if (colisaoJogadorCaminhao.length > 0) {
        somExplosao.play()
        energiaAtual--

        let caminhaoX = parseInt($('.caminhao').css('left'))
        let caminhaoY = parseInt($('.caminhao').css('top'))
        explodirCaminhao(caminhaoX, caminhaoY)

        $('.caminhao').remove()

        reposicionarCaminhao()
    }

    if (colisaoProjetilHelicopteroInimigo.length > 0) {
        somExplosao.play()
        velocidadeHelicopteroInimigo += 0.3
        velocidadeCaminhao += 0.1
        pontuacao += 100

        let helicopteroInimigoX = parseInt($('.helicoptero-inimigo').css('left'))
        let helicopteroInimigoY = parseInt($('.helicoptero-inimigo').css('top'))
        explodirHelicopteroInimigo(helicopteroInimigoX, helicopteroInimigoY)
        $('.projetil').css('left', 950)

        posicaoY = parseInt(Math.random() * 334)
        $('.helicoptero-inimigo').css('left', 694)
        $('.helicoptero-inimigo').css('top', posicaoY)
    }

    if (colisaoProjetilCaminhao.length > 0) {
        somExplosao.play()
        velocidadeHelicopteroInimigo += 0.1
        velocidadeCaminhao += 0.5
        pontuacao += 50

        let caminhaoX = parseInt($('.caminhao').css('left'))
        let caminhaoY = parseInt($('.caminhao').css('top'))
        explodirCaminhao(caminhaoX, caminhaoY)
        $('.projetil').css('left', 950)
        $('.caminhao').remove()

        reposicionarCaminhao()
    }

    if (colisaoJogadorAliado.length > 0) {
        somAliadoResgatado.play()
        aliadosSalvos++

        reposicionarAliado()
        $('.aliado').remove()
    }

    if (colisaoAliadoCaminhao.length > 0) {
        somAliadoPerdido.play()
        aliadosPerdidos++

        let aliadoX = parseInt($('.aliado').css('left'))
        let aliadoY = parseInt($('.aliado').css('top'))
        explodirAliado(aliadoX, aliadoY)
        $('.aliado').remove()

        reposicionarAliado()
    }
}

//=================
//Explosões
//=================

function explodirHelicopteroInimigo(helicopteroInimigoX, helicopteroInimigoY) {
    $('.fundo-jogo').append("<div class='explosao-helicoptero-inimigo'></div>")
    $('.explosao-helicoptero-inimigo').css('top', helicopteroInimigoY)
    $('.explosao-helicoptero-inimigo').css('left', helicopteroInimigoX)
    $('.explosao-helicoptero-inimigo').animate({ width: 250, opacity: 0 }, "slow")

    let tempoExplosao = window.setInterval(removerExplosao, 1000)

    function removerExplosao() {
        $('.explosao-helicoptero-inimigo').remove()
        window.clearInterval(tempoExplosao)
    }
}

function explodirCaminhao(caminhaoX, caminhaoY) {
    $('.fundo-jogo').append("<div class='explosao-caminhao'></div>")
    $('.explosao-caminhao').css('top', caminhaoY)
    $('.explosao-caminhao').css('left', caminhaoX)
    $('.explosao-caminhao').animate({ width: 250, opacity: 0 }, "slow")

    let tempoExplosao = window.setInterval(removerExplosao, 1000)

    function removerExplosao() {
        $('.explosao-caminhao').remove()
        window.clearInterval(tempoExplosao)
    }
}

function reposicionarCaminhao() {
    let tempoColisaoCaminhao = window.setInterval(aparecerCaminhao, 5000)

    function aparecerCaminhao() {
        window.clearInterval(tempoColisaoCaminhao)

        if (fimDeJogo == false) {
            $('.fundo-jogo').append("<div class='caminhao'></div>")
        }
    }
}

function explodirAliado(aliadoX, aliadoY) {
    $('.fundo-jogo').append("<div class='explosao-aliado'</div>")
    $('.explosao-aliado').css('left', aliadoX)
    $('.explosao-aliado').css('top', aliadoY)

    let tempoExplosao = window.setInterval(removerExplosao, 1000)

    function removerExplosao() {
        $('.explosao-aliado').remove()
        window.clearInterval(tempoExplosao)
    }

}

function reposicionarAliado() {
    let tempoColisaoAliado = window.setInterval(aparecerAliado, 6000)

    function aparecerAliado() {
        window.clearInterval(tempoColisaoAliado)

        if (fimDeJogo == false) {
            $('.fundo-jogo').append("<div class='aliado animacao-aliado'></div>")
        }
    }
}

//=================
//Placar do jogo
//=================
let pontuacao = 0
let aliadosSalvos = 0
let aliadosPerdidos = 0

function mostrarPlacar() {
    $('.placar').html(`
    <h2>Pontuação: ${pontuacao} / Aliados Salvos: ${aliadosSalvos} / Aliados Perdidos: ${aliadosPerdidos}</h2>
    `)
}

//=================
//Energia do jogador
//=================
let energiaAtual = 3
function atualizarEnergia() {
    switch(energiaAtual) {
        case 3:
            document.querySelector('.energia').innerHTML = "<img src='imagens/energia3.png' alt='energia 3'>"
        break

        case 2:
            document.querySelector('.energia').innerHTML = "<img src='imagens/energia2.png' alt='energia 2'>"
        break

        case 1:
            document.querySelector('.energia').innerHTML = "<img src='imagens/energia1.png' alt='energia 1'>"
        break

        case 0:
            document.querySelector('.energia').innerHTML = "<img src='imagens/energia0.png' alt='energia 0'>"
            exibirFimDeJogo()
        break

    }
}

//=================
//Fim de jogo
//=================
let fimDeJogo = false

function exibirFimDeJogo() {
    fimDeJogo = true
    musicaJogo.pause()
    somGameover.play()

    window.clearInterval(jogo.temporizador)

    $('.jogador').remove()
    $('.helicoptero-inimigo').remove()
    $('.caminhao').remove()
    $('.aliado').remove()
    $('.placar').remove()
    $('.energia').remove()


    $('.fundo-jogo').append("<div class='fim'></div>")

    $('.fim').html(`
        <h1>Game Over</h1>
        <p>Sua pontuação foi: ${pontuacao}</p>
        <p>Aliados salvos: ${aliadosSalvos}</p>
        <p>Aliados perdidos: ${aliadosPerdidos}</p>
        <button onclick='reiniciarJogo()'>Jogar Novamente</button>
        `)
}

//=================
//Reiniciar Jogo
//=================
function reiniciarJogo() {
    somGameover.pause()
    $('.fim').remove()

    energiaAtual = 3
    velocidadeHelicopteroInimigo = 4
    velocidadeCaminhao = 3
    pontuacao = 0
    aliadosSalvos = 0
    aliadosPerdidos = 0
    fimDeJogo = false

    processarJogo()
}

