<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Chess Lesson Microservice

This is the Lesson module. All data related with lessons that players or student will play will be stored here.

## Docker config documentation

The file with name `Dockerfile` is what we will use for Development environment.
The file with name `Dockerfile.prod` is what we will use for Production environment.

## Packages already are Installed

1. Microservices
   `npm i @nestjs/microservices`

2. Dotenv and joi to handle environments variables
   `npm i dotenv joi`
3. Validator and transformer
   `npm i class-transformer class-validator`

4. TypeOrm with nestJs
   `npm i @nestjs/typeorm typeorm`

5. NestJs ConfigModule
   `npm i @nestjs/config`

6. Mysql
   `npm i mysql@^2.18.1`

7. Nats
   `npm i nats`

8. Mapped Type
   `npm i @nestjs/mapped-types`

9. PGN Parser
   `npm i pgn-parser`

## How a lesson could be structured (explanation of PGN)

**PGN** (Portable Game Notation) includes metadata about chess games. These properties help organize and analyze chess games, lessons, or puzzles effectively. Here’s what each one means and why it might be useful in the future:

1. event (String)
   Definition: The name of the event or tournament where the game was played.
   Future Use: If you're storing multiple games, this helps categorize games by events. It could be useful for filtering games played in specific tournaments.
2. site (String)
   Definition: The location where the game took place.
   Future Use: Helps in tracking where lessons or real games occurred, useful for historical records.
3. date (String)
   Definition: The date the game was played in YYYY.MM.DD format.
   Future Use: Important for sorting games chronologically, identifying trends, and retrieving games played on specific dates.
4. round (String)
   Definition: The round number in a tournament.
   Future Use: Useful for tournament-based lesson structures where players can analyze games round-by-round.
5. white (String) & black (String)
   Definition: Names or identifiers of the players playing as White and Black.
   Future Use: Helps in tracking player performance, reviewing specific player games, and storing historical lessons by known players.
6. result (String)
   Definition: The outcome of the game.
   Common Values:
   1-0 → White wins
   0-1 → Black wins
   1/2-1/2 → Draw
   "\*" → Unknown or unfinished
   Future Use: Useful for filtering games based on results. For lessons, you might want to focus on decisive games (no draws).

7. setup (String)
   Definition: Indicates if the game starts from a custom position (1 means yes, 0 means no).
   Future Use: If your lessons include chess puzzles or training positions, this helps differentiate between full games and set-piece exercises.
8. plyCount (Number)
   Definition: Total number of half-moves in the game (one full move = two plies).
   Future Use: Helps in tracking game length, categorizing short vs. long games, and optimizing lesson difficulty.

**Conclusion**
These properties might seem unnecessary at first, but they help with:

- Filtering and Searching: You can retrieve games by event, date, or players.
- Lesson Organization: Helps categorize games by type, difficulty, and learning goals.
- Data Analysis: Identifies patterns in historical games, player performance, and common openings.
- Game Integrity: Stores enough metadata to reconstruct a lesson or puzzle accurately.
