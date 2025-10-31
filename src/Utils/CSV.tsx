import Papa from 'papaparse';
import { partnerOfferingType } from '../Types';

type CSVRow = {
    id: string;
    offeringName: string;
    contactInfo: string;
    dashboard: string;
    notes: string;
    status: string;
    nwnOffering: string;
    nwnOfferingManager: string;
    company: string;
    priority: string;
    apiDocLink: string;
    apiTrainingLink: string;
    apiSandboxEnvironment: string;
    apiEndpoint: string;
    apiType: string;
    authenticationType: string;
    authenticationInfo: string;
}

/**
 * Flattens partner offerings into CSV rows
 * If an offering has multiple APIs, it creates multiple rows
 */
function flattenToCSVRows(offerings: partnerOfferingType[]): CSVRow[] {
    const rows: CSVRow[] = [];
    
    for (const offering of offerings) {
        if (offering.apis.length === 0) {
            // No APIs - create one row with empty API fields
            rows.push({
                id: offering.id,
                offeringName: offering.offeringName,
                contactInfo: offering.contactInfo,
                dashboard: offering.dashboard,
                notes: offering.notes,
                status: offering.status.name,
                nwnOffering: offering.nwnOffering.name,
                nwnOfferingManager: offering.nwnOffering.manager.name,
                company: offering.company.name,
                priority: offering.priority.name,
                apiDocLink: '',
                apiTrainingLink: '',
                apiSandboxEnvironment: '',
                apiEndpoint: '',
                apiType: '',
                authenticationType: '',
                authenticationInfo: ''
            });
        } else {
            // Create a row for each API
            for (const api of offering.apis) {
                rows.push({
                    id: offering.id,
                    offeringName: offering.offeringName,
                    contactInfo: offering.contactInfo,
                    dashboard: offering.dashboard,
                    notes: offering.notes,
                    status: offering.status.name,
                    nwnOffering: offering.nwnOffering.name,
                    nwnOfferingManager: offering.nwnOffering.manager.name,
                    company: offering.company.name,
                    priority: offering.priority.name,
                    apiDocLink: api.docLink,
                    apiTrainingLink: api.trainingLink,
                    apiSandboxEnvironment: api.sandboxEnvironment,
                    apiEndpoint: api.endpoint,
                    apiType: api.apiType.name,
                    authenticationType: api.authenticationType.name,
                    authenticationInfo: api.authenticationInfo
                });
            }
        }
    }
    
    return rows;
}

/**
 * Downloads partner offerings as a CSV file
 */
export function downloadCSV(offerings: partnerOfferingType[], filename: string = 'partner-offerings.csv'): void {
    const rows = flattenToCSVRows(offerings);
    const csv = Papa.unparse(rows);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

/**
 * Groups CSV rows back into partner offerings
 * Rows with the same id are combined into one offering with multiple APIs
 */
function groupCSVRows(rows: CSVRow[]): partnerOfferingType[] {
    const grouped = new Map<string, partnerOfferingType>();
    
    for (const row of rows) {
        const key = row.id?.trim();
        if (!key) continue;
        
        if (!grouped.has(key)) {
            grouped.set(key, {
                id: row.id,
                offeringName: row.offeringName,
                contactInfo: row.contactInfo,
                dashboard: row.dashboard,
                notes: row.notes,
                status: { id: '', name: row.status },
                nwnOffering: {
                    id: '',
                    name: row.nwnOffering,
                    manager: { id: '', name: row.nwnOfferingManager }
                },
                company: { id: '', name: row.company },
                priority: { id: '', name: row.priority },
                apis: []
            });
        }
        
        const offering = grouped.get(key)!;
        
        // Add API if there's any API data
        if (row.apiEndpoint || row.apiDocLink) {
            offering.apis!.push({
                id: '',
                docLink: row.apiDocLink || '',
                trainingLink: row.apiTrainingLink || '',
                sandboxEnvironment: row.apiSandboxEnvironment || '',
                endpoint: row.apiEndpoint || '',
                apiType: { id: '', name: row.apiType || '' },
                authenticationType: { id: '', name: row.authenticationType || '' },
                authenticationInfo: row.authenticationInfo || ''
            });
        }
    }
    
    return Array.from(grouped.values());
}

/**
 * Parses a CSV file and returns partner offerings
 * The offering ID is preserved from the CSV, but nested IDs remain empty strings
 */
export function uploadCSV(file: File): Promise<partnerOfferingType[]> {
    return new Promise((resolve, reject) => {
        Papa.parse<CSVRow>(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header: string): string => header.trim(),
            complete: (results: Papa.ParseResult<CSVRow>): void => {
                if (results.errors.length > 0) {
                    console.error('CSV parsing errors:', results.errors);
                }
                
                const offerings = groupCSVRows(results.data);
                resolve(offerings);
            },
            error: (error: Error): void => {
                reject(error);
            }
        });
    });
}

/**
 * Parses CSV from a string and returns partner offerings
 */
export function parseCSVString(csvString: string): partnerOfferingType[] {
    const results = Papa.parse<CSVRow>(csvString, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string): string => header.trim()
    });
    
    if (results.errors.length > 0) {
        console.error('CSV parsing errors:', results.errors);
    }
    
    return groupCSVRows(results.data);
}

/**
 * Example usage for file input element
 */
export function handleFileUpload(event: Event): Promise<partnerOfferingType[]> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) {
        return Promise.reject(new Error('No file selected'));
    }
    
    return uploadCSV(file);
}