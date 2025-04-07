
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  query, 
  where, 
  getDocs,
  enableNetwork,
  enableIndexedDbPersistence
} from 'firebase/firestore';

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.error("Multiple tabs open, persistence can only be enabled in one tab at a time");
    } else if (err.code === 'unimplemented') {
      console.error("The current browser doesn't support all of the features required to enable persistence");
    }
  });

// Helper function to retry operations with exponential backoff
const retryOperation = async (operation: Function, maxRetries = 3, delayMs = 1000) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      // Try to ensure network is enabled
      if (retries > 0) {
        await enableNetwork(db);
      }
      
      return await operation();
    } catch (error: any) {
      retries++;
      console.log(`Operation failed, retry ${retries}/${maxRetries}`, error?.message);
      
      if (retries >= maxRetries || error?.code !== 'unavailable') {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, retries - 1)));
    }
  }
};

// Bookmark a movie
export const bookmarkMovie = async (userId: string, movieId: string, movieData: any) => {
  return retryOperation(async () => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      await setDoc(userDocRef, {
        bookmarks: [{ id: movieId, ...movieData }],
        watchHistory: [],
        preferences: {}
      });
    } else {
      // Update existing document
      await updateDoc(userDocRef, {
        bookmarks: arrayUnion({ id: movieId, ...movieData })
      });
    }
    return true;
  });
};

// Remove bookmark
export const removeBookmark = async (userId: string, movieId: string) => {
  return retryOperation(async () => {
    const userDocRef = doc(db, 'users', userId);
    
    // Get the current bookmarks to find the one with matching ID
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) return false;
    
    const userData = userDoc.data();
    const movieToRemove = userData.bookmarks.find((movie: any) => movie.id === movieId);
    
    if (movieToRemove) {
      await updateDoc(userDocRef, {
        bookmarks: arrayRemove(movieToRemove)
      });
    }
    
    return true;
  });
};

// Add to watch history
export const addToWatchHistory = async (userId: string, movieId: string, movieData: any) => {
  return retryOperation(async () => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    const watchData = {
      id: movieId,
      watchedAt: new Date(),
      ...movieData
    };
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        bookmarks: [],
        watchHistory: [watchData],
        preferences: {}
      });
    } else {
      await updateDoc(userDocRef, {
        watchHistory: arrayUnion(watchData)
      });
    }
    
    return true;
  });
};

export const clearWatchHistory = async (userId: string) => {
  const userDocRef = doc(db, "users", userId); 
  try {
    await updateDoc(userDocRef, {
      watchHistory: []
    });
  } catch (error) {
    console.error("Error clearing watch history:", error);
  }
};

// Get user data
export const getUserData = async (userId: string) => {
  return retryOperation(async () => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      const newUserData = {
        bookmarks: [],
        watchHistory: [],
        preferences: {}
      };
      await setDoc(userDocRef, newUserData);
      return newUserData;
    }
    
    return userDoc.data();
  });
};

// Update user preferences
export const updateUserPreferences = async (userId: string, preferences: any) => {
  return retryOperation(async () => {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        bookmarks: [],
        watchHistory: [],
        preferences: preferences
      });
    } else {
      await updateDoc(userDocRef, {
        preferences: preferences
      });
    }
    
    return true;
  });
};
