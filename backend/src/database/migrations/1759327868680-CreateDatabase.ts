import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1759327868680 implements MigrationInterface {
    name = 'CreateDatabase1759327868680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'FUNCIONARIO', 'DOADOR', 'BENEFICIARIO')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'DOADOR', "isActive" boolean NOT NULL DEFAULT true, "phone" character varying, "address" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."items_type_enum" AS ENUM('roupa', 'calcado', 'utensilio', 'outro')`);
        await queryRunner.query(`CREATE TYPE "public"."items_status_enum" AS ENUM('disponivel', 'reservado', 'distribuido')`);
        await queryRunner.query(`CREATE TABLE "items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."items_type_enum" NOT NULL, "description" character varying NOT NULL, "conservationState" character varying, "size" character varying, "receivedDate" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."items_status_enum" NOT NULL DEFAULT 'disponivel', "photos" text array, "donorId" uuid NOT NULL, "categoryId" uuid, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "location" character varying, "alertLevel" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_6227c61eff466680f9bb993330" UNIQUE ("itemId"), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "distributions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL DEFAULT now(), "beneficiaryId" uuid NOT NULL, "employeeId" uuid NOT NULL, "observations" character varying, CONSTRAINT "PK_b73beffd2ed658ba71d8bd7d820" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "token" character varying NOT NULL, "isRevoked" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_610102b60fea1455310ccd299d" ON "refresh_tokens" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4542dd2f38a61354a040ba9fd5" ON "refresh_tokens" ("token") `);
        await queryRunner.query(`CREATE TABLE "distribution_items" ("distributionId" uuid NOT NULL, "itemId" uuid NOT NULL, CONSTRAINT "PK_ce8b054eb3facbe4ed9f889fc8f" PRIMARY KEY ("distributionId", "itemId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_35e0632e01121d99cbb4e16e40" ON "distribution_items" ("distributionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4e5733561af4549170748509c4" ON "distribution_items" ("itemId") `);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_7bece0dc130017070043d6fca15" FOREIGN KEY ("donorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_788929ed61ab78bb914f0d1931b" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_6227c61eff466680f9bb9933305" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "distributions" ADD CONSTRAINT "FK_dc30ef1a6dc25f904683f9bf65b" FOREIGN KEY ("beneficiaryId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "distributions" ADD CONSTRAINT "FK_63c34950156f15e2a26798e556e" FOREIGN KEY ("employeeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "distribution_items" ADD CONSTRAINT "FK_35e0632e01121d99cbb4e16e402" FOREIGN KEY ("distributionId") REFERENCES "distributions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "distribution_items" ADD CONSTRAINT "FK_4e5733561af4549170748509c47" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "distribution_items" DROP CONSTRAINT "FK_4e5733561af4549170748509c47"`);
        await queryRunner.query(`ALTER TABLE "distribution_items" DROP CONSTRAINT "FK_35e0632e01121d99cbb4e16e402"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "distributions" DROP CONSTRAINT "FK_63c34950156f15e2a26798e556e"`);
        await queryRunner.query(`ALTER TABLE "distributions" DROP CONSTRAINT "FK_dc30ef1a6dc25f904683f9bf65b"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_6227c61eff466680f9bb9933305"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_788929ed61ab78bb914f0d1931b"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_7bece0dc130017070043d6fca15"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e5733561af4549170748509c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35e0632e01121d99cbb4e16e40"`);
        await queryRunner.query(`DROP TABLE "distribution_items"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4542dd2f38a61354a040ba9fd5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_610102b60fea1455310ccd299d"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "distributions"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TYPE "public"."items_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."items_type_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
