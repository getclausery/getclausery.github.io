// Compile Allow/Disallow rules for the generic (*) crawler. This is an offline guard for the generated robots.txt,
// not an HTTP fetch or a promise of search-engine indexing. Match path plus query; URL fragments are never requests.
// Supports the wildcard and end-anchor syntax used by Google/Bing, longest-rule precedence and Allow on equal length.
export function createRobotsPolicy(text) {
  const groups = [];
  let agents = [];
  let rules = [];
  let hasRules = false;
  const flush = () => { if (agents.length) groups.push({ agents, rules }); agents = []; rules = []; hasRules = false; };
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (key === 'user-agent') {
      if (hasRules) flush();
      agents.push(value.toLowerCase());
    } else if ((key === 'allow' || key === 'disallow') && agents.length) {
      hasRules = true;
      if (value) rules.push({ allow: key === 'allow', pattern: value });
    }
  }
  flush();
  const compiled = groups.filter((g) => g.agents.includes('*')).flatMap((g) => g.rules).map((rule) => {
    const anchored = rule.pattern.endsWith('$');
    const pattern = anchored ? rule.pattern.slice(0, -1) : rule.pattern;
    const source = pattern.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    return { allow: rule.allow, specificity: Buffer.byteLength(pattern.replace(/\*/g, '')), match: new RegExp('^' + source + (anchored ? '$' : '')) };
  });
  return (requestPath) => {
    let winner = null;
    for (const rule of compiled) {
      if (!rule.match.test(requestPath)) continue;
      if (!winner || rule.specificity > winner.specificity || (rule.specificity === winner.specificity && rule.allow)) winner = rule;
    }
    return winner?.allow ?? true;
  };
}
