export default (_fetch) => ({
    getFiles(document_type, document_id) {
        return _fetch('GET', `file/${document_type}/${document_id}`);
    },
    addFile(document_type, document_id, data) {
        return _fetch('POST', `file/${document_type}/${document_id}`, data, false);
    },
    removeFile(document_type, document_id, file_id) {
        return _fetch('DELETE', `file/${document_type}/${document_id}/${file_id}`);
    },
})