import { partnerOfferingType } from "./Types";

// Component to load and display APIs
function ApiList(
  { partnerOffering }:
    {
      partnerOffering: partnerOfferingType
    }
  ) {

  return (
    <ul>
      {partnerOffering.apis.map((api) => {
        return (
          <li key={api.id}>
            {api.docLink} - {api.apiType.name}
          </li>
        );
      })}
    </ul>
  );
}

export default ApiList;
