export type ItemType = 'lost' | 'found';

export type Category = 
  | 'Electronics'
  | 'Bags'
  | 'Wallets'
  | 'ID Cards'
  | 'Keys'
  | 'Books'
  | 'Clothing'
  | 'Accessories'
  | 'Other';

export type CampusLocation = 
  | 'Library'
  | 'Cafeteria'
  | 'Hostel'
  | 'Classroom'
  | 'Laboratory'
  | 'Parking'
  | 'Auditorium'
  | 'Sports Ground'
  | 'Main Gate'
  | 'Student Center'
  | 'Other';

export type LostItemStatus = 'Active' | 'Found' | 'Resolved';
export type FoundItemStatus = 'Active' | 'Claimed' | 'Returned' | 'Resolved';
export type ItemStatus = LostItemStatus | FoundItemStatus;

export interface User {
  userId: string;
  name: string;
  email: string;
  department: string;
  year: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface Item {
  itemId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userDepartment?: string;
  type: ItemType;
  name: string;
  category: Category;
  description: string;
  color: string;
  brand?: string;
  location: CampusLocation | string;
  specificLocation?: string;
  date: string; // YYYY-MM-DD
  image: string;
  additionalDetails?: string;
  status: ItemStatus;
  createdAt: string;
  resolvedAt?: string;
}

export interface Claim {
  claimId: string;
  itemId: string;
  itemTitle: string;
  itemType: ItemType;
  claimantId: string;
  claimantName: string;
  claimantEmail: string;
  claimantDepartment?: string;
  postOwnerId: string;
  reason: string;
  uniqueFeature: string;
  contactNumber?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'resolved';
  createdAt: string;
  responseMessage?: string;
}

export interface Message {
  messageId: string;
  conversationId: string;
  itemId?: string;
  itemTitle?: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  createdAt: string;
}

export interface Notification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: 'claim_received' | 'claim_accepted' | 'claim_rejected' | 'message_received' | 'status_changed' | 'ai_match';
  itemId?: string;
  claimId?: string;
  read: boolean;
  createdAt: string;
}

export interface AIMatchResult {
  candidateId: string;
  score: number;
  reasons: string[];
  explanation: string;
}
