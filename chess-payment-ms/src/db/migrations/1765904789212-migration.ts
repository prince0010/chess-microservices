import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765904789212 implements MigrationInterface {
  name = 'Migration1765904789212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`item\` ADD \`storeProductId\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`item\` DROP COLUMN \`storeProductId\``,
    );
  }
}
