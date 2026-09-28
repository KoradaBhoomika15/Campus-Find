import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Item, Claim, Message, Notification, ItemType, ItemStatus, Category, CampusLocation } from '../types';
import { INITIAL_USERS, INITIAL_ITEMS, INITIAL_CLAIMS, INITIAL_MESSAGES, INITIAL_NOTIFICATIONS } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  allUsers: User[];
  items: Item[];
  claims: Claim[];
  messages: Message[];
  notifications: Notification[];
  activeTab: 'home' | 'browse' | 'report-lost' | 'report-found' | 'my-reports' | 'matches' | 'messages' | 'profile';
  setActiveTab: (tab: 'home' | 'browse' | 'report-lost' | 'report-found' | 'my-reports' | 'matches' | 'messages' | 'profile') => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  claimModalItemId: string | null;
  setClaimModalItemId: (id: string | null) => void;
  contactModalItemId: string | null;
  setContactModalItemId: (id: string | null) => void;
  
  // Actions
  login: (email: string, pass: string) => boolean;
  signup: (userData: { name: string; email: string; department: string; year: string }) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  addItem: (itemData: Omit<Item, 'itemId' | 'userId' | 'userName' | 'userEmail' | 'userDepartment' | 'createdAt' | 'status'>) => string;
  updateItem: (itemId: string, patch: Partial<Item>) => void;
  deleteItem: (itemId: string) => void;
  markItemStatus: (itemId: string, status: ItemStatus) => void;
  submitClaim: (data: { itemId: string; reason: string; uniqueFeature: string; contactNumber?: string }) => string;
  updateClaimStatus: (claimId: string, status: 'accepted' | 'rejected' | 'resolved', responseNote?: string) => void;
  sendChatMessage: (receiverId: string, text: string, itemId?: string, itemTitle?: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or initialize state with localStorage persistence
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('campusfind_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[0]; // Aarav Sharma by default
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('campusfind_all_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS;
  });

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('campusfind_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ITEMS;
  });

  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem('campusfind_claims');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CLAIMS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('campusfind_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('campusfind_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'report-lost' | 'report-found' | 'my-reports' | 'matches' | 'messages' | 'profile'>('home');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [claimModalItemId, setClaimModalItemId] = useState<string | null>(null);
  const [contactModalItemId, setContactModalItemId] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('campusfind_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('campusfind_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('campusfind_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('campusfind_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('campusfind_claims', JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem('campusfind_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('campusfind_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth methods
  const login = (email: string, _pass: string): boolean => {
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setAuthModalOpen(false);
      return true;
    }
    // Auto-create user if not found to facilitate effortless testing
    const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    const newUser: User = {
      userId: `user_${Date.now()}`,
      name: formattedName || 'Campus Student',
      email,
      department: 'General Studies',
      year: '1st Year',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setAuthModalOpen(false);
    return true;
  };

  const signup = (userData: { name: string; email: string; department: string; year: string }) => {
    const newUser: User = {
      userId: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      department: userData.department,
      year: userData.year,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const found = allUsers.find(u => u.userId === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  // Add Item
  const addItem = (itemData: Omit<Item, 'itemId' | 'userId' | 'userName' | 'userEmail' | 'userDepartment' | 'createdAt' | 'status'>): string => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return '';
    }

    const prefix = itemData.type === 'lost' ? 'LOST' : 'FND';
    const randNum = Math.floor(100 + Math.random() * 900);
    const newItemId = `${prefix}-${randNum}`;

    const newItem: Item = {
      ...itemData,
      itemId: newItemId,
      userId: currentUser.userId,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userDepartment: currentUser.department,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    setItems(prev => [newItem, ...prev]);

    // Check if there are similar items to notify user about
    const potentialMatches = items.filter(
      other => other.type !== newItem.type &&
               other.category === newItem.category &&
               other.status === 'Active'
    );

    if (potentialMatches.length > 0) {
      const match = potentialMatches[0];
      const matchNotif: Notification = {
        notificationId: `notif_${Date.now()}`,
        userId: currentUser.userId,
        title: 'Potential Campus Match Detected',
        message: `Your newly reported ${newItem.name} may correspond to ${match.name} (${match.type}) at ${match.location}. Check Matches tab.`,
        type: 'ai_match',
        itemId: match.itemId,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [matchNotif, ...prev]);
    }

    return newItemId;
  };

  const updateItem = (itemId: string, patch: Partial<Item>) => {
    setItems(prev => prev.map(item => item.itemId === itemId ? { ...item, ...patch } : item));
  };

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.itemId !== itemId));
    // Clean up associated claims
    setClaims(prev => prev.filter(c => c.itemId !== itemId));
  };

  const markItemStatus = (itemId: string, status: ItemStatus) => {
    setItems(prev => prev.map(item => {
      if (item.itemId === itemId) {
        return {
          ...item,
          status,
          resolvedAt: status === 'Resolved' || status === 'Returned' ? new Date().toISOString() : item.resolvedAt,
        };
      }
      return item;
    }));
  };

  // Claim operations
  const submitClaim = (data: { itemId: string; reason: string; uniqueFeature: string; contactNumber?: string }): string => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return '';
    }

    const item = items.find(i => i.itemId === data.itemId);
    if (!item) return '';

    const newClaimId = `claim_${Date.now()}`;
    const newClaim: Claim = {
      claimId: newClaimId,
      itemId: item.itemId,
      itemTitle: item.name,
      itemType: item.type,
      claimantId: currentUser.userId,
      claimantName: currentUser.name,
      claimantEmail: currentUser.email,
      claimantDepartment: currentUser.department,
      postOwnerId: item.userId,
      reason: data.reason,
      uniqueFeature: data.uniqueFeature,
      contactNumber: data.contactNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setClaims(prev => [newClaim, ...prev]);

    // Notify item post owner
    const notif: Notification = {
      notificationId: `notif_${Date.now()}`,
      userId: item.userId,
      title: 'New Verification Claim Request',
      message: `${currentUser.name} submitted a claim for "${item.name}". Please review their verification details.`,
      type: 'claim_received',
      itemId: item.itemId,
      claimId: newClaimId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    return newClaimId;
  };

  const updateClaimStatus = (claimId: string, status: 'accepted' | 'rejected' | 'resolved', responseNote?: string) => {
    setClaims(prev => prev.map(claim => {
      if (claim.claimId === claimId) {
        // Notify the claimant
        const statusTitle = status === 'accepted' ? 'Claim Request Accepted!' : status === 'rejected' ? 'Claim Request Rejected' : 'Item Handover Resolved';
        const statusMsg = status === 'accepted' 
          ? `Your claim for "${claim.itemTitle}" was accepted by the poster! You can now coordinate pickup.`
          : status === 'rejected'
          ? `Your claim for "${claim.itemTitle}" was reviewed and declined. ${responseNote ? `Note: "${responseNote}"` : ''}`
          : `The handover for "${claim.itemTitle}" has been completed.`;

        const notif: Notification = {
          notificationId: `notif_${Date.now()}`,
          userId: claim.claimantId,
          title: statusTitle,
          message: statusMsg,
          type: status === 'accepted' ? 'claim_accepted' : 'claim_rejected',
          itemId: claim.itemId,
          claimId: claim.claimId,
          read: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications(curr => [notif, ...curr]);

        // If accepted, update item status to 'Claimed'
        if (status === 'accepted') {
          markItemStatus(claim.itemId, 'Claimed');
        } else if (status === 'resolved') {
          markItemStatus(claim.itemId, 'Returned');
        }

        return { ...claim, status, responseMessage: responseNote };
      }
      return claim;
    }));
  };

  // Direct chat messaging
  const sendChatMessage = (receiverId: string, text: string, itemId?: string, itemTitle?: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const targetUser = allUsers.find(u => u.userId === receiverId);
    const receiverName = targetUser ? targetUser.name : 'Fellow Student';

    const convId = [currentUser.userId, receiverId].sort().join('_') + (itemId ? `_${itemId}` : '');
    const newMsg: Message = {
      messageId: `msg_${Date.now()}`,
      conversationId: convId,
      itemId,
      itemTitle,
      senderId: currentUser.userId,
      senderName: currentUser.name,
      receiverId,
      receiverName,
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]);

    // Send notification to receiver
    const notif: Notification = {
      notificationId: `notif_${Date.now()}`,
      userId: receiverId,
      title: `Message from ${currentUser.name}`,
      message: `"${text.slice(0, 60)}${text.length > 60 ? '...' : ''}" regarding ${itemTitle || 'campus item'}.`,
      type: 'message_received',
      itemId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.notificationId === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.userId ? { ...n, read: true } : n));
  };

  const resetAllDemoData = () => {
    localStorage.removeItem('campusfind_items');
    localStorage.removeItem('campusfind_claims');
    localStorage.removeItem('campusfind_messages');
    localStorage.removeItem('campusfind_notifications');
    localStorage.removeItem('campusfind_user');
    localStorage.removeItem('campusfind_all_users');
    setItems(INITIAL_ITEMS);
    setClaims(INITIAL_CLAIMS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_USERS[0]);
    setAllUsers(INITIAL_USERS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        items,
        claims,
        messages,
        notifications,
        activeTab,
        setActiveTab,
        selectedItemId,
        setSelectedItemId,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        claimModalItemId,
        setClaimModalItemId,
        contactModalItemId,
        setContactModalItemId,
        login,
        signup,
        logout,
        switchUser,
        addItem,
        updateItem,
        deleteItem,
        markItemStatus,
        submitClaim,
        updateClaimStatus,
        sendChatMessage,
        markNotificationAsRead,
        markAllNotificationsRead,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
