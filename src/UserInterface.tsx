import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import PartnerOfferingItem from "./PartnerOfferingItem";

const client = generateClient<Schema>();

function UserInterface() {
  const [partnerOfferings, setPartnerOfferings] = useState<Array<Schema["PartnerOffering"]["type"]>>([]);

  useEffect(() => {
    client.models.PartnerOffering.observeQuery().subscribe({
      next: (data) => setPartnerOfferings([...data.items]),
    });
  }, []);

  async function createPartnerOffering() {
    const test = await client.models.PartnerOffering.create({
      offeringName: window.prompt("Offering content")
    });
    const id = test.data?.id;
    await client.models.Api.create({
      partnerOfferingId: id,
      docLink: "abcd1"
    });
    await client.models.Api.create({
      partnerOfferingId: id,
      docLink: "abcd2"
    });
  }

  return (
    <main>
      <h1>My partnerOfferings</h1>
      <button onClick={createPartnerOffering}>+ new</button>
      <ul>
        {partnerOfferings.map((partnerOffering) => (
          <PartnerOfferingItem key={partnerOffering.id} partnerOffering={partnerOffering}/>
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
