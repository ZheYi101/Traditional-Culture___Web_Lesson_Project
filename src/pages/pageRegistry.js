import { advisorPageTag } from "./advisor/index.js";
import { fortunePageTag, initFortunePage } from "./fortune/index.js";
import { homePageTag } from "./home/index.js";
import { termsPageTag } from "./terms/index.js";
import { playPageTag } from "./play/index.js";

export const pageRegistry = {
  home: {
    pageTag: homePageTag
  },
  terms: {
    pageTag: termsPageTag
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
