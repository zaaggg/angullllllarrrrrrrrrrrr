export interface ValidationEntryUpdateDTO {
  status: boolean;
  reason: string | null;
  date: string; // ISO string like '2025-04-24'
}
