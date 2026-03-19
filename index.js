let des = document.getElementById('des').getContext('2d')

// Inimigos compartilhados
let carroInimigo  = new CarroInimigo(1300, 325, 80, 50, './img/carro_02_bg.png')
let carroInimigo2 = new CarroInimigo(1500, 125, 80, 50, './img/carro_03_bg.png')
let carroInimigo3 = new CarroInimigo(1700, 400, 80, 50, './img/carro_04_bg.png')

// Estrada
let estrada  = new Estrada(10,  345, 40, 10, 'white')
let estrada2 = new Estrada(80,  345, 40, 10, 'blue')
let estrada3 = new Estrada(140, 345, 40, 10, 'green')

// Jogador 1 — controles: W / S
let carro  = new Carro(100, 250, 80, 50, './img/carro_001_bg.png')

// Jogador 2 — controles: ↑ / ↓   (desenhado ligeiramente à frente para não sobrepor)
let carro2 = new Carro(100, 420, 80, 50, './img/carro_001_bg.png')
carro2.vida   = 5
carro2.pontos = 0

// Textos HUD
let t1       = new Text()
let t2       = new Text()
let fase_txt = new Text()

// Sons
let motor  = new Audio('./img/motor.wav')
let batida = new Audio('./img/batida.mp3')
motor.volume  = 0.5
motor.loop    = true
batida.volume = 0.5

let fase  = 1
// O jogo continua enquanto pelo menos um jogador estiver vivo
let jogar = true

// ── Controles ──────────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    motor.play()

    // Jogador 1: W / S
    if (e.key === 'w') {
        carro.dir = -10
    } else if (e.key === 's') {
        carro.dir = 10
    }

    // Jogador 2: ↑ / ↓
    if (e.key === 'ArrowUp') {
        carro2.dir = -10
    } else if (e.key === 'ArrowDown') {
        carro2.dir = 10
    }
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 's') {
        carro.dir = 0
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        carro2.dir = 0
    }
})

// ── Game Over ───────────────────────────────────────────────────────────────
function game_over() {
    if (carro.vida  <= 0) carro.vivo  = false
    if (carro2.vida <= 0) carro2.vivo = false

    // Jogo termina quando os dois estão eliminados
    if (!carro.vivo && !carro2.vivo) {
        jogar = false
        motor.pause()
    }
}

// ── Fase ────────────────────────────────────────────────────────────────────
function ver_fase() {
    // Usa a maior pontuação entre os dois para definir a fase
    let melhor = Math.max(carro.pontos, carro2.pontos)

    if (melhor > 20 && fase === 1) {
        fase = 2
        carroInimigo.vel  = 4
        carroInimigo2.vel = 4
        carroInimigo3.vel = 4
    } else if (melhor > 40 && fase === 2) {
        fase = 3
        carroInimigo.vel  = 6
        carroInimigo2.vel = 6
        carroInimigo3.vel = 6
    }
}

// ── Colisão ─────────────────────────────────────────────────────────────────
function colisao() {
    // Jogador 1
    if (carro.vivo) {
        if (carro.colid(carroInimigo))  { batida.play(); carroInimigo.recomeca();  carro.tomarDano() }
        if (carro.colid(carroInimigo2)) { batida.play(); carroInimigo2.recomeca(); carro.tomarDano() }
        if (carro.colid(carroInimigo3)) { batida.play(); carroInimigo3.recomeca(); carro.tomarDano() }
    }

    // Jogador 2
    if (carro2.vivo) {
        if (carro2.colid(carroInimigo))  { batida.play(); carroInimigo.recomeca();  carro2.tomarDano() }
        if (carro2.colid(carroInimigo2)) { batida.play(); carroInimigo2.recomeca(); carro2.tomarDano() }
        if (carro2.colid(carroInimigo3)) { batida.play(); carroInimigo3.recomeca(); carro2.tomarDano()}
    }
}

// ── Pontuação ────────────────────────────────────────────────────────────────
function pontuacao() {
    // Inimigo 1 saiu da tela — ponto para quem ainda está vivo
    if (carroInimigo.x <= -100) {
        if (carro.vivo)  carro.pontos  += 5
        if (carro2.vivo) carro2.pontos += 5
        carroInimigo.recomeca()
    }
    if (carroInimigo2.x <= -100) {
        if (carro.vivo)  carro.pontos  += 5
        if (carro2.vivo) carro2.pontos += 5
        carroInimigo2.recomeca()
    }
    if (carroInimigo3.x <= -100) {
        if (carro.vivo)  carro.pontos  += 5
        if (carro2.vivo) carro2.pontos += 5
        carroInimigo3.recomeca()
    }
}

