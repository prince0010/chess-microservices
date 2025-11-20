# File to remember the SEED data to run in new database

## List of LESSON PARENT - LESSON SEED

1. First run SEED of Lesson Parents with endpoint `lessonParent.seed.data`
2. Then run seed child lessons with endpoint `lesson.insert.pgn`.
3. SEED List of Manual lesson-puzzle-description translation by target and hashCode.
   `lesson/seed-manually-translations-list`.
4. (Not more used) Pre job Translating with GOOGLE API all lessons description `seed-translations-for-language`

## List of Bots

1. Run SEED endpoint to insert animal Bots in database `bot/seed-animal-bots`

## Game Piece Square

1. Run SEED endpoint to generate 32 Levels of this game

## Game World Chess Champion

1. Run SEED endpoint to generate 57 Levels.
2. Run SEED endpoint to generate PGN World Champions games with the filename as payload (exists enum with the existing filenames)
3. When new world chess champion pgn file appears add it to existing Enum with the exact filename.

## List advanced lessons and normal lessons for PGN Viewer

1. Get always update list of `lessonAdvancedFilenames`.
2. Run the SEED endpoint to insert them `lesson/seed-all-advanced-pgn-files`;

## List Items packages to allow Payments from APP

1. Get always updated list of items seed.
2. Run the SEED endpoint to insert items `item/seed-list-packages`;
