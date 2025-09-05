import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth } from './entities/auth.entity';

import { IRankingResponse } from './interfaces';

@Injectable()
export class AuthRankingService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  public async rankingByEducationLessons(
    userUid: number,
  ): Promise<IRankingResponse> {
    try {
      // verify if user is on table history
      const userRow = await this.authRepository.findOneBy({ uid: userUid });
      if (!userRow) {
        throw new BadRequestException(`User with UID: ${userUid} not found.`);
      }

      const currentUserScore = userRow.educationPoints;

      // Step 1: Get current user's rank
      const rawRank = await this.authRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM auth
        WHERE educationPoints > ?
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: get top 100
      const listUsers = await this.authRepository.find({
        where: {},
        order: { educationPoints: 'DESC' },
        take: 100,
      });

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
      // verify if user is on table history
      const userRow = await this.authRepository.findOneBy({ uid: userUid });
      if (!userRow) {
        throw new BadRequestException(`User with UID: ${userUid} not found.`);
      }

      const currentUserScore = userRow.puzzlePoints;

      // Step 1: Get current user's rank
      const rawRank = await this.authRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM auth
        WHERE puzzlePoints > ?
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: get top 100
      const listUsers = await this.authRepository.find({
        where: {},
        order: { puzzlePoints: 'DESC' },
        take: 100,
      });

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
      // verify if user is on table history
      const userRow = await this.authRepository.findOneBy({ uid: userUid });
      if (!userRow) {
        throw new BadRequestException(`User with UID: ${userUid} not found.`);
      }

      const currentUserScore = userRow.endgamesPoints;

      // Step 1: Get current user's rank
      const rawRank = await this.authRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM auth
        WHERE endgamesPoints > ?
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: get top 100
      const listUsers = await this.authRepository.find({
        where: {},
        order: { endgamesPoints: 'DESC' },
        take: 100,
      });

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
      // verify if user is on table history
      const userRow = await this.authRepository.findOneBy({ uid: userUid });
      if (!userRow) {
        throw new BadRequestException(`User with UID: ${userUid} not found.`);
      }

      const currentUserScore = userRow.animalPoints;

      // Step 1: Get current user's rank
      const rawRank = await this.authRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM auth
        WHERE animalPoints > ?
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: get top 100
      const listUsers = await this.authRepository.find({
        where: {},
        order: { animalPoints: 'DESC' },
        take: 100,
      });

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
      // verify if user is on table history
      const userRow = await this.authRepository.findOneBy({ uid: userUid });
      if (!userRow) {
        throw new BadRequestException(`User with UID: ${userUid} not found.`);
      }

      const currentUserScore = userRow.totalScore;

      // Step 1: Get current user's rank
      const rawRank = await this.authRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM auth
        WHERE totalScore > ?
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: get top 100
      const listUsers = await this.authRepository.find({
        where: {},
        order: { totalScore: 'DESC' },
        take: 100,
      });

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
