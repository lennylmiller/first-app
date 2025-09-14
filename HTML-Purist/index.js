//* This is a comment */

class SmileyEmoji extends HTMLElement {
  constructor() {
    super();
    this.innerText = '😊';
  }
}
customElements.define('smiley-emoji', SmileyEmoji);

class AddSmileyBefore extends HTMLSpanElement {
  constructor() {
    super();
    this.innerText = `😊 ${this.innerText}`;
  }
}
customElements.define('add-smiley-before', AddSmileyBefore, { extends: 'span' });

class AddSmileyAfter extends HTMLSpanElement {
  constructor() {
    super();
    this.innerText = `${this.innerText} 😊`;
  }
}
customElements.define('add-smiley-after', AddSmileyAfter, { extends: 'span' });