// ── HUD ──────────────────────────────────────────────────────────────────────
function desenha_hud() {
    // Painel Jogador 1 (esquerda)
    des.fillStyle = 'rgba(0,0,0,0.45)'
    des.fillRect(10, 8, 220, 50)
    t1.des_text('J1  Pts: ' + carro.pontos,  20, 30, '#00e5ff', '18px monospace')
    t1.des_text('Vidas: ' + (carro.vivo ? carro.vida : 'X'),  20, 52, '#ff5252', '18px monospace')

    // Painel Jogador 2 (direita)
    des.fillStyle = 'rgba(0,0,0,0.45)'
    des.fillRect(970, 8, 220, 50)
    t2.des_text('J2  Pts: ' + carro2.pontos, 980, 30, '#69ff47', '18px monospace')
    t2.des_text('Vidas: ' + (carro2.vivo ? carro2.vida : 'X'), 980, 52, '#ff5252', '18px monospace')

    // Fase (centro)
    fase_txt.des_text('Fase: ' + fase, 565, 30, 'white', '22px monospace')
}

// ── Desenha ──────────────────────────────────────────────────────────────────
function desenha() {
    if (jogar) {
        estrada.des_quad()
        estrada2.des_quad()
        estrada3.des_quad()

        carroInimigo.des_carro()
        carroInimigo2.des_carro()
        carroInimigo3.des_carro()

        if (carro.vivo)  carro.des_carro()
        if (carro2.vivo) carro2.des_carro()

        // Indicador visual do jogador eliminado
        if (!carro.vivo) {
            t1.des_text('J1 ELIMINADO', 60, 360, 'rgba(255,82,82,0.8)', '28px monospace')
        }
        if (!carro2.vivo) {
            t2.des_text('J2 ELIMINADO', 800, 360, 'rgba(255,82,82,0.8)', '28px monospace')
        }

        desenha_hud()

    } else {
        // Tela de Game Over
        des.fillStyle = 'rgba(0,0,0,0.75)'
        des.fillRect(0, 0, 1200, 700)

        t1.des_text('GAME OVER', 390, 270, '#ff5252', '72px monospace')

        let vencedor = ''
        if (carro.pontos > carro2.pontos)       vencedor = 'Jogador 1 venceu!'
        else if (carro2.pontos > carro.pontos)  vencedor = 'Jogador 2 venceu!'
        else                                     vencedor = 'Empate!'

        t1.des_text(vencedor, 430, 340, 'gold', '32px monospace')

        t1.des_text('J1 — Pontos: ' + carro.pontos,  370, 420, '#00e5ff', '26px monospace')
        t2.des_text('J2 — Pontos: ' + carro2.pontos, 370, 460, '#69ff47', '26px monospace')

        t1.des_text('Pressione F5 para jogar novamente', 310, 540, 'white', '20px monospace')
    }
}

// ── Atualiza ─────────────────────────────────────────────────────────────────
function atualiza() {
    if (jogar) {
        if (carro.vivo) {
            carro.mov_car()
            carro.anim('carro_00')
        }
        if (carro2.vivo) {
            carro2.mov_car()
            carro2.anim('carro_00')
        }

        if (carro.invulneravel) carro.tempoInv--
        if (carro2.invulneravel) carro2.tempoInv--

        if (carro.tempoInv <= 0) carro.invulneravel = false
        if (carro2.tempoInv <= 0) carro2.invulneravel = false

        carroInimigo.mov_car()
        carroInimigo2.mov_car()
        carroInimigo3.mov_car()

        estrada.mov_est()
        estrada2.mov_est()
        estrada3.mov_est()

        colisao()
        pontuacao()
        ver_fase()
        game_over()
    }
}

// ── Loop principal ────────────────────────────────────────────────────────────
function main() {
    des.clearRect(0, 0, 1200, 700)
    desenha()
    atualiza()
    requestAnimationFrame(main)
}

main()
