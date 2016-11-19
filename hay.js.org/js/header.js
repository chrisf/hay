var header = document.querySelector('.landing');

var pixelRatio = window.devicePixelRatio || 1;

function rand( min, max ) {
  return Math.random() * ( max - min ) + min;
}

function setupCanvas(container, color) {
  var rgb = {
    black: '0, 0, 0',
    white: '255, 255, 255'
  };

  var c = container.querySelector('canvas');

  var ctx = c.getContext("2d");
  var cw, ch;

  function resizeCanvas() {
    c.width = container.clientWidth;
    c.height = container.clientHeight;

    c.style.width = c.width + 'px';
    c.style.height = c.height + 'px';
    c.width *= pixelRatio;
    c.height *= pixelRatio;

    // Now that its high res we need to compensate so our images can be drawn as
    //normal, by scaling everything up by the pixelRatio.
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    cw = c.width;
    ch = c.height;
    // ctx.fillStyle = '#2D313A';
    // ctx.fillRect(0, 0, cw, ch);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Create Particle class
  var Particle = function (parent) {
    this.canvas = parent.canvas;
    this.ctx = parent.ctx;

    this.x = Math.random() * (cw / pixelRatio);
    this.y = Math.random() * (ch / pixelRatio);

    this.velocity = {
      y: (Math.random() - 0.5) * 0.7,
      x: (Math.random() - 0.5) * 0.7
    };
  };

  Particle.prototype.update = function () {
    // Change dir if outside map
    if (this.x > (cw / pixelRatio) + 3 || this.x < -3) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y > (ch / pixelRatio) + 3 || this.y < -3) {
      this.velocity.y = -this.velocity.y;
    }

    // Update position
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };

  Particle.prototype.draw = function () {
    // Draw particle
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
    this.ctx.fill();
  };

  // Create ParticleNetwork class
  ParticleNetwork = function (canvas) {
    this.canvas = canvas;
    this.canvas.size = {
      'width': cw,
      'height': ch
    };

    this.init();
  };
  ParticleNetwork.prototype.init = function () {
    // Create canvas & context
    this.ctx = this.canvas.getContext('2d');
    // Initialise particles
    this.particles = [];
    var density = Math.floor(ch / 4);

    for (var i = 0; i < density; i++) {
      this.particles.push(new Particle(this));
    }
    requestAnimationFrame(this.update.bind(this));
  };
  ParticleNetwork.prototype.update = function () {
    this.ctx.globalAlpha = 1;
    this.ctx.clearRect(0, 0, cw, ch);

    // Draw particles
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();

      // Draw connections
      for (var j = this.particles.length - 1; j > i; j--) {
        var distance = Math.sqrt(
          Math.pow(this.particles[i].x - this.particles[j].x, 2)
          + Math.pow(this.particles[i].y - this.particles[j].y, 2)
        );
        if (distance > 100) {
          continue;
        }
        var width;

        if (1 > 1000 / (distance * distance)) {
          width = 1000 / (distance * distance);
        } else {
          width = 1.7;
        }
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(this.particles[i].x - 1, this.particles[i].y + 1);
        this.ctx.lineTo(this.particles[j].x + 1, this.particles[j].y - 1);
        this.ctx.stroke();
      }
    }
    this.ctx.closePath();

    requestAnimationFrame(this.update.bind(this));
  };

  new ParticleNetwork(c);
}

