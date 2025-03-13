import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741898896208 implements MigrationInterface {
  name = 'Migration1741898896208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE \`bot\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`difficulty\` varchar(255) NOT NULL,
            \`name\` varchar(255) NOT NULL,
            \`elo\` int NOT NULL,
            \`isActive\` tinyint NOT NULL DEFAULT 1,
            \`avatar\` varchar(255) NULL,
            \`description\` varchar(255) NULL,
            PRIMARY KEY (\`id\`)) ENGINE=InnoDB
    `);
    await queryRunner.query(`
        CREATE TABLE \`bot_user_history\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`userUid\` int NOT NULL,
            \`gameWon\` int NOT NULL DEFAULT '0',
            \`gameTied\` int NOT NULL DEFAULT '0',
            \`gameLost\` int NOT NULL DEFAULT '0',
            \`botId\` int NOT NULL,
            UNIQUE INDEX \`IDX_a00e1fcf56a4a5449ab1a8601d\` (\`botId\`, \`userUid\`),
            PRIMARY KEY (\`id\`)) ENGINE=InnoDB
    `);
    await queryRunner.query(`
        ALTER TABLE \`bot_user_history\`
        ADD CONSTRAINT \`FK_f7d320d2ad37a02c413a5a8fbe5\`
        FOREIGN KEY (\`botId\`)
        REFERENCES \`bot\`(\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bot_user_history\` DROP FOREIGN KEY \`FK_f7d320d2ad37a02c413a5a8fbe5\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a00e1fcf56a4a5449ab1a8601d\` ON \`bot_user_history\``,
    );
    await queryRunner.query(`DROP TABLE \`bot_user_history\``);
    await queryRunner.query(`DROP TABLE \`bot\``);
  }
}
