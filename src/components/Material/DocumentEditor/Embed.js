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
        this.wrapper.classList.add("m-editor-iframe");

        if (this.data && this.data.embed) {
            this._createImage(this.data.embed);
            return this.wrapper;
        }

        let custom_id = new Date().getTime();
        let custom_id_url = new Date().getTime() + "_";

        //
        let container_url = document.createElement("div");
        container_url.classList.add("container-url")

        let input_url = document.createElement("input");
        input_url.setAttribute("id", custom_id_url);
        input_url.setAttribute("placeholder", 'Ingresar URL');

        let button_url = document.createElement("button");
        button_url.innerText = "Añadir URL";
        button_url.addEventListener("click", () => {
            if (input_url.value) {
                let url = this._getEmbed(input_url.value)
                this._createImage(url)
            }
        });

        container_url.appendChild(input_url);
        container_url.appendChild(button_url);
        
        let text = document.createElement("p");
        text.innerText = "- o -"

        let input = document.createElement("input");
        input.setAttribute("id", custom_id);
        input.style.display = "none";
        input.addEventListener("click", (e) => {
            this._createImage(e.target.value);
        });

        let button = document.createElement("button");
        button.innerText = "Subir Archivo";
        button.addEventListener("click", () => {
            window.showFiles(custom_id, ['video', 'audio']);
        });
        button.classList.add("btn-files")

        this.wrapper.appendChild(container_url);
        this.wrapper.appendChild(text);
        this.wrapper.appendChild(input);
        this.wrapper.appendChild(button);

        return this.wrapper;
    }
    save(blockContent) {
        const iframe = blockContent.querySelector("iframe");

        return {
            embed: iframe ? iframe.src : "",
        };
    }
    validate(savedData) {
        if (!savedData.embed.trim()) return false;

        return true;
    }
    _createImage(embed) {
        const container_iframe = document.createElement("div");
        container_iframe.classList.add("container-iframe")
        const iframe = document.createElement("iframe");
        iframe.src = embed;

        this.wrapper.innerHTML = "";
        container_iframe.appendChild(iframe);
        this.wrapper.appendChild(container_iframe);
    }
    //
    _getEmbed(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        let youtube_id = (match && match[2].length === 11)
            ? match[2]
            : null;

        return `//www.youtube.com/embed/${youtube_id}`
    }
}