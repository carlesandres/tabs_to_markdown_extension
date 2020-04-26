const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const closeTab = tabId => chrome.tabs.remove(tabId);

const makeTabElement = tab => {
  return (
  `<li>
    <div class="title">${tab.title}</div>
    <div class="actions"><button class="close" id="tab-${tab.id}">Close tab</button></div>
    </li>`
  );
};

const attachActionsToList = () => {
  const closeButtons = document.querySelectorAll('#list button.close');
  closeButtons.forEach( b => {
    const id = parseInt(b.id.replace('tab-',''), 10);
    b.onclick = () => closeTab(id)
  });
}

function allUrls(){
  const queryInfo = { currentWindow: true };

  chrome.tabs.query(queryInfo, function(tabs){
    const getMarkdownLink = tab => `[${tab.title}](${tab.url})`;
    const markdown = tabs.map(getMarkdownLink).join('\n');

    let linkList = tabs.map(makeTabElement).join('\n');
    linkList = `<ul>${linkList}</ul>`;
    document.getElementById('list').innerHTML = linkList;

    setTimeout( attachActionsToList, 0);

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
