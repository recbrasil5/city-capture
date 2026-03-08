import type { World } from './world'

export function tick(world: World) {
  world.tick++

  // Later: call systems here
  // updateStorms(world)
  // updateShips(world)
  // updateSectors(world)
}