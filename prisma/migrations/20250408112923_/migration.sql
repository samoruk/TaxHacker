/*
  Warnings:

  - You are about to drop the `transaction_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transaction_items" DROP CONSTRAINT "transaction_items_transaction_id_fkey";

-- DropTable
DROP TABLE "transaction_items";

-- CreateTable
CREATE TABLE "transactionitems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sub_category" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unit" TEXT,
    "unit_price" INTEGER,
    "total" INTEGER,
    "transaction_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactionitems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transactionitems_transaction_id_idx" ON "transactionitems"("transaction_id");

-- AddForeignKey
ALTER TABLE "transactionitems" ADD CONSTRAINT "transactionitems_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
