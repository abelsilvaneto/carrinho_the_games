let des = document.getElementById('des').getContext('2d')

// 🌆 FUNDO
let bg = new Image()
bg.src = './img/fundo.png'

// 🚗 INIMIGOS
let carroInimigo  = new CarroInimigo(1300, 325, 80, 50, './img/carro_02_bg.png')
let carroInimigo2 = new CarroInimigo(1500, 125, 80, 50, './img/carro_03_bg.png')
let carroInimigo3 = new CarroInimigo(1700, 400, 80, 50, './img/carro_04_bg.png')

// 🐡 JOGADORES (BAIACU)
let baiacu1 = new Carro(100, 250, 80, 50, './img/baiacu_0_bg.png')
let baiacu2 = new Carro(100, 420, 80, 50, './img/baiacu_1_bg.png')

// HUD
let t1 = new Text()
let t2 = new Text()
let fase_txt = new Text()

let fase = 1
let jogar = true

// 🎮 CONTROLES
document.addEventListener('keydown', (e) => {
    if (e.key === 'w') baiacu1.dir = -10
    if (e.key === 's') baiacu1.dir = 10

    if (e.key === 'ArrowUp') baiacu2.dir = -10
    if (e.key === 'ArrowDown') baiacu2.dir = 10
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 's') baiacu1.dir = 0
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') baiacu2.dir = 0
})

// 💥 COLISÃO
function colisao() {
    let inimigos = [carroInimigo, carroInimigo2, carroInimigo3]

    inimigos.forEach(inimigo => {
        if (baiacu1.vivo && baiacu1.colid(inimigo)) {
            inimigo.recomeca()
            baiacu1.tomarDano()
        }

        if (baiacu2.vivo && baiacu2.colid(inimigo)) {
            inimigo.recomeca()
            baiacu2.tomarDano()
        }
    })
}

// ⭐ PONTUAÇÃO
function pontuacao() {
    let inimigos = [carroInimigo, carroInimigo2, carroInimigo3]

    inimigos.forEach(inimigo => {
        if (inimigo.x <= -100) {
            if (baiacu1.vivo) baiacu1.pontos += 5
            if (baiacu2.vivo) baiacu2.pontos += 5
            inimigo.recomeca()
        }
    })
}

// 🎯 FASE
function ver_fase() {
    let melhor = Math.max(baiacu1.pontos, baiacu2.pontos)

    if (melhor > 20 && fase === 1) {
        fase = 2
        carroInimigo.vel = carroInimigo2.vel = carroInimigo3.vel = 5
    }
    else if (melhor > 40 && fase === 2) {
        fase = 3
        carroInimigo.vel = carroInimigo2.vel = carroInimigo3.vel = 7
    }
}

// 💀 GAME OVER
function game_over() {
    if (baiacu1.vida <= 0) baiacu1.vivo = false
    if (baiacu2.vida <= 0) baiacu2.vivo = false

    if (!baiacu1.vivo && !baiacu2.vivo) {
        jogar = false
        // Tela de Game Over
        des.fillStyle = 'rgba(0,0,0,0.6)'
        des.fillRect(0, 0, 1200, 700)
        des.fillStyle = 'red'
        des.font = 'bold 80px monospace'
        des.textAlign = 'center'
        des.fillText('GAME OVER', 600, 320)
        des.fillStyle = 'white'
        des.font = '30px monospace'
        des.fillText(`J1: ${baiacu1.pontos} pts   J2: ${baiacu2.pontos} pts`, 600, 400)
    }
}

// 🧾 HUD
function desenha_hud() {
    // Vida J1
    t1.des_text(`J1: ${baiacu1.pontos} pts`, 20, 30, 'cyan', '20px monospace')
    t1.des_text(`Vida: ${'❤️'.repeat(baiacu1.vida)}`, 20, 58, 'cyan', '16px monospace')

    // Vida J2
    t2.des_text(`J2: ${baiacu2.pontos} pts`, 900, 30, 'lime', '20px monospace')
    t2.des_text(`Vida: ${'❤️'.repeat(baiacu2.vida)}`, 900, 58, 'lime', '16px monospace')

    fase_txt.des_text(`Fase: ${fase}`, 550, 30, 'white', '20px monospace')
}

// 🎨 DESENHAR
function desenha() {

    // FUNDO
    des.drawImage(bg, 0, 0, 1200, 700)

    // INIMIGOS
    des.drawImage(carroInimigo.img,  carroInimigo.x,  carroInimigo.y,  carroInimigo.w,  carroInimigo.h)
    des.drawImage(carroInimigo2.img, carroInimigo2.x, carroInimigo2.y, carroInimigo2.w, carroInimigo2.h)
    des.drawImage(carroInimigo3.img, carroInimigo3.x, carroInimigo3.y, carroInimigo3.w, carroInimigo3.h)

    // 🐡 JOGADORES
    if (baiacu1.vivo) {
        if (baiacu1.invulneravel && Math.floor(baiacu1.tempoInv / 5) % 2 === 0) {
            des.globalAlpha = 0.3
        }
        des.drawImage(baiacu1.img, baiacu1.x, baiacu1.y, baiacu1.w, baiacu1.h)
        des.globalAlpha = 1
    }

    if (baiacu2.vivo) {
        if (baiacu2.invulneravel && Math.floor(baiacu2.tempoInv / 5) % 2 === 0) {
            des.globalAlpha = 0.3
        }
        des.drawImage(baiacu2.img, baiacu2.x, baiacu2.y, baiacu2.w, baiacu2.h)
        des.globalAlpha = 1
    }

    desenha_hud()
}

// 🔄 ATUALIZA
function atualiza() {
    if (!jogar) return

    baiacu1.mov_car()
    baiacu2.mov_car()

    carroInimigo.mov_car()
    carroInimigo2.mov_car()
    carroInimigo3.mov_car()

    if (baiacu1.invulneravel) baiacu1.tempoInv--
    if (baiacu2.invulneravel) baiacu2.tempoInv--

    if (baiacu1.tempoInv <= 0) baiacu1.invulneravel = false
    if (baiacu2.tempoInv <= 0) baiacu2.invulneravel = false

    colisao()
    pontuacao()
    ver_fase()
    game_over()
}

// 🔁 LOOP
function main() {
    des.clearRect(0, 0, 1200, 700)
    desenha()
    atualiza()
    requestAnimationFrame(main)
}

// 🚀 AGUARDA TODAS AS IMAGENS CARREGAREM
let todasImagens = [bg, baiacu1.img, baiacu2.img, carroInimigo.img, carroInimigo2.img, carroInimigo3.img]
let carregadas = 0

todasImagens.forEach(img => {
    img.onload = () => {
        carregadas++
        if (carregadas === todasImagens.length) {
            main()
        }
    }
    img.onerror = () => {
        console.warn(`Imagem não encontrada: ${img.src}`)
        carregadas++
        if (carregadas === todasImagens.length) {
            main()
        }
    }
})