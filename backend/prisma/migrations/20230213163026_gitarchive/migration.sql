-- CreateTable
CREATE TABLE "gitarchive" (
    "id" SERIAL NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "gitarchive_pkey" PRIMARY KEY ("id")
);
