import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import PartnerOfferingItem from "./PartnerOfferingItem";
import { createPartnerOffering, deleteAll } from "./Utils/CreateData"
import { CLIENT } from "./Utils/Constants";

function UserInterface() {
  const [partnerOfferings, setPartnerOfferings] = useState<Array<Schema["PartnerOffering"]["type"]>>([]);
  const [apiTypes, setApiTypes] = useState<Array<Schema["ApiType"]["type"]>>([]);

  useEffect(() => {
    CLIENT.models.PartnerOffering.observeQuery().subscribe({
      next: (data) => setPartnerOfferings([...data.items]),
    });
    // the apiType table will not change often
    CLIENT.models.ApiType.observeQuery().subscribe({
      next: (data) => setApiTypes([...data.items]),
    })
  }, []);

  return (
    <main>
      <h1>My partnerOfferings</h1>
      <button onClick={createPartnerOffering}>+ new</button>
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
