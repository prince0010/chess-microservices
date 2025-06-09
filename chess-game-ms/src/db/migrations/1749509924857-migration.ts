import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1749509924857 implements MigrationInterface {
  name = 'Migration1749509924857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE \`guess_piece_square_user_history\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`userUid\` int NOT NULL,
        \`bestScore\` int NOT NULL DEFAULT '0',
        UNIQUE INDEX \`IDX_a5e38869f8ab152a3b44791ce8\` (\`userUid\`),
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_a5e38869f8ab152a3b44791ce8\` ON \`guess_piece_square_user_history\``,
    );
    await queryRunner.query(`DROP TABLE \`guess_piece_square_user_history\``);
  }
}
