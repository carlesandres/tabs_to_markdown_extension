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
  const tabId = parseInt(event.currentTarget.id.replace('tab-',''), 10);
  chrome.tabs.remove(tabId);
}

const switchToTab = (event) => {
  const tabData = event.currentTarget.dataset;
  const { windowId, pos } = tabData
  const parsedPos = parseInt(pos, 10);
  const parseWindowId = parseInt(windowId, 10);
  chrome.tabs.highlight({tabs: parsedPos, windowId: parseWindowId});
}

const makeTabElement = (tab, index) => {
  return (
    `<li
        data-pos=${index}
        data-window-id=${tab.windowId}
        data-tab-id=${tab.id}>
        <img src="${tab.favIconUrl}" />
        <div class="title">${tab.title}</div>
        <div class="actions">
        <button class="close"
          data-pos=${index}
          data-window-id=${tab.windowId} id="tab-${tab.id}">Close</button>
        </div>
      </li>`
  );
};

let filterValue = '';

const attachActionsToList = () => {
  const closeButtons = document.querySelectorAll('#list button.close');
  closeButtons.forEach( b => { b.onclick = closeTab });

  const filter = document.getElementById('filter');
  filter.addEventListener('input', onUpdateFilter);

  const listElements = document.querySelectorAll('#list li');
  listElements.forEach( b => { b.onclick = switchToTab });
}

const onUpdateFilter = function() {
  filterValue = (event.target.value || '').trim();
  populateList();
};

chrome.tabs.onRemoved.addListener(populateList);

function populateList(){
  const queryInfo = { currentWindow: true };

  chrome.tabs.query(queryInfo, function(tabs){

    const filteredTabs = tabs.filter(tab => !filterValue || tab.title.match(filterValue));

    let linkList = filteredTabs.map(makeTabElement).join('\n');
    linkList = `<ul>${linkList}</ul>`;
    document.getElementById('list').innerHTML = linkList;

    setTimeout( attachActionsToList, 0);

    const filter = document.getElementById('filter');
    filter.focus;

    // const getMarkdownLink = tab => `[${tab.title}](${tab.url})`;
    // const markdown = tabs.map(getMarkdownLink).join('\n');
    // const button = document.querySelector('#copy-to-clipboard');
    //
    // try {
    //   copyToClipboard(markdown);
    //   button.style = "display:block";
    // } catch (e) {
    //   button.style = "display:hidden";
    // }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  populateList();
});
