export function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function xpToNextMilestone(xp: number) {
  const milestones = [100, 300, 600, 1000];
  const next = milestones.find((m) => m > xp) ?? Math.ceil((xp + 1) / 500) * 500;
  return { next, remaining: Math.max(0, next - xp) };
}

export function levelUnlocked(requiredXp: number, currentXp: number) {
  return currentXp >= requiredXp;
}
