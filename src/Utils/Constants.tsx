import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

export const CLIENT = generateClient<Schema>();
