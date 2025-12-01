import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764622797777 implements MigrationInterface {
  name = 'Migration1764622797777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`coach\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`chessTitle\` varchar(255) NOT NULL,
      \`languages\` text NOT NULL,
      \`price\` decimal(10,2) NOT NULL,
      \`photoUrl\` varchar(255) NOT NULL,
      \`cvUrl\` varchar(255) NOT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      \`isActive\` tinyint NOT NULL DEFAULT 1,
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`coach\``);
  }
}
