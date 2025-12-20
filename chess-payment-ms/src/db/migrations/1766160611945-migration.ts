import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1766160611945 implements MigrationInterface {
  name = 'Migration1766160611945';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_7d05869eb98d5ef3595c166144\` ON \`order\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_7d05869eb98d5ef3595c166144\` ON \`order\` (\`storeChargeId\`)`,
    );
  }
}
