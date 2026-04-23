import { advisorPageTag } from "./advisor/index.js";
import { fortunePageTag, initFortunePage } from "./fortune/index.js";
import { homePageTag } from "./home/index.js";
import { playPageTag } from "./play/index.js";

export const pageRegistry = {
  home: {
    pageTag: homePageTag
  },
  fortune: {
    pageTag: fortunePageTag,
    initPage: initFortunePage
  },
  play: {
    pageTag: playPageTag
  },
  advisor: {
    pageTag: advisorPageTag
  }
};
