// FROM https://editorjs.io/creating-a-block-tool
export default class Image {
    constructor({ data }) {
        this.data = data;
    }
    static get toolbox() {
        return {
            title: "Imagen",
            icon:
                '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
        };
    }
    render() {
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("m-editor-img");

        if (this.data && this.data.url) {
            this._createImage(this.data.url);
            return this.wrapper;
        }

        let custom_id = new Date().getTime();

        let input = document.createElement("input");
        input.setAttribute("id", custom_id);
        input.addEventListener("click", (e) => {
            this._createImage(e.target.value);
        });

        let button = document.createElement("button");
        button.innerText = "Añadir Imagen";
        button.addEventListener("click", () => {
            window.showFiles(custom_id, ['image']);
        });

        this.wrapper.appendChild(input);
        this.wrapper.appendChild(button);
        window.showFiles(custom_id, ['image']);

        return this.wrapper;
    }
    save(blockContent) {
        const image = blockContent.querySelector("img");

        return {
            url: image ? image.src : "",
        };
    }
    validate(savedData) {
        if (!savedData.url.trim()) return false;

        return true;
    }
    _createImage(url) {
        const image = document.createElement("img");
        image.src = url;

        this.wrapper.innerHTML = "";
        this.wrapper.appendChild(image);
    }
}