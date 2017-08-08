function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function allUrls(callback){
  var queryInfo = {
    currentWindow: true
  };

    chrome.tabs.query(queryInfo, function(tabs){
        var getMarkdownLink = function(tab){
            return '[' + tab.title + '](' + tab.url + ')';
        };
        var urls = tabs.map( getMarkdownLink );
        var urlList = urls.join('\n');
        var url = 'https:www.textmarkr.com/paste?title=Bookmarks&text=' + encodeURIComponent(urlList);

        if (url.length > 2000){
            // renderStatus('-----' + url.length + '----');
            renderStatus(urlList);
        } else {
            renderStatus(url);
        }

        // try {
        //     document.execCommand('copy');
        //     const url = 'https:www.textmarkr.com/paste?title=Bookmarks&text=' + encodeURIComponent(urlList);
        //     renderStatus(url);
        // } catch (e) {
        //     renderStatus(urlList);
        //     console.log('Imposible to copy');
        // }
    });
}

document.addEventListener('DOMContentLoaded', function() {
  allUrls();
});
