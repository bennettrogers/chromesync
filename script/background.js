chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
    Instapaper.Api.addBookmark(id, bookmark);
});
chrome.bookmarks.onRemoved.addListener(function(id, info) {
});
