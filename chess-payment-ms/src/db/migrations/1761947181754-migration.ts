import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761947181754 implements MigrationInterface {
  name = 'Migration1761947181754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notification_purchase\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`type\` enum ('PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'INSUFFICIENT_BALANCE') NOT NULL,
      \`title\` varchar(255) NOT NULL,
      \`message\` text NOT NULL,
      \`orderId\` varchar(255) NOT NULL,
      \`isGlobal\` tinyint NOT NULL DEFAULT 0,
      \`isRead\` tinyint NOT NULL DEFAULT 0,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`notification_purchase\``);
  }
}
