// folders.js
import { folderList, feed, backBtn, pageIndicator } from './domRefs.js';
import { loadImagesFromSubfolder,updatePageIndicator } from './images.js';

export function setupFolderPicker() {
  document.getElementById('folderPickerBtn').addEventListener('click', async () => {
    try {
      const rootHandle = await window.showDirectoryPicker();
      window.currentRootHandle = rootHandle;
      await selectRootFolder(rootHandle);
    } catch (err) {
      console.error('Error picking folder:', err);
    }
  });
}

export async function selectRootFolder(rootDirHandle) {
  folderList.innerHTML = '';
  feed.innerHTML = '';
  folderList.style.display = 'flex';
  backBtn.style.display = 'none';

  const folderButtons = [];
  for await (const entry of rootDirHandle.values()) {
    if (entry.kind === 'directory') folderButtons.push(entry);
  }

  folderButtons.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  for (const entry of folderButtons) {
    let hasImage = false;
    for await (const fileEntry of entry.values()) {
      if (fileEntry.kind === 'file' && /\.(jpe?g|png|gif|webp)$/i.test(fileEntry.name)) {
        hasImage = true;
        break;
      }
    }
    if (!hasImage) continue;

    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'center';
    div.style.width = '100px';

    const thumb = document.createElement('img');
    thumb.style.width = '100px';
    thumb.style.height = '100px';
    thumb.style.objectFit = 'cover';
    thumb.style.borderRadius = '6px';
    thumb.style.marginBottom = '4px';
    thumb.alt = 'thumbnail';

    for await (const fileEntry of entry.values()) {
      if (fileEntry.kind === 'file' && /\.(jpe?g|png|gif|webp)$/i.test(fileEntry.name)) {
        const file = await fileEntry.getFile();
        const url = URL.createObjectURL(file);
        thumb.src = url;
        break;
      }
    }

    const label = document.createElement('button');
    label.className = 'icon-button';
    label.style.maxWidth = '100px';
    label.style.overflowWrap = 'break-word';
    label.style.textAlign = 'center';
    label.style.wordBreak = 'break-word';
    label.innerHTML = entry.name.split(/[-\s]/).reduce((lines, word) => {
      const last = lines[lines.length - 1];
      if ((last + ' ' + word).trim().length <= 12) {
        lines[lines.length - 1] = (last + ' ' + word).trim();
      } else {
        lines.push(word);
      }
      return lines;
    }, ['']).join('<br>');

    label.onclick = async () => {
      pageIndicator.style.display = 'block';
      window.currentFolderName = entry.name;
      window.currentFolderHandle = entry;
      window.currentRootName = rootDirHandle.name;
      folderList.style.display = 'none';
      backBtn.style.display = 'inline-block';
      await loadImagesFromSubfolder(entry);
    };

    div.appendChild(thumb);
    div.appendChild(label);
    folderList.appendChild(div);
  }
  updatePageIndicator(0, 0); // Reset page indicator
  // ✅ Show bookmark button now that root is selected
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  if (bookmarkBtn) bookmarkBtn.style.display = 'inline-block';
  document.getElementById('bookmarkBtn').style.display = 'inline-block';
}
