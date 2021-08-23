function processarJogo() {
    //Criar elementos na tela
    $(".inicio").hide()
    $(".fundo-jogo").append("<div class='jogador animacao-jogador'</div>")
    $(".fundo-jogo").append("<div class='amigo animacao-amigo'</div>")
    $(".fundo-jogo").append("<div class='inimigo1 animacao-inimigo1'</div>")
    $(".fundo-jogo").append("<div class='inimigo2'</div>")

    //Game looping
    const jogo = {}
    jogo.temporizador = setInterval(executarLooping, 30)

    function executarLooping() {
        moverFundo()
        moverJogador()
        moverInimigo1()
        moverInimigo2()
        moverAmigo()
        detectarColisoes()
    }

    function moverFundo() {
        const esquerda = parseInt($(".fundo-jogo").css("background-position"))
        $(".fundo-jogo").css("background-position", esquerda - 1)
    }

    //Movimentação do jogador:
    const pressionarTecla = []
    const tecla = {
        W: 87,
        S: 83,
        ESPACO: 32
    }

    $(document).keydown(function (e) {
        pressionarTecla[e.which] = true
    })

    $(document).keyup(function (e) {
        pressionarTecla[e.which] = false
    })

    function moverJogador() {
        if (pressionarTecla[tecla.W]) {
            let topo = parseInt($('.jogador').css("top"))
            $(".jogador").css("top", topo - 10)

            if (topo <= 0) {
                $(".jogador").css("top", topo + 10)
            }
        }

        if (pressionarTecla[tecla.S]) {
            let topo = parseInt($('.jogador').css("top"))
            $(".jogador").css("top", topo + 10)

            if (topo >= 434) {
                $(".jogador").css("top", topo - 10)
            }
        }

        if (pressionarTecla[tecla.ESPACO]) {
            criarProjetil()
        }
    }

    //Movimentação dos inimigos
    let posicaoY = parseInt(Math.random() * 334)
    function moverInimigo1() {
        let posicaoX = parseInt($('.inimigo1').css('left'))
        $(".inimigo1").css('left', posicaoX - 7)
        $(".inimigo1").css('top', posicaoY)

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334)
            $(".inimigo1").css('left', 694)
            $(".inimigo1").css('top', posicaoY)
        }
    }

    function moverInimigo2() {
        let posicaoX = parseInt($('.inimigo2').css('left'))
        $(".inimigo2").css('left', posicaoX - 3)

        if (posicaoX <= 0) {
            $(".inimigo2").css('left', 775)
        }
    }

    //movimentação do amigo
    function moverAmigo() {
        let posicaoX = parseInt($('.amigo').css('left'))
        $(".amigo").css('left', posicaoX + 1)

        if (posicaoX > 906) {
            $('.amigo').css('left', 0)
        }
    }

    //disparo do projétil
    let podeAtirar = true
    function criarProjetil() {
        if (podeAtirar === true) {
            podeAtirar = false

            let topo = parseInt($('.jogador').css('top'))
            let posicaoX = parseInt($('.jogador').css('left'))
            let tiroX = posicaoX + 190
            let topoTiro = topo + 43
            $('.fundo-jogo').append("<div class='projetil'></div>")
            $('.projetil').css('top', topoTiro)
            $('.projetil').css('left', tiroX)

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
    } //function criarProjetil

    //Colisões
    function detectarColisoes() {
        let colisaoJogadorInimigo1 = ($(".jogador").collision($(".inimigo1")))

        if (colisaoJogadorInimigo1.length > 0) {
            let inimigo1X = parseInt($('.inimigo1').css('left'))
            let inimigo1Y = parseInt($('.inimigo1').css('top'))
            explosaoJogadorInimigo1(inimigo1X, inimigo1Y)

            posicaoY = parseInt(Math.random() * 334)
            $('.inimigo1').css('left', 694)
            $('.inimigo1').css('top', posicaoY)
        }
    }

    function explosaoJogadorInimigo1(inimigo1X, inimigo1Y) {
        $('.fundo-jogo').append("<div class='explosao-jogador-inimigo1'></div>")
        
        $('.explosao-jogador-inimigo1').css('top', inimigo1Y)
        $('.explosao-jogador-inimigo1').css('left', inimigo1X)
        $('.explosao-jogador-inimigo1').animate({width:200, opacity:0}, "slow")  

        let tempoExplosao = window.setInterval(removerExplosao, 1000)

        function removerExplosao() {
            $('.explosao-jogador-inimigo1').remove()
            window.clearInterval(tempoExplosao)
        }
    }
} //function iniciarJogo()