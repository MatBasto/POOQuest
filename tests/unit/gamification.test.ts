import { describe, expect, it } from "vitest";
import { clampPercentage, levelUnlocked, xpToNextMilestone } from "@/lib/gamification";
describe("gamification",()=>{
  it("limita porcentaje",()=>{ expect(clampPercentage(121)).toBe(100); expect(clampPercentage(-4)).toBe(0); });
  it("desbloquea por XP",()=>{ expect(levelUnlocked(100,100)).toBe(true); expect(levelUnlocked(100,99)).toBe(false); });
  it("calcula siguiente hito",()=>{ expect(xpToNextMilestone(120)).toEqual({next:300,remaining:180}); });
});
