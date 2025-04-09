import { prisma } from "@/lib/db"
import { TransactionItem } from "@prisma/client"

export type TransactionItemData = {
  name: string
  description?: string
  subCategory?: string
  quantity?: number
  unit?: string
  unitPrice?: number
  total?: number
}

export const getTransactionItems = async (transactionId: string): Promise<TransactionItem[]> => {
  return await prisma.transactionItem.findMany({
    where: { transactionId },
    orderBy: { createdAt: "asc" },
  })
}

export const createTransactionItem = async (
  transactionId: string,
  data: TransactionItemData
): Promise<TransactionItem> => {
  return await prisma.transactionItem.create({
    data: {
      ...data,
      transaction: { connect: { id: transactionId } },
    },
  })
}

export const updateTransactionItem = async (
  id: string,
  data: Partial<TransactionItemData>
): Promise<TransactionItem> => {
  return await prisma.transactionItem.update({
    where: { id },
    data,
  })
}

export const deleteTransactionItem = async (id: string): Promise<TransactionItem> => {
  return await prisma.transactionItem.delete({
    where: { id },
  })
}

export const deleteTransactionItems = async (transactionId: string): Promise<number> => {
  const result = await prisma.transactionItem.deleteMany({
    where: { transactionId },
  })
  return result.count
}
