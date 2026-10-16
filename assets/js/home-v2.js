(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const header = $('#header');
  const updateHeader = () => header.classList.toggle('scrolled', scrollY > 18);
  updateHeader();
  addEventListener('scroll', updateHeader, { passive: true });

  const menu = $('.menu-toggle');
  const nav = $('#nav');
  menu.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  });
  $$('a', nav).forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));

  const reveal = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }), { threshold: .12, rootMargin: '0px 0px -30px 0px' });
    reveal.forEach(el => io.observe(el));
  } else reveal.forEach(el => el.classList.add('in'));

  const steps = $$('.approach-steps article');
  if ('IntersectionObserver' in window && innerWidth > 700 && !reduced) {
    const approach = $('#approach');
    const activate = () => {
      const rect = approach.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight * .7 - rect.top) / Math.max(1, rect.height - innerHeight * .15)));
      const index = Math.min(2, Math.floor(progress * 3));
      steps.forEach((step, i) => step.classList.toggle('active', i === index));
      $$('.visual-bars i').forEach((bar, i) => bar.style.opacity = i <= index ? '1' : '.22');
    };
    addEventListener('scroll', activate, { passive: true });
    activate();
  }

  if (finePointer && !reduced) {
    const hero = $('.hero');
    const glow = $('.hero-glow');
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      glow.style.transform = `translate(${x * 32}px,${y * 26}px)`;
    }, { passive: true });
  }

  const compare = $('.compare');
  const compareRange = $('input[type=range]', compare);
  compareRange.addEventListener('input', () => compare.style.setProperty('--split', compareRange.value + '%'));

  const form = $('#contact-form');
  $$('[data-work]').forEach(link => link.addEventListener('click', () => {
    const select = $('select[name=work]', form);
    select.value = link.dataset.work;
    if (!select.value) select.value = '상담 후 결정';
    const message = $('textarea[name=message]', form);
    const note = '[' + link.dataset.work + '] 문의';
    if (!message.value.includes(note)) message.value = (message.value ? message.value + '\n\n' : '') + note;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = $('.form-status', form);
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const body = [
      '성함: ' + data.name,
      '연락처: ' + data.phone,
      '이메일: ' + data.email,
      '희망 일정: ' + (data.due || '-'),
      '필요한 작업: ' + data.work,
      '예산 범위: ' + (data.budget || '-'),
      '자료 링크: ' + (data.link || '-'),
      '',
      '[문의 내용]',
      data.message
    ].join('\n');
    location.href = 'mailto:youstar_ppt@naver.com?subject=' + encodeURIComponent('[유별난PPT 작업 문의] ' + data.name + ' / ' + data.work) + '&body=' + encodeURIComponent(body);
    status.textContent = '메일 앱이 열리면 내용을 확인하고 전송해 주세요.';
  });

  const dialog = $('#quote-dialog');
  const quoteForm = $('#quote-form');
  const quoteSteps = $$('.quote-step', quoteForm);
  let quoteIndex = 0;
  const showQuoteStep = () => {
    quoteSteps.forEach((step, index) => step.classList.toggle('active', index === quoteIndex));
    $('.quote-progress', dialog).textContent = String(quoteIndex + 1).padStart(2, '0') + ' / 04';
    $('.quote-back', dialog).style.visibility = quoteIndex ? 'visible' : 'hidden';
    $('.quote-next', dialog).textContent = quoteIndex === 3 ? '문의서에 담기 ↗' : '다음 ↗';
  };
  $$('.quote-trigger').forEach(button => button.addEventListener('click', () => {
    quoteIndex = 0;
    showQuoteStep();
    dialog.showModal();
  }));
  $('.quote-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  $('.quote-back', dialog).addEventListener('click', () => { quoteIndex = Math.max(0, quoteIndex - 1); showQuoteStep(); });
  $('.quote-next', dialog).addEventListener('click', () => {
    const current = quoteSteps[quoteIndex];
    if (!$('input:checked', current)) {
      const first = $('input', current);
      first.focus();
      return;
    }
    if (quoteIndex < 3) {
      quoteIndex++;
      showQuoteStep();
      return;
    }
    const data = Object.fromEntries(new FormData(quoteForm));
    $('select[name=work]', form).value = data.type === 'IR · 데모데이' ? 'IR · 데모데이' : 'PPT 기획·디자인';
    $('input[name=due]', form).value = data.timing;
    $('textarea[name=message]', form).value = [
      '[빠른 견적에서 선택]',
      '자료 유형: ' + data.type,
      '자료 상태: ' + data.state,
      '예상 분량: ' + data.pages,
      '희망 일정: ' + data.timing
    ].join('\n');
    dialog.close();
    $('#contact').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    setTimeout(() => $('input[name=name]', form).focus({ preventScroll: true }), 500);
  });
  showQuoteStep();
  $('#year').textContent = String(new Date().getFullYear());
})();
