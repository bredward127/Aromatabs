/**
 * Every citation on the site has to resolve. This walks the corpus, collects
 * each citation URL, and requests it.
 *
 *   node scripts/check-citations.mjs
 *
 * Requires outbound network access. In a sandbox without it, every row will
 * report a network error - that is the sandbox, not the citation.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT = join(process.cwd(), 'content');
const TIMEOUT_MS = 15000;
const CONCURRENCY = 6;

function collect() {
  const found = new Map(); // url -> [{file, id}]
  for (const pillar of readdirSync(CONTENT)) {
    const dir = join(CONTENT, pillar);
    if (!statSync(dir).isDirectory()) continue;
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
      const raw = readFileSync(join(dir, file), 'utf8');
      const front = raw.split('---')[1] ?? '';
      let id = null;
      for (const line of front.split('\n')) {
        const idMatch = /^\s*-\s*id:\s*(\S+)/.exec(line);
        if (idMatch) id = idMatch[1];
        const urlMatch = /^\s*url:\s*(\S+)/.exec(line);
        if (urlMatch?.[1]) {
          const url = urlMatch[1];
          if (!found.has(url)) found.set(url, []);
          found.get(url).push({ file: `${pillar}/${file}`, id });
        }
      }
    }
  }
  return found;
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // Some publishers reject HEAD; fall back to a ranged GET.
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    });
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: { Range: 'bytes=0-0' },
        signal: controller.signal,
      });
    }
    return { ok: res.status < 400, status: res.status };
  } catch (error) {
    return {
      ok: false,
      status: error.name === 'AbortError' ? 'timeout' : 'network error',
    };
  } finally {
    clearTimeout(timer);
  }
}

const urls = [...collect().entries()];
console.log(`Checking ${urls.length} citation URLs across the corpus.\n`);

let failed = 0;
for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = urls.slice(i, i + CONCURRENCY);
  const results = await Promise.all(batch.map(([url]) => probe(url)));
  batch.forEach(([url, uses], index) => {
    const result = results[index];
    if (!result.ok) failed += 1;
    const where = uses.map((u) => `${u.file}#${u.id}`).join(', ');
    console.log(
      `${result.ok ? 'ok  ' : 'FAIL'} ${String(result.status).padEnd(13)} ${url}\n     ${where}`,
    );
  });
}

console.log(
  failed === 0
    ? '\nAll citation URLs resolved.'
    : `\n${failed} citation URL(s) did not resolve.`,
);
process.exit(failed === 0 ? 0 : 1);
