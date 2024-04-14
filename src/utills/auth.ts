// utils/auth.ts
export const getTokenExpiration = (): number | null => {
    const expiresIn = localStorage.getItem('expires_in');
    return expiresIn ? parseInt(expiresIn) : null;
  };
  
  export const checkTokenExpiration = (): boolean => {
    const expirationTime = getTokenExpiration();
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const oneHourAhead = currentTime + 3600; // One hour ahead in seconds
  
    console.log(expirationTime)
    console.log(currentTime)
    if (expirationTime && currentTime >= expirationTime) {
      // Token expired
      return false;
    }
  
    if (currentTime >= oneHourAhead) {
      // One hour has passed, return true
      return true;
    }
  
    // Token not expired and less than one hour has passed
    return false;
  };
  