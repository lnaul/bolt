function drawIsoBox(ctx, cx, cy, hw, hd, ht, colorTop, colorLeft, colorRight) {
  // Right face
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + hw, cy - hd);
  ctx.lineTo(cx + hw, cy - hd - ht);
  ctx.lineTo(cx, cy - ht);
  ctx.closePath();
  ctx.fillStyle = colorRight;
  ctx.fill();
  ctx.strokeStyle = '#00000066';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Left face
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - hw, cy - hd);
  ctx.lineTo(cx - hw, cy - hd - ht);
  ctx.lineTo(cx, cy - ht);
  ctx.closePath();
  ctx.fillStyle = colorLeft;
  ctx.fill();
  ctx.strokeStyle = '#00000066';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Top face
  ctx.beginPath();
  ctx.moveTo(cx, cy - ht);
  ctx.lineTo(cx + hw, cy - hd - ht);
  ctx.lineTo(cx, cy - hd * 2 - ht);
  ctx.lineTo(cx - hw, cy - hd - ht);
  ctx.closePath();
  ctx.fillStyle = colorTop;
  ctx.fill();
  ctx.strokeStyle = '#00000066';
  ctx.lineWidth = 1;
  ctx.stroke();
}

const OBJECT_DEFS = {
  battery: { hw: 10, hd: 6,  ht: 22, wattage: 50,  size: 10, label: '🔋',
             top: '#FFD700', left: '#CC8800', right: '#996600' },
  coin:    { hw: 12, hd: 4,  ht: 5,  wattage: 10,  size: 7,  label: '🪙',
             top: '#FFE044', left: '#FFB800', right: '#CC8800' },
  led:     { hw: 6,  hd: 6,  ht: 16, wattage: 15,  size: 7,  label: '💡',
             top: '#FFFF88', left: '#CCCC00', right: '#999900' },
  plug:    { hw: 10, hd: 8,  ht: 14, wattage: 25,  size: 9,  label: '🔌',
             top: '#AAAAAA', left: '#777777', right: '#444444' },
};

class GameObject {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.absorbed = false;
    this.phase = Math.random() * Math.PI * 2;
    this.time = 0;
    Object.assign(this, OBJECT_DEFS[type]);
  }

  update(dt) {
    this.time += dt;
  }

  draw(ctx, sx, sy, playerSize) {
    const cx = sx;
    const cy = sy + ISO.TILE_H;

    const canAbsorb = this.size <= playerSize;
    const glowAlpha = 0.3 + Math.sin(this.time * 2 + this.phase) * 0.1;
    const glowColor = canAbsorb
      ? `rgba(255, 215, 0, ${glowAlpha})`
      : `rgba(255, 80, 80, ${glowAlpha})`;

    // Glow halo
    const glowR = (this.hw + this.ht * 0.5) * 1.8;
    const grad = ctx.createRadialGradient(cx, cy - this.ht * 0.6, 0, cx, cy - this.ht * 0.6, glowR);
    grad.addColorStop(0, glowColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy - this.ht * 0.6, glowR, 0, Math.PI * 2);
    ctx.fill();

    drawIsoBox(ctx, cx, cy, this.hw, this.hd, this.ht, this.top, this.left, this.right);

    // Wattage label above box
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = canAbsorb ? '#FFD700' : '#FF6B6B';
    ctx.fillText(this.wattage + 'W', cx, cy - this.ht - this.hd * 2 - 5);
  }
}

class ObjectManager {
  constructor() {
    this.objects = [];
    this.score = 0;
    this.spawnObjects(28);
  }

  spawnObjects(count) {
    const types = Object.keys(OBJECT_DEFS);
    const margin = 2;
    const center = ISO.GRID_SIZE / 2;

    for (let i = 0; i < count; i++) {
      let x, y;
      do {
        x = margin + Math.random() * (ISO.GRID_SIZE - margin * 2);
        y = margin + Math.random() * (ISO.GRID_SIZE - margin * 2);
      } while (Math.hypot(x - center, y - center) < 2.5);

      const type = types[Math.floor(Math.random() * types.length)];
      this.objects.push(new GameObject(x, y, type));
    }
  }

  update(dt, player) {
    for (const obj of this.objects) {
      if (!obj.absorbed) obj.update(dt);
    }
    this.checkAbsorption(player);

    // Respawn when < 10 objects remain
    const alive = this.objects.filter(o => !o.absorbed).length;
    if (alive < 10) this.spawnObjects(10);
  }

  checkAbsorption(player) {
    const absorbRange = (player.size + 8) / 32;
    for (const obj of this.objects) {
      if (obj.absorbed || obj.size > player.size) continue;
      const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
      if (dist < absorbRange) {
        obj.absorbed = true;
        player.absorb(obj);
        this.score += obj.wattage;
      }
    }
  }

  draw(ctx, cam, playerSize) {
    const visible = this.objects.filter(o => !o.absorbed);
    visible.sort((a, b) => (a.x + a.y) - (b.x + b.y));
    for (const obj of visible) {
      const pos = ISO.toScreen(obj.x, obj.y);
      obj.draw(ctx, pos.x + cam.x, pos.y + cam.y, playerSize);
    }
  }
}