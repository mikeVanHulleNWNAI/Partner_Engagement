import type { Schema } from "../amplify/data/resource";
import ApiList from "./APIList";

function PartnerOfferingItem({ partnerOffering }: { partnerOffering: Schema["PartnerOffering"]["type"] }) {
  return (
    <li>
      {partnerOffering.offeringName}
      <ApiList partnerOffering={partnerOffering} />
     </li>
  );
}

export default PartnerOfferingItem;