export function computeTrendLine(points: { x: number; y: number }[]): number[] {
  const n = points.length;
  if (n < 2) return points.map((p) => p.y);

  const sumX = points.reduce((acc, p) => acc + p.x, 0);
  const sumY = points.reduce((acc, p) => acc + p.y, 0);
  const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return points.map(() => sumY / n);

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return points.map((p) => slope * p.x + intercept);
}
