/**
 * A module for a class desktop.
 * Initiates a web desktop with a menu
 * and windows to open.
 *
 * @author Molly Arhammar
 * @version 1.0
 */


class Desktop {
    /**
     * Initiates the Desktop. Sets up event listeners
     * and adds sub-menu to the main menu items if such are provided.
     * @param desktopConfig {object} with params:
     * menu {[expandable-menu-item]},
     * space: {node} where the desktop windows lives
     * and optional:
     * windowManager: {object} a custom window manager that handles the windows, will otherwise be supplied
     * subTemplate: {document-fragment} a sub-menu to be added to each of the main menu items
     * subHandler {function} an event handler to be applies to the sub menu
     */
    constructor(desktopConfig) {
        let topWindow = 2; //to keep focused window on top

        let mainMenu = desktopConfig.menu;
        let windowSpace = desktopConfig.space;
        let windowManager = desktopConfig.windowManager || Desktop.windowManager(windowSpace); //supply windowManager if there is none
        let subMenuTemplate = desktopConfig.subTemplate;
        let subHandler = desktopConfig.subHandler;


        if (subMenuTemplate) { //there is a submenu
            //add the submenu
            Array.prototype.forEach.call(mainMenu.children, (node) => {
                let subMenu = document.importNode(subMenuTemplate.content, true);
                this.addSubMenu(node, subMenu, subHandler);
            });

            //add event handlers on the sub menu
            addEventListeners(mainMenu, 'click focusout', (event) => {
                let mainMenuItems = mainMenu.querySelectorAll('expandable-menu-item');
                mainMenuItems.forEach((item) => {
                    if ((item !== event.target && item !== event.target.parentElement) && (item.displayingSubMenu)) {
                        item.toggleSubMenu(false);
                    }
                })
            });
        }

        //open new window at double click
        mainMenu.addEventListener('dblclick', (event) => {
            let type = event.target.getAttribute("data-kind") || event.target.parentNode.getAttribute("data-kind");
            if (type) {
                windowManager.createWindow(type).focus();
            }
            event.preventDefault();
        });

        //put focused window on top
        windowSpace.addEventListener('focus', (event) => {
            if (event.target !== windowSpace) {
                event.target.style.zIndex = topWindow;
                topWindow += 1;
            }
        }, true);
    }

    /**
     * @param item {HTMLElement} the expandable-menu-item to add the sub-menu to
     * @param subMenu {HTMLElement} a template of the sub-menu
     * @param eventHandler {function} the event handler to be applied to the sub menu
     */
    addSubMenu(item, subMenu, eventHandler) {
        let label = item.getAttribute('label');

        Array.prototype.forEach.call(subMenu.children, (node) => {
            node.setAttribute('label', label);
        });

        item.appendChild(subMenu);

        item.addEventListener('click', eventHandler);
    }

