document.addEventListener('visibilitychange', () => {
    chrome.runtime.sendMessage({
      type: 'tabVisibilityChanged',
      isVisible: !document.hidden
    });
  });
  