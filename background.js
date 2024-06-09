chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  chrome.tabs.onActivated.addListener(handleTabChange);
  chrome.windows.onFocusChanged.addListener(handleWindowFocusChange);
  chrome.runtime.onMessage.addListener(handleMessage);
});

function handleTabChange(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    if (tab && tab.url && !tab.url.startsWith('chrome://')) {
      console.log(`Tab activated: ${tab.url}`);
      if (chrome.scripting) {
        chrome.scripting.executeScript({
          target: { tabId: activeInfo.tabId },
          function: checkAndControlVideo,
          args: [true] // true means the tab is active
        });
      } else {
        console.error('chrome.scripting API is not available');
      }
    }
  });
}

function handleWindowFocusChange(windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      if (tabs.length > 0 && tabs[0].url && !tabs[0].url.startsWith('chrome://')) {
        console.log(`Window focus changed: ${tabs[0].url}`);
        if (chrome.scripting) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: checkAndControlVideo,
            args: [false] // false means the window is not in focus
          });
        } else {
          console.error('chrome.scripting API is not available');
        }
      }
    });
  }
}

function handleMessage(message, sender) {
  if (message.type === 'tabVisibilityChanged') {
    if (sender.tab && sender.tab.url && !sender.tab.url.startsWith('chrome://')) {
      console.log(`Tab visibility changed: ${sender.tab.url}`);
      if (chrome.scripting) {
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          function: checkAndControlVideo,
          args: [message.isVisible]
        });
      } else {
        console.error('chrome.scripting API is not available');
      }
    }
  }
}

function checkAndControlVideo(isActive) {
  console.log(`checkAndControlVideo called with isActive: ${isActive}`);
  document.querySelectorAll('video').forEach(video => {
    if (isActive) {
      if (document.hidden) {
        video.pause();
      } else {
        video.play();
      }
    } else {
      video.pause();
    }
  });
}
