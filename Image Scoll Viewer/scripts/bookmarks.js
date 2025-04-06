// bookmarks.js
import { bookmarkMenu, backBtn, folderList } from './domRefs.js';
import { loadImagesFromSubfolder, scrollToPage } from './images.js';

export function setupBookmarks() {
  document.getElementById('bookmarkBtn').addEventListener('click', () => {
    bookmarkMenu.style.display = bookmarkMenu.style.display === 'flex' ? 'none' : 'flex';
    renderBookmarks();
  });
}

function renderBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem('imageBookmarks') || '[]');
  bookmarkMenu.innerHTML = '';

  const addBtn = document.createElement('button');
  addBtn.className = 'icon-button';
  addBtn.textContent = '➕ Add Bookmark';
  addBtn.onclick = () => {
    const currentFolderName = window.currentFolderName;
    const currentRootName = window.currentRootName;
    const currentIndex = window.currentIndex || 0;
    if (currentFolderName && currentRootName) {
      bookmarks.push({ root: currentRootName, name: currentFolderName, index: currentIndex });
      localStorage.setItem('imageBookmarks', JSON.stringify(bookmarks));
      renderBookmarks();
    }
  };
  bookmarkMenu.appendChild(addBtn);

  bookmarks.forEach((bm, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'bookmark-item';

    const span = document.createElement('span');
    span.textContent = `${bm.name} (Page ${bm.index + 1})`;
    span.onclick = async () => {
      if (!window.currentRootHandle) {
        alert('Please select a root folder first.');
        return;
      }
      const subfolderHandle = await window.currentRootHandle.getDirectoryHandle(bm.name).catch(() => null);
      if (!subfolderHandle) {
        alert('Subfolder not found.');
        return;
      }
      window.currentFolderName = bm.name;
      window.currentFolderHandle = subfolderHandle;
      folderList.style.display = 'none';
      backBtn.style.display = 'inline-block';
      await loadImagesFromSubfolder(subfolderHandle);
      requestAnimationFrame(() => {
        scrollToPage(bm.index);
      });
      bookmarkMenu.style.display = 'none';
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '✕';
    delBtn.onclick = () => {
      bookmarks.splice(i, 1);
      localStorage.setItem('imageBookmarks', JSON.stringify(bookmarks));
      renderBookmarks();
    };

    wrapper.appendChild(span);
    wrapper.appendChild(delBtn);
    bookmarkMenu.appendChild(wrapper);
  });
}
