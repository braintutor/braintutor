export default (_fetch) => ({
    session: {
        getFiles(session_id) {
            return _fetch('GET', `file/session/${session_id}`);
        },
        addFile(session_id, data) {
            return _fetch('POST', `file/session/${session_id}`, data, false);
        },
        removeFile(session_id, file_id) {
            return _fetch('DELETE', `file/session/${session_id}/${file_id}`);
        },
    }
})