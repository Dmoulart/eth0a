const template = document.createElement("template");
template.innerHTML = `
<div class="chat">
Chat
    <ul class="chat_messages"></ul>
</div>
`;

export class Chat extends HTMLElement {
  constructor() {
    super();
  }
}

window.customElements.define("chat", Chat);
