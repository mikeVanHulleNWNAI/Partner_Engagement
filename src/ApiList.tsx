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
      {partnerOffering.apis?.map((api) => {
        return (
          <li key={api.id}>
            <div><strong>Api Type: </strong>{api.apiType.name}</div>
            <div><strong>Doc link: </strong>{api.docLink}</div>
            <div><strong>Training link: </strong>{api.trainingLink}</div>
            <div><strong>Sandbox Environment: </strong>{api.sandboxEnvironment}</div>
            <div><strong>Endpoint: </strong>{api.endpoint}</div>
            <div><strong>Authentication info: </strong>{api.authenticationInfo}</div>
            <div><strong>Authentication type: </strong>{api.authenticationType?.name}</div>
          </li>
        );
      })}
    </ul>
  );
}

export default ApiList;
