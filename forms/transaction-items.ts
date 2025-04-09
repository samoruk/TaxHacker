import { z } from "zod"

export const transactionItemFormSchema = z.object({
  name: z.string().min(1, "Item name is required").max(128),
  description: z.string().max(256).optional(),
  subCategory: z.string().max(128).optional(),
  quantity: z
    .string()
    .transform((val) => {
      const num = parseFloat(val)
      if (isNaN(num)) {
        throw new z.ZodError([{ message: "Invalid quantity", path: ["quantity"], code: z.ZodIssueCode.custom }])
      }
      return num
    })
    .default("1"),
  unit: z.string().max(50).optional(),
  unitPrice: z
    .string()
    .transform((val) => {
      const num = parseFloat(val)
      if (isNaN(num)) {
        throw new z.ZodError([{ message: "Invalid unit price", path: ["unitPrice"], code: z.ZodIssueCode.custom }])
      }
      return Math.round(num * 100) // convert to cents
    })
    .optional(),
  total: z
    .string()
    .transform((val) => {
      const num = parseFloat(val)
      if (isNaN(num)) {
        throw new z.ZodError([{ message: "Invalid total", path: ["total"], code: z.ZodIssueCode.custom }])
      }
      return Math.round(num * 100) // convert to cents
    })
    .optional(),
})

export type TransactionItemFormValues = z.infer<typeof transactionItemFormSchema>