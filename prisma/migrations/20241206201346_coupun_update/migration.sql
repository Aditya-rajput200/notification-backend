-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "description" TEXT,
ALTER COLUMN "discountPrice" DROP NOT NULL;

-- CreateTable
CREATE TABLE "playing_with_neon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" REAL,

    CONSTRAINT "playing_with_neon_pkey" PRIMARY KEY ("id")
);
