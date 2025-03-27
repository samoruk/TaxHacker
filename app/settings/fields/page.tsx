import { addFieldAction, deleteFieldAction, editFieldAction } from "@/app/settings/actions"
import { CrudTable } from "@/components/settings/crud"
import { getFields } from "@/models/fields"
import { Prisma } from "@prisma/client"

export default async function FieldsSettingsPage() {
  const fields = await getFields()
  const fieldsWithActions = fields.map((field) => ({
    ...field,
    isEditable: true,
    isDeletable: field.isExtra,
  }))

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-2">Custom Fields</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-prose">
        You can add new fields to your transactions. Standard fields can't be removed but you can tweak their prompts or
        hide them. If you don't want a field to be analyzed by AI but filled in by hand, leave the "LLM prompt" empty.
      </p>
      <CrudTable
        items={fieldsWithActions}
        columns={[
          { key: "name", label: "Name", editable: true },
          {
            key: "type",
            label: "Type",
            type: "select",
            options: ["string", "number", "boolean"],
            defaultValue: "string",
            editable: true,
          },
          { key: "llm_prompt", label: "LLM Prompt", editable: true },
          {
            key: "isVisibleInList",
            label: "Show in transactions table",
            type: "checkbox",
            defaultValue: false,
            editable: true,
          },
          {
            key: "isVisibleInAnalysis",
            label: "Show in analysis form",
            type: "checkbox",
            defaultValue: false,
            editable: true,
          },
        ]}
        onDelete={async (code) => {
          "use server"
          return await deleteFieldAction(code)
        }}
        onAdd={async (data) => {
          "use server"
          return await addFieldAction(data as Prisma.FieldCreateInput)
        }}
        onEdit={async (code, data) => {
          "use server"
          return await editFieldAction(code, data as Prisma.FieldUpdateInput)
        }}
      />
    </div>
  )
}
