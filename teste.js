
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