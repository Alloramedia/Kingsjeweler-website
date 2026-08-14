/**
 * Legacy stub — the food-truck "vehicles" concept is not used by Kings
 * Jeweler. Kept only so the admin bundle editor compiles; empty list means
 * the vehicle toggles simply don't render.
 */
export interface VehicleInfo {
  slug: string;
  name: string;
  service: string;
}

export const VEHICLES: VehicleInfo[] = [];

export const VEHICLE_SLUGS = VEHICLES.map((v) => v.slug);
export const getVehicle = (slug: string): VehicleInfo | undefined =>
  VEHICLES.find((v) => v.slug === slug);
export const vehicleName = (slug: string): string =>
  getVehicle(slug)?.name ?? slug;
