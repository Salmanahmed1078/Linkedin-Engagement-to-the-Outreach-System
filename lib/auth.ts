// Authentication utilities for ChatWalrus

// Uses credentials.json file and localStorage for persistence

export interface Credentials {
  username: string;
  password: string;
  source: 'file' | 'localStorage';
}

export interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
}

/**
 * Get credentials from credentials.json or localStorage
 * Priority: credentials.json file > localStorage
 */
export async function getCredentials(forceFile = false): Promise<Credentials | null> {
  // Try to load from credentials.json first
  try {
    const response = await fetch('/credentials.json?' + new Date().getTime());
    if (response.ok) {
      const data = await response.json();
      if (data.username && data.password && 
          data.username.trim() !== '' && data.password.trim() !== '') {
        
        const fileCredentials: Credentials = {
          username: data.username.trim(),
          password: data.password.trim(),
          source: 'file'
        };
        
        // Update localStorage if different
        if (typeof window !== 'undefined') {
          const storedUsername = localStorage.getItem('chatwalrus_username');
          const storedPassword = localStorage.getItem('chatwalrus_password');
          
          if (storedUsername !== fileCredentials.username || 
              storedPassword !== fileCredentials.password) {
            localStorage.setItem('chatwalrus_username', fileCredentials.username);
            localStorage.setItem('chatwalrus_password', fileCredentials.password);
          }
        }
        
        return fileCredentials;
      }
    }
  } catch (error) {
    console.log('Could not load credentials.json:', error);
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const username = localStorage.getItem('chatwalrus_username');
    const password = localStorage.getItem('chatwalrus_password');
    
    if (username && password && username.trim() !== '' && password.trim() !== '') {
      return {
        username: username.trim(),
        password: password.trim(),
        source: 'localStorage'
      };
    }
  }
  
  return null;
}

/**
 * Save credentials to localStorage and download credentials.json
 */
export function saveCredentials(username: string, password: string) {
  if (typeof window === 'undefined') return;
  
  // Save to localStorage
  localStorage.setItem('chatwalrus_username', username);
  localStorage.setItem('chatwalrus_password', password);
  
  // Create and download credentials.json
  const credentials = { username, password };
  const blob = new Blob([JSON.stringify(credentials, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'credentials.json';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Verify login credentials
 */
export async function verifyLogin(
  username: string, 
  password: string
): Promise<{ success: boolean; message?: string }> {
  const credentials = await getCredentials(true);
  
  if (!credentials) {
    return { 
      success: false, 
      message: 'No credentials found. Please set up your account first.' 
    };
  }
  
  if (username.trim() === credentials.username && 
      password === credentials.password) {
    // Set logged in state
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatwalrus_loggedIn', 'true');
    }
    return { success: true };
  }
  
  return { 
    success: false, 
    message: `Invalid username or password. Current username: "${credentials.username}"` 
  };
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('chatwalrus_loggedIn') === 'true';
}

/**
 * Logout user (keeps credentials)
 */
export function logout() {
  if (typeof window === 'undefined') return;
  console.log('Setting loggedIn to false');
  localStorage.setItem('chatwalrus_loggedIn', 'false');
  console.log('Logged out successfully');
}

/**
 * Get current auth state
 */
export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { isLoggedIn: false, username: null };
  }
  
  const loggedIn = localStorage.getItem('chatwalrus_loggedIn') === 'true';
  const username = localStorage.getItem('chatwalrus_username');
  
  return {
    isLoggedIn: loggedIn,
    username: loggedIn ? username : null
  };
}
