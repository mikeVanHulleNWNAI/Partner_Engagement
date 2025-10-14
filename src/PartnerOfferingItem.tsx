import type { Schema } from "../amplify/data/resource";
import ApiList from "./ApiList";

function PartnerOfferingItem({ partnerOffering, apiTypes }: 
  { 
    partnerOffering: Schema["PartnerOffering"]["type"] 
    apiTypes: Array<Schema["ApiType"]["type"]>
  }) {
  return (
    <li>
      {partnerOffering.offeringName}
      <ApiList 
        partnerOffering={partnerOffering} 
        apiTypes={apiTypes}
      />
     </li>
  );
}

export default PartnerOfferingItem;