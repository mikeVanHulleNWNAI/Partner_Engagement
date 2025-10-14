import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a PartnerOffering database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "PartnerOffering" records.
=========================================================================*/
const schema = a.schema({
  Manager: a
    .model({
      name: a.string().required(),
      nwnOfferings: a.hasMany('NwnOffering', 'managerId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  NwnOffering: a
    .model({
      name: a.string().required(),
      managerId: a.id(),
      manager: a.belongsTo('Manager', 'managerId'),
      partnerOfferings: a.hasMany('PartnerOffering', 'nwnOfferingId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  PartnerOffering: a
    .model({
      offeringName: a.string().required(),
      contactInfo: a.string().required(),
      dashboard: a.string().required(),
      notes: a.string().required(),
      statusId: a.id(),
      status: a.belongsTo('ConnectionStatus', 'statusId'),
      nwnOfferingId: a.id(),
      nwnOffering: a.belongsTo('NwnOffering', 'nwnOfferingId'),
      companyId: a.id(),
      company: a.belongsTo('Company', 'companyId'),
      priorityId: a.id(),
      priority: a.belongsTo('Priority', 'priorityId'),
      apis: a.hasMany('Api', 'partnerOfferingId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ConnectionStatus: a
    .model({
      name: a.string().required(),
      partnerOfferings: a.hasMany('PartnerOffering', 'statusId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Company: a
    .model({
      name: a.string().required(),
      partnerOfferings: a.hasMany('PartnerOffering', 'companyId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Priority: a
    .model({
      name: a.string().required(),
      partnerOfferings: a.hasMany('PartnerOffering', 'priorityId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Api: a
    .model({
      docLink: a.string().required(),
      trainingLink: a.string().required(),
      sandboxEnvironment: a.string().required(),
      endpoint: a.string().required(),
      partnerOfferingId: a.id(),
      partnerOffering: a.belongsTo('PartnerOffering', 'partnerOfferingId'),
      apiTypeId: a.id(),
      apiType: a.belongsTo('ApiType', 'apiTypeId'),
      authenticationTypeId: a.id().required(),
      authenticationType: a.belongsTo('AuthenticationType', 'authenticationTypeId'),
      authenticationInfo: a.string().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ApiType: a
    .model({
      name: a.string().required(),
      apis: a.hasMany('Api', 'apiTypeId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  AuthenticationType: a
    .model({
      name: a.string().required(),
      apis: a.hasMany('Api', 'authenticationTypeId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
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
