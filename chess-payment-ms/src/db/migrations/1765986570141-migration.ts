import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765986570141 implements MigrationInterface {
  name = 'Migration1765986570141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_receipt\` DROP COLUMN \`receiptUrl\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_receipt\` DROP COLUMN \`updatedAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`stripeChargeId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_receipt\` ADD \`source\` enum ('google_play', 'app_store') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_receipt\` ADD \`rawReceipt\` json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`source\` enum ('google_play', 'app_store') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`storeChargeId\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD UNIQUE INDEX \`IDX_7d05869eb98d5ef3595c166144\` (\`storeChargeId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`userUid\` \`userUid\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`userUid\` \`userUid\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP INDEX \`IDX_7d05869eb98d5ef3595c166144\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`storeChargeId\``,
    );
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`source\``);
    await queryRunner.query(
      `ALTER TABLE \`order_receipt\` DROP COLUMN \`rawReceipt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_receipt\` DROP COLUMN \`source\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`stripeChargeId\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_receipt\` ADD \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_receipt\` ADD \`receiptUrl\` varchar(255) NOT NULL`,
    );
  }
}
