import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a PartnerOffering database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "PartnerOffering" records.
=========================================================================*/
const schema = a.schema({
  PartnerOffering: a
    .model({
      statusTypeId: a.id(),
      nwnOfferingId: a.id(),
      companyId: a.id(),
      priorityTypeId: a.id(),
      offeringName: a.string(),
      contactInfo: a.string(),
      dashboard: a.string(),
      notes: a.string(),
      
      // Relationships
      statusType: a.belongsTo('ConnectionStatusType', 'statusTypeId'),
      nwnOffering: a.belongsTo('NwnOffering', 'nwnOfferingId'),
      company: a.belongsTo('Company', 'companyId'),
      priorityType: a.belongsTo('PriorityType', 'priorityTypeId'),
      apis: a.hasMany('Api', 'partnerOfferingId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Manager: a
    .model({
      name: a.string(),
      
      // Relationships
      nwnOfferings: a.hasMany('NwnOffering', 'managerId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  NwnOffering: a
    .model({
      name: a.string(),
      managerId: a.id(),
      
      // Relationships
      manager: a.belongsTo('Manager', 'managerId'),
      partnerOfferings: a.hasMany('PartnerOffering', 'nwnOfferingId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ConnectionStatusType: a
    .model({
      name: a.string(),
      
      // Relationships
      partnerOfferings: a.hasMany('PartnerOffering', 'statusTypeId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Company: a
    .model({
      name: a.string(),
      
      // Relationships
      partnerOfferings: a.hasMany('PartnerOffering', 'companyId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Api: a
    .model({
      partnerOfferingId: a.id(),
      apiTypeId: a.id(),
      docLink: a.string(),
      trainingLink: a.string(),
      sandboxEnvironment: a.string(),
      mcpEnabled: a.string(),
      
      // Relationships
      partnerOffering: a.belongsTo('PartnerOffering', 'partnerOfferingId'),
      apiType: a.belongsTo('ApiType', 'apiTypeId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ApiType: a
    .model({
      name: a.string(),
      
      // Relationships
      apis: a.hasMany('Api', 'apiTypeId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  PriorityType: a
    .model({
      name: a.string(),
      
      // Relationships
      partnerOfferings: a.hasMany('PartnerOffering', 'priorityTypeId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: partnerOfferingss } = await client.models.PartnerOffering.list()

// return <ul>{partnerOfferings.map(partnerOffering => <li key={partnerOffering.id}>{partnerOffering.offeringName}</li>)}</ul>
