// main.js (Entry point that brings everything together)
import { setupScrollTracking } from './images.js';
import { folderPickerBtn } from './domRefs.js';
import { setupEvents } from './events.js';
import { setupFolderPicker } from './folders.js';
import { setupBookmarks } from './bookmarks.js';

// Initial setup
//setupDOM();
setupEvents();
setupFolderPicker();
setupBookmarks();
setupScrollTracking(); // ✅ this fixes the page number issue

