import { html } from 'lit';
import { fixture, expect, elementUpdated, fixtureCleanup } from '@open-wc/testing';

import { QaBot } from '../src/qa-bot/qa-bot.js';
import '../qabot.js';

describe('QaBot', () => {
  let element: QaBot;

  beforeEach(async () => {
    element = await fixture(html`<qa-bot></qa-bot>`);
  });

  afterEach(async () => {
    localStorage.clear();
    fixtureCleanup();
  });

  it('renders its container', () => {
    const container = element.shadowRoot!.querySelector('*')!;
    expect(container).to.exist;
  });

  it('passes the a11y audit on widget', async () => {
    const widget = element.shadowRoot?.querySelector('.qabot.widget');
    await expect(widget).to.be.accessible();
  });

  it('passes the a11y audit on card', async () => {
    const card = element.shadowRoot?.querySelector('.qabot.card');
    await expect(card).to.be.accessible();
  });

  it('bot closes by default', () => {
    const widget = element.shadowRoot?.querySelector('.qabot.widget');
    const card = element.shadowRoot?.querySelector('.qabot.card');
    expect(widget).to.have.attr('visible');
    expect(card).not.to.have.attr('visible');
  });

  it('sets bot opened', async () => {
    const widget = element.shadowRoot?.querySelector('.qabot.widget');
    const card = element.shadowRoot?.querySelector('.qabot.card');
    element.open = true;
    await elementUpdated(element);
    expect(widget).not.to.have.attr('visible');
    expect(card).to.have.attr('visible');
  });

  it('sets title', async () => {
    const botName = 'QA BOT TITLE';
    element.title = botName;
    await elementUpdated(element);
    const nameElem = element.shadowRoot?.querySelector('.card__title__content .name');
    expect(nameElem).to.have.text(botName);
  });

  it('sets description', async () => {
    const botDesc = 'QA BOT DESCRIPTION';
    element.description = botDesc;
    element.loadPreferences();
    await elementUpdated(element);
    const descriptionElem = element.shadowRoot?.querySelector('.card__title__content .description');
    expect(descriptionElem).to.have.text(botDesc);
  });

  it('sets avatar', async () => {
    const avatarSrc = 'https://docs.jina.ai/_static/logo-light.svg';
    element.botAvatar = avatarSrc;
    await elementUpdated(element);
    const widgetAvatarElem = element.shadowRoot?.querySelector('.widget .badge img');
    const headerAvatarElem = element.shadowRoot?.querySelector('.card__header .avatar img');
    const contentAvatarElem = element.shadowRoot?.querySelector('.card__content .avatar img');
    expect(widgetAvatarElem).to.have.attribute('src', avatarSrc);
    expect(headerAvatarElem).to.have.attribute('src', avatarSrc);
    expect(contentAvatarElem).to.have.attribute('src', avatarSrc);
  });

  it('sets header background', async () => {
    const backgroundSrc = 'https://docs.jina.ai/_static/logo-light.svg';
    element.headerBackground = backgroundSrc;
    await elementUpdated(element);
    const headerStyles = window.getComputedStyle(element.shadowRoot?.querySelector('.card__header') as HTMLElement);
    expect(headerStyles.backgroundImage).to.equal(`url("${backgroundSrc}")`);
  });

  it('sets theme', async () => {
    const theme = 'infer';
    const bgColor = 'rgb(227, 89, 89)';
    const fgColor = 'rgb(246, 238, 238)';
    element.theme = theme;
    element.bgColor = bgColor;
    element.fgColor = fgColor;
    await elementUpdated(element);
    const widgetStyles = window.getComputedStyle(element.shadowRoot?.querySelector('.qabot.widget') as HTMLElement);
    const card = element.shadowRoot?.querySelector('.qabot.card');
    const headerStyles = window.getComputedStyle(card?.querySelector('.card__header') as HTMLElement);
    const questionStyles = window.getComputedStyle(card?.querySelector('.question') as HTMLElement);
    expect(widgetStyles.backgroundColor).to.equal(bgColor);
    expect(headerStyles.backgroundColor).to.equal(fgColor);
    expect(questionStyles.color).to.equal(fgColor);
  });

  it('sets orientation', async () => {
    let botStyles = window.getComputedStyle(element as HTMLElement);
    expect(parseInt(botStyles.right.slice(0, -2), 10)).to.lessThan(parseInt(botStyles.left.slice(0, -2), 10));
    const orientation = 'bottom-left';
    element.orientation = orientation;
    await elementUpdated(element);
    botStyles = window.getComputedStyle(element as HTMLElement);
    expect(parseInt(botStyles.right.slice(0, -2), 10)).to.greaterThan(parseInt(botStyles.left.slice(0, -2), 10));
  });

it('renders tip', async () => {
    const tipElem = element.shadowRoot?.querySelector('.tip');
    expect(window.getComputedStyle(tipElem as HTMLElement).display).to.equal('none');
    element.showTip = true;
    await elementUpdated(element);
    expect(window.getComputedStyle(tipElem as HTMLElement).display).not.to.equal('none');
    expect(tipElem).to.have.text(element.preferences.texts.tip);
  });

  it('sets tip', async () => {
    const tipElem = element.shadowRoot?.querySelector('.tip');
    const span = document.createElement('span');
    const text = 'HELLO, THREE!';
    span.setAttribute('slot', 'texts');
    span.setAttribute('for', 'tip');
    span.innerText = text;
    element.appendChild(span);
    element.showTip = true;
    element.loadPreferences();
    await elementUpdated(element);
    expect(window.getComputedStyle(tipElem as HTMLElement).display).not.to.equal('none');
    expect(tipElem).to.have.text(text);
  });

  it('hides tip after open', async () => {
    element.server = 'https://jina-ai-jina.docsqa.jina.ai';
    const tipElem = element.shadowRoot?.querySelector('.tip');
    expect(window.getComputedStyle(tipElem as HTMLElement).display).to.equal('none');
    element.showTip = true;
    await elementUpdated(element);
    expect(window.getComputedStyle(tipElem as HTMLElement).display).not.to.equal('none');

    element.openCard();
    await element.closeCard();
    await elementUpdated(element);
    expect(window.getComputedStyle(tipElem as HTMLElement).display).to.equal('none');
  });

  it('hides tip on mobile', async () => {
    element.smallViewPort = true;
    const tipElem = element.shadowRoot?.querySelector('.tip');
    expect(window.getComputedStyle(tipElem as HTMLElement).display).to.equal('none');
    element.showTip = true;
    await elementUpdated(element);
    expect(window.getComputedStyle(tipElem as HTMLElement).display).to.equal('none');
  });

  it('sets greetings', async () => {
    const dl = document.createElement('dl');
    dl.setAttribute('slot', 'greetings');
    const greeting = 'WELCOME!';
    const dt = document.createElement('dt');
    dt.innerText = greeting;
    dl.appendChild(dt);
    const questions = ['Q1', 'Q2', 'Q3'];
    questions.forEach((item) => {
        const elem = document.createElement('dd');
        elem.innerText = item;
        dl.appendChild(elem);
    });
    element.appendChild(dl);
    element.loadPreferences();
    element.requestUpdate();
    await elementUpdated(element);
    const hintElem = element.shadowRoot?.querySelector('.answer-hint__content');
    const greetingElem = hintElem?.querySelector('.greeting');
    const questionElems = hintElem?.querySelectorAll('.question');
    expect(greetingElem).to.have.text(greeting);
    questionElems?.forEach((item, index) => {
        expect(item).to.have.text(questions[index]);
    });
  });

  it('asks question', async () => {
    element.server = 'https://jina-ai-jina.docsqa.jina.ai';
    element.toggleOpen();
    await elementUpdated(element);

    const inputElem = element.shadowRoot?.querySelector('.qabot__control textarea') as HTMLTextAreaElement;
    const submitElem = element.shadowRoot?.querySelector('.qabot__control button') as HTMLButtonElement;
    const question = 'What\'s jina';
    inputElem!.value = question;
    submitElem.click();
    await elementUpdated(element);
    const questionElem = element.shadowRoot?.querySelector('.qa-pair .question');
    const answerElem = element.shadowRoot?.querySelector('.qa-pair .answer');
    expect(questionElem).to.be.displayed;
    expect(answerElem).to.be.displayed;
    expect(questionElem).to.have.trimmed.text(question);
  });

  it('clicks default question', async () => {
    element.server = 'https://jina-ai-jina.docsqa.jina.ai';
    element.toggleOpen();
    await elementUpdated(element);

    const defaultQuestionElem = element.shadowRoot?.querySelector('.question button') as HTMLButtonElement;
    defaultQuestionElem.click();
    await elementUpdated(element);
    const questionElem = element.shadowRoot?.querySelector('.qa-pair .question');
    const answerElem = element.shadowRoot?.querySelector('.qa-pair .answer');
    expect(questionElem).to.be.displayed;
    expect(answerElem).to.be.displayed;
    expect(questionElem).to.have.trimmed.text(defaultQuestionElem.innerText);
  });

  it('infers parent background color', async () => {
    const bgColor = 'rgb(227, 89, 89)';
    const parentNode = document.createElement('div');
    parentNode.style.backgroundColor = bgColor;

    const elem = await fixture(html`<qa-bot></qa-bot>`, { parentNode });
    const widgetStyles = window.getComputedStyle(elem.shadowRoot?.querySelector('.qabot.widget') as HTMLElement);
    expect(widgetStyles.backgroundColor).to.equal(bgColor);
  });

  it('infers css variables', async () => {
    const bgColor = 'rgb(227, 89, 89)';
    const fgColor = 'rgb(246, 238, 238)';
    const parentNode = document.createElement('div');
    parentNode.style.setProperty('--color-background-primary', bgColor);
    parentNode.style.setProperty('--color-brand-primary', fgColor);

    const elem = await fixture(html`<qa-bot></qa-bot>`, { parentNode });
    const widgetStyles = window.getComputedStyle(elem.shadowRoot?.querySelector('.qabot.widget') as HTMLElement);
    const card = elem.shadowRoot?.querySelector('.qabot.card');
    const headerStyles = window.getComputedStyle(card?.querySelector('.card__header') as HTMLElement);
    const questionStyles = window.getComputedStyle(card?.querySelector('.question') as HTMLElement);
    expect(widgetStyles.backgroundColor).to.equal(bgColor);
    expect(headerStyles.backgroundColor).to.equal(fgColor);
    expect(questionStyles.color).to.equal(fgColor);
  });

  it('infers theme color', async () => {
    const fgColor = 'rgb(227, 89, 89)';
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', fgColor);
    document.head.appendChild(meta);

    const elem = await fixture(html`<qa-bot></qa-bot>`);
    const card = elem.shadowRoot?.querySelector('.qabot.card');
    const headerStyles = window.getComputedStyle(card?.querySelector('.card__header') as HTMLElement);
    const questionStyles = window.getComputedStyle(card?.querySelector('.question') as HTMLElement);
    expect(headerStyles.backgroundColor).to.equal(fgColor);
    expect(questionStyles.color).to.equal(fgColor);
  });

  it('infers header color', async () => {
    const fgColor = 'rgb(227, 89, 89)';
    const header = document.createElement('header');
    header.style.backgroundColor = fgColor;
    document.body.appendChild(header);

    const elem = await fixture(html`<qa-bot></qa-bot>`);
    const card = elem.shadowRoot?.querySelector('.qabot.card');
    const headerStyles = window.getComputedStyle(card?.querySelector('.card__header') as HTMLElement);
    const questionStyles = window.getComputedStyle(card?.querySelector('.question') as HTMLElement);
    expect(headerStyles.backgroundColor).to.equal(fgColor);
    expect(questionStyles.color).to.equal(fgColor);
  });

  it('loads local question and answer', async () => {
    const qaPair = [{
        ts: Date.now(),
        useTemplate: 'text',
        answer: {
            text: 'this is an answer',
        },
        question: 'this is a question',
        STATUS: 1
    }];
    localStorage.setItem('qabot:channel:default', JSON.stringify(qaPair));

    element.server = 'https://jina-ai-jina.docsqa.jina.ai';
    element.toggleOpen();
    await elementUpdated(element);
    const questionElem = element.shadowRoot?.querySelector('.qa-pair .question');
    const answerElem = element.shadowRoot?.querySelector('.qa-pair .answer');
    expect(questionElem).to.be.displayed;
    expect(answerElem).to.be.displayed;
    expect(questionElem).to.have.trimmed.text(qaPair[0].question);
  });

  it('loads local answer with text and link template', async () => {
    const qaPair = [{
        ts: Date.now(),
        useTemplate: 'text-with-link',
        answer: {
            text: 'this is an answer',
            uri: 'http://doc.jina.ai',
        },
        question: 'this is a question',
        STATUS: 1
    }];
    localStorage.setItem('qabot:channel:default', JSON.stringify(qaPair));

    element.server = 'https://jina-ai-jina.docsqa.jina.ai';
    element.toggleOpen();
    await elementUpdated(element);
    const answerElem = element.shadowRoot?.querySelector('.qa-pair .answer');
    expect(answerElem).to.be.displayed;
    expect(answerElem?.querySelector('.talktext a')).to.be.displayed;
  });

  it('loads local answer with text and multiple links template', async () => {
    const qaPair = [{
        ts: Date.now(),
        useTemplate: 'text-with-multiple-links',
        answer: {
            matches: [
                {
                    text: 'this is an answer1',
                    uri: 'http://doc.jina.ai',
                },
                {
                    text: 'this is an answer2',
                    uri: 'http://doc.jina.ai',
                }
            ]
        },
        question: 'this is a question',
        STATUS: 1
    }];
    localStorage.setItem('qabot:channel:default', JSON.stringify(qaPair));

    element.server = 'https://jina-ai-jina.docsqa.jina.ai';
    element.toggleOpen();
    await elementUpdated(element);
    const answerElem = element.shadowRoot?.querySelector('.qa-pair .answer');
    expect(answerElem).to.be.displayed;
    expect(answerElem?.querySelectorAll('.talktext a').length).to.equal(qaPair[0].answer.matches.length);
  });

  it('loads local answer with error template', async () => {
    const qaPair = [{
        ts: Date.now(),
        useTemplate: 'error',
        answer: {
            text: 'this is an answer',
        },
        question: 'this is a question',
        STATUS: 1
    }];
    localStorage.setItem('qabot:channel:default', JSON.stringify(qaPair));

    element.server = 'https://jina-ai-jina.docsqa.jina.ai';
    element.toggleOpen();
    await elementUpdated(element);
    const answerElem = element.shadowRoot?.querySelector('.qa-pair .answer');
    expect(answerElem).to.be.displayed;
    expect(answerElem?.querySelector('.talktext p')).to.have.trimmed.text(`😵‍💫 Sorry! Something somehow went wrong.\n ⛑ ️Please ping me later. 🙇‍♂️`);
  });

});
