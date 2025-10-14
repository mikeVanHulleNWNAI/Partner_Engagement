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

    // Create a uuid for the PartnerOffering because we are going to include
    // in on the client side.  This way everything for PartnerOffering is updated once.
    const partnerOfferingId = crypto.randomUUID();

    const [apiTypeRESTResult, apiTypeGRAPHQLResult] = await Promise.all([
      client.models.ApiType.list({ filter: { name: { eq: "REST" } } }),
      client.models.ApiType.list({ filter: { name: { eq: "GRAPHQL" } } })
    ])

    const apiTypeRESTId = apiTypeRESTResult.data?.[0]?.id;
    const apiTypeGRAPHQLId = apiTypeGRAPHQLResult.data?.[0]?.id;

    const authenticationTypeResult = await client.models.AuthenticationType.create({
      name: "Test authentication"
    });
    const authenticationTypeId = authenticationTypeResult.data?.id;

    await client.models.Api.create({
      partnerOfferingId: partnerOfferingId,
      docLink: "abcd1",
      apiTypeId: apiTypeRESTId,
      trainingLink: "",
      sandboxEnvironment: "",
      endpoint: "",
      authenticationTypeId: authenticationTypeId ?? "",
      authenticationInfo: ""
    })

    await client.models.Api.create({
      partnerOfferingId: partnerOfferingId,
      docLink: "abcd2",
      apiTypeId: apiTypeGRAPHQLId,
      trainingLink: "",
      sandboxEnvironment: "",
      endpoint: "",
      authenticationTypeId: authenticationTypeId ?? "",
      authenticationInfo: ""
    })

    await client.models.PartnerOffering.create({
      id: partnerOfferingId,
      offeringName: window.prompt("Offering content") ?? "",
      contactInfo: "Mr. Jones",
      dashboard: "www.google.com",
      notes: "This is a test"
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
        filter: { name: { eq: name } }
      });

      if (!existing || existing.length === 0) {
        await client.models.ApiType.create({ name });
      }
    }
  }

  async function deleteAll() {
    const allApis = await client.models.Api.list();
    await Promise.all(allApis.data.map((d) => client.models.Api.delete(d)));

    const allApiTypes = await client.models.ApiType.list();
    await Promise.all(allApiTypes.data.map((d) => client.models.ApiType.delete(d)));

    const allPartnerOfferings = await client.models.PartnerOffering.list();
    await Promise.all(allPartnerOfferings.data.map((d) => client.models.PartnerOffering.delete(d)));
  }

  return (
    <main>
      <h1>My partnerOfferings</h1>
      <button onClick={createPartnerOffering}>+ new</button>
      <button onClick={createInitialDataSettings}>Create Initial Data</button>
      <button onClick={deleteAll}>Delete all</button>
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
