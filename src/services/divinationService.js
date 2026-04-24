import { divinationProfiles } from "../constants/divinationProfiles.js";
import { createStableHash, mapHashToRange } from "./hash.js";

function getProfileByScore(resultScore) {
  return divinationProfiles.find((profile) => resultScore >= profile.min && resultScore <= profile.max) || divinationProfiles[0];
}

export function getDivinationResult(userInput = "") {
  const cleanedInput = String(userInput || "").trim();
  const randomSeed = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const sourceText = cleanedInput || randomSeed;
  const hashValue = createStableHash(sourceText);
  const resultScore = mapHashToRange(hashValue, 1, 100);
  const profile = getProfileByScore(resultScore);

  return {
    sourceText: cleanedInput,
    resultScore,
    resultTag: profile.tag,
    resultTitle: profile.title,
    interpretation: profile.summary,
    suggestion: profile.advice
  };
}

export function getDailyFortuneResult(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateKey = `${year}-${month}-${day}`;
  const hashValue = createStableHash(`daily-fortune:${dateKey}`);
  const resultScore = mapHashToRange(hashValue, 1, 100);
  const profile = getProfileByScore(resultScore);

  return {
    dateKey,
    resultScore,
    resultTag: profile.tag,
    resultTitle: profile.title,
    interpretation: profile.summary,
    suggestion: profile.advice
  };
}
