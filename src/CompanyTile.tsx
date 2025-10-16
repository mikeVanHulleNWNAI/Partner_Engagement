import type { Schema } from "../amplify/data/resource";

function CompanyTile({ company, onClick }:
    {
        company: Schema["Company"]["type"]
        onClick?: () => void
    }) {

    return (
        <div
            className={`bg-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="m-2 select-none">
                {company.name}
            </div>
        </div>
    );
}

export default CompanyTile;
