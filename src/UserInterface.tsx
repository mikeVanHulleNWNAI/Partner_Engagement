/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import MockData from './MockData';
import MultiSelect from './MultiSelect';

// Types based on schema
interface Manager {
  manager_id: number;
  name: string;
}

interface ConnectionStatusType {
  status_type_id: number;
  name: string;
}

interface PriorityType {
  priority_type_id: number;
  name: string;
}

interface Company {
  company_id: number;
  name: string;
}

interface ApiType {
  api_type_id: number;
  name: string;
}

interface NwnOffering {
  nwn_offering_id: number;
  name: string;
  manager_id: number;
  manager?: Manager;
}

interface PartnerOffering {
  partner_offering_id: number;
  status_type_id: number;
  nwn_offering_id: number;
  company_id: number;
  contact_info?: string;
  dashboard?: string;
  api_doc_links?: string;
  training_links?: string;
  sandbox_environment?: string;
  mcp_enabled: boolean;
  priority_type_id?: number;
  created_date: string;
  modified_date: string;
  status?: ConnectionStatusType;
  nwn_offering?: NwnOffering;
  company?: Company;
  priority?: PriorityType;
  api_types?: ApiType[];
  apiTypeIds: number[];
}

// Mock GraphQL queries/mutations (in real app, use Apollo Client or similar)
const mockGraphQL = {
  query: async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (query.includes('getPartnerOfferings')) {
      return {
        data: {
          partnerOfferings: MockData.partnerOfferings.map(po => ({
            ...po,
            status: MockData.statuses.find(s => s.status_type_id === po.status_type_id),
            nwn_offering: MockData.nwnOfferings.find(n => n.nwn_offering_id === po.nwn_offering_id),
            company: MockData.companies.find(c => c.company_id === po.company_id),
            priority: MockData.priorities.find(p => p.priority_type_id === po.priority_type_id),
            api_types: MockData.apiTypes.filter(at => {
              return po.apiTypeIds?.find((id) => id === at.api_type_id) !== undefined;
            }),
            apiTypeIds: po.apiTypeIds
          }))
        }
      };
    }
    
    if (query.includes('getLookupData')) {
      return {
        data: {
          managers: MockData.managers,
          statuses: MockData.statuses,
          priorities: MockData.priorities,
          companies: MockData.companies,
          apiTypes: MockData.apiTypes,
          nwnOfferings: MockData.nwnOfferings
        }
      };
    }
    
    return { data: {} };
  },
  
  mutate: async (mutation: string, variables: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (mutation.includes('createPartnerOffering')) {
      const newOffering: PartnerOffering = {
        partner_offering_id: MockData.partnerOfferings.length + 1,
        ...variables.input,
        created_date: new Date().toISOString(),
        modified_date: new Date().toISOString()
      };
      if (newOffering.contact_info !== undefined)
        MockData.partnerOfferings.push(newOffering as any);
      return { data: { createPartnerOffering: newOffering } };
    }
    
    if (mutation.includes('updatePartnerOffering')) {
      const idx = MockData.partnerOfferings.findIndex(
        po => po.partner_offering_id === variables.id
      );
      if (idx >= 0) {
        MockData.partnerOfferings[idx] = {
          ...MockData.partnerOfferings[idx],
          ...variables.input,
          modified_date: new Date().toISOString()
        };
      }
      return { data: { updatePartnerOffering: MockData.partnerOfferings[idx] } };
    }
    
    if (mutation.includes('deletePartnerOffering')) {
      MockData.partnerOfferings = MockData.partnerOfferings.filter(
        po => po.partner_offering_id !== variables.id
      );
      return { data: { deletePartnerOffering: true } };
    }
    
    return { data: {} };
  }
};

