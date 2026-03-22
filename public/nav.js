// Shared navigation component
// Include with: <script src="nav.js"></script><nav id="site-nav"></nav>
(function() {
  const pages = [
    {href: 'index.html', label: 'Atlas'},
    {href: 'context.html', label: 'Context'},
    {href: 'data.html', label: 'Data & Downloads'},
    {href: 'research.html', label: 'Essay Guide'},
    {href: 'video.html', label: 'Video Response'},
  ];
  const current = location.pathname.split('/').pop() || 'index.html';
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  nav.style.cssText = 'padding:1rem 0;border-bottom:1px solid #ddd;margin-bottom:2rem;font-size:.9rem';
  nav.innerHTML = pages.map(p => {
    const isActive = current === p.href;
    return `<a href="${p.href}" style="color:${isActive ? '#8b4513' : '#2d5a27'};margin-right:1.5rem;text-decoration:none;border-bottom:1px solid ${isActive ? '#8b4513' : '#2d5a27'};font-weight:${isActive ? 'bold' : 'normal'}">${p.label}</a>`;
  }).join('');
})();
