export default function generateTiers(items, tierMap, excludedScores) {
  const t = Array.from(tierMap.entries());

  const tiers = t
    .filter(([s]) => !excludedScores.has(s))
    .reduce((m, [score, tier]) => {
      const curr = m.get(tier) || [];
      return m.set(tier, [...curr, ...items.filter((x) => x.score === score)]);
    }, new Map());

  return Array.from(tiers.entries());
}
