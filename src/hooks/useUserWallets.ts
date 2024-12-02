import { userAtom } from "@/atoms/userAtom";
import api from "@/utils/api";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

const useUserWalletBalances = () => {
  const [user, setUser] = useAtom(userAtom);
  const getAllWalletBalances = useCallback(async () => {
    if (!user) return;

    const walletWithBalances = await Promise.all(
      user.wallets.map(async (wallet) => {
        const getBalance = await api.get<{ balance: number }>(
          `wallet/${wallet.id}/balance`
        );
        return { ...wallet, balance: getBalance.balance };
      })
    );

    setUser((prevUser) => ({
      ...prevUser!,
      wallets: walletWithBalances,
    }));
  }, [user, setUser]);

  useEffect(() => {
    getAllWalletBalances();
  }, [getAllWalletBalances]);

  useEffect(() => {
    const interval = setInterval(() => {
      getAllWalletBalances();
    }, 10000);
    return () => clearInterval(interval);
  }, [getAllWalletBalances]);

  return {
    wallets: user?.wallets,
  };
};

export default useUserWalletBalances;
