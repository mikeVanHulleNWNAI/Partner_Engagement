import { partnerOfferingType } from "./Types";

function PartnerOfferingTile({ partnerOffering, onClick, isHighlighted = false }:
    {
        partnerOffering: partnerOfferingType
        isHighlighted?: boolean
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
            className={`${tileColor} rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden select-none ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${isHighlighted ? 'ring-4 ring-blue-500 ring-offset-2' : ''}`}
            onClick={onClick}
        >
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
                        {partnerOffering.nwnOffering?.name}
                    </h3>
                </div>
                
                <div className="border-l-4 border-gray-400 pl-3">
                    <p className="text-lg font-bold text-gray-900">
                        {partnerOffering.company?.name}
                    </p>
                </div>
                
                <div className="pt-2 border-t border-gray-300">
                    <p className="text-sm text-gray-600">
                        {partnerOffering.offeringName}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PartnerOfferingTile;