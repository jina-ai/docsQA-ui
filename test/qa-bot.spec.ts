import { html } from 'lit';
import { fixture, expect, elementUpdated } from '@open-wc/testing';

import { QaBot } from '../src/qa-bot/qa-bot.js';
import '../qabot.js';

describe('QaBot', () => {
  let element: QaBot;
  beforeEach(async () => {
    element = await fixture(html`<qa-bot></qa-bot>`);
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

  it('opens bot', async () => {
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
});
