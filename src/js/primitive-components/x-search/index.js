import { cssGlobals } from '../../providers/app-ctx';

class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    mountPoint.setAttribute('class', `${cssGlobals.appPrefix}-c-x-search`);
    mountPoint.setAttribute('part', 'my-test-web-c');

    const styleNode = document.createElement('style');
    styleNode.innerHTML = `
      span {
        background: green;
      }
      a {
        color: white;
      }
    `;

    const shadowNode = this.attachShadow({ mode: 'open' });
    shadowNode.appendChild(mountPoint);
    shadowNode.appendChild(styleNode);

    const name = this.getAttribute('name');
    const url = `https://www.baidu.com/s?wd=${encodeURIComponent(name)}`;
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
