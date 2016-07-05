function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function allUrls(callback){
  var queryInfo = {
    currentWindow: true
  };

    chrome.tabs.query(queryInfo, function(tabs){
        var getMarkdownLink = function(tab){
            return "[" + tab.title + "](" + tab.url + ")";
        };
        var urls = tabs.map( getMarkdownLink );

        var urlList = urls.join('\n');
        renderStatus(urlList);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  allUrls();
});
