const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const closeTab = tabId => {
  chrome.tabs.remove(tabId);
}

const makeTabElement = tab => {
  return (
  `<li>
    <div class="title">${tab.title}</div>
    <div class="actions"><button class="close" id="tab-${tab.id}">Close</button></div>
    </li>`
  );
};

let filterValue = '';

const attachActionsToList = () => {
  const closeButtons = document.querySelectorAll('#list button.close');
  closeButtons.forEach( b => {
    const id = parseInt(b.id.replace('tab-',''), 10);
    b.onclick = () => closeTab(id)
  });

  const filter = document.getElementById('filter');
  filter.addEventListener('input', onUpdateFilter);
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
