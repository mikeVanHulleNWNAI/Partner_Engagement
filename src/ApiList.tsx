import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";

// Helper function to simulate delay
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Component to load and display APIs
function ApiList({ partnerOffering }: { partnerOffering: Schema["PartnerOffering"]["type"] }) {
  const [apis, setApis] = useState<Array<Schema["Api"]["type"]>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApis() {
      setLoading(true);
      // TODO: remove this sleep
      await sleep(2000);
      const { data } = await partnerOffering.apis();
      if (data) setApis(data);
      setLoading(false);
    }
    
    loadApis();
  }, [partnerOffering.id]);

  if (loading) {
    return <span> Loading APIs...</span>;
  }

  return (
    <ul>
      {apis.map(api => (
        <li key={api.id}>{api.docLink}</li>
      ))}
    </ul>
  );
}

export default ApiList;