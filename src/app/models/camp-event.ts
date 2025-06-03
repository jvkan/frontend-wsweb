export interface CampEvent {
  id: number;
  name: string;
  startDate: string;   // ISO date (e.g. "2025-06-01")
  endDate: string;
  description?: string;
  active: boolean;
}
