import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";

// Helper function to simulate delay
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Component to load and display APIs
function ApiList(
  { partnerOffering, apiTypes }:
    {
      partnerOffering: Schema["PartnerOffering"]["type"]
      apiTypes: Array<Schema["ApiType"]["type"]>
    }
  ) {
  const [apis, setApis] = useState<Array<Schema["Api"]["type"]>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApis() {
      setLoading(true);
      setError(null);
      try {
        // TODO: remove this sleep
        await sleep(Math.random() * 2000);
        const { data, errors } = await partnerOffering.apis();
        
        if (errors) {
          setError("Failed to load APIs");
          console.error(errors);
        } else if (data) {
          setApis(data);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadApis();
  }, [partnerOffering]);

  if (loading) {
    return <span>Loading APIs...</span>;
  }

  if (error) {
    return <span style={{ color: 'red' }}>{error}</span>;
  }

  if (apis.length === 0) {
    return <span>No APIs found.</span>;
  }

  return (
    <ul>
      {apis.map(api => {
        const apiType = apiTypes.find(type => type.id === api.apiTypeId);
        return (
          <li key={api.id}>
            {api.docLink} - {apiType?.name ?? 'Unknown Type'}
          </li>
        );
      })}
    </ul>
  );
}

export default ApiList;
