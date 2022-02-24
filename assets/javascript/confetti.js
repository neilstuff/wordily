const confettiCount = 200;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const repeats = 120;
const refire = false;
const colors = [
    { front: 'red', back: 'darkred' },
    { front: 'green', back: 'darkgreen' },
    { front: 'blue', back: 'darkblue' },
    { front: 'yellow', back: 'darkyellow' },
    { front: 'orange', back: 'darkorange' },
    { front: 'pink', back: 'darkpink' },
    { front: 'purple', back: 'darkpurple' },
    { front: 'turquoise', back: 'darkturquoise' }
];

function Confetti(container, canvasId) {

    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(container);

    this.container.style.display = 'inline-block';

    this.ctx = this.canvas.getContext("2d");
    this.cx = this.canvas.width / 2;
    this.cy = this.canvas.height / 2;
    console.log(this.canvas.width, this.canvas.height);

    this.confetti = [];

    let __this = this;

    window.addEventListener('resize', function() {
        __this.resizeCanvas();
    });

    this.initConfetti();

}

Confetti.prototype.resizeCanvas = function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    cx = this.ctx.canvas.width / 2;
    cy = this.ctx.canvas.height / 2;
};

Confetti.prototype.randomRange = function(min, max) {
    return Math.random() * (max - min) + min;
};

Confetti.prototype.initConfetti = function() {

    for (let i = 0; i < confettiCount; i++) {
        this.confetti.push({
            color: colors[Math.floor(this.randomRange(0, colors.length))],
            dimensions: {
                x: this.randomRange(10, 20),
                y: this.randomRange(10, 30)
            },

            position: {
                x: this.randomRange(0, this.canvas.width),
                y: this.canvas.height - 1
            },

            rotation: this.randomRange(0, 2 * Math.PI),
            scale: {
                x: 0.3,
                y: 0.3
            },

            velocity: {
                x: this.randomRange(-25, 25),
                y: this.randomRange(0, -50)
            }
        });

    }

};

//---------Render-----------
Confetti.prototype.render = function() {

    let __this = this;

    __this.ctx.clearRect(0, 0, __this.canvas.width, __this.canvas.height);

    this.confetti.forEach((confetto, index) => {
        let width = confetto.dimensions.x * confetto.scale.x;
        let height = confetto.dimensions.y * confetto.scale.y;

        // Move canvas to position and rotate
        __this.ctx.translate(confetto.position.x, confetto.position.y);
        __this.ctx.rotate(confetto.rotation);

        // Apply forces to velocity
        confetto.velocity.x -= confetto.velocity.x * drag;
        confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
        confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

        // Set position
        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;

        // Delete confetti when out of frame
        if (confetto.position.y >= __this.canvas.height) __this.confetti.splice(index, 1);

        // Loop confetto x position
        if (confetto.position.x > __this.canvas.width) confetto.position.x = 0;
        if (confetto.position.x < 0) confetto.position.x = __this.canvas.width;

        // Spin confetto by scaling y
        confetto.scale.y = Math.cos(confetto.position.y * 0.1);
        __this.ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        // Draw confetti
        __this.ctx.fillRect(-width / 2, -height / 2, width, height);

        // Reset transform matrix
        __this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    });

    // Fire off another round of confetti
    if (__this.confetti.length <= repeats) {

        console.log()
        if (refire) {
            __this.initConfetti();
        } else {
            console.log("Stop");
            __this.container.style.display = 'none';
        }
    } else {

        window.requestAnimationFrame(function() {
            console.log("In request for Animation");

            __this.render(__this);

        });

    }

};