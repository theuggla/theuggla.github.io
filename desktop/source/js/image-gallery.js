/*
 * A module for a custom HTML element image-gallery to form part of a web component.
 * It creates a gallery that displays clickable images as thumbnails.
 * @author Molly Arhammar
 * @version 1.0.0
 *
 */

class ImageGallery extends HTMLElement {
    /**
     * Initiates a gallery, sets up shadow DOM.
     */
    constructor() {
        super();
        let galleryTemplate = document.querySelector('link[href="/desktop/source/image-gallery-app.html"]').import.querySelector('link[href="/desktop/source/image-gallery.html"]').import.querySelector("#galleryTemplate"); //shadow DOM import

        //setup shadow dom styles
        let shadowRoot = this.attachShadow({mode: "open"});
        let instance = galleryTemplate.content.cloneNode(true);
        shadowRoot.appendChild(instance);

    }

    /**
     * Runs when gallery is inserted into the DOM.
     * Sets up event listeners and tracks the picture sources.
     */
    connectedCallback() {
        let gallery = this.shadowRoot.querySelector('#gallery');
        let imageDisplay = this.shadowRoot.querySelector('#imageDisplay');
        let localNav = this.shadowRoot.querySelector('#localNav');

        //make array of all the picture sources for traversing
        this.pictureSources = [];
        Array.prototype.forEach.call(this.querySelectorAll('[slot ="picture"'), (a) => {
            if (a.hasAttribute('src') && this.pictureSources.indexOf(a.getAttribute('src')) === -1) {
                this.pictureSources.push(a.getAttribute('src'));
            } else if (a.firstElementChild && a.firstElementChild.hasAttribute('src') && this.pictureSources.indexOf(a.firstElementChild.getAttribute('src')) === -1) {
                this.pictureSources.push(a.firstElementChild.getAttribute('src'));
            }
        });

        gallery.addEventListener('click', (event) => {
            let src = event.target.getAttribute('src') || event.target.firstElementChild.getAttribute('src');

            if (src) {
                gallery.classList.add('hide');
                imageDisplay.classList.remove('hide');
                this.displayPicture(src, imageDisplay);
            }
        });

        localNav.addEventListener('click', (event) => {
            let task = event.target.getAttribute('data-task');
            let currentPicture = imageDisplay.querySelector('img.displayed');
            let currentPictureSrc = currentPicture.getAttribute('src');
            let nextPictureSrc;

            if (this.querySelectorAll('[slot ="picture"').length !== this.pictureSources.length) { //check if more pictures has been added
                Array.prototype.forEach.call(this.querySelectorAll('[slot ="picture"'), (a) => { //in that case update sourcelist
                    let src = a.getAttribute('src') || a.firstElementChild.getAttribute('src');
                    if (this.pictureSources.indexOf(src) === -1) {
                        this.pictureSources.push(src);
                    }
                });
            }

            //traverse through the picture sources
            switch (task) {
                case 'forward':
                    nextPictureSrc = this.pictureSources.indexOf(currentPictureSrc) + 1;
                    if (nextPictureSrc === this.pictureSources.length) {
                        nextPictureSrc = 0;
                    }
                    nextPictureSrc = this.pictureSources[nextPictureSrc];
                    this.displayPicture(nextPictureSrc, imageDisplay);
                    break;
                case 'back':
                    nextPictureSrc = this.pictureSources.indexOf(currentPictureSrc) - 1;
                    if (nextPictureSrc < 0) {
                        nextPictureSrc = this.pictureSources.length - 1;
                    }
                    nextPictureSrc = this.pictureSources[nextPictureSrc];
                    this.displayPicture(nextPictureSrc, imageDisplay);
                    break;
                case 'gallery':
                    this.showThumbnails();
                    break;
            }
        });

        //show full image in separate window if clicked
        imageDisplay.querySelector('a.displayed').addEventListener('click', (event) => {
            let src = event.target.src || event.target.href;
            if (src) {
                open(src);
            }
        });

    }

    /**
     * Displays an image with a description. Description has to have
     * a for-attribute that matches the images label-attribute.
     * @param src {string} the source of the picture to display
     * @param destination {HTMLElement} where to display the image.
     */
    displayPicture(src, destination) {
        let display = destination;
        let img = display.querySelector('img.displayed');
        let a = display.querySelector('a.displayed');
        let p = display.querySelector('p#description');

        let current = this.querySelector('[src="' + src + '"]');
        let label = current.getAttribute('label');
        let descriptionFor = "[for='" + label + "']";
        let description = this.querySelector(descriptionFor).textContent;

        img.src = src;
        a.href = src;
        p.textContent = description;
    }

    /**
     * Shows clickable thumbnails of all the images in the gallery.
     */
    showThumbnails() {
        let gallery = this.shadowRoot.querySelector('#gallery');
        let imageDisplay = this.shadowRoot.querySelector('#imageDisplay');

        gallery.classList.remove('hide');
        imageDisplay.classList.add('hide');

    }
}


//defines the element
customElements.define('image-gallery', ImageGallery);
