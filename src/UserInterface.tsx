import { useEffect, useState } from "react";
import { createInitialDataSettings, deleteAll } from "./Utils/CreateData"
import { CLIENT } from "./Utils/Constants";
import ItemGrid from "./ItemGrid";
import Sidebar from "./Sidebar";
import ApiList from "./ApiList";
import EditPartnerOfferingForm from "./EditPartnerOfferingForm";
import PartnerOfferingTile from "./PartnerOfferingTile";
import { partnerOfferingType } from "./Types";

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
        'nwnOffering.name',
        'company.name',
        'priority.name',
        'apis.id',
        'apis.endpoint',
        'apis.docLink',
        'apis.apiType.name'
      ]
    }).subscribe({
      next: (data) => {
        const partnerOfferingMap = data.items.map(partnerOffering => ({
          ...partnerOffering,
          apisMap: new Map(partnerOffering.apis.map(api => [api.id, api])),
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
                    <ApiList
                      partnerOffering={activePartnerOffering}
                    />
                  </li>
                </ul>              </div>
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
