import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761668825422 implements MigrationInterface {
  name = 'Migration1761668825422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`item\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`currency\` varchar(255) NOT NULL DEFAULT 'USD',
      \`name\` varchar(255) NOT NULL,
      \`description\` text NOT NULL,
      \`price\` float NOT NULL,
      \`isActive\` tinyint NOT NULL DEFAULT 1,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`type\` varchar(255) NOT NULL,
      \`pointsAmount\` int NULL,
      \`subscriptionTier\` varchar(255) NULL,
      \`durationDays\` int NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_item\` ADD \`itemId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_e03f3ed4dab80a3bf3eca50babc\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_e03f3ed4dab80a3bf3eca50babc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_item\` DROP COLUMN \`itemId\``,
    );
    await queryRunner.query(`DROP TABLE \`item\``);
  }
}
