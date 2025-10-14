import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import PartnerOfferingItem from "./PartnerOfferingItem";

const client = generateClient<Schema>();

function UserInterface() {
  const [partnerOfferings, setPartnerOfferings] = useState<Array<Schema["PartnerOffering"]["type"]>>([]);
  const [apiTypes, setApiTypes] = useState<Array<Schema["ApiType"]["type"]>>([]);

  useEffect(() => {
    client.models.PartnerOffering.observeQuery().subscribe({
      next: (data) => setPartnerOfferings([...data.items]),
    });
    // the apiType table will not change often
    client.models.ApiType.observeQuery().subscribe({
      next: (data) => setApiTypes([...data.items]),
    })
  }, []);

  // add a ProductOffering
  async function createPartnerOffering() {
    const test = await client.models.PartnerOffering.create({
      offeringName: window.prompt("Offering content")
    });
    const id = test.data?.id;

    const apiTypeREST = await client.models.ApiType.list({
      filter: { name: {eq: "REST"}}
    })
    const apiTypeGRAPHQL = await client.models.ApiType.list({
      filter: { name: {eq: "GRAPHQL"}}
    })

    await client.models.Api.create({
      partnerOfferingId: id,
      docLink: "abcd1",
      apiTypeId: apiTypeREST.data?.[0].id
    });
    await client.models.Api.create({
      partnerOfferingId: id,
      docLink: "abcd2",
      apiTypeId: apiTypeGRAPHQL.data?.[0].id
    });
  }

  // populate the database with initial values
  async function createInitialDataSettings() {
    const apiTypeNames = [
      "REST",
      "REST (OKTA)",
      "MCP",
      "GRAPHQL",
      "SDK",
      "REST & SOAP",
      "REST & GRAPH"
    ];

    for (const name of apiTypeNames) {
      const { data: existing } = await client.models.ApiType.list({
        filter: { name: {eq: name}}
      });
      
      if (!existing || existing.length === 0) {
        await client.models.ApiType.create({ name });
      }
    }
  }

  return (
    <main>
      <h1>My partnerOfferings</h1>
      <button onClick={createPartnerOffering}>+ new</button>
      <button onClick={createInitialDataSettings}>Create Initial Data</button>
      <ul>
        {partnerOfferings.map((partnerOffering) => (
          <PartnerOfferingItem
            key={partnerOffering.id}
            partnerOffering={partnerOffering}
            apiTypes={apiTypes}
          />
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new partnerOffering.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default UserInterface;
