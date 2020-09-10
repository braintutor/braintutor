function convertToJSON(html) {
  var temp = document.createElement("div");
  temp.innerHTML = html;

  var all = temp.getElementsByTagName("*");
  all = Array.from(all).filter((item) => item.dataset && item.dataset.editor);

  let json = all.map((item) => {
    let data = JSON.parse(item.dataset.editor);
    return data;
  });
  return json;
}

function convertToHMTL(blocks) {
  let html = "";
  blocks.forEach(function(block) {
    switch (block.type) {
      case "header":
        html += `<h${block.data.level} data-editor='${JSON.stringify(
          block
        )}' class="m-editor__header">${block.data.text}</h${block.data.level}>`;
        break;
      case "paragraph":
        html += `<p data-editor='${JSON.stringify(
          block
        )}' class="m-editor__paragraph">${block.data.text}</p>`;
        break;
      case "delimiter":
        html += `<hr data-editor='${JSON.stringify(
          block
        )}' class="m-editor__delimiter"/>`;
        break;
      case "image":
        html += `<img data-editor='${JSON.stringify(block)}' src="${
          block.data.url
        }" title="${block.data.caption}"  class='m-editor__image ${block.data
          .stretched && "m-editor__image--stretched"} ${block.data
          .withBackground && "m-editor__image--centered"}'/>`; // ADD <em>${block.data.caption}</em>
        break;
      case "list":
        html += `<ul data-editor='${JSON.stringify(
          block
        )}' class="m-editor__list">`;
        block.data.items.forEach(function(li) {
          html += `<li>${li}</li>`;
        });
        html += `</ul>`;
        break;
      case "embed":
        html += `
          <div class="m-editor__embed"><div>
            <iframe data-editor='${JSON.stringify(block)}' src="${
          block.data.embed
        }" frameborder="0" allowfullscreen></iframe>
          </div></div>
        `;
        break;
      case "linkTool":
        var pathArray = block.data.link.split("/");
        var protocol = pathArray[0];
        var host = pathArray[2];
        var url = protocol + "//" + host;
        html += `
          <a data-editor='${JSON.stringify(block)}' href='${
          block.data.link
        }' target='_blank' class='m-editor__link'>
            <div class='m-editor__link-image' style='background-image: url("${
              block.data.meta.image.url
            }")'></div>
            ${block.data.meta.title &&
              `<p class='m-editor__link-title'>${block.data.meta.title}</p>`}
            ${block.data.meta.description &&
              `<p class='m-editor__link-description'>${block.data.meta.description}</p>`}
            <p class='m-editor__link-url'>${url}</p>
          </a>
        `;
        break;
      default:
        html += `<div data-editor='${JSON.stringify(block)}'></div>`;
        break;
    }
  });
  return html;
}

export { convertToJSON, convertToHMTL };
