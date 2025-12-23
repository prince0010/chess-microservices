import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1766464555233 implements MigrationInterface {
  name = 'Migration1766464555233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`storeChargeId\` \`storeChargeId\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`storeChargeId\` \`storeChargeId\` varchar(255) NOT NULL`,
    );
  }
}
