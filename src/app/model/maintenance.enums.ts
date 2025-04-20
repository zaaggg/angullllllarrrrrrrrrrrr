// maintenance-form.model.ts

export enum ControlStandard {
  NONE, VDE_0100, NFC_15_100
}

export enum CurrentType {
  NONE = 'NONE',
  AC = 'AC',
  DC = 'DC'
}

export enum NetworkForm {
  SYSTEM_3_CONDUCTORS = 'SYSTEM_3_CONDUCTORS',
  SYSTEM_4_CONDUCTORS = 'SYSTEM_4_CONDUCTORS',
  SYSTEM_5_CONDUCTORS = 'SYSTEM_5_CONDUCTORS'
}
