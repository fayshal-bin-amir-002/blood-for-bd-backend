-- CreateTable
CREATE TABLE "blood_donations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "donation_date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "blood_donations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blood_donations_user_id_key" ON "blood_donations"("user_id");

-- AddForeignKey
ALTER TABLE "blood_donations" ADD CONSTRAINT "blood_donations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
