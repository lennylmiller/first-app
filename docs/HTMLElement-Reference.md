
# HTMLElement Reference

This document provides a comprehensive list of `HTMLElement` subclasses, which represent the various HTML elements available in the browser.

## Comprehensive List of HTMLElement Interfaces

### General Elements

* `HTMLAnchorElement` (`<a>`)
* `HTMLAreaElement` (`<area>`)
* `HTMLAudioElement` (`<audio>`)
* `HTMLBaseElement` (`<base>`)
* `HTMLBodyElement` (`<body>`)
* `HTMLBRElement` (`<br>`)
* `HTMLButtonElement` (`<button>`)
* `HTMLCanvasElement` (`<canvas>`)
* `HTMLDataElement` (`<data>`)
* `HTMLDataListElement` (`<datalist>`)
* `HTMLDetailsElement` (`<details>`)
* `HTMLDialogElement` (`<dialog>`)
* `HTMLDivElement` (`<div>`)
* `HTMLDListElement` (`<dl>`)
* `HTMLEmbedElement` (`<embed>`)
* `HTMLFieldSetElement` (`<fieldset>`)
* `HTMLFormElement` (`<form>`)
* `HTMLHeadElement` (`<head>`)
* `HTMLHeadingElement` (`<h1>` - `<h6>`)
* `HTMLBRElement` (`<hr>`)
* `HTMLHtmlElement` (`<html>`)
* `HTMLIFrameElement` (`<iframe>`)
* `HTMLImageElement` (`<img>`)
* `HTMLInputElement` (`<input>`)
* `HTMLLabelElement` (`<label>`)
* `HTMLLegendElement` (`<legend>`)
* `HTMLLIElement` (`<li>`)
* `HTMLLinkElement` (`<link>`)
* `HTMLMapElement` (`<map>`)
* `HTMLMediaElement` (base for `<audio>` and `<video>`)
* `HTMLMenuElement` (`<menu>`)
* `HTMLMetaElement` (`<meta>`)
* `HTMLMeterElement` (`<meter>`)
* `HTMLModElement` (`<ins>`, `<del>`)
* `HTMLObjectElement` (`<object>`)
* `HTMLOListElement` (`<ol>`)
* `HTMLOptGroupElement` (`<optgroup>`)
* `HTMLOptionElement` (`<option>`)
* `HTMLOutputElement` (`<output>`)
* `HTMLParagraphElement` (`<p>`)
* `HTMLPictureElement` (`<picture>`)
* `HTMLPreElement` (`<pre>`)
* `HTMLProgressElement` (`<progress>`)
* `HTMLQuoteElement` (`<blockquote>`, `<q>`)
* `HTMLScriptElement` (`<script>`)
* `HTMLSelectElement` (`<select>`)
* `HTMLSlotElement` (`<slot>`)
* `HTMLSourceElement` (`<source>`)
* `HTMLSpanElement` (`<span>`)
* `HTMLStyleElement` (`<style>`)
* `HTMLTableCaptionElement` (`<caption>`)
* `HTMLTableCellElement` (`<td>`, `<th>`)
* `HTMLTableColElement` (`<col>`, `<colgroup>`)
* `HTMLTableElement` (`<table>`)
* `HTMLTableRowElement` (`<tr>`)
* `HTMLTableSectionElement` (`<thead>`, `<tbody>`, `<tfoot>`)
* `HTMLTemplateElement` (`<template>`)
* `HTMLTextAreaElement` (`<textarea>`)
* `HTMLTimeElement` (`<time>`)
* `HTMLTitleElement` (`<title>`)
* `HTMLTrackElement` (`<track>`)
* `HTMLUListElement` (`<ul>`)
* `HTMLVideoElement` (`<video>`)

### Other Standard Elements

* `HTMLAddressElement` (`<address>`)
* `HTMLArticleElement` (`<article>`)
* `HTMLAsideElement` (`<aside>`)
* `HTMLElement` (used for elements with no specific interface, like `<b>`, `<i>`, `<u>`, `<em>`, `<strong>`, `<cite>`, `<code>`, `<dfn>`, `<kbd>`, `<samp>`, `<var>`, `<abbr>`, `<figcaption>`, `<figure>`, `<footer>`, `<header>`, `<main>`, `<mark>`, `<nav>`, `<section>`, `<summary>`, `<hgroup>`)
* `HTMLUnknownElement` (for unrecognized elements)

### Obsolete and Deprecated Elements

* `HTMLAcronymElement` (`<acronym>`)
* `HTMLBaseFontElement` (`<basefont>`)
* `HTMLBGSoundElement` (`<bgsound>`)
* `HTMLBigElement` (`<big>`)
* `HTMLBlinkElement` (`<blink>`)
* `HTMLCenterElement` (`<center>`)
* `HTMLCommandElement` (`<command>`)
* `HTMLContentElement` (`<content>`)
* `HTMLDirectoryElement` (`<dir>`)
* `HTMLFontElement` (`<font>`)
* `HTMLFrameElement` (`<frame>`)
* `HTMLFrameSetElement` (`<frameset>`)
* `HTMLIsIndexElement` (`<isindex>`)
* `HTMLKeygenElement` (`<keygen>`)
* `HTMLMarqueeElement` (`<marquee>`)
* `HTMLMenuItemElement` (`<menuitem>`)
* `HTMLNoBRElement` (`<nobr>`)
* `HTMLNoEmbedElement` (`<noembed>`)
* `HTMLNoFramesElement` (`<noframes>`)
* `HTMLNoScriptElement` (`<noscript>`)
* `HTMLParamElement` (`<param>`)
* `HTMLPlainTextElement` (`<plaintext>`)
* `HTMLShadowElement` (`<shadow>`)
* `HTMLSpanElement` (`<strike>` instead of `<s>`)
* `HTMLTableCellElement` (`<tt>`)
* `HTMLUnknownElement` (`<xmp>`)

---

## Usage Examples

### Raw/Plain JS

**Creating a paragraph element:**

```javascript
const p = document.createElement('p');
p.textContent = 'This is a paragraph.';
document.body.appendChild(p);
```

**Creating a div with a class:**

```javascript
const div = document.createElement('div');
div.classList.add('my-class');
div.textContent = 'This is a div with a class.';
document.body.appendChild(div);
```

### Polymer 3

**Creating a custom element with a button:**

```javascript
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class MyElement extends PolymerElement {
  static get template() {
    return html`
      <button on-click="handleClick">Click Me</button>
    `;
  }

  handleClick() {
    console.log('Button clicked!');
  }
}

customElements.define('my-element', MyElement);
```

### Lit 3

**Creating a custom element with a button:**

```javascript
import { LitElement, html, css } from 'lit';

class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    button {
      background-color: blue;
      color: white;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `;

  render() {
    return html`
      <button @click=\${this.handleClick}>Click Me</button>
    `;
  }

  handleClick() {
    console.log('Button clicked!');
  }
}

customElements.define('my-element', MyElement);
```
