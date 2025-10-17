import { memo, useEffect, useState } from "react";
import { createInitialDataSettings, createPartnerOffering, deleteAll } from "./Utils/CreateData"
import { CLIENT } from "./Utils/Constants";
import ItemGrid from "./ItemGrid";
import Sidebar from "./Sidebar";
import ApiList from "./ApiList";
import EditPartnerOfferingForm from "./EditPartnerOfferingForm";
import PartnerOfferingTile from "./PartnerOfferingTile";
import { partnerOfferingType } from "./Types";

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
    const partnerOfferingSubscription = CLIENT.models.PartnerOffering.observeQuery({
      selectionSet: [
        'id',
        'offeringName',
        'contactInfo',
        'dashboard',
        'notes',
        'status.name',
        'nwnOffering.name',
        'nwnOffering.manager.name',
        'company.name',
        'priority.name',
        'apis.id',
        'apis.docLink',
        'apis.trainingLink',
        'apis.sandboxEnvironment',
        'apis.endpoint',
        'apis.apiType.name',
        'apis.authenticationType.name',
        'apis.authenticationInfo',
      ]
    }).subscribe({
      next: (data) => {
        const partnerOfferingMap = data.items.map(partnerOffering => ({
          ...partnerOffering,
        }))

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
              <button hidden onClick={async () => {
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
