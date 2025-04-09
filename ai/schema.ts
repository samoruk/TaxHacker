import { Field } from "@prisma/client"

const transactionItems = {
  type: "array",
  description: "",
  items: {
      type: "object",
      properties: {
          name: { type: "string" },
          // description: { type: "string" },
          // subCategory: { type: "string" },
          // quantity: { type: "number" },          
          // unit: { type: "string" },
          // unitPrice: { type: "number" },
          total: { type: "number" },
  
      },
      required: ["name", "total"],
      additionalProperties: false,
     // description: "Array of transaction items",
  }
}

export const fieldsToJsonSchema = (fields: Field[]) => {
  const fieldsWithPrompt = fields.filter((field) => field.llm_prompt)
  const schema = {
    type: "object",
    properties: fieldsWithPrompt.reduce((acc, field) => {
      acc[field.code] = { type: field.type, description: field.llm_prompt || "" }
      return acc
    }, {} as Record<string, { type: string; description: string }>),
    required: fieldsWithPrompt.map((field) => field.code),
    additionalProperties: false,
  }

  const desc = schema.properties["items"].description
  transactionItems.description = desc

  delete schema.properties["items"]

  schema.properties["items"] = transactionItems
  // schema.required.pop()
  // schema.required.push("transactionitems")
  return schema
}
