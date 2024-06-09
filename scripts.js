const toggleExtension = () => {
    chrome.action.setPopup({ popup: 'popup.html' });
  };
  
  chrome.runtime.onInstalled.addListener(toggleExtension);
  chrome.runtime.onStartup.addListener(toggleExtension);
  