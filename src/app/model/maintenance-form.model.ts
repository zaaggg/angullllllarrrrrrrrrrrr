import { ControlStandard, CurrentType, NetworkForm } from "./maintenance.enums";

export interface MaintenanceForm {
  id?: number;

  controlStandard?: ControlStandard;
  currentType?: CurrentType;
  networkForm?: NetworkForm;

  powerCircuit?: string;
  controlCircuit?: string;
  fuseValue?: string;
  hasTransformer?: boolean;
  frequency?: string;

  phaseBalanceTest380v?: string;
  phaseBalanceTest210v?: string;

  insulationResistanceMotor?: string;
  insulationResistanceCable?: string;

  machineSizeHeight?: string;
  machineSizeLength?: string;
  machineSizeWidth?: string;

  isInOrder?: boolean;

  maintenanceSystemUpdated?: boolean;
  sheUpdated?: boolean;
  
    // 🔥 Add this line
    [key: string]: any;
}
