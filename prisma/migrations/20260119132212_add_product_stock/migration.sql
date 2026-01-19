/*
  Warnings:

  - You are about to drop the column `in_stock` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "in_stock",
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
