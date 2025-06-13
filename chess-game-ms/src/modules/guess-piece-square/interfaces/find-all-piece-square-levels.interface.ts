export interface ICountAndListPieceSquareLevels {
  currentPage: number;
  total: number;
  levels: IPieceSquareLevel[];
}

export interface IPieceSquareLevel {
  id: number;
  level: string;
  disabled: boolean;
}
