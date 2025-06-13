import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1749825694915 implements MigrationInterface {
  name = 'Migration1749825694915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`piece_square_level_completed\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`userUid\` int NOT NULL,
      \`pieceSquareLevelId\` int NOT NULL,
      UNIQUE INDEX \`IDX_a985803ed8cb107fbad7dd9d0e\` (\`pieceSquareLevelId\`,\`userUid\`),
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`piece_square_level\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`level\` varchar(16) NOT NULL,
      \`points\` int NOT NULL,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`piece_square_level_completed\` ADD CONSTRAINT \`FK_139d5a2399f4d824c2c274fe9df\` FOREIGN KEY (\`pieceSquareLevelId\`) REFERENCES \`piece_square_level\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`piece_square_level_completed\` DROP FOREIGN KEY \`FK_139d5a2399f4d824c2c274fe9df\``,
    );
    await queryRunner.query(`DROP TABLE \`piece_square_level\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a985803ed8cb107fbad7dd9d0e\` ON \`piece_square_level_completed\``,
    );
    await queryRunner.query(`DROP TABLE \`piece_square_level_completed\``);
  }
}
