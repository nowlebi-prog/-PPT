// Quick quote: the first four questions of the inquiry form as buttons, then the filled form or KakaoTalk.
import { inquiryOptions } from './data.mjs';
import { localToday, daysUntil } from './domain.mjs';
import { inquiry } from './inquiry.mjs';

const qz = document.getElementById('qz');
if (qz) {
  const body = qz.querySelector('[data-qz-body]'), bar = qz.querySelector('.qz__prog i'), toastEl = document.querySelector('[data-qz-toast]');
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const today = localToday();
  const steps = [
    { key: 'kind', label: '의뢰 구분', q: '어떤 의뢰인가요?', opts: inquiryOptions.kind },
    { key: 'purpose', label: '자료 용도', q: '어디에 쓸 자료인가요?', opts: inquiryOptions.purpose.map(([v, l]) => [v, v === 'other' ? '기타' : l]) },
    { key: 'service', label: '자료 상태', q: '지금 자료는 어떤 상태인가요?', opts: inquiryOptions.state },
    { key: 'due', label: '필요한 날짜', q: '언제까지 필요하세요?', date: true },
  ];
  const nameOf = (st, v) => st.date ? (v === 'undecided' ? '아직 미정' : v) : (st.opts.find(o => o[0] === v) || [])[1] || v;
  let n = 0, ans = {}, last = null, tt;
  const toast = m => { if (!toastEl) return; toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('on'), 2800); };
  const urgent = () => { const d = daysUntil(ans.due, today); return d !== null && d >= 0 && d <= 7; };
  const summary = () => '[견적 문의] ' + steps.map(s => `${s.label}: ${nameOf(s, ans[s.key])}`).join(' / ');
  const render = () => {
    bar.style.width = ((n + 1) / (steps.length + 1)) * 100 + '%';
    const back = n ? '<button class="qz__back" type="button" data-back>← 이전</button>' : '';
    if (n < steps.length) {
      const st = steps[n];
      const choices = st.date
        ? `<div class="qz__date"><label class="sr-only" for="qz-date">필요한 날짜</label><input type="date" id="qz-date" min="${today}" value="${ans.due && ans.due !== 'undecided' ? ans.due : ''}"><div class="row"><button type="button" data-date-next${ans.due && ans.due !== 'undecided' ? '' : ' disabled'}>이 날짜로</button><button type="button" data-v="undecided">아직 미정</button></div></div>`
        : `<div class="qz__opts">${st.opts.map(([v, l, h]) => `<button type="button" data-v="${esc(v)}"${ans[st.key] === v ? ' class="is-on"' : ''}><b>${esc(l)}</b>${h ? `<small>${esc(h)}</small>` : ''}</button>`).join('')}</div>`;
      body.innerHTML = `<div class="qz__step"><small>${n + 1} / ${steps.length}</small><h3>${st.q}</h3>${choices}${back}</div>`;
    } else {
      const fill = '<button class="qz__btn qz__btn--fill" type="button" data-fill>이어서 쓰기</button>', kakao = '<button class="qz__btn qz__btn--kakao" type="button" data-kakao>카카오톡으로 보내기 ↗</button>';
      body.innerHTML = `<div class="qz__step"><small>정리</small><h3>이렇게 정리됐어요.</h3><ul class="qz__sum">${steps.map(st => `<li><span>${st.label}</span><b>${esc(nameOf(st, ans[st.key]))}</b></li>`).join('')}</ul>${urgent() ? '<p class="qz__tip">급한 일정은 카카오톡이 가장 빨라요.</p>' : ''}<p class="qz__q">이 내용으로 견적 문의를 이어서 쓸까요?</p><div class="qz__acts">${urgent() ? kakao + fill : fill + kakao}</div><p class="qz__hint">카카오톡을 누르면 정리된 내용이 복사돼요. 대화창에 붙여넣기만 하세요.</p>${back}</div>`;
    }
    body.querySelector('input,button:not(.qz__back):not(:disabled)')?.focus({ preventScroll: true });
  };
  const open = e => { e?.preventDefault(); n = 0; ans = {}; last = document.activeElement; qz.hidden = false; requestAnimationFrame(() => qz.classList.add('open')); document.body.style.overflow = 'hidden'; render(); };
  const close = (restore = true) => { qz.classList.remove('open'); document.body.style.overflow = ''; setTimeout(() => { qz.hidden = true; }, 300); if (restore) last?.focus?.({ preventScroll: true }); };
  document.querySelectorAll('[data-quote]').forEach(t => t.addEventListener('click', open));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !qz.hidden) close(); });
  qz.addEventListener('input', e => { if (e.target.id === 'qz-date') { const next = qz.querySelector('[data-date-next]'); if (next) next.disabled = !(e.target.value && e.target.value >= today); } });
  qz.addEventListener('click', async e => {
    if (e.target.closest('[data-close]')) return close();
    if (e.target.closest('[data-date-next]')) { const v = qz.querySelector('#qz-date')?.value; if (v && v >= today) { ans.due = v; n++; render(); } return; }
    const o = e.target.closest('[data-v]');
    if (o) { ans[steps[n].key] = o.dataset.v; n++; return render(); }
    if (e.target.closest('[data-back]')) { n = Math.max(0, n - 1); return render(); }
    if (e.target.closest('[data-fill]')) {
      const sel = { kind: ans.kind, purpose: ans.purpose, service: ans.service, due: ans.due };
      if (inquiry.present) {
        inquiry.prefill(sel);
        close(false);
        document.getElementById('contact')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        setTimeout(() => inquiry.focus(), 650);
        return;
      }
      const q = new URLSearchParams(Object.entries(sel).filter(([, v]) => v));
      location.href = qz.dataset.contact + '?' + q;
      return;
    }
    if (e.target.closest('[data-kakao]')) {
      try { await navigator.clipboard.writeText(summary()); toast('정리된 내용을 복사했어요. 카카오톡 대화창에 붙여넣어 주세요.'); } catch { toast('카카오톡 문의 창을 열었어요.'); }
      window.open(qz.dataset.kakao, '_blank', 'noopener');
    }
  });
}
