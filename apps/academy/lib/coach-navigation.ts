export const coachPages = [
  { title: "關係教練", short: "關係", icon: "💗", pageId: "393716701898812fa92bf63526ac35ba" },
  { title: "招募教練", short: "招募", icon: "🎯", pageId: "39371670189881f9bc6cec2cdbd739d6" },
  { title: "零售教練", short: "零售", icon: "🛍️", pageId: "3937167018988107a82dea072ffb064e" },
  { title: "工具教練", short: "工具", icon: "🛠️", pageId: "39371670189881dca855c430f97f2031" },
  { title: "AI／自媒體教練", short: "AI／自媒體", icon: "🤖", pageId: "39371670189881b6a2d6f831925170a4" },
];

export function compactPageId(pageId: string) { return pageId.replaceAll("-", ""); }
