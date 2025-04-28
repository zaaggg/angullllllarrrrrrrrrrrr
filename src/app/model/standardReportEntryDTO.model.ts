export interface StandardReportEntryDTO {
  id: number;
  implemented: boolean ;
  action: string | null;
  responsableAction: string | null;
  deadline: string | null;
  successControl: string | null;
  isUpdated: boolean;
}
