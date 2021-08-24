function processarJogo() {
    //=================
    //Criar elementos na tela
    //=================

    $(".inicio").hide()
    $(".fundo-jogo").append("<div class='jogador animacao-jogador'</div>")
    $(".fundo-jogo").append("<div class='aliado animacao-aliado'</div>")
    $(".fundo-jogo").append("<div class='helicoptero-inimigo animacao-helicoptero-inimigo'</div>")
    $(".fundo-jogo").append("<div class='caminhao'</div>")

    //=================
    //Game looping
    //=================
    const jogo = {}
    jogo.temporizador = setInterval(executarLooping, 30)

    function executarLooping() {
        moverFundo()
        moverJogador()
        moverHelicopteroInimigo()
        moverCaminhao()
        moverAliado()
        detectarColisoes()
    }

    function moverFundo() {
        const esquerda = parseInt($(".fundo-jogo").css("background-position"))
        $(".fundo-jogo").css("background-position", esquerda - 1)
    }

    //=================
    //Movimentação do jogador:
    //=================
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

    //=================
    //Movimentação dos inimigos
    //=================
    let posicaoY = parseInt(Math.random() * 334)
    function moverHelicopteroInimigo() {
        let posicaoX = parseInt($('.helicoptero-inimigo').css('left'))
        $(".helicoptero-inimigo").css('left', posicaoX - 7)
        $(".helicoptero-inimigo").css('top', posicaoY)

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334)
            $(".helicoptero-inimigo").css('left', 694)
            $(".helicoptero-inimigo").css('top', posicaoY)
        }
    }

    function moverCaminhao() {
        let posicaoX = parseInt($('.caminhao').css('left'))
        $(".caminhao").css('left', posicaoX - 3)

        if (posicaoX <= 0) {
            $(".caminhao").css('left', 775)
        }
    }

    //=================
    //movimentação do aliado
    //=================
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
            let helicopteroInimigoX = parseInt($('.helicoptero-inimigo').css('left'))
            let helicopteroInimigoY = parseInt($('.helicoptero-inimigo').css('top'))
            explosaoHelicopteroInimigo(helicopteroInimigoX, helicopteroInimigoY)

            posicaoY = parseInt(Math.random() * 334)
            $('.helicoptero-inimigo').css('left', 694)
            $('.helicoptero-inimigo').css('top', posicaoY)
        }

        if (colisaoJogadorCaminhao.length > 0) {
            let caminhaoX = parseInt($('.caminhao').css('left'))
            let caminhaoY = parseInt($('.caminhao').css('top'))
            explosaoCaminhao(caminhaoX, caminhaoY)

            $('.caminhao').remove()

            reposicionarCaminhao()
        }

        if (colisaoProjetilHelicopteroInimigo.length > 0) {
            let helicopteroInimigoX = parseInt($('.helicoptero-inimigo').css('left'))
            let helicopteroInimigoY = parseInt($('.helicoptero-inimigo').css('top'))
            explosaoHelicopteroInimigo(helicopteroInimigoX, helicopteroInimigoY)
            $('.projetil').css('left', 950)

            posicaoY = parseInt(Math.random() * 334)
            $('.helicoptero-inimigo').css('left', 694)
            $('.helicoptero-inimigo').css('top', posicaoY)
        }

        if (colisaoProjetilCaminhao.length > 0) {
            let caminhaoX = parseInt($('.caminhao').css('left'))
            let caminhaoY = parseInt($('.caminhao').css('top'))
            explosaoCaminhao(caminhaoX, caminhaoY)
            $('.projetil').css('left', 950)

            $('.caminhao').remove()

            reposicionarCaminhao()
        }

        if (colisaoJogadorAliado.length > 0) {
            reposicionarAliado()
            $('.aliado').remove()
        }
    }

    function explosaoHelicopteroInimigo(helicopteroInimigoX, helicopteroInimigoY) {
        $('.fundo-jogo').append("<div class='explosao-helicoptero-inimigo'></div>")

        $('.explosao-helicoptero-inimigo').css('top', helicopteroInimigoY)
        $('.explosao-helicoptero-inimigo').css('left', helicopteroInimigoX)
        $('.explosao-helicoptero-inimigo').animate({ width: 200, opacity: 0 }, "slow")

        let tempoExplosao = window.setInterval(removerExplosao, 1000)

        function removerExplosao() {
            $('.explosao-helicoptero-inimigo').remove()
            window.clearInterval(tempoExplosao)
        }
    }

    function explosaoCaminhao(caminhaoX, caminhaoY) {
        $('.fundo-jogo').append("<div class='explosao-caminhao'></div>")

        $('.explosao-caminhao').css('top', caminhaoY)
        $('.explosao-caminhao').css('left', caminhaoX)
        $('.explosao-caminhao').animate({ width: 200, opacity: 0 }, "slow")

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
    //Fim de jogo
    //=================
    let fimDeJogo = false
}