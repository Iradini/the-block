import type { Vehicle } from '../types/vehicle'
import { getVehicleById } from '../lib/vehicles'

export function useVehicle(id: string | undefined): Vehicle | undefined {
  if (!id) return undefined
  return getVehicleById(id)
}
