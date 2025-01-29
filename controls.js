class Controls {
    constructor(controlType) {
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        switch (controlType) {
            case "PLAYER":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward = true;
                break;
        }
    }

    #addKeyboardListeners() {
        const keyMapping = {
            "ArrowUp": "forward",
            "ArrowDown": "reverse",
            "ArrowLeft": "left",
            "ArrowRight": "right"
        };

        const KeyState = (key, state) => {
            if (keyMapping[key]) {
                this[keyMapping[key]] = state;
            }
        };

        document.onkeydown = (event) => KeyState(event.key, true);
        document.onkeyup = (event) => KeyState(event.key, false);
    }
}
