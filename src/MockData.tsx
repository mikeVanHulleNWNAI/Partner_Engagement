// Mock data
const MockData = {
  managers: [
    { manager_id: 1, name: 'Kevin Basden' },
    { manager_id: 2, name: 'Brian Fichter' },
    { manager_id: 3, name: 'Austin Rose' }
  ],
  statuses: [
    { status_type_id: 1, name: 'Connected' },
    { status_type_id: 2, name: 'In Process' },
    { status_type_id: 3, name: 'Upcomming' },
    { status_type_id: 4, name: 'Meeting Scheduled' }
  ],
  priorities: [
    { priority_type_id: 1, name: 'High' },
    { priority_type_id: 2, name: 'Medium' },
    { priority_type_id: 3, name: 'Low' }
  ],
  companies: [
    { company_id: 1, name: 'Genysis' },
    { company_id: 2, name: 'Five9\'s' },
    { company_id: 3, name: 'Verkada' },
    { company_id: 4, name: 'AmpexaiQ' },
    { company_id: 5, name: 'Microsoft' },
    { company_id: 6, name: 'Nectar' },
    { company_id: 7, name: 'Amazon' }
  ],
  apiTypes: [
    { api_type_id: 1, name: 'REST' },
    { api_type_id: 2, name: 'GraphQL' },
    { api_type_id: 3, name: 'SOAP' },
    { api_type_id: 4, name: 'WebSocket' },
    { api_type_id: 5, name: 'MCP' }
  ],
  nwnOfferings: [
    { nwn_offering_id: 1, name: 'Intelligent Cloud', manager_id: 3 },
    { nwn_offering_id: 2, name: 'Visual Collaboration', manager_id: 2 },
    { nwn_offering_id: 3, name: 'Customer Experience', manager_id: 1 }
  ],
  partnerOfferings: [
    {
      partner_offering_id: 1,
      status_type_id: 1,
      nwn_offering_id: 3,
      company_id: 1,
      contact_info: '',
      dashboard: 'nwn-demo.command.verkada.com',
      api_doc_links: 'https://all.docs.genesys.com/Developer/APIbyService',
      training_links: 'https://beyond.genesys.com/explore/',
      sandbox_environment: '"{""Environment"":""Sandbox"...',
      mcp_enabled: true,
      priority_type_id: 3,
      apiTypeIds: [
        1
      ],
      created_date: '2024-01-15T10:00:00',
      modified_date: '2024-10-01T15:30:00'
    },
    {
      partner_offering_id: 2,
      status_type_id: 2,
      nwn_offering_id: 3,
      company_id: 2,
      contact_info: 'Brian Norton <brian.norton@five9.com>',
      dashboard: 'https://login.five9.com/and; https://admin.us.five9.net/.',
      api_doc_links: 'https://documentation.five9.com/category/dev',
      training_links: 'https://www.five9.com/contact-center-services/training',
      sandbox_environment: '"{""Client ID"": ""122g33Y5tsTYjrGQpHVlCdUMjNxIsWfD',
      mcp_enabled: false,
      priority_type_id: 1,
      apiTypeIds: [
        1
      ],
      created_date: '2024-02-20T14:00:00',
      modified_date: '2024-09-15T09:15:00'
    }
  ]
};

export default MockData;