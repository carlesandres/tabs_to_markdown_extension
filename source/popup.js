function renderList(linkListHTMLString) {
  document.getElementById('list').innerHTML = linkListHTMLString;
}

function allUrls(callback){
  var queryInfo = {
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs){
    var getMarkdownLink = function(tab){
      return '[' + tab.title + '](' + tab.url + ')';
    };

    // var markdown = tabs.map( getMarkdownLink ).join('\n');
    var linkForTab = function(tab) {
      return '<a href="' + encodeURIComponent(tab.url) + '">' +
        tab.title + '</a>';
    }

    var linkList = tabs.map(linkForTab).join('\n');

    renderList(linkList);

    // try {
    //     document.execCommand('copy');
    //     const url = 'https:www.textmarkr.com/paste?title=Bookmarks&text=' + encodeURIComponent(urlList);
    //     renderList(url);
    // } catch (e) {
    //     renderList(urlList);
    //     console.log('Imposible to copy');
    // }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  allUrls();
});
