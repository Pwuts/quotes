-- DropForeignKey
ALTER TABLE "Subquote" DROP CONSTRAINT "Subquote_quoteId_fkey";

-- DropForeignKey
ALTER TABLE "UserInvitation" DROP CONSTRAINT "UserInvitation_createdById_fkey";

-- AlterTable
ALTER TABLE "Subquote" ADD COLUMN     "isAction" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Subquote" ADD CONSTRAINT "Subquote_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvitation" ADD CONSTRAINT "UserInvitation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
