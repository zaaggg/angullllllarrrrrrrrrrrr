import { ControlStandard, CurrentType, NetworkForm } from "./maintenance.enums";

export interface MaintenanceForm {
  id?: number;

  controlStandard?: ControlStandard | null;
  currentType?: CurrentType | null;
  networkForm?: NetworkForm | null;

  powerCircuit?: string | null;
  controlCircuit?: string | null;
  fuseValue?: string | null;
  hasTransformer?: boolean | null;
  frequency?: string | null;

  phaseBalanceTest380v?: string | null;
  phaseBalanceTest210v?: string | null;

  insulationResistanceMotor?: string | null;
  insulationResistanceCable?: string | null;

  machineSizeHeight?: string | null;
  machineSizeLength?: string | null;
  machineSizeWidth?: string | null;

  isInOrder?: boolean | null ;

  maintenanceSystemUpdated?: boolean;
  sheUpdated?: boolean;

    // 🔥 Add this line
    [key: string]: any;
}
