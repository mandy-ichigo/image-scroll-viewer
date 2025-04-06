// events.js
import { folderPickerBtn, backBtn, feed, widthSlider, folderList } from './domRefs.js';
import { updatePageIndicator } from './images.js';

export function setupEvents() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'o' || e.key === 'O') folderPickerBtn.click();
    else if (e.key === 'Backspace' && backBtn.style.display !== 'none') backBtn.click();

    const scrollAmount = window.innerHeight * 0.9;
    if (e.key === 'ArrowDown') feed.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    else if (e.key === 'ArrowUp') feed.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
  });

  widthSlider.addEventListener('input', () => {
    document.documentElement.style.setProperty('--image-width', widthSlider.value + 'px');
  });
  
  backBtn.addEventListener('click', () => {
    feed.innerHTML = '';
    pageIndicator.style.display = 'none';
    folderList.style.display = 'flex';
    backBtn.style.display = 'none';
    console.log('Back button clicked');
    

  });
}
