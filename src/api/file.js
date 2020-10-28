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
    // Task
    getFilesTask(task_id, user_id) {
        return _fetch('GET', `file/task/${task_id}/${user_id}`);
    },
    addFileTask(task_id, data) {
        return _fetch('POST', `file/task/${task_id}`, data, false);
    },
    removeFileTask(task_id, file_id) {
        return _fetch('DELETE', `file/task/${task_id}/${file_id}`);
    },
})