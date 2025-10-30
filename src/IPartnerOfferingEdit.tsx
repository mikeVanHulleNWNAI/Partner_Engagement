import { partnerOfferingType } from "./Types";

export interface PartnerOfferingEditRef {
  getCurrentPOData: () => partnerOfferingType;
}