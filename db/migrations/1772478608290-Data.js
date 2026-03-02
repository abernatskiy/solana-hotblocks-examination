module.exports = class Data1772478608290 {
    name = 'Data1772478608290'

    async up(db) {
        await db.query(`CREATE TABLE "instruction" ("id" character varying NOT NULL, "block" integer NOT NULL, "block_hash" text NOT NULL, "signature" text NOT NULL, CONSTRAINT "PK_dd8def68dee37e3f878d0f8673a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_59c9b9e1da27641c535448caf1" ON "instruction" ("block") `)
        await db.query(`CREATE INDEX "IDX_04609eb9ce3c7a0ecf002c9572" ON "instruction" ("signature") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "instruction"`)
        await db.query(`DROP INDEX "public"."IDX_59c9b9e1da27641c535448caf1"`)
        await db.query(`DROP INDEX "public"."IDX_04609eb9ce3c7a0ecf002c9572"`)
    }
}
