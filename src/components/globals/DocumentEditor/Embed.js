// FROM https://editorjs.io/creating-a-block-tool
export default class Embed {
    constructor({ data }) {
        this.data = data;
    }
    static get toolbox() {
        return {
            title: "Video",
            icon:
                '<svg width="17" height="15" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.919,4.633l-3.833,2.48V6.371c0-1-0.815-1.815-1.816-1.815H3.191c-1.001,0-1.816,0.814-1.816,1.815v7.261c0,1.001,0.815,1.815,1.816,1.815h9.079c1.001,0,1.816-0.814,1.816-1.815v-0.739l3.833,2.478c0.428,0.226,0.706-0.157,0.706-0.377V5.01C18.625,4.787,18.374,4.378,17.919,4.633 M13.178,13.632c0,0.501-0.406,0.907-0.908,0.907H3.191c-0.501,0-0.908-0.406-0.908-0.907V6.371c0-0.501,0.407-0.907,0.908-0.907h9.079c0.502,0,0.908,0.406,0.908,0.907V13.632zM17.717,14.158l-3.631-2.348V8.193l3.631-2.348V14.158z"></path></svg>',
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
            window.showFiles(custom_id);
        });

        this.wrapper.appendChild(input);
        this.wrapper.appendChild(button);
        window.showFiles(custom_id);

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