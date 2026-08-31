/**
 * The foundation's acceptance check: renders the running site at the three
 * breakpoints in both themes, and verifies the parts that are easy to break
 * and hard to notice - horizontal overflow, console errors, the theme cycle,
 * theme persistence, first-Tab focus, and the no-JavaScript fallback.
 *
 *   npx next build && npx next start -p 3111
 *   node scripts/check-layout.mjs
 *
 * Screenshots land in .screenshots/ (git-ignored).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const ORIGIN = process.env.CHECK_ORIGIN ?? 'http://localhost:3111';
const EXECUTABLE = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const OUT = '.screenshots';

const SIZES = [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];

let failures = 0;
const check = (ok, label, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${label}${detail ? `  ${detail}` : ''}`);
};

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  args: [
    '--disable-background-networking',
    '--no-first-run',
    '--disable-component-update',
  ],
});

/** The sandbox has no route off-box; block anything that is not the site. */
const localOnly = (ctx) =>
  ctx.route('**/*', (route) =>
    route.request().url().startsWith(ORIGIN) ? route.continue() : route.abort(),
  );

for (const theme of ['light', 'dark']) {
  for (const size of SIZES) {
    const ctx = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      colorScheme: theme,
    });
    await localOnly(ctx);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

    await page.goto(ORIGIN, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${OUT}/${theme}-${size.name}.png`, fullPage: true });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    const expected = theme === 'dark' ? 'rgb(15, 30, 28)' : 'rgb(243, 238, 228)';

    check(
      overflow === 0,
      `${theme}/${size.name} no horizontal overflow`,
      `${overflow}px`,
    );
    check(bg === expected, `${theme}/${size.name} ground follows the theme`, bg);
    check(errors.length === 0, `${theme}/${size.name} console clean`, errors[0] ?? '');
    await ctx.close();
  }
}

// Theme control: cycles system -> light -> dark and survives a reload.
{
  const ctx = await browser.newContext({ colorScheme: 'light' });
  await localOnly(ctx);
  const page = await ctx.newPage();
  await page.goto(ORIGIN, { waitUntil: 'load' });
  const toggle = page.getByRole('button', { name: /change colour theme/i });
  const pref = () => page.evaluate(() => document.documentElement.dataset.themePref);

  check((await pref()) === 'system', 'theme starts on system');
  await toggle.click();
  check((await pref()) === 'light', 'theme cycles to light');
  await toggle.click();
  check((await pref()) === 'dark', 'theme cycles to dark');
  await toggle.click();
  check((await pref()) === 'system', 'theme cycles back to system');

  await toggle.click();
  await toggle.click();
  await page.goto(ORIGIN, { waitUntil: 'domcontentloaded' });
  const early = await page.evaluate(() => document.documentElement.dataset.theme);
  check(early === 'dark', 'chosen theme applies before first paint');

  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => {
    const el = document.activeElement;
    const rect = el.getBoundingClientRect();
    return {
      text: el.textContent?.trim(),
      visible: rect.width > 0 && rect.height > 0,
      outline: parseFloat(getComputedStyle(el).outlineWidth),
    };
  });
  check(
    first.text === 'Skip to content',
    'first Tab stop is the skip link',
    first.text ?? '',
  );
  check(first.visible && first.outline >= 2, 'skip link is visible when focused');
  await ctx.close();
}

// Without JavaScript the theme control cannot work, so it is not offered.
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  await localOnly(ctx);
  const page = await ctx.newPage();
  await page.goto(ORIGIN, { waitUntil: 'load' });
  check(
    !(await page.locator('.theme-toggle').first().isVisible()),
    'theme control hidden without JavaScript',
  );
  check(
    (await page.getByRole('link', { name: 'Sleep' }).count()) > 0,
    'navigation still renders without JavaScript',
  );
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? '\nall checks passed' : `\n${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