const UserInterface: React.FC = () => {
  const [offerings, setOfferings] = useState<PartnerOffering[]>([]);
  const [lookupData, setLookupData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffering, setEditingOffering] = useState<PartnerOffering | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<number | null>(null);
  const [filterPriority, setFilterPriority] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [offeringsRes, lookupsRes] = await Promise.all([
      mockGraphQL.query('getPartnerOfferings'),
      mockGraphQL.query('getLookupData')
    ]);
    setOfferings(offeringsRes.data.partnerOfferings!);
    setLookupData(lookupsRes.data);
    setLoading(false);
  };

  const handleSave = async (formData: Partial<PartnerOffering>) => {
    if (editingOffering) {
      await mockGraphQL.mutate('updatePartnerOffering', {
        id: editingOffering.partner_offering_id,
        input: formData
      });
    } else {
      await mockGraphQL.mutate('createPartnerOffering', { input: formData });
    }
    await loadData();
    setShowForm(false);
    setEditingOffering(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this offering?')) {
      await mockGraphQL.mutate('deletePartnerOffering', { id });
      await loadData();
    }
  };

  const handleEdit = (offering: PartnerOffering) => {
    setEditingOffering(offering);
    setShowForm(true);
  };

  const filteredOfferings = offerings.filter(o => {
    const matchesSearch = !searchTerm || 
      o.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.nwn_offering?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || o.status_type_id === filterStatus;
    const matchesPriority = !filterPriority || o.priority_type_id === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-20">
        <header className="mb-8">
          <p className="text-gray-600">Manage partner offerings and API integrations</p>
        </header>

        {!showForm ? (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-64">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by company or offering..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus || ''}
                    onChange={(e) => setFilterStatus(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    {lookupData.statuses?.map((s: ConnectionStatusType) => (
                      <option key={s.status_type_id} value={s.status_type_id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={filterPriority || ''}
                    onChange={(e) => setFilterPriority(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Priorities</option>
                    {lookupData.priorities?.map((p: PriorityType) => (
                      <option key={p.priority_type_id} value={p.priority_type_id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => { setShowForm(true); setEditingOffering(null); }}
                  className="px-4 py-2 bg-blue-600 text-gray-700 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Offering
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredOfferings.map((offering) => (
                <div key={offering.partner_offering_id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-semibold text-gray-900">{offering.company?.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          offering.status?.name === 'Active' ? 'bg-green-100 text-green-800' :
                          offering.status?.name === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          offering.status?.name === 'In Development' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {offering.status?.name}
                        </span>
                        {offering.priority && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            offering.priority.name === 'High' ? 'bg-red-100 text-red-800' :
                            offering.priority.name === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {offering.priority.name} Priority
                          </span>
                        )}
                        {offering.mcp_enabled && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            MCP Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-1">NWN Offering: {offering.nwn_offering?.name}</p>
                      {offering.contact_info && (
                        <p className="text-sm text-gray-500">Contact: {offering.contact_info}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(offering)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(offering.partner_offering_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {offering.api_types && offering.api_types.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">API Types: </span>
                      <span className="text-sm text-gray-600">{offering.api_types.map(at => at.name).join(', ')}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {offering.dashboard && (
                      <div>
                        <span className="font-medium text-gray-700">Dashboard:</span>
                        <a href={offering.dashboard} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline break-all">
                          {offering.dashboard}
                        </a>
                      </div>
                    )}
                    {offering.api_doc_links && (
                      <div>
                        <span className="font-medium text-gray-700">API Docs:</span>
                        <a href={offering.api_doc_links} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline break-all">
                          {offering.api_doc_links}
                        </a>
                      </div>
                    )}
                    {offering.training_links && (
                      <div>
                        <span className="font-medium text-gray-700">Training:</span>
                        <a href={offering.training_links} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline break-all">
                          {offering.training_links}
                        </a>
                      </div>
                    )}
                    {offering.sandbox_environment && (
                      <div>
                        <span className="font-medium text-gray-700">Sandbox:</span>
                        <a href={offering.sandbox_environment} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline break-all">
                          {offering.sandbox_environment}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                    <span>Created: {new Date(offering.created_date).toLocaleDateString()}</span>
                    <span className="ml-4">Modified: {new Date(offering.modified_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}

              {filteredOfferings.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-500">No offerings found. Try adjusting your filters or add a new offering.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <OfferingForm
            offering={editingOffering}
            lookupData={lookupData}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingOffering(null); }}
          />
        )}
      </div>
    </div>
  );
};

interface OfferingFormProps {
  offering: PartnerOffering | null;
  lookupData: any;
  onSave: (data: Partial<PartnerOffering>) => void;
  onCancel: () => void;
}

const OfferingForm: React.FC<OfferingFormProps> = ({ offering, lookupData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<PartnerOffering>>({
    status_type_id: offering?.status_type_id || lookupData.statuses[0]?.status_type_id,
    nwn_offering_id: offering?.nwn_offering_id || lookupData.nwnOfferings[0]?.nwn_offering_id,
    company_id: offering?.company_id || lookupData.companies[0]?.company_id,
    contact_info: offering?.contact_info || '',
    dashboard: offering?.dashboard || '',
    api_doc_links: offering?.api_doc_links || '',
    training_links: offering?.training_links || '',
    sandbox_environment: offering?.sandbox_environment || '',
    mcp_enabled: offering?.mcp_enabled || false,
    priority_type_id: offering?.priority_type_id || undefined,
    apiTypeIds: offering?.apiTypeIds
  });

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {offering ? 'Edit Offering' : 'New Offering'}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
            <select
              value={formData.company_id}
              onChange={(e) => setFormData({ ...formData, company_id: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {lookupData.companies?.map((c: Company) => (
                <option key={c.company_id} value={c.company_id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NWN Offering *</label>
            <select
              value={formData.nwn_offering_id}
              onChange={(e) => setFormData({ ...formData, nwn_offering_id: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {lookupData.nwnOfferings?.map((n: NwnOffering) => (
                <option key={n.nwn_offering_id} value={n.nwn_offering_id}>{n.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <select
              value={formData.status_type_id}
              onChange={(e) => setFormData({ ...formData, status_type_id: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {lookupData.statuses?.map((s: ConnectionStatusType) => (
                <option key={s.status_type_id} value={s.status_type_id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority_type_id || ''}
              onChange={(e) => setFormData({ ...formData, priority_type_id: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">None</option>
              {lookupData.priorities?.map((p: PriorityType) => (
                <option key={p.priority_type_id} value={p.priority_type_id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">API Type</label>
            {/* 9879 Need to add code to the MultiSelect that allows it to change the database. */}
            <MultiSelect 
              options={MockData.apiTypes.map((x) => x.name)}
              selectedOptions={
                MockData.apiTypes.filter((value) => 
                  {
                    return formData.apiTypeIds?.find((id) => id === value.api_type_id) !== undefined
                  })
                  .map((x) => x.name)
              }
              onChange={(e) => setFormData({
                ...formData, 
                apiTypeIds: e.map((value) => MockData.apiTypes.find((x) => x.name === value)?.api_type_id) as number[]
              })}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
            <input
              type="text"
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard URL</label>
            <input
              type="url"
              value={formData.dashboard}
              onChange={(e) => setFormData({ ...formData, dashboard: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://dashboard.example.com"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">API Documentation Links</label>
            <input
              type="url"
              value={formData.api_doc_links}
              onChange={(e) => setFormData({ ...formData, api_doc_links: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://docs.example.com/api"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Training Links</label>
            <input
              type="url"
              value={formData.training_links}
              onChange={(e) => setFormData({ ...formData, training_links: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://training.example.com"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sandbox Environment</label>
            <input
              type="url"
              value={formData.sandbox_environment}
              onChange={(e) => setFormData({ ...formData, sandbox_environment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://sandbox.example.com"
            />
          </div>

          <div className="col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.mcp_enabled}
                onChange={(e) => setFormData({ ...formData, mcp_enabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">MCP Enabled</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-gray-700 rounded-lg hover:bg-blue-700"
          >
            {offering ? 'Update' : 'Create'} Offering
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInterface;