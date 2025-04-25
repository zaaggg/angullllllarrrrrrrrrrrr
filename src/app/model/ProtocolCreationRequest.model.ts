import { SpecificCriteriaDTO } from './SpecificCriteriaDTO.model';
import { ProtocolType } from './protocol-type.enum';

export interface ProtocolCreationRequest {
  name: string;
  protocolType: ProtocolType;
  specificCriteria: SpecificCriteriaDTO[];
}