    /**
     * creates a window manager to handle windows on the desktop.
     * @param windowSpace {HTMLElement} the space where the windows live
     * @returns {{createWindow: createWindow, openWindows: openWindows, expand: expand, minimize: minimize, close: close}} an
     * object with methods to expand, minimize, close all, open new, and get open windows of a certain type.
     */
    static windowManager(windowSpace) {
        //keep track of the window space
        let wm = {
            startX: windowSpace.offsetLeft + 20,
            startY: windowSpace.offsetTop + 20,
            types: 0
        };

        return {
            /**
             * Creates a new window and opens it in the window space.
             * @param type {string} the name of the html-element to create.
             * @returns {HTMLElement} the newly created window
             */
            createWindow: function (type) {
                let aWindow;
                if (!wm[type]) {
                    let linkTemplate = document.querySelector("#linkTemplate");
                    let link = document.importNode(linkTemplate.content.firstElementChild, true);
                    link.href = "/" + type + ".html";
                    document.head.appendChild(link);
                }

                aWindow = document.createElement(type);

                //import pictures for the image gallery
                if (type === 'image-gallery-app') {
                    if (document.querySelector('#pictures')) {
                        aWindow.appendChild(document.importNode(document.querySelector('#pictures').content, true));
                    }
                }

                windowSpace.appendChild(aWindow);
                setupSpace(type, aWindow);

                //keep track of the open windows
                if (wm[type].open) {
                    wm[type].open.push(aWindow);
                } else {
                    wm[type].open = [aWindow];
                }

                return aWindow;
            },
            /**
             * Gets the open windows of a type.
             * @param type {string} the name of the html-element to check for.
             * @returns {[HTMLElement]} a node list of the open windows of the type.
             */
            openWindows: function (type) {
                if (wm[type]) {
                    let result = [];
                    let windows = wm[type].open;
                    //filter out the one's that's been closed since the last time
                    result = windows.filter((w) => {
                        return w.open;
                    });
                    wm[type].open = result;
                    return result;
                } else {
                    return 0; //if no windows are open
                }
            },
            /**
             * Expands all minimized windows of a type.
             * @param type {string} the name of the html-element to expand.
             */
            expand: function (type) {
                let wins = this.openWindows(type);
                if (wins) {
                    wins.forEach((w) => {
                        w.minimized = false;
                    });
                }
            },
            /**
             * Minimizes all open windows of a type.
             * @param type {string} the name of the html-element to minimize.
             */
            minimize: function (type) {
                let wins = this.openWindows(type);
                if (wins) {
                    wins.forEach((w) => {
                        w.minimized = true;
                    });
                }
            },
            /**
             * Closes all open windows of a type.
             * @param type {string} the name of the html-element to close.
             */
            close: function (type) {
                let wins = this.openWindows(type);
                if (wins) {
                    console.log(wins);
                    wins.forEach((w) => {
                        w.close();
                    });
                }
            }
        };

        //helper functions
        // keeps track of the window space so the windows don't all
        //open on top of each other, and doesn't disappear out
        //of the space
        function setupSpace(type, space) {
            let destination = {};
            let x;
            let y;

            if (wm[type]) { //the type already exists
                destination.x = (wm[type].latestCoords.x += 50);  //create a new space to open the window
                destination.y = (wm[type].latestCoords.y += 50);

                if (!(withinBounds(space, windowSpace, destination))) { //check that the space is within bounds
                    x = wm[type].startCoords.x += 5;
                    y = wm[type].startCoords.y += 5;
                    wm[type].latestCoords.x = x;
                    wm[type].latestCoords.y = y;
                } else {
                    x = destination.x;
                    y = destination.y;
                }

            } else { //create a starting point for the windows of this type
                destination.x = (wm.startX + (60 * wm.types));
                destination.y = (wm.startY);

                if (!(withinBounds(space, windowSpace, destination))) {
                    x = wm.startX;
                    y = wm.startY;
                } else {
                    x = destination.x;
                    y = destination.y;
                }

                wm[type] = {};
                wm[type].startCoords = {
                    x: x,
                    y: y
                };
                wm[type].latestCoords = {
                    x: x,
                    y: y
                };
                wm.types += 1;
            }
            space.tabIndex = 0;
            space.style.top = y + "px";
            space.style.left = x + "px";
        }

        //checks if a space is within bounds
        function withinBounds(element, container, coords) {
            let minX = container.offsetLeft;
            let maxX = (minX + container.clientWidth) - (element.getBoundingClientRect().width);
            let minY = container.offsetTop;
            let maxY = (minY + container.clientHeight) - (element.getBoundingClientRect().height);

            return (coords.x <= maxX && coords.x >= minX && coords.y <= maxY && coords.y >= minY);
        }
    }
}


//helper function to add more than one event type for each element and handler
function addEventListeners (element, events, handler) {
    events.split(' ').forEach(event => element.addEventListener(event, handler));
}