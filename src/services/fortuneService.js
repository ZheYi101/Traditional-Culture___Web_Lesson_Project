import {
  earthlyBranches,
  fiveElementProfiles,
  heavenlyStems,
  interpretationProfiles,
  suggestionProfiles
} from "../constants/fortuneProfiles.js";
import { createStableHash } from "./hash.js";

function getPillar(seedValue, offset) {
  const stem = heavenlyStems[(seedValue + offset) % heavenlyStems.length];
  const branch = earthlyBranches[(seedValue + offset * 2) % earthlyBranches.length];
  return `${stem}${branch}`;
}

export function getFortuneResult({ birthDate = "", birthTime = "", gender = "" }) {
  const sourceText = `${birthDate}|${birthTime}|${gender || "unknown"}`;
  const hashValue = createStableHash(sourceText);
  const dayHash = createStableHash(birthDate || sourceText);
  const timeHash = createStableHash(birthTime || sourceText);
  const genderHash = createStableHash(gender || "unknown");

  const pillars = {
    year: getPillar(hashValue, 1),
    month: getPillar(dayHash, 2),
    day: getPillar(timeHash, 3),
    hour: getPillar(hashValue + genderHash, 4)
  };

  const fiveElementProfile = fiveElementProfiles[hashValue % fiveElementProfiles.length];
  const interpretation = interpretationProfiles[(dayHash + timeHash) % interpretationProfiles.length];
  const suggestion = suggestionProfiles[(hashValue + genderHash) % suggestionProfiles.length];

  return {
    baZiText: `${pillars.year}年  ${pillars.month}月  ${pillars.day}日  ${pillars.hour}时`,
    pillarList: [
      { label: "年柱", value: pillars.year },
      { label: "月柱", value: pillars.month },
      { label: "日柱", value: pillars.day },
      { label: "时柱", value: pillars.hour }
    ],
    fiveElements: `${fiveElementProfile.name} · 偏${fiveElementProfile.element}`,
    interpretation: `${fiveElementProfile.description}${interpretation}`,
    suggestion
  };
}
