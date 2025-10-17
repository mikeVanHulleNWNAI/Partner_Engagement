import { partnerOfferingType } from "./Types";

function PartnerOfferingTile({ partnerOffering, onClick }:
    {
        partnerOffering: partnerOfferingType
        onClick?: () => void
    }) {

    let tileColor = "bg-gray-200";
    if (partnerOffering.priority) {
        switch (partnerOffering.priority.name) {
            case "LOW": tileColor = "bg-gray-200";
                break;
            case "MEDIUM": tileColor = "bg-yellow-200";
                break;
            case "HIGH": tileColor = "bg-red-200";
                break;
        }
    }

    return (
        <div
            className={`${tileColor} rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden select-none ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="m-2">
                {partnerOffering.nwnOffering.name}
                <br/>
                {partnerOffering.company.name}
                <br/>
                {partnerOffering.offeringName}
                <br/>
            </div>
        </div>
    );
}

export default PartnerOfferingTile;
