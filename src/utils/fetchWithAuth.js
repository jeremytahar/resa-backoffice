export async function fetchWithAuth(url, options = {}, onLogout) {
    const response = await fetch(url, options);
  
    if (response.status === 401) {
      onLogout();
      return null;
    }
  
    return response;
  }
  