export default (_fetch, Fetch) => ({
    getFiles(document_type, document_id) {
        return _fetch('GET', `file/${document_type}/${document_id}`);
    },
    addFile(document_type, document_id, data) {
        return _fetch('POST', `file/${document_type}/${document_id}`, data, false);
    },
    removeFile(document_type, document_id, file_id) {
        return _fetch('DELETE', `file/${document_type}/${document_id}/${file_id}`);
    },
    // Task
    getFilesTask(task_id) {
        return _fetch('GET', `file/task/${task_id}`);
    },
    addFileTask(task_id, data) {
        return _fetch('POST', `file/task/${task_id}`, data, false);
    },
    removeFileTask(task_id, file_id) {
        return _fetch('DELETE', `file/task/${task_id}/${file_id}`);
    },
    // v2
    index() {
        return Fetch('v2', 'GET', `file`);
    },
    create(data) {
        return Fetch('v2', 'POST', `file`, data, false);
    },
    destroy(file_id) {
        return Fetch('v2', 'DELETE', `file/${file_id}`);
    }
})