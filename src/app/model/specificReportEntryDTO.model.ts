export interface SpecificReportEntryDTO {
  id: number;
  homologation: boolean | null;
  action: string | null;
  responsableAction: string | null;
  deadline: string | null;
  successControl: string | null;
  isUpdated: boolean;
}
