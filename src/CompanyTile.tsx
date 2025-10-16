import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";

function CompanyTile({ company, onClick }:
    {
        company: Schema["Company"]["type"]
        onClick?: () => void
    }) {

    const [partnerOfferings, setPartnerOfferings] = useState<Array<Schema["PartnerOffering"]["type"]>>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (company) {
                await company.partnerOfferings();
                const { data } = await company.partnerOfferings();
                if (data) {
                    setPartnerOfferings(data);
                }
            }
        }

        fetchData();
    }, [company]);

    const hasOffering = partnerOfferings.length > 0;
    const offeringLength = partnerOfferings.length;

    return (
        <div
            className={`bg-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden select-none h-32 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className={`${hasOffering ? "text-green-600 " : ""}m-2 h-full flex flex-col justify-between pb-2`}>
                <div>{company.name}</div>
                {hasOffering && (
                    <div className="text-green-600">
                        {offeringLength}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CompanyTile;
