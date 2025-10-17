import { memo, useEffect, useState } from "react";
import { createInitialDataSettings, createPartnerOffering, deleteAll } from "./Utils/CreateData"
import { CLIENT } from "./Utils/Constants";
import ItemGrid from "./ItemGrid";
import Sidebar from "./Sidebar";
import ApiList from "./ApiList";
import EditPartnerOfferingForm from "./EditPartnerOfferingForm";
import PartnerOfferingTile from "./PartnerOfferingTile";
import { partnerOfferingType } from "./Types";
import { PartnerOfferingSelectionSet } from "./Utils/PartnerOfferingSelectionSet";

const ProductOfferingItem = memo<{ partnerOffering: partnerOfferingType; onClick: () => void }>(
  ({ partnerOffering, onClick }) => (
    <PartnerOfferingTile
      key={partnerOffering.id}
      partnerOffering={partnerOffering}
      onClick={onClick}
    />
  )
);

function UserInterface() {
  const [partnerOfferings, setPartnerOfferings] = useState<partnerOfferingType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activePartnerOffering, setActivePartnerOffering] = useState<partnerOfferingType>();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const partnerOfferingSubscription = CLIENT.models.PartnerOffering.observeQuery(
      { selectionSet: PartnerOfferingSelectionSet }
    ).subscribe({
      next: async (data) => {
        // Check if any items have null status
        const hasNullStatus = data.items.some(item => item.status === null);

        if (hasNullStatus) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // This code fixes https://github.com/aws-amplify/amplify-js/issues/13267 .
        // Which is considered a bug.  When a new record is inserted into GraphQL,
        // the item returned to the observable does not have any of its nested items
        // populated.  This code finds items that have item.status as null.  It
        // looks in the GraphQL database and replaces those items with good ones.
        const partnerOfferingMap = (await Promise.all(
          data.items.map(async (item) => {
            if (item.status === null) {
              const refetchedItem = await CLIENT.models.PartnerOffering.get(
                { id: item.id },
                { selectionSet: PartnerOfferingSelectionSet }
              );
              return refetchedItem.data;
            }
            return item;
          })
        )).filter((item): item is partnerOfferingType => item !== null && item !== undefined);

        setPartnerOfferings(partnerOfferingMap);
      }
    })

    return () => {
      partnerOfferingSubscription.unsubscribe();
    }
  }, []);

  const activateSidebar = (
    productOffering: partnerOfferingType,
  ) => {
    setActivePartnerOffering(productOffering);
    setIsOpen(true);
  }

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmitForm = (data: { name: string; email: string }) => {
    console.log('Form submitted with data:', data);
    // Perform actions with the submitted data, e.g., send to an API
  };

  return (
    <main>
      <h1>My partnerOfferings</h1>
      <button hidden className="select-none" onClick={async () => {
        await deleteAll();
        await createInitialDataSettings();
      }}>Delete and Restore</button>
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6 mt-14">
          {activePartnerOffering ? (
            <div>
              <button onClick={async () => {
                await createPartnerOffering(
                  "Test 1234",
                  "Pragti Aggarwal <pragti@apexaiq.com>; Engineering support: lokesh@apexaiq.com",
                  "https://nwn.okta.com/app/UserHome",
                  "",
                  "Connected",
                  "",
                  "ApexaiQ",
                  "LOW",
                  ["REST"],
                  [""],
                  [""],
                  [""],
                  [""],
                  [""]
                );
              }}>New Partner Offering</button>
              <button hidden className="select-none" onClick={handleOpenPopup}>
                Test Form
              </button>
              <EditPartnerOfferingForm
                open={isPopupOpen}
                onClose={handleClosePopup}
                onSubmit={handleSubmitForm}
              />
              <div>
                <ul>
                  <li>
                    <div className="text-2xl font-bold">
                      {activePartnerOffering.offeringName}
                    </div>
                    <div><strong>ContactInfo: </strong>{activePartnerOffering.contactInfo}</div>
                    <div><strong>Dashboard: </strong>{activePartnerOffering.dashboard}</div>
                    <div><strong>Notes: </strong>{activePartnerOffering.notes}</div>
                    <div><strong>Status: </strong>{activePartnerOffering.status.name}</div>
                    <div><strong>NWN Offering: </strong>{activePartnerOffering.nwnOffering.name}</div>
                    <div><strong>Company: </strong>{activePartnerOffering.company.name}</div>
                    <div><strong>Priority: </strong>{activePartnerOffering.priority.name}</div>
                    <ApiList
                      partnerOffering={activePartnerOffering}
                    />
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            "Loading..."
          )}
        </div>
      </Sidebar>
      <ItemGrid>
        {partnerOfferings.map((partnerOffering) => (
          <ProductOfferingItem
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
