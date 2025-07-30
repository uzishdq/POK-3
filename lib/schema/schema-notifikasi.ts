import * as z from "zod";
import { validatedStringSchema } from "./schema-helper";

export const BulkNotifFormSchema = z.object({
  title: validatedStringSchema(5, 50),
  text: validatedStringSchema(5, 500),
});
