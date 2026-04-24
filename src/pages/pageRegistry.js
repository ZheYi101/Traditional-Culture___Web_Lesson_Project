import { aboutPageTag } from "./about/index.js";
import { advisorPageTag } from "./advisor/index.js";
import { fortunePageTag, initFortunePage } from "./fortune/index.js";
import { homePageTag } from "./home/index.js";
import { loginPageTag } from "./login/index.js";
import { termsPageTag } from "./terms/index.js";
import { playPageTag } from "./play/index.js";

export const pageRegistry = {
  login: {
    pageTag: loginPageTag
  },
  about: {
    pageTag: aboutPageTag
  },
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
