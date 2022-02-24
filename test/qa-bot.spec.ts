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

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
