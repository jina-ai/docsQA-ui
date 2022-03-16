import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

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
    expect(widget).to.be.accessible();
  });

  it('passes the a11y audit on card', async () => {
    const card = element.shadowRoot?.querySelector('.qabot.card');
    expect(card).to.be.accessible();
  });
});
