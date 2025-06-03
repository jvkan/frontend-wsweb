export interface Payment {
  id: number;
  event: CampEvent;
  user: { id: number; username: string; };  // only id/username returned in JSON
  paymentType: 'GAS' | 'FOOD' | 'PERSONAL' | 'OTHER';
  amount: number;
  receiptMimeType: string;
  receiptFilename: string | null;
  timestamp: string; // ISO string
  approved: boolean;
}
