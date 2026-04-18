const ISO = {
  TILE_W: 64,
  TILE_H: 32,
  GRID_SIZE: 20,

  toScreen(worldX, worldY) {
    return {
      x: (worldX - worldY) * (this.TILE_W / 2),
      y: (worldX + worldY) * (this.TILE_H / 2)
    };
  }
};