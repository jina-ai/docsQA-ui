import type { QaBot } from '../qa-bot';

function isOverlapping(e1: Element, e2: Element) {
    const rect1 = e1 instanceof Element ? e1.getBoundingClientRect() : false;
    const rect2 = e2 instanceof Element ? e2.getBoundingClientRect() : false;

    let overlap = false;

    if (rect1 && rect2) {
        overlap = !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
        return overlap;
    }

    return overlap;
}

export default function dodgeRtdBadge(this: QaBot) {
    const theBadge = document.querySelector('.rst-badge');
    if (!theBadge) {
        return;
    }
    if (this.orientation !== 'bottom-right') {
        return;
    }

    if (this.style.bottom || this.style.right) {
        return;
    }

    if (!isOverlapping(theBadge, this)) {
        return;
    }

    this.style.bottom = `calc(1.25em + 80px)`;
}
