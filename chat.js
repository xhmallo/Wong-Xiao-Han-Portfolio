(() => {
  'use strict';

  const endpoint = document.currentScript?.dataset.endpoint;
  if (!endpoint || document.getElementById('xh-chat')) return;

  const MAX_MESSAGE = 1200;
  const MAX_CONTEXT = 7200;
  const MAX_MESSAGES = 12;
  const suggestions = [
    ['Her studies', 'What is Xiao Han studying?'],
    ['Her projects', 'Tell me about Xiao Han’s projects.'],
    ['Her hackathon wins', 'What did Xiao Han achieve at the Tencent Cloud hackathon?']
  ];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function icon(kind) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', kind === 'chat'
      ? 'M20 11.5a8 8 0 0 1-8 8H5l-3 3v-11a9 9 0 0 1 18 0ZM7 9.5h8M7 13.5h5'
      : kind === 'close' ? 'm6 6 12 12M18 6 6 18' : 'M5 12h14m-6-6 6 6-6 6');
    svg.append(path);
    return svg;
  }

  const root = element('div', 'xh-chat');
  root.id = 'xh-chat';
  const launcher = element('button', 'xh-chat-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'xh-chat-panel');
  launcher.append(icon('chat'), element('span', '', 'Ask Xiao Han AI'));

  const panel = element('section', 'xh-chat-panel');
  panel.id = 'xh-chat-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-labelledby', 'xh-chat-title');
  panel.setAttribute('data-lenis-prevent', '');

  const header = element('div', 'xh-chat-header');
  const headingGroup = element('div', 'xh-chat-heading-group');
  const heading = element('h2', 'xh-chat-title', 'Ask Xiao Han AI');
  heading.id = 'xh-chat-title';
  headingGroup.append(heading, element('p', 'xh-chat-subtitle', 'Your guide to the portfolio'));
  const headerActions = element('div', 'xh-chat-header-actions');
  const clear = element('button', 'xh-chat-header-action', '↻');
  clear.type = 'button';
  clear.disabled = true;
  clear.setAttribute('aria-label', 'Restart conversation');
  clear.title = 'Restart conversation';
  const minimise = element('button', 'xh-chat-header-action', '−');
  minimise.type = 'button';
  minimise.setAttribute('aria-label', 'Minimise chat');
  minimise.title = 'Minimise chat';
  const close = element('button', 'xh-chat-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close chat');
  close.append(icon('close'));
  headerActions.append(clear, minimise, close);
  header.append(headingGroup, headerActions);

  const scroll = element('div', 'xh-chat-scroll');
  scroll.setAttribute('data-lenis-prevent', '');
  const introduction = element('p', 'xh-chat-intro', 'Hi! I’m Xiao Han’s AI portfolio assistant. What would you like to know?');
  const suggestionList = element('div', 'xh-chat-suggestions');
  suggestionList.setAttribute('aria-label', 'Suggested questions');
  const suggestionButtons = suggestions.map(([label, question]) => {
    const button = element('button', 'xh-chat-suggestion', label);
    button.type = 'button';
    button.addEventListener('click', () => submit(question));
    suggestionList.append(button);
    return button;
  });
  const messages = element('div', 'xh-chat-messages');
  messages.setAttribute('role', 'log');
  messages.setAttribute('aria-live', 'polite');
  messages.setAttribute('aria-relevant', 'additions');
  messages.setAttribute('aria-label', 'Chat conversation');
  const status = element('div', 'xh-chat-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  scroll.append(introduction, suggestionList, messages, status);

  const footer = element('div', 'xh-chat-footer');
  const form = element('form', 'xh-chat-form');
  const input = element('textarea', 'xh-chat-input');
  input.rows = 1;
  input.maxLength = MAX_MESSAGE;
  input.placeholder = 'Ask a question…';
  input.setAttribute('aria-label', 'Your question about Xiao Han');
  input.setAttribute('autocomplete', 'off');
  const send = element('button', 'xh-chat-send');
  send.type = 'submit';
  send.disabled = true;
  send.setAttribute('aria-label', 'Send question');
  send.append(icon('arrow'));
  form.append(input, send);
  const privacy = element('p', 'xh-chat-privacy', 'Questions are processed by Cloudflare AI. This site does not save your conversation. Avoid sharing sensitive information. AI replies may be inaccurate.');
  footer.append(form, privacy);
  panel.append(header, scroll, footer);
  root.append(panel, launcher);
  document.body.append(root);

  let history = [];
  let pending = false;
  let controller;
  let generation = 0;

  function scrollToLatest() {
    scroll.scrollTo({ top: scroll.scrollHeight, behavior: 'instant' });
  }

  function setOpen(open, restoreFocus = true) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-open', open);
    if (open) input.focus({ preventScroll: true });
    else if (restoreFocus) launcher.focus({ preventScroll: true });
  }

  function updateControls() {
    send.disabled = pending || !input.value.trim();
    send.setAttribute('aria-label', pending ? 'Waiting for a reply' : 'Send question');
    input.readOnly = pending;
    form.setAttribute('aria-busy', String(pending));
    suggestionButtons.forEach(button => { button.disabled = pending; });
    clear.disabled = messages.childElementCount === 0;
  }

  function resizeInput() {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
  }

  function appendMessage(role, text) {
    const bubble = element('div', `xh-chat-message xh-chat-message-${role}`);
    bubble.append(element('span', 'xh-chat-speaker', role === 'user' ? 'YOU' : 'PORTFOLIO ASSISTANT'));
    bubble.append(element('p', '', text));
    messages.append(bubble);
    while (messages.childElementCount > 40) messages.firstElementChild.remove();
    scrollToLatest();
  }

  function contextFor(question) {
    const context = [...history, { role: 'user', content: question }];
    while (context.length > MAX_MESSAGES || context.reduce((count, message) => count + message.content.length, 0) > MAX_CONTEXT) {
      if (context.length <= 1) break;
      context.splice(0, 2);
    }
    return context;
  }

  async function submit(rawQuestion, retry = false) {
    const question = rawQuestion.trim();
    if (pending || !question || question.length > MAX_MESSAGE) return;
    const requestGeneration = ++generation;
    const context = contextFor(question);
    const activeController = new AbortController();
    controller = activeController;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; activeController.abort(); }, 30000);
    pending = true;
    status.replaceChildren(element('span', 'xh-chat-thinking', 'Thinking…'));
    if (!retry) appendMessage('user', question);
    suggestionList.hidden = true;
    input.value = '';
    resizeInput();
    updateControls();
    scrollToLatest();
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: context }),
        signal: activeController.signal
      });
      if (requestGeneration !== generation) return;
      if (!response.ok) {
        const failure = new Error('request_failed');
        failure.status = response.status;
        throw failure;
      }
      const data = await response.json();
      if (requestGeneration !== generation) return;
      if (typeof data.reply !== 'string' || !data.reply.trim() || data.reply.length > 3000) throw new Error('invalid_reply');
      const reply = data.reply.trim();
      history = [...context, { role: 'assistant', content: reply }];
      status.replaceChildren();
      appendMessage('assistant', reply);
    } catch (error) {
      if (requestGeneration !== generation) return;
      const message = error.status === 429
        ? 'A few too many questions at once. Please wait a minute, then try again.'
        : timedOut
          ? 'That reply is taking a little longer. Please try again.'
          : 'I couldn’t get a reply right now. Please try again, or use the contact links below.';
      const retryButton = element('button', 'xh-chat-retry', 'Try again ↗');
      retryButton.type = 'button';
      retryButton.addEventListener('click', () => submit(question, true));
      status.replaceChildren(element('p', 'xh-chat-error', message), retryButton);
      scrollToLatest();
    } finally {
      clearTimeout(timeout);
      if (requestGeneration === generation) {
        pending = false;
        controller = undefined;
        updateControls();
      }
    }
  }

  launcher.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));
  minimise.addEventListener('click', () => setOpen(false));
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  });
  input.addEventListener('input', () => { resizeInput(); updateControls(); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      submit(input.value);
    }
  });
  form.addEventListener('submit', event => { event.preventDefault(); submit(input.value); });
  clear.addEventListener('click', () => {
    generation++;
    controller?.abort();
    controller = undefined;
    pending = false;
    history = [];
    messages.replaceChildren();
    status.replaceChildren();
    suggestionList.hidden = false;
    input.value = '';
    resizeInput();
    updateControls();
    input.focus({ preventScroll: true });
  });
  document.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('.menu-toggle, [data-panel]') && !panel.hidden) setOpen(false, false);
  }, true);
})();
