import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth } from './entities/auth.entity';

import { IRankingResponse } from './interfaces';
import { SecurityRoles } from 'src/enum';

@Injectable()
export class AuthRankingService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  private async fetchCurrentUser(userUid: number): Promise<Auth | null> {
    return await this.authRepository
      .createQueryBuilder('auth')
      .where('auth.uid = :uid', { uid: userUid })
      .andWhere('auth.isActive = :isActive', { isActive: true })
      .andWhere('FIND_IN_SET(:role, auth.roles)', {
        role: SecurityRoles.PLAYER,
      })
      .getOne();
  }

  public async rankingByEducationLessons(
    userUid: number,
  ): Promise<IRankingResponse> {
    try {
      const userRow = await this.fetchCurrentUser(userUid);
      if (!userRow) {
        throw new BadRequestException(`Player with UID: ${userUid} not found.`);
      }

      const currentUserScore = userRow.educationPoints;

      // Step 1: Get current user's rank
      const rawRank = await this.authRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM auth
        WHERE educationPoints > ?
        AND FIND_IN_SET('PLAYER', roles)
        AND isActive = 1
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: get top 100 players only
      const listUsers = await this.authRepository
        .createQueryBuilder('auth')
        .where("FIND_IN_SET('PLAYER', auth.roles)")
        .andWhere('auth.isActive = :isActive', { isActive: true })
        .orderBy('auth.educationPoints', 'DESC')
        .limit(100)
        .getMany();

      const result = listUsers.map((user, index) => ({
        userUid: user.uid,
        score: user.educationPoints,
        username: user.name,
        position: index + 1,
      }));

      return {
        currentUserUid: userUid,
        currentUsername: userRow.username,
        currentScore: userRow.educationPoints,
        currentPosition: currentRank,
        top100: result,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  public async rankingByPuzzleLessons(
    userUid: number,
  ): Promise<IRankingResponse> {
    try {
      const userRow = await this.fetchCurrentUser(userUid);
      if (!userRow) {
        throw new BadRequestException(`Player with UID: ${userUid} not found.`);
      }

      const currentUserScore = userRow.puzzlePoints;

      // Step 1: Get current user's rank
      const rawRank = await this.authRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM auth
        WHERE puzzlePoints > ?
        AND FIND_IN_SET('PLAYER', roles)
        AND isActive = 1
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: get top 100 players only
      const listUsers = await this.authRepository
        .createQueryBuilder('auth')
        .where("FIND_IN_SET('PLAYER', auth.roles)")
        .andWhere('auth.isActive = :isActive', { isActive: true })
        .orderBy('auth.puzzlePoints', 'DESC')
        .limit(100)
        .getMany();

      const result = listUsers.map((user, index) => ({
        userUid: user.uid,
        score: user.puzzlePoints,
        username: user.name,
        position: index + 1,
      }));

      return {
        currentUserUid: userUid,
        currentUsername: userRow.username,
        currentScore: userRow.puzzlePoints,
        currentPosition: currentRank,
        top100: result,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  public async rankingByEndgamesLessons(
    userUid: number,
  ): Promise<IRankingResponse> {
    try {
      const userRow = await this.fetchCurrentUser(userUid);
      if (!userRow) {
        throw new BadRequestException(`Player with UID: ${userUid} not found.`);
      }

      const currentUserScore = userRow.endgamesPoints;

      // Step 1: Get current user's rank
      const rawRank = await this.authRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM auth
        WHERE endgamesPoints > ?
        AND FIND_IN_SET('PLAYER', roles)
        AND isActive = 1
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: get top 100 players only
      const listUsers = await this.authRepository
        .createQueryBuilder('auth')
        .where("FIND_IN_SET('PLAYER', auth.roles)")
        .andWhere('auth.isActive = :isActive', { isActive: true })
        .orderBy('auth.endgamesPoints', 'DESC')
        .limit(100)
        .getMany();

      const result = listUsers.map((user, index) => ({
        userUid: user.uid,
        score: user.endgamesPoints,
        username: user.name,
        position: index + 1,
      }));

      return {
        currentUserUid: userUid,
        currentUsername: userRow.username,
        currentScore: userRow.endgamesPoints,
        currentPosition: currentRank,
        top100: result,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  public async rankingByAnimalBots(userUid: number): Promise<IRankingResponse> {
    try {
      const userRow = await this.fetchCurrentUser(userUid);
      if (!userRow) {
        throw new BadRequestException(`Player with UID: ${userUid} not found.`);
      }

      const currentUserScore = userRow.animalPoints;

      // Step 1: Get current user's rank
      const rawRank = await this.authRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM auth
        WHERE animalPoints > ?
        AND FIND_IN_SET('PLAYER', roles)
        AND isActive = 1
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: get top 100 players only
      const listUsers = await this.authRepository
        .createQueryBuilder('auth')
        .where("FIND_IN_SET('PLAYER', auth.roles)")
        .andWhere('auth.isActive = :isActive', { isActive: true })
        .orderBy('auth.animalPoints', 'DESC')
        .limit(100)
        .getMany();

      const result = listUsers.map((user, index) => ({
        userUid: user.uid,
        score: user.animalPoints,
        username: user.name,
        position: index + 1,
      }));

      return {
        currentUserUid: userUid,
        currentUsername: userRow.username,
        currentScore: userRow.animalPoints,
        currentPosition: currentRank,
        top100: result,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  public async rankingByTotalScore(userUid: number): Promise<IRankingResponse> {
    try {
      const userRow = await this.fetchCurrentUser(userUid);
      if (!userRow) {
        throw new BadRequestException(`Player with UID: ${userUid} not found.`);
      }

      const currentUserScore = userRow.totalScore;

      // Step 1: Get current user's rank
      const rawRank = await this.authRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM auth
        WHERE totalScore > ?
        AND FIND_IN_SET('PLAYER', roles)
        AND isActive = 1
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: get top 100 players only
      const listUsers = await this.authRepository
        .createQueryBuilder('auth')
        .where("FIND_IN_SET('PLAYER', auth.roles)")
        .andWhere('auth.isActive = :isActive', { isActive: true })
        .orderBy('auth.totalScore', 'DESC')
        .limit(100)
        .getMany();

      const result = listUsers.map((user, index) => ({
        userUid: user.uid,
        score: user.totalScore,
        username: user.name,
        position: index + 1,
      }));

      return {
        currentUserUid: userUid,
        currentUsername: userRow.username,
        currentScore: userRow.totalScore,
        currentPosition: currentRank,
        top100: result,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
