import { User } from "@/context/AppContext";

// Mock Google OAuth for demo purposes
declare global {
  interface Window {
    google?: any;
    FB?: any;
    gapi?: any;
  }
}

export interface SocialAuthProvider {
  id: string;
  name: string;
  icon: string;
  login: () => Promise<User>;
}

// Mock Google Sign-In
const googleAuth: SocialAuthProvider = {
  id: 'google',
  name: 'Google',
  icon: 'google',
  login: async (): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Simulate OAuth flow
      setTimeout(() => {
        const mockGoogleUser: User = {
          email: 'user@gmail.com',
          name: 'Google User'
        };
        
        // In a real app, this would open Google OAuth popup
        const confirmed = window.confirm(
          `Sign in with Google?\n\nThis will log you in as: ${mockGoogleUser.name}\nEmail: ${mockGoogleUser.email}`
        );
        
        if (confirmed) {
          resolve(mockGoogleUser);
        } else {
          reject(new Error('User cancelled Google sign-in'));
        }
      }, 500);
    });
  }
};

// Mock Facebook Sign-In
const facebookAuth: SocialAuthProvider = {
  id: 'facebook',
  name: 'Facebook',
  icon: 'facebook',
  login: async (): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockFacebookUser: User = {
          email: 'user@facebook.com',
          name: 'Facebook User'
        };
        
        const confirmed = window.confirm(
          `Sign in with Facebook?\n\nThis will log you in as: ${mockFacebookUser.name}\nEmail: ${mockFacebookUser.email}`
        );
        
        if (confirmed) {
          resolve(mockFacebookUser);
        } else {
          reject(new Error('User cancelled Facebook sign-in'));
        }
      }, 500);
    });
  }
};

// Mock Apple Sign-In
const appleAuth: SocialAuthProvider = {
  id: 'apple',
  name: 'Apple',
  icon: 'apple',
  login: async (): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockAppleUser: User = {
          email: 'user@icloud.com',
          name: 'Apple User'
        };
        
        const confirmed = window.confirm(
          `Sign in with Apple?\n\nThis will log you in as: ${mockAppleUser.name}\nEmail: ${mockAppleUser.email}`
        );
        
        if (confirmed) {
          resolve(mockAppleUser);
        } else {
          reject(new Error('User cancelled Apple sign-in'));
        }
      }, 500);
    });
  }
};

export const socialAuthProviders: SocialAuthProvider[] = [
  googleAuth,
  facebookAuth,
  appleAuth
];

export const getSocialAuthProvider = (id: string): SocialAuthProvider | undefined => {
  return socialAuthProviders.find(provider => provider.id === id);
};

// Real-world Google Sign-In setup (commented out for demo)
/*
export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
        }).then(resolve).catch(reject);
      });
    } else {
      reject(new Error('Google API not loaded'));
    }
  });
};

export const signInWithGoogle = async (): Promise<User> => {
  const authInstance = window.gapi.auth2.getAuthInstance();
  const googleUser = await authInstance.signIn();
  const profile = googleUser.getBasicProfile();
  
  return {
    email: profile.getEmail(),
    name: profile.getName(),
    avatar: profile.getImageUrl()
  };
};
*/
