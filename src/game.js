class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.keys = {};
    this.player = new Player(ISO.GRID_SIZE / 2, ISO.GRID_SIZE / 2);
    this.objects = new ObjectManager();
    this.lastTime = 0;
    this.setupInput();
  }

  setupInput() {
    window.addEventListener('keydown', e => {
      this.keys[e.key] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
    });
    window.addEventListener('keyup', e => { this.keys[e.key] = false; });
  }

  getCamera() {
    const pos = ISO.toScreen(this.player.x, this.player.y);
    return {
      x: this.canvas.width / 2 - pos.x,
      y: this.canvas.height / 2 - pos.y + 60
    };
  }

  drawTile(ctx, sx, sy, alt) {
    const hw = ISO.TILE_W / 2;
    const hh = ISO.TILE_H / 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + hw, sy + hh);
    ctx.lineTo(sx, sy + ISO.TILE_H);
    ctx.lineTo(sx - hw, sy + hh);
    ctx.closePath();
    ctx.fillStyle = alt ? '#1A1E3A' : '#141830';
    ctx.fill();
    ctx.strokeStyle = '#252A55';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  drawGrid(cam) {
    for (let gy = 0; gy < ISO.GRID_SIZE; gy++) {
      for (let gx = 0; gx < ISO.GRID_SIZE; gx++) {
        const pos = ISO.toScreen(gx, gy);
        const sx = pos.x + cam.x;
        const sy = pos.y + cam.y;
        if (sx < -ISO.TILE_W * 2 || sx > this.canvas.width + ISO.TILE_W * 2) continue;
        if (sy < -ISO.TILE_H * 2 || sy > this.canvas.height + ISO.TILE_H * 2) continue;
        this.drawTile(this.ctx, sx, sy, (gx + gy) % 2 === 0);
      }
    }
  }

  getTierName() {
    const s = this.player.size;
    if (s < 20) return 'SPARK    tier 1/7';
    if (s < 28) return 'CHARGE   tier 2/7';
    if (s < 38) return 'BOLT     tier 3/7';
    if (s < 50) return 'SURGE    tier 4/7';
    if (s < 62) return 'LIGHTNING tier 5/7';
    if (s < 72) return 'STORM    tier 6/7';
    return 'THUNDER  tier 7/7';
  }

  drawHUD() {
    const ctx = this.ctx;
    ctx.fillStyle = '#00D4FF';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ BOLT.io', 16, 32);
    ctx.fillStyle = '#ffffff66';
    ctx.font = '11px monospace';
    ctx.fillText(this.getTierName(), 16, 50);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(this.objects.score + ' W', 16, 70);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff22';
    ctx.font = '11px monospace';
    ctx.fillText('WASD / Arrow Keys to move', this.canvas.width / 2, this.canvas.height - 16);
  }

  update(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;
    this.player.update(dt, this.keys);
    this.objects.update(dt, this.player);
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const bg = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    bg.addColorStop(0, '#0A0E27');
    bg.addColorStop(1, '#1A1A3E');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const cam = this.getCamera();
    this.drawGrid(cam);
    this.objects.draw(ctx, cam, this.player.size);

    const pPos = ISO.toScreen(this.player.x, this.player.y);
    this.player.draw(ctx, pPos.x + cam.x, pPos.y + cam.y + ISO.TILE_H / 2);

    this.drawHUD();
  }

  loop(timestamp) {
    this.update(timestamp);
    this.draw();
    requestAnimationFrame(ts => this.loop(ts));
  }

  start() {
    requestAnimationFrame(ts => { this.lastTime = ts; this.loop(ts); });
  }
}