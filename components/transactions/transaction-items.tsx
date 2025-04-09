import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { TransactionItemFormValues, transactionItemFormSchema } from "@/forms/transaction-items"
import { formatAmount, formatCurrency } from "@/lib/utils"
//import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useFieldArray, useFormContext, useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

export const TransactionItems = ({ currencyCode }: { currencyCode?: string }) => {
  const [showAddItem, setShowAddItem] = useState(false)
  const { control, handleSubmit, watch} = useForm()
  const onSubmit = (data:any) => console.log(data)
  //const { register, reset } = methods

   //const form = useFormContext()

   //console.log(form)
  
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control
//    control: form.control,
  })

  const handleAddItem = (data: TransactionItemFormValues) => {
    append(data)
    setShowAddItem(false)
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Items</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddItem(true)}
          className="flex items-center gap-1"
        >
          {/* <PlusIcon className="h-4 w-4" />  */}
          Add Item
        </Button>
      </CardHeader>
      <CardContent>
        
          <form onSubmit={handleSubmit(onSubmit)}>
            <ItemForm onSubmit={handleAddItem} onCancel={() => setShowAddItem(false)} currencyCode={currencyCode} />
          </form>
        {fields.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Sub-category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <div>
                      <div>{watch(`items.${index}.name`)}</div>
                      {watch(`items.${index}.description`) && (
                        <div className="text-xs text-gray-500">{watch(`items.${index}.description`)}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{watch(`items.${index}.subCategory`) || "-"}</TableCell>
                  <TableCell>{watch(`items.${index}.quantity`)}</TableCell>
                  <TableCell>{watch(`items.${index}.unit`) || "-"}</TableCell>
                  <TableCell>
                    {watch(`items.${index}.unitPrice`) !== undefined
                      ? formatCurrency(watch(`items.${index}.unitPrice`), currencyCode!)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {watch(`items.${index}.total`) !== undefined
                      ? formatCurrency(watch(`items.${index}.total`), currencyCode!)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="flex h-8 w-8 p-0"
                    >
                      {/* <TrashIcon className="h-4 w-4" /> */}
                      remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-gray-500 py-6">No items added</div>
        )}

        {/* {showAddItem && <ItemForm onSubmit={handleAddItem} onCancel={() => setShowAddItem(false)} currencyCode={currencyCode} />} */}
        
      </CardContent>
      
    </Card>
  )
}

interface ItemFormProps {
  onSubmit: (data: TransactionItemFormValues) => void
  onCancel: () => void
  currencyCode?: string
}

const ItemForm = ({ onSubmit, onCancel, currencyCode }: ItemFormProps) => {
  const [formData, setFormData] = useState<Partial<TransactionItemFormValues>>({
    name: "",
    quantity: "1",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const validatedData = transactionItemFormSchema.parse(formData)
      onSubmit(validatedData)
    } catch (error) {
      console.error("Validation error:", error)
    }
  }

  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity || "1")
    const unitPrice = parseFloat(formData.unitPrice || "0")
    
    if (!isNaN(quantity) && !isNaN(unitPrice)) {
      return (quantity * unitPrice).toFixed(2)
    }
    return ""
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-md mt-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subCategory">Sub-category</Label>
          <Input id="subCategory" name="subCategory" value={formData.subCategory || ""} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description || ""} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity" 
              name="quantity" 
              type="number" 
              step="0.01" 
              min="0.01" 
              value={formData.quantity || "1"} 
              onChange={handleChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" name="unit" value={formData.unit || ""} onChange={handleChange} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitPrice">Unit Price ({currencyCode || ""})</Label>
          <Input 
            id="unitPrice" 
            name="unitPrice" 
            type="number" 
            step="0.01" 
            min="0"
            value={formData.unitPrice || ""} 
            onChange={(e) => {
              handleChange(e)
              // Auto-calculate total if quantity exists
              if (formData.quantity) {
                setFormData(prev => ({ 
                  ...prev, 
                  total: calculateTotal() 
                }))
              }
            }} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total">Total ({currencyCode || ""})</Label>
          <Input 
            id="total" 
            name="total" 
            type="number" 
            step="0.01" 
            min="0"
            value={formData.total || ""} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Item
        </Button>
      </div>
    </form>
  )
}