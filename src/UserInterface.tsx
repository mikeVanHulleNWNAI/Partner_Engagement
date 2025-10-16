import { useCallback, useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { createPartnerOffering, createInitialDataSettings, deleteAll } from "./Utils/CreateData"
import { CLIENT } from "./Utils/Constants";
import ItemGrid from "./ItemGrid";
//import PartnerOfferingTile from "./PartnerOfferingTile";
import Sidebar from "./SideBar";
//import ApiList from "./ApiList";
import CompanyTile from "./CompanyTile";
import ApiList from "./ApiList";

function UserInterface() {
  //  const [partnerOfferings, setPartnerOfferings] = useState<Array<Schema["PartnerOffering"]["type"]>>([]);
  const [companies, setCompanies] = useState<Array<Schema["Company"]["type"]>>([]);
  const [apiTypes, setApiTypes] = useState<Array<Schema["ApiType"]["type"]>>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  //  const [activePartnerOffering, setActivePartnerOffering] = useState<Schema["PartnerOffering"]["type"]>();
  const [activeCompany, setActiveCompany] = useState<Schema["Company"]["type"]>();
  const [activePartnerOfferings, setActivePartnerOfferings] = useState<Array<Schema["PartnerOffering"]["type"]>>([]);

  useEffect(() => {
    //    CLIENT.models.PartnerOffering.observeQuery().subscribe({
    //      next: (data) => setPartnerOfferings([...data.items]),
    //    });
    const companiesSubscription = CLIENT.models.Company.observeQuery().subscribe({
      next: (data) => setCompanies([...data.items]),
    })
    // the apiType table will not change often
    const apiTypesSubscription = CLIENT.models.ApiType.observeQuery().subscribe({
      next: (data) => setApiTypes([...data.items]),
    })

    return () => {
      companiesSubscription.unsubscribe();
      apiTypesSubscription.unsubscribe();
    }
  }, []);

  const loadActivePartnerOfferings = useCallback(async () => {
    if (activeCompany) {
      const { data } = await activeCompany.partnerOfferings();
      if (data) {
        setActivePartnerOfferings(data);
      }
    }
  }, [activeCompany]);

  useEffect(() => {
    loadActivePartnerOfferings();
  }, [loadActivePartnerOfferings]);

  const activateSidebar = (
    //    productOffering: Schema["PartnerOffering"]["type"],
    company: Schema["Company"]["type"],
  ) => {
    //    setActivePartnerOffering(productOffering);
    setActiveCompany(company);
    setIsOpen(true);
  }

  return (
    <main>
      <h1>My partnerOfferings</h1>
      <button className="select-none" onClick={async () => {
        await deleteAll();
        await createInitialDataSettings();
      }}>Delete and Restore</button>
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6 mt-14">
          {/*
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
          */}
          {activeCompany ? (
            <div>
              <button className="select-none" onClick={async () => {
                await createPartnerOffering(activeCompany);
                await loadActivePartnerOfferings();
              }}>New Partner Offering</button>
              <div className="text-3xl font-bold">Company: {activeCompany.name}</div>
              <ul>
                {
                  activePartnerOfferings?.map((activePartnerOffering) => (
                    <li>
                      <div>
                        <div className="text-2xl font-bold">
                          {activePartnerOffering.offeringName}
                        </div>
                        <ApiList
                          partnerOffering={activePartnerOffering}
                          apiTypes={apiTypes}
                        />
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>
          ) : (
            "Loading..."
          )}

        </div>
      </Sidebar>
      <ItemGrid>
        {/*
        {partnerOfferings.map((partnerOffering) => (
          <PartnerOfferingTile
            key={partnerOffering.id}
            partnerOffering={partnerOffering}
            onClick={() => activateSidebar(partnerOffering)}
          />
        ))}
        */}
        {companies.map((company) => 
        (
          <CompanyTile
            key={company.id}
            company={company}
            onClick={() => activateSidebar(company)}
          />
        ))}
      </ItemGrid>
    </main>
  );
}

export default UserInterface;
