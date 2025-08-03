import { Game, Player, PlayerType } from "../../game/Game";
import { TileRef } from "../../game/GameMap";

export class MapAnalysis {
  public gameProgress = 0;
  public unconqueredBots: Player[] = [];
  public botToNeighborNations: Map<Player, Player> = new Map();
  public wildernessAreas: TileRef[] = [];

  analyzeMap(game: Game): void {
    this.calculateGameProgress(game);
    this.findUnconqueredBots(game);
    this.mapBotsToNeighborNations(game);
    this.findWildernessAreas(game);
  }

  private calculateGameProgress(game: Game): void {
    const totalLandTiles = game.numLandTiles();
    const players = game.players();

    if (totalLandTiles === 0 || players.length === 0) {
      this.gameProgress = 0;
      return;
    }

    // Find the player with the most tiles
    let maxTilesOwned = 0;
    for (const player of players) {
      const tilesOwned = player.numTilesOwned();
      if (tilesOwned > maxTilesOwned) {
        maxTilesOwned = tilesOwned;
      }
    }

    // Calculate game progress as fraction of land owned by largest player
    this.gameProgress = maxTilesOwned / totalLandTiles;
  }

  private findUnconqueredBots(game: Game): void {
    this.unconqueredBots = game
      .players()
      .filter((player) => player.type() === PlayerType.Bot && player.isAlive());
  }

  private mapBotsToNeighborNations(game: Game): void {
    this.botToNeighborNations.clear();

    // Get all nation players (players that have a nation)
    const nationPlayers = game
      .players()
      .filter((player) => player.info().nation !== null && player.isAlive());

    // For each bot, check if it neighbors any nation players
    for (const bot of this.unconqueredBots) {
      for (const nationPlayer of nationPlayers) {
        if (bot.sharesBorderWith(nationPlayer)) {
          this.botToNeighborNations.set(bot, nationPlayer);
          break; // Only map to the first neighboring nation found
        }
      }
    }
  }

  private findWildernessAreas(game: Game): void {
    this.wildernessAreas = this.calculateWildernessClusters(game);
  }

  private calculateWildernessClusters(game: Game): TileRef[] {
    const seen = new Set<TileRef>();
    const wildernessClusters: TileRef[] = [];

    game.forEachTile((tile: TileRef) => {
      if (seen.has(tile) || !game.isLand(tile) || game.hasOwner(tile)) {
        return;
      }

      // Found an unowned land tile, explore the wilderness cluster
      const clusterSize = this.exploreWildernessCluster(game, tile, seen);
      if (clusterSize > 0) {
        // Store a representative tile for this wilderness cluster
        wildernessClusters.push(tile);
      }
    });

    return wildernessClusters;
  }

  private exploreWildernessCluster(
    game: Game,
    startTile: TileRef,
    globalSeen: Set<TileRef>,
  ): number {
    const queue: TileRef[] = [startTile];
    const clusterSeen = new Set<TileRef>();
    let clusterSize = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (clusterSeen.has(current) || globalSeen.has(current)) {
        continue;
      }

      if (!game.isLand(current) || game.hasOwner(current)) {
        continue;
      }

      clusterSeen.add(current);
      globalSeen.add(current);
      clusterSize++;

      // Add neighbors to queue for exploration
      for (const neighbor of game.neighbors(current)) {
        if (!clusterSeen.has(neighbor) && !globalSeen.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    return clusterSize;
  }
}
