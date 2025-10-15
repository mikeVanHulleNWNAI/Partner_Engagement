import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";

function PartnerOfferingTile({ partnerOffering, onClick }:
    {
        partnerOffering: Schema["PartnerOffering"]["type"]
        onClick?: () => void
    }) {

    const [priority, setPriority] = useState<Schema["Priority"]["type"]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPriority() {
            setLoading(true);
            setError(null);
            try {
                const { data, errors } = await partnerOffering.priority();

                if (errors) {
                    setError("Failed to load");
                    console.error(errors);
                } else if (data) {
                    setPriority(data);
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadPriority();
    }, [partnerOffering]);

    if (loading) {
        return <span>Loading...</span>;
    }

    if (error) {
        return <span style={{ color: 'red' }}>{error}</span>;
    }

    let tileColor = "bg-gray-200";
    if (priority) {
        switch (priority.name) {
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
            className={`${tileColor} rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="m-2">
                {partnerOffering.offeringName}
            </div>
        </div>
    );
}

export default PartnerOfferingTile;
