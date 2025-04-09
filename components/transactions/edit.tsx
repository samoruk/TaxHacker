"use client"

import { deleteTransactionAction, saveTransactionAction } from "@/app/(app)/transactions/actions"
import { FormError } from "@/components/forms/error"
import { FormSelectCategory } from "@/components/forms/select-category"
import { FormSelectCurrency } from "@/components/forms/select-currency"
import { FormSelectProject } from "@/components/forms/select-project"
import { FormSelectType } from "@/components/forms/select-type"
import { FormInput, FormTextarea } from "@/components/forms/simple"
import { TransactionItems } from "./transaction-items"
import { Button } from "@/components/ui/button"
import { Category, Currency, Field, Project, Transaction } from "@prisma/client"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition, useActionState, useEffect, useMemo, useState } from "react"
import { TransactionItems2 } from "./transaction-items-table"
import { TransactionItemFormValues } from "@/forms/transaction-items"

export default function TransactionEditForm({
  transaction,
  categories,
  projects,
  currencies,
  fields,
  settings,
}: {
  transaction: Transaction
  categories: Category[]
  projects: Project[]
  currencies: Currency[]
  fields: Field[]
  settings: Record<string, string>
}) {
  const router = useRouter()
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteTransactionAction, null)
  const [saveState, saveAction, isSaving] = useActionState(saveTransactionAction, null)

  const extraFields = fields.filter((field) => field.isExtra)// && field.code != "items")
  
  const [formData, setFormData] = useState({
    name: transaction.name || "",
    merchant: transaction.merchant || "",
    description: transaction.description || "",
    total: transaction.total ? transaction.total / 100 : 0.0,
    currencyCode: transaction.currencyCode || settings.default_currency,
    convertedTotal: transaction.convertedTotal ? transaction.convertedTotal / 100 : 0.0,
    convertedCurrencyCode: transaction.convertedCurrencyCode,
    type: transaction.type || "expense",
    categoryCode: transaction.categoryCode || settings.default_category,
    projectCode: transaction.projectCode || settings.default_project,
    issuedAt: transaction.issuedAt ? format(transaction.issuedAt, "yyyy-MM-dd") : "",
    note: transaction.note || "",
    //items: transaction.extra?.["items"] || [],
    ...extraFields.reduce((acc, field) => {
      acc[field.code] = transaction.extra?.[field.code as keyof typeof transaction.extra] || ""
      return acc
    }, {} as Record<string, any>),
  })

  const fieldMap = useMemo(() => {
    return fields.reduce(
      (acc, field) => {
        acc[field.code] = field
        return acc
      },
      {} as Record<string, Field>
    )
  }, [fields])

  const handleDelete = async () => {
    if (confirm("Are you sure? This will delete the transaction with all the files permanently")) {
      startTransition(async () => {
        await deleteAction(transaction.id)
        router.back()
      })
    }
  }

  useEffect(() => {
    if (saveState?.success) {
      router.back()
    }
  }, [saveState, router])

  return (
    <form action={saveAction} className="space-y-4">
      <input type="hidden" name="transactionId" value={transaction.id} />

      <FormInput title={fieldMap.name.name} name="name" defaultValue={formData.name} />

      <FormInput title={fieldMap.merchant.name} name="merchant" defaultValue={formData.merchant} />

      <FormInput title={fieldMap.description.name} name="description" defaultValue={formData.description} />

      <div className="flex flex-row gap-4">
        <FormInput
          title={fieldMap.total.name}
          type="number"
          step="0.01"
          name="total"
          defaultValue={formData.total.toFixed(2)}
          className="w-32"
        />

        <FormSelectCurrency
          title={fieldMap.currencyCode.name}
          name="currencyCode"
          value={formData.currencyCode}
          onValueChange={(value) => {
            setFormData({ ...formData, currencyCode: value })
          }}
          currencies={currencies}
        />

        <FormSelectType title={fieldMap.type.name} name="type" defaultValue={formData.type} />
      </div>

      {formData.currencyCode !== settings.default_currency || formData.convertedTotal !== 0 ? (
        <div className="flex flex-row gap-4">
          <FormInput
            title={`Total converted to ${formData.convertedCurrencyCode || "UNKNOWN CURRENCY"}`}
            type="number"
            step="0.01"
            name="convertedTotal"
            defaultValue={formData.convertedTotal.toFixed(2)}
          />
          {(!formData.convertedCurrencyCode || formData.convertedCurrencyCode !== settings.default_currency) && (
            <FormSelectCurrency
              title="Convert to"
              name="convertedCurrencyCode"
              defaultValue={formData.convertedCurrencyCode || settings.default_currency}
              currencies={currencies}
            />
          )}
        </div>
      ) : (
        <></>
      )}

      <div className="flex flex-row flex-grow gap-4">
        <FormInput title={fieldMap.issuedAt.name} type="date" name="issuedAt" defaultValue={formData.issuedAt} />
      </div>

      <div className="flex flex-row gap-4">
        <FormSelectCategory
          title={fieldMap.categoryCode.name}
          categories={categories}
          name="categoryCode"
          defaultValue={formData.categoryCode}
        />

        <FormSelectProject
          title={fieldMap.projectCode.name}
          projects={projects}
          name="projectCode"
          defaultValue={formData.projectCode}
        />
      </div>

      <FormTextarea title={fieldMap.note.name} name="note" defaultValue={formData.note} className="h-24" />
      {extraFields.map((field) => (
        field.code != "items" ?
        <FormInput
          key={field.code}
          type="text"
          title={field.name}
          name={field.code}
          defaultValue={formData[field.code as keyof typeof formData] || ""}
        />
        : <TransactionItems2
            items={formData[field.code as keyof typeof formData] as unknown as TransactionItemFormValues[]}
          />
      ))}

      <div className="flex justify-between space-x-4 pt-6">
        <Button type="button" onClick={handleDelete} variant="destructive" disabled={isDeleting}>
          {isDeleting ? "⏳ Deleting..." : "Delete "}
        </Button>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Transaction"
          )}
        </Button>

        {deleteState?.error && <FormError>⚠️ {deleteState.error}</FormError>}
        {saveState?.error && <FormError>⚠️ {saveState.error}</FormError>}
      </div>
    </form>
  )
}
