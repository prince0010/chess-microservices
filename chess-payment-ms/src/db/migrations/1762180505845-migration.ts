import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1762180505845 implements MigrationInterface {
  name = 'Migration1762180505845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`payment_subscription\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`startedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`durationDays\` int NULL,
      \`itemId\` int NOT NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_subscription\` ADD CONSTRAINT \`FK_9f0357caa7c05e71e66272a2a1d\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment_subscription\` DROP FOREIGN KEY \`FK_9f0357caa7c05e71e66272a2a1d\``,
    );
    await queryRunner.query(`DROP TABLE \`payment_subscription\``);
  }
}
