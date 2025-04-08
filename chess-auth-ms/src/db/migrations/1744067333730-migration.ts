import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1744067333730 implements MigrationInterface {
  name = 'Migration1744067333730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE \`auth_panda\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`state\` varchar(64) NOT NULL DEFAULT 'happy',
        \`lastFeedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        \`lastSleepAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        \`lastBathAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        \`userUid\` int NOT NULL,
        UNIQUE INDEX \`REL_317a1572b97bd41e3d8e054540\` (\`userUid\`),
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB
    `);
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` ADD CONSTRAINT \`FK_317a1572b97bd41e3d8e0545407\` FOREIGN KEY (\`userUid\`) REFERENCES \`auth\`(\`uid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // STEP: Seed panda for existing users
    await queryRunner.query(`
        INSERT INTO auth_panda (state, lastFeedAt, lastSleepAt, lastBathAt, userUid)
        SELECT
          'happy',
          CURRENT_TIMESTAMP(),
          CURRENT_TIMESTAMP(),
          CURRENT_TIMESTAMP(),
          uid
        FROM auth
        WHERE uid NOT IN (SELECT userUid FROM auth_panda)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_panda\` DROP FOREIGN KEY \`FK_317a1572b97bd41e3d8e0545407\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_317a1572b97bd41e3d8e054540\` ON \`auth_panda\``,
    );
    await queryRunner.query(`DROP TABLE \`auth_panda\``);
  }
}
