import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TransactionItemFormValues } from "@/forms/transaction-items"
import {  formatCurrency } from "@/lib/utils"
import { useState } from "react"


type TransactionItems2Props = {  items?: TransactionItemFormValues[]}

export const TransactionItems2 = ({ items }: TransactionItems2Props) => {
  const [showAddItem, setShowAddItem] = useState(false)

  const currencyCode = "NZD" // Replace with your actual currency code

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        {/* <CardTitle>Items</CardTitle> */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddItem(showAddItem =>!showAddItem)}
          className="flex items-center gap-1"
        >
          {/* <PlusIcon className="h-4 w-4" />  */}
          Show Items
        </Button>
      </CardHeader>
      <CardContent>
        
          
        {showAddItem && items && items.length > 0 ? (
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
              {items?.map((field, index) => (
                <TableRow key={field.name}>
                  <TableCell>
                    <div>
                      <div>{field.name}</div>
                      {field.description && (
                        <div className="text-xs text-gray-500">{field.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{field.subCategory || "-"}</TableCell>
                  <TableCell>{field.quantity}</TableCell>
                  <TableCell>{field.unit || "-"}</TableCell>
                  <TableCell>
                    {field.unitPrice !== undefined
                      ? formatCurrency(field.unitPrice, currencyCode!)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {field.total !== undefined
                      ? formatCurrency(field.total, currencyCode!)
                      : "-"}
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}

        {/* {showAddItem && <ItemForm onSubmit={handleAddItem} onCancel={() => setShowAddItem(false)} currencyCode={currencyCode} />} */}
        
      </CardContent>
      
    </Card>
  )
}
