import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1766192796971 implements MigrationInterface {
  name = 'Migration1766192796971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth\` CHANGE \`country\` \`country\` varchar(128) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth\` CHANGE \`country\` \`country\` varchar(128) NOT NULL`,
    );
  }
}
