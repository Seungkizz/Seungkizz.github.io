/* Shared rendering helpers keep project cards and detail views consistent. */
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const badges = (items, core = false) => items.length ? `<div class="tags${core ? ' core-tags' : ''}">${items.map(item => `<span>${escapeHTML(item)}</span>`).join('')}</div>` : '';
const list = items => `<ul class="task-list">${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
const externalLink = (url, label) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} <span aria-hidden="true">↗</span></a>`;
const projectGrid = document.querySelector('#project-grid');
function renderProjects(filter = 'featured') {
  const projects = careerProjects.filter(project => filter === 'all' || project.featured);
  projectGrid.innerHTML = projects.map(project => {
    const primary = project.primary === true;
    const supporting = project.featured && !primary;
    if (primary) {
      return `<article id="${project.id}" class="card project-card project-primary project-compact"><div class="project-top"><span class="category">MAIN PROJECT</span><span class="period">${escapeHTML(project.period)}</span></div><h3>리테일 결제 승인서버</h3><p class="compact-subtitle">백엔드 개발 · 레거시 전환 · 운영 안정화</p><div class="primary-highlights"><section><h4>레거시 전환</h4><p>C# → Java·Spring</p></section><section><h4>평균 승인시간</h4><p>9초 → 4.5초</p></section><section><h4>수기반품 API</h4><p>고객 결제 취소 정상화</p></section></div><dl class="contribution-list"><div><dt>결제 연동</dt><dd>직승인·VAN·간편결제 이관 / KLSC 전문 수용</dd></div><div><dt>신규 수단</dt><dd>라인페이 · 토스페이 · 여성바우처</dd></div><div><dt>매입·모니터링</dt><dd>간편결제 매입 표준화 / 승인·대사 실시간 모니터링</dd></div><div><dt>장애 대응</dt><dd>VAN 우회승인 · AWS DR 전환 · 장애 결제수단 차단</dd></div><div><dt>추가 고도화</dt><dd>신용카드 매입 공통화 · 망취소</dd></div></dl><p class="compact-footnote">성과·진행 상태 기준: ${escapeHTML(project.sourceDate)}</p></article>`;
    }

    const facts = primary || !supporting
      ? `<dl class="project-facts"><div><dt>담당 역할</dt><dd>${escapeHTML(project.role)}</dd></div><div><dt>핵심 구현</dt><dd>${escapeHTML(project.tasks[0])}</dd></div><div><dt>구현 결과</dt><dd>${escapeHTML(project.result)}</dd></div></dl>`
      : `<p class="supporting-result">${escapeHTML(project.result)}</p>`;
    return `<article class="card project-card${primary ? ' project-primary' : supporting ? ' project-supporting' : ''}"><div class="project-top"><span class="category">${primary ? 'MAIN PROJECT · 현재 담당' : supporting ? '이전 주요 프로젝트' : '실무 프로젝트'}</span><span class="period">${escapeHTML(project.period)}</span></div><h3>${escapeHTML(project.title)}</h3><p class="project-summary">${escapeHTML(project.summary)}</p>${facts}${badges(project.tech)}<button type="button" class="detail-button" data-project="${project.id}">${escapeHTML(project.title)}<span class="sr-only"> 프로젝트</span> 상세보기 <span aria-hidden="true">↗</span></button></article>`;
  }).join('');
  document.querySelector('#project-count').textContent = `${projects.length}개 프로젝트 표시 중`;
}
renderProjects();
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  renderProjects(button.dataset.filter);
}));
const dialog = document.querySelector('#project-dialog');
let detailTrigger;
projectGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-project]');
  if (!button) return;
  openProject(button.dataset.project, button);
});
function openProject(id, trigger) {
  const project = careerProjects.find(item => item.id === id);
  if (!project) return;
  detailTrigger = trigger;
  document.querySelector('#detail-content').innerHTML = `<p class="period">${escapeHTML(project.period)}</p><h2 id="detail-title">${escapeHTML(project.title)}</h2><p class="detail-role">${escapeHTML(project.role)}</p>${badges(project.tech, true)}<section class="detail-section"><h3>01. 프로젝트 배경</h3><p>${escapeHTML(project.summary)}</p></section><section class="detail-section"><h3>02. 해결할 과제</h3><p>${escapeHTML(project.problem)}</p></section><section class="detail-section"><h3>03. 해결 과정과 주요 구현</h3>${list(project.tasks)}${project.workstreams ? `<div class="workstreams"><h4>세부 수행 이력</h4><p class="caption">진척도·완료 시점·수치 성과는 ${escapeHTML(project.sourceDate)} 기준 자료입니다. 당시 진행 중이던 항목의 이후 완료 여부는 반영하지 않았습니다.</p>${project.workstreams.map(work => `<article class="workstream"><h4>${escapeHTML(work.title)}</h4><p class="workstream-status">${escapeHTML(work.status)}</p>${list(work.items)}</article>`).join('')}</div>` : ''}</section><section class="detail-section"><h3>04. 기술적 의사결정과 구현 기준</h3><p>${escapeHTML(project.decision || project.tasks[0])}</p><p class="caption">구현 기준은 수행 이력에 명시된 내용입니다. 세부 기술 선택의 비교 근거는 공개 자료에 포함되어 있지 않습니다.</p></section><section class="detail-section"><h3>05. 구현 결과</h3><p class="result-box">${escapeHTML(project.result)}</p></section><section class="detail-section"><h3>06. 경험을 통해 다룬 주제</h3><p>${escapeHTML(project.experience || `${project.subtitle} 과정에서 ${project.tech.slice(0, 3).join(' · ')} 기반의 개발·운영을 경험했습니다.`)}</p></section><p class="diagram-note">고객사명과 내부 시스템의 상세 구성은 공개하지 않습니다.</p>`;
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('dialog-open');
  document.querySelector('.close-dialog').focus();
}
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); detailTrigger?.focus(); });
const chronological = [...careerProjects].sort((a, b) => a.period.localeCompare(b.period));
document.querySelector('#career-timeline').innerHTML = chronological.map(project => `<li><span class="timeline-marker" aria-hidden="true"></span><p class="period">${escapeHTML(project.period)}</p><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.primary ? 'C# → Java·Spring 전환, 결제수단 확장 및 운영 안정화' : project.result)}</p>${project.primary ? `<a class="text-button" href="#${project.id}">페이지에서 수행 이력 보기 <span aria-hidden="true">↑</span></a>` : `<button class="text-button" type="button" data-career="${project.id}">담당 업무 보기 <span class="sr-only">${escapeHTML(project.title)}</span><span aria-hidden="true"> ↗</span></button>`}</li>`).join('');
document.querySelector('#career-timeline').addEventListener('click', event => { const button = event.target.closest('[data-career]'); if (button) openProject(button.dataset.career, button); });
const stackGroups = [
  {name:'Backend', description:'거래 처리와 정산 애플리케이션',core:['Java','Spring'],other:['Servlet','PHP','Spring Framework','MyBatis','C# / .NET']},
  {name:'Database', description:'거래 내역과 정산 데이터',core:['Oracle','SQL'],other:['DB2']},
  {name:'Integration', description:'결제·파일·배치 연계',core:['TCP Socket','REST API','Batch'],other:['SFTP','Webhook','EDI','Nexacro']},
  {name:'Infrastructure & Tools', description:'서비스 운영 환경과 형상 관리',core:['Linux','Apache / Tomcat'],other:['AWS','데이터독','Shell','GitLab']}
];
document.querySelector('#stack-grid').innerHTML = stackGroups.map(group => `<article class="card stack-card"><h3>${group.name}</h3><p>${group.description}</p>${badges(group.core,true)}${badges(group.other)}</article>`).join('');
document.querySelector('#personal-projects').innerHTML = jsonData.portfolioList.map(project => `<article class="archive-card card"><img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title.replace('Framwork','Framework').replaceAll('포토폴리오','포트폴리오'))} 실행 화면" loading="lazy" decoding="async" width="600" height="360"><div class="archive-content"><h3>${escapeHTML(project.title.replace('Framwork','Framework').replaceAll('포토폴리오','포트폴리오'))}</h3><p>${escapeHTML(project.description.replaceAll('포토폴리오','포트폴리오'))}</p>${badges(project.technologies)}<div class="archive-links">${project.liveLink ? externalLink(project.liveLink,'사이트 보기') : ''}${externalLink(project.githubLink,'GitHub 저장소')}</div></div></article>`).join('');
// Native dialog supplies Escape handling, focus containment and modal semantics.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded','false'); nav.classList.remove('is-open'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded',String(open)); nav.classList.toggle('is-open',open); });
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header-inner')) closeMenu(); });
const desktopQuery = window.matchMedia('(min-width: 841px)');
desktopQuery.addEventListener('change', closeMenu);
const navLinks = [...nav.querySelectorAll('a')];
const trackedSections = ['home','about','projects','career','stack','archive','contact'].map(id => document.getElementById(id));
let framePending = false;
function updateActiveSection() {
  const anchor = Math.min(window.innerHeight * .28, 200);
  let active = trackedSections[0];
  trackedSections.forEach(section => { if (section.getBoundingClientRect().top <= anchor) active = section; });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) active = document.getElementById('contact');
  navLinks.forEach(link => { if (link.hash === '#'+active.id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
  framePending = false;
}
window.addEventListener('scroll', () => { if (!framePending) { framePending = true; requestAnimationFrame(updateActiveSection); } }, {passive:true});
window.addEventListener('resize', updateActiveSection);
updateActiveSection();
// Content remains visible if observers or motion effects are unavailable.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } }), {threshold:.08});
  document.querySelectorAll('.section-heading,.expertise-grid,.stack-grid,.archive-grid,.about-context').forEach(element => { element.classList.add('reveal'); observer.observe(element); });
  reducedMotion.addEventListener('change', event => { if (event.matches) { document.querySelectorAll('.reveal').forEach(element => element.classList.add('revealed')); observer.disconnect(); } });
}
