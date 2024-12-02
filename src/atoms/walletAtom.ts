import { TransactionHistory } from "@/components/TransactionHistory";
import { UserWallet } from "@/types/user";
import { atom } from "jotai";

export const activeWalletAtom = atom<UserWallet | undefined>(undefined);
export const transactionsAtom = atom<TransactionHistory[]>([]);
