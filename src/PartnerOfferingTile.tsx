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

    // Map Tailwind classes to actual color values
    const colorMap: { [key: string]: string } = {
        "bg-gray-200": "#f3f4f6",
        "bg-yellow-200": "#fef9c3",
        "bg-red-200": "#fee2e2"
    };

    return (
        <div
            className={`${tileColor} rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden select-none ${onClick ? 'cursor-pointer' : ''} ${isHighlighted ? 'ring-4 ring-blue-500 ring-offset-2' : ''}`}
            onClick={onClick}
        >
            <div className="m-2">
                <ul style={{ backgroundColor: 'black' }}>
                    <li style={{ backgroundColor: colorMap[tileColor] }}>
                        {partnerOffering.nwnOffering?.name}
                    </li>
                    <li style={{ backgroundColor: colorMap[tileColor] }}>
                        {partnerOffering.company?.name}
                    </li>
                    <li style={{ backgroundColor: colorMap[tileColor] }}>
                        {partnerOffering.offeringName}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default PartnerOfferingTile;