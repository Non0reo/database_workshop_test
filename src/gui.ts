

function initGuiEvents() {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const inputField = document.querySelector('#video-input') as HTMLInputElement;
      if (inputField) {
        createVideoEntry(inputField.value);
        inputField.value = '';
      }
    }
  });
}


function createVideoEntry(url: string) {
  const cleanedUrl = /(?:https:\/\/youtu\.be\/|https:\/\/www\.youtube\.com\/watch\?v=)(.*)/.exec(url)?.at(1);
  if(!cleanedUrl) {
    console.warn('Bad Url Provided');
    return;
  }

  console.log(cleanedUrl);
}


export { initGuiEvents, createVideoEntry };