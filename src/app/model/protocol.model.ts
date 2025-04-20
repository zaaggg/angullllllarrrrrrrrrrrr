import { ProtocolType } from './protocol-type.enum';

export interface Protocol {
  id: number;
  name: string;
  protocolType: ProtocolType;
}
