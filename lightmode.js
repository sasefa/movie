// Retrieve the stored mode preference from local storage, if available
    var storedMode = localStorage.getItem('mode');
    if (storedMode === 'dark') {
    enableDarkMode();
    }


function toggleMode() {
    var mode = localStorage.getItem('mode');
  
    if (mode !== 'dark') {
      enableDarkMode();
    } else {
      enableLightMode();
    }
  }
  
  function enableDarkMode() {
    var body = document.body;
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
  
    // Store the mode preference in local storage
    localStorage.setItem('mode', 'dark');
  }
  
  function enableLightMode() {
    var body = document.body;
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  
    // Store the mode preference in local storage
    localStorage.setItem('mode', 'light');
      }
  
  