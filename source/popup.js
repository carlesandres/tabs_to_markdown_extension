const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const closeTab = event => {
  event.stopPropagation();
  const tabData = event.currentTarget.dataset;
  const { tabId } = tabData
  console.log('tabData', tabData);
  const parsedTabId = parseInt(tabId, 10);
  chrome.tabs.remove(parsedTabId);
  // chrome.tabs.remove(parsedTabId);
}

const switchToTab = (event) => {
  const tabData = event.currentTarget.dataset;
  const { windowId, pos } = tabData
  const parsedTabId = parseInt(pos, 10);
  const parseWindowId = parseInt(windowId, 10);
  chrome.tabs.highlight({tabs: parsedTabId, windowId: parseWindowId});
}

const openTextmarkr = () => {
  const date = (new Date()).toJSON();
  const title = encodeURIComponent(`Bookmarks ${date}`);
  const options = { url: `https://www.textmarkr.com/new?title=${title}` };
  chrome.tabs.create(options);
}

const makeTabElement = tab => {
  return (
    `<li>
        <div class="tablink"
        data-pos=${tab.index}
        data-window-id=${tab.windowId}
        data-tab-id=${tab.id}>
          <img src="${tab.favIconUrl}" />
          <div class="title">${tab.title}</div>
        </div>
        <div class="actions">
        <button class="close"
          data-pos=${tab.index}
          data-window-id=${tab.windowId}
          data-tab-id=${tab.id}>Close</button>
        </div>
      </li>`
  );
};

let filterValue = '';

const attachListeners = () => {
  const closeButtons = document.querySelectorAll('#list button.close');
  closeButtons.forEach( b => { b.onclick = closeTab });

  const filter = document.getElementById('filter');
  filter.addEventListener('input', onUpdateFilter);

  const listElements = document.querySelectorAll('#list .tablink');
  listElements.forEach( b => { b.onclick = switchToTab });

  const copyToClipBtn = document.querySelector('#copy-to-clipboard');
  copyToClipBtn.addEventListener('click', copyLinksToClipboard);

  const openTxBtx = document.querySelector('#open-textmarkr');
  openTxBtx.addEventListener('click', openTextmarkr);
}

const onUpdateFilter = function() {
  filterValue = (event.target.value || '').trim();
  populateList();
};

chrome.tabs.onRemoved.addListener(populateList);

function copyLinksToClipboard() {
  const queryInfo = { currentWindow: true };
  chrome.tabs.query(queryInfo, function(tabs){
    const getMarkdownLink = tab => `[${tab.title}](${tab.url})`;
    const markdown = tabs.map(getMarkdownLink).join('\n');
    // TO-DO: Use try catch to show feedback
    copyToClipboard(markdown);
  });
}

function populateList(){
  const queryInfo = { currentWindow: true };

  chrome.tabs.query(queryInfo, function(tabs){

    const filteredTabs = tabs.filter(tab => !filterValue || tab.title.match(filterValue));

    let linkList = filteredTabs.map(makeTabElement).join('\n');
    linkList = `<ul>${linkList}</ul>`;
    document.getElementById('list').innerHTML = linkList;

    setTimeout( attachListeners, 0);

    const filter = document.getElementById('filter');
    filter.focus;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  populateList();
});
