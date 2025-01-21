class Controls{
    constructor(){
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        this.#addKeyboardListeners();
        }
    
    #addKeyboardListeners() {
        const KeyState = (key, state) => {
            switch(key){
                case "ArrowUp":
                    this.forward = state;
                    break;
                case "ArrowDown":
                    this.reverse = state;
                    break;
                case "ArrowLeft":
                    this.left = state;
                    break;
                case "ArrowRight":
                    this.right = state;
                    break;
            }
        }

        document.onkeydown = (event) => KeyState(event.key, true);
        document.onkeyup = (event) => KeyState(event.key, false);
    }
}
