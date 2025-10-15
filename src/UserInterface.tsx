import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { createPartnerOffering, deleteAll } from "./Utils/CreateData"
import { CLIENT } from "./Utils/Constants";
import ItemGrid from "./ItemGrid";
import PartnerOfferingTile from "./PartnerOfferingTile";
import Sidebar from "./SideBar";
import ApiList from "./ApiList";

function UserInterface() {
  const [partnerOfferings, setPartnerOfferings] = useState<Array<Schema["PartnerOffering"]["type"]>>([]);
  const [apiTypes, setApiTypes] = useState<Array<Schema["ApiType"]["type"]>>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activePartnerOffering, setActivePartnerOffering] = useState<Schema["PartnerOffering"]["type"]>();

  useEffect(() => {
    CLIENT.models.PartnerOffering.observeQuery().subscribe({
      next: (data) => setPartnerOfferings([...data.items]),
    });
    // the apiType table will not change often
    CLIENT.models.ApiType.observeQuery().subscribe({
      next: (data) => setApiTypes([...data.items]),
    })
  }, []);

  const activateSidebar = (productOffering: Schema["PartnerOffering"]["type"]) => {
    setActivePartnerOffering(productOffering);
    setIsOpen(true);
  }

  return (
    <main>
      <h1>My partnerOfferings</h1>
      <button onClick={createPartnerOffering}>+ new</button>
      <button onClick={deleteAll}>Delete all</button>
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6 mt-14">
          {activePartnerOffering ? (
            <div>
              {activePartnerOffering.offeringName}
              <ApiList
                partnerOffering={activePartnerOffering}
                apiTypes={apiTypes}
              />
            </div>
          ) : (
            "Loading..."
          )}
        </div>
      </Sidebar>
      <ItemGrid>
        {partnerOfferings.map((partnerOffering) => (
          <PartnerOfferingTile
            key={partnerOffering.id}
            partnerOffering={partnerOffering}
            onClick={() => activateSidebar(partnerOffering)}
          />
        ))}
      </ItemGrid>
    </main>
  );
}

export default UserInterface;
