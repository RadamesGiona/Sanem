import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsBeneficiaryItem1765360940862 implements MigrationInterface {
    name = '1733850000000AddFieldsBeneficiaryItem.ts1765360940862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ADD "reservedDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "items" ADD "reservedById" uuid`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_413461a88a3ca248d2f08014e1e" FOREIGN KEY ("reservedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_413461a88a3ca248d2f08014e1e"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "reservedById"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "reservedDate"`);
    }

}
