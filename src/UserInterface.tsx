import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function UserInterface() {
  const [partnerOfferings, setPartnerOfferings] = useState<Array<Schema["PartnerOffering"]["type"]>>([]);

  useEffect(() => {
    client.models.PartnerOffering.observeQuery().subscribe({
      next: (data) => setPartnerOfferings([...data.items]),
    });
  }, []);

  function createPartnerOffering() {
    client.models.PartnerOffering.create({
      offeringName: window.prompt("Offering content")
    });
  }

  return (
    <main>
      <h1>My partnerOfferings</h1>
      <button onClick={createPartnerOffering}>+ new</button>
      <ul>
        {partnerOfferings.map((partnerOffering) => (
          <li key={partnerOffering.id}>{partnerOffering.offeringName}</li>
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
