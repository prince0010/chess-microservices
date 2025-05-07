import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746659568437 implements MigrationInterface {
  name = 'Migration1746659568437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`guess_position_user_history\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`bestScore\` int NOT NULL DEFAULT '0',
      UNIQUE INDEX \`IDX_3b7eced6992ff9493183f11f36\` (\`userUid\`),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_3b7eced6992ff9493183f11f36\` ON \`guess_position_user_history\``,
    );
    await queryRunner.query(`DROP TABLE \`guess_position_user_history\``);
  }
}
