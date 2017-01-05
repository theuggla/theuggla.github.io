/**
* A module for a custom HTML element insta-chat-app to form part of a web component.
* It combined the component insta-chat with the component draggable-window, to
* make a chat in a window with an added menu.
* @author Molly Arhammar
* @version 1.0.0
*
*/

let InstaChat = require('./insta-chat.js');

class InstaChatApp extends HTMLElement {
    /**
     * Initiates a chat-window, sets up shadow DOM.
     */
    constructor() {
        super();
        let chatWindowTemplate = document.querySelector('link[href="/desktop/source/insta-chat-app.html"]').import.querySelector("#chatWindowTemplate"); //shadow DOM import

        let shadowRoot = this.attachShadow({mode: "open"});
        let instance = chatWindowTemplate.content.cloneNode(true);
        shadowRoot.appendChild(instance);
    }

    /**
     * Runs when chat is inserted into the DOM.
     * Sets up event listeners for
     * the menu, and prints messages
     * saved in local storage if any.
     */
    connectedCallback() {
        //initiate the chat
        let chatspace;

        let namespace = this.shadowRoot.querySelector('#submitName');
        let aboutspace = this.shadowRoot.querySelector('#about');
        let socketspace = this.shadowRoot.querySelector('#chooseSocket');

        let chatoption = this.shadowRoot.querySelector('[label="chat"]');
        let aboutoption = this.shadowRoot.querySelector('[label="about"]');
        let optionoption = this.shadowRoot.querySelector('[label="options"]');

        //check if a socket has already been chosen
        if (localStorage.chatConfig) {
            let config = JSON.parse(localStorage.chatConfig);
            chatspace = new InstaChat(config);

            chatspace.setAttribute('slot', 'content');
            this.shadowRoot.querySelector('draggable-window').appendChild(chatspace);

            //print the last twenty messages from last time
            let messages = chatspace.messageManager.getChatLog().reverse();
            if (messages.length > 0) {
                messages.forEach((message) => {
                    chatspace.print(message);
                });
            }

            //scroll down when window has been rendered
            setTimeout(() => {
                chatspace.shadowRoot.querySelector('#messageWindow').scrollTop = chatspace.shadowRoot.querySelector('#messageWindow').scrollHeight;
            }, 10);

            aboutspace.classList.add('hide');
            socketspace.classList.add('hide');
            namespace.classList.add('hide');
            chatspace.classList.remove('hide');
        } else { //ask for a socket
            aboutspace.classList.add('hide');
            socketspace.classList.remove('hide');
            namespace.classList.add('hide');
        }

        socketspace.querySelector('button').addEventListener('click', (event) => {
            let address = socketspace.querySelector('input#address').value;
            let channel = socketspace.querySelector('input#channel').value;
            let apikey = socketspace.querySelector('input#apikey').value;
            let name = socketspace.querySelector('input#name').value;

            let config = {
                url: address,
                channel: channel,
                key: apikey,
                name: name
            };

            localStorage.chatConfig = JSON.stringify(config);

            chatspace = new InstaChat(config);

            chatspace.setAttribute('slot', 'content');
            this.shadowRoot.querySelector('draggable-window').appendChild(chatspace);

            chatspace.classList.remove('hide');
            namespace.classList.add('hide');
            aboutspace.classList.add('hide');
            socketspace.classList.add('hide');
        });

        namespace.querySelector('button').addEventListener('click', (event) => {
            let name = namespace.querySelector('input').value;
            chatspace.changeConfig({name: name});
            let config = JSON.parse(localStorage.chatConfig);
            config.name = name;
            localStorage.chatConfig = JSON.stringify(config);
            namespace.classList.add('hide');
            aboutspace.classList.add('hide');
            socketspace.classList.add('hide');
            chatspace.classList.remove('hide');
        });

        //event listeners for menu, add separate ones for accessibility reasons
        optionoption.addEventListener('click', (event) => {
            let target = event.target.focused || event.target.querySelector('[data-task]') || event.target;
            let task = target.getAttribute('data-task');
            if (target.getAttribute('data-task')) {
                switch (target.getAttribute('data-task')) {
                    case 'namechange':
                        chatspace.classList.add('hide');
                        aboutspace.classList.add('hide');
                        socketspace.classList.add('hide');
                        namespace.classList.remove('hide');
                        break;
                    case 'socketchange':
                        chatspace.classList.add('hide');
                        aboutspace.classList.add('hide');
                        namespace.classList.add('hide');
                        socketspace.classList.remove('hide');
                        break;
                    case 'quit':
                        this.close();
                        break;
                }
            }
        });

        //avent listener for menu
        aboutoption.addEventListener('click', (event) => {
            let target = event.target.focused || event.target.querySelector('[data-task]') || event.target;
            let task = target.getAttribute('data-task');
            if (target.getAttribute('data-task')) {
                switch (target.getAttribute('data-task')) {
                    case 'about':
                        namespace.classList.add('hide');
                        chatspace.classList.add('hide');
                        socketspace.classList.add('hide');
                        aboutspace.classList.remove('hide');
                        break;
                }
            }
        });

        //event listener for menu
        chatoption.addEventListener('click', (event) => {
            let target = event.target.focused || event.target.querySelector('[data-task]') || event.target;
            let task = target.getAttribute('data-task');
            if (target.getAttribute('data-task')) {
                switch (target.getAttribute('data-task')) {
                    case 'chat':
                        if (chatspace) {
                            chatspace.classList.remove('hide');
                            aboutspace.classList.add('hide');
                            socketspace.classList.add('hide');
                            namespace.classList.add('hide');
                            break;
                        }
                }
            }
        });
    }

    /**
     * Runs when app is removed from the DOM.
     * Closes the window and the web socket.
     */
    disconnectedCallback() {
        this.close();
    }

    /**
     * @returns true if the window containing the app is open.
     */
    get open() {
        return this.shadowRoot.querySelector('draggable-window').open;
    }

    /**
     * @returns true if the window containing the app is minimized.
     */
    get minimized() {
        return this.shadowRoot.querySelector('draggable-window').minimized;
    }

    /**
     * Sets the minimized property of the window containing the app.
     * @param minimize {boolean} whether to minimize
     */
    set minimized(minimize) {
        if (minimize) {
            this.shadowRoot.querySelector('draggable-window').minimized = true;
        } else {
            this.shadowRoot.querySelector('draggable-window').minimized = false;
        }

    }

    /**
     * Closes the window and the web socket.
     */
    close() {
        this.shadowRoot.querySelector('draggable-window').close();
        this.shadowRoot.querySelector('insta-chat').socket.close();
    }
}

//defines the element
customElements.define('insta-chat-app', InstaChatApp);
