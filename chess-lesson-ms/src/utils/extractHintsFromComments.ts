export interface HintData {
  squares: string[];
  arrows: string[];
}

export interface Comment {
  text?: string;
  commands?: Array<{
    key?: string;
    values?: string[];
    name?: string;
    args?: string;
  }>;
}

export function extractHintsFromComments(comments: Comment[] = []): HintData {
  const hintSquares: string[] = [];
  const hintArrows: string[] = [];

  for (const comment of comments) {
    // Text-based tags (e.g. [%csl Gd5], [%cal Gd2d4])
    if (typeof comment.text === 'string') {
      const cslMatch = comment.text.match(/\[%csl\s+([^\]]+)\]/);
      if (cslMatch) {
        const squares = cslMatch[1].split(',').map((sq) => sq.trim());
        hintSquares.push(...squares);
      }

      const calMatch = comment.text.match(/\[%cal\s+([^\]]+)\]/);
      if (calMatch) {
        const arrows = calMatch[1].split(',').map((ar) => ar.trim());
        hintArrows.push(...arrows);
      }
    }

    // Parsed command-based hints
    if (Array.isArray(comment.commands)) {
      for (const cmd of comment.commands) {
        const key = cmd.name ?? cmd.key;
        const values = Array.isArray(cmd.values)
          ? cmd.values
          : (cmd.args?.split(',') ?? []);

        if (key === 'csl') {
          hintSquares.push(...values.map((v) => v.trim()));
        }

        if (key === 'cal') {
          hintArrows.push(...values.map((v) => v.trim()));
        }
      }
    }
  }

  return {
    squares: hintSquares,
    arrows: hintArrows,
  };
}
