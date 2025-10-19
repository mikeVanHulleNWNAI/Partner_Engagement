import { RenderLinkOrText } from "./RenderLinkOrText";
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
            <div style={{ fontSize: '1.4em', fontWeight: 'bold', marginBottom: '8px', color: 'mediumpurple' }}>
              {api.apiType.name}
            </div>
            <RenderLinkOrText label="Doc link: " value={api.docLink} />
            <RenderLinkOrText label="Training link: " value={api.trainingLink} />
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
