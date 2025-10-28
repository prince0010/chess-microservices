import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761664537089 implements MigrationInterface {
  name = 'Migration1761664537089';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`order_item\` (
      \`id\` uuid NOT NULL,
      \`quantity\` int NOT NULL DEFAULT '1',
      \`price\` float NOT NULL,
      \`orderId\` uuid NOT NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_receipt\` (
      \`id\` uuid NOT NULL,
      \`receiptUrl\` varchar(255) NOT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      \`orderId\` uuid NOT NULL,
      UNIQUE INDEX \`REL_6bcc142e76d004e355d733c99a\` (\`orderId\`),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order\` (
      \`id\` uuid NOT NULL,
      \`totalAmount\` float NOT NULL,
      \`totalItems\` int NOT NULL,
      \`userUid\` int NULL,
      \`status\` varchar(32) NOT NULL DEFAULT 'PENDING',
      \`paid\` tinyint NOT NULL DEFAULT 0,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`paidAt\` timestamp NULL,
      \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_646bf9ece6f45dbe41c203e06e0\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_receipt\` ADD CONSTRAINT \`FK_6bcc142e76d004e355d733c99a0\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_receipt\` DROP FOREIGN KEY \`FK_6bcc142e76d004e355d733c99a0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_646bf9ece6f45dbe41c203e06e0\``,
    );
    await queryRunner.query(`DROP TABLE \`order\``);
    await queryRunner.query(
      `DROP INDEX \`REL_6bcc142e76d004e355d733c99a\` ON \`order_receipt\``,
    );
    await queryRunner.query(`DROP TABLE \`order_receipt\``);
    await queryRunner.query(`DROP TABLE \`order_item\``);
  }
}
