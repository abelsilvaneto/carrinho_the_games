class Obj {
    constructor(x, y, w, h, src) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.img = new Image()
        this.img.src = src
    }
}

// ─────────────────────────────

class Carro extends Obj {
    constructor(x, y, w, h, src) {
        super(x, y, w, h, src)

        this.dir = 0
        this.vida = 5
        this.pontos = 0
        this.vivo = true
        this.invulneravel = false
        this.tempoInv = 0
    }

    mov_car() {
        this.y += this.dir

        if (this.y < 62) this.y = 62
        if (this.y > 650) this.y = 650
    }

    tomarDano() {
        if (!this.invulneravel) {
            this.vida--
            this.invulneravel = true
            this.tempoInv = 120
        }
    }

    colid(obj) {
        return (
            this.x < obj.x + obj.w &&
            this.x + this.w > obj.x &&
            this.y < obj.y + obj.h &&
            this.y + this.h > obj.y
        )
    }
}

// ─────────────────────────────

class CarroInimigo extends Obj {
    constructor(x, y, w, h, src) {
        super(x, y, w, h, src)
        this.vel = 3
    }

    mov_car() {
        this.x -= this.vel

        if (this.x <= -200) {
            this.recomeca()
        }
    }

    recomeca() {
        this.x = 1300
        this.y = Math.floor(Math.random() * (650 - 62) + 62)
    }
}

// ─────────────────────────────

class Text {
    des_text(text, x, y, cor, font) {
        des.fillStyle = cor
        des.font = font
        des.fillText(text, x, y)
    }
}