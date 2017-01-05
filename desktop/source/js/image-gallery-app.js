/*
 * A module for a custom HTML element image-gallery-app to form part of a web component.
 * It combined the component image-gallery with the component draggable-window, to
 * make an image gallery in a window with an added menu.
 * @author Molly Arhammar
 * @version 1.0.0
 *
 */

class ImageGalleryApp extends HTMLElement {
    /**
     * Initiates a gallery-window, sets up shadow DOM.
     */
    constructor() {
        super();
        let galleryWindowTemplate = document.querySelector('link[href="/desktop/source/image-gallery-app.html"]').import.querySelector('#galleryWindowTemplate');

        let shadowRoot = this.attachShadow({mode: "open"});
        let instance = galleryWindowTemplate.content.cloneNode(true);
        shadowRoot.appendChild(instance);

        this.images = [];
    }

    /**
     * Runs when gallery is inserted into the DOM.
     * Sets up event listeners for
     * the menu.
     */
    connectedCallback() {
        let imageGallery = this.shadowRoot.querySelector('image-gallery');
        let aboutspace = this.shadowRoot.querySelector('#about');

        let galleryOption = this.shadowRoot.querySelector('[label="gallery"]');
        let quitOption = this.shadowRoot.querySelector('[label="quit"]');
        let aboutOption = this.shadowRoot.querySelector('[label="about"]');

        this.updateImages();

        //menu event listeners. add separate ones for accessibility reasons with web components.
        quitOption.addEventListener('click', (event) => {
            let target = event.target.focused || event.target.querySelector('[data-task]') || event.target; //shadow DOM accessibility issues
            let task = target.getAttribute('data-task');
            if (task) {
                switch (task) {
                    case 'quit':
                        this.close();
                        break;
                }
            }
        }, true);

        //menu event listener
        galleryOption.addEventListener('click', (event) => {
            let target = event.target.querySelector('[data-task]') || event.target; //shadow DOM accessibility issues
            let task = target.getAttribute('data-task');
            if (task) {
                switch (task) {
                    case 'gallery':
                        aboutspace.classList.add('hide');
                        imageGallery.classList.remove('hide');
                        imageGallery.showThumbnails();
                        break;
                }
            }
        });

        //menu event listener
        aboutOption.addEventListener('click', (event) => {
            let target = event.target.querySelector('[data-task]') || event.target; //shadow DOM accessibility issues
            let task = target.getAttribute('data-task');
            if (task) {
                switch (task) {
                    case 'about':
                        imageGallery.classList.add('hide');
                        aboutspace.classList.remove('hide');
                        break;
                }
            }
        });
    }

    /**
     * Gets all the added images
     * @returns {NodeList} a list of all the image elements that are
     * children of the gallery.
     */
    getImages() {
        return this.querySelectorAll('img');
    }

    /**
     * Gets all the imagedescriptions.
     * @returns {NodeList} a list of all the p elements that are
     * children of the gallery and has a for-attribute.
     */
    getDescriptions() {
        return this.querySelectorAll('p[for]');
    }

    /**
     * Matches descriptions with image-sources via the matching for- and label- attributes
     * on the p and img elements respectively.
     */
    updateImages() {
        let imgTemplate = document.querySelector('link[href="/desktop/source/image-gallery-app.html"]').import.querySelector("#imgTemplate"); //shadow DOM import
        let imageGallery = this.shadowRoot.querySelector('image-gallery');

        this.images = this.images.concat(Array.prototype.slice.call(this.getImages()));
        this.descriptions = this.getDescriptions();

        this.images.forEach((image) => {
            let container = imgTemplate.content.cloneNode(true);
            container.firstElementChild.replaceChild(image, container.firstElementChild.querySelector('img'));
            container.removeChild(container.querySelector('p'));
            imageGallery.appendChild(container);
        });

        Array.prototype.forEach.call(this.descriptions, (description) => {
            imageGallery.appendChild(description);
        });
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
        this.shadowRoot.querySelector('draggable-window').minimized = minimize;
    }

    /**
     * Closes the window containing the app.
     */
    close() {
        this.shadowRoot.querySelector('draggable-window').close();
    }

}


//define the element
customElements.define('image-gallery-app', ImageGalleryApp);
