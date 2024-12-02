export type User = {
  id: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  wallets: UserWallet[];
};

export type UserWallet = {
  id: string;
  address: string;
  encryptedPrivateKey: string;
  encryptionIv: string;
  createdAt: number;
  updatedAt: number;
  isPrimaryWallet?: boolean;
  isprimarywallet?: boolean;
  balance?: number | string;
};
