
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
  getDocs 
} from 'firebase/firestore';

// Bookmark a movie
export const bookmarkMovie = async (userId: string, movieId: string, movieData: any) => {
  try {
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
  } catch (error) {
    console.error('Error bookmarking movie:', error);
    throw error;
  }
};

// Remove bookmark
export const removeBookmark = async (userId: string, movieId: string) => {
  try {
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
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

// Add to watch history
export const addToWatchHistory = async (userId: string, movieId: string, movieData: any) => {
  try {
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
  } catch (error) {
    console.error('Error adding to watch history:', error);
    throw error;
  }
};

// Get user data
export const getUserData = async (userId: string) => {
  try {
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
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (userId: string, preferences: any) => {
  try {
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
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};
