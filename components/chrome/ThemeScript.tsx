/**
 * Runs before first paint so a reader who chose dark never sees a linen
 * flash. Kept deliberately tiny and dependency-free; it is inlined into the
 * document head, not shipped as a module.
 */
const script = `(function(){try{var d=document.documentElement,p=localStorage.getItem('at-theme');d.dataset.themePref=p==='light'||p==='dark'?p:'system';if(p==='light'||p==='dark')d.dataset.theme=p}catch(e){d.dataset.themePref='system'}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
