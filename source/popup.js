const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

function allUrls(callback){
  var queryInfo = {
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs){
    var getMarkdownLink = tab => `[${tab.title}](${tab.url})`;
    var markdown = tabs.map(getMarkdownLink).join('\n');

    var linkList = tabs.map(tab => `<li>${tab.title}</li>`).join('\n');
    linkList = `<ul>${linkList}</ul>`;
    document.getElementById('list').innerHTML = linkList;

    const button = document.querySelector('#copy-to-clipboard');

    try {
      copyToClipboard(markdown);
      button.style = "display:block";
    } catch (e) {
      button.style = "display:hidden";
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  allUrls();
});
