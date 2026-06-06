import type { Vehicle, VehicleFilters, SortOption } from '../types/vehicle'
import vehiclesRaw from '../../data/vehicles.json'

const vehicles: Vehicle[] = vehiclesRaw as unknown as Vehicle[]

export function getAllVehicles(): Vehicle[] {
  return vehicles
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id)
}

export function searchVehicles(
  query: string,
  filters: VehicleFilters,
  sort: SortOption
): Vehicle[] {
  let result = [...vehicles]

  if (query.trim()) {
    const q = query.trim().toLowerCase()
    result = result.filter((v) => {
      const haystack = `${v.year} ${v.make} ${v.model} ${v.trim} ${v.lot} ${v.selling_dealership} ${v.city}`.toLowerCase()
      return haystack.includes(q)
    })
  }

  if (filters.make) {
    result = result.filter((v) => v.make === filters.make)
  }

  if (filters.bodyStyle) {
    result = result.filter((v) => v.body_style === filters.bodyStyle)
  }

  if (filters.province) {
    result = result.filter((v) => v.province === filters.province)
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((v) => (v.current_bid ?? v.starting_bid) >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((v) => (v.current_bid ?? v.starting_bid) <= filters.maxPrice!)
  }

  if (filters.minCondition !== undefined) {
    result = result.filter((v) => v.condition_grade >= filters.minCondition!)
  }

  if (filters.maxCondition !== undefined) {
    result = result.filter((v) => v.condition_grade <= filters.maxCondition!)
  }

  result.sort((a, b) => {
    const priceA = a.current_bid ?? a.starting_bid
    const priceB = b.current_bid ?? b.starting_bid
    switch (sort) {
      case 'price_asc': return priceA - priceB
      case 'price_desc': return priceB - priceA
      case 'year_desc': return b.year - a.year
      case 'year_asc': return a.year - b.year
      case 'odometer_asc': return a.odometer_km - b.odometer_km
      case 'condition_desc': return b.condition_grade - a.condition_grade
    }
  })

  return result
}

export interface FilterOptions {
  makes: string[]
  bodyStyles: string[]
  provinces: string[]
}

let cachedOptions: FilterOptions | null = null

export function getFilterOptions(): FilterOptions {
  if (cachedOptions) return cachedOptions
  cachedOptions = {
    makes: [...new Set(vehicles.map((v) => v.make))].sort(),
    bodyStyles: [...new Set(vehicles.map((v) => v.body_style))].sort(),
    provinces: [...new Set(vehicles.map((v) => v.province))].sort(),
  }
  return cachedOptions
}
