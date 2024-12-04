import { UserWallet } from "@/types/user";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { transactionsAtom } from "@/atoms/walletAtom";
import { useAtom } from "jotai";
import api from "@/utils/api";
import { formatWalletAddress } from "./WalletMenu";

export const formatDate = (timestamp: string) => {
  const date = new Date(Number(timestamp) * 1000);
  const today = new Date();
  const showYear = date.getFullYear() !== today.getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[date.getMonth()];

  return `${monthName} ${date.getDate()}${
    showYear ? `/${date.getFullYear()}` : ""
  }`;
};

export type TransactionHistory = {
  toAddress: string;
  fromAddress: string;
  amount: string;
  timestamp: string;
  txnHash: string;
};

const TransactionHistory = ({ activeWallet }: { activeWallet: UserWallet }) => {
  const [transactions, setTransactions] = useAtom(transactionsAtom);

  const getTransactions = useCallback(async () => {
    const getTransactions = await api.get<{
      transactions: TransactionHistory[];
    }>(`wallet/${activeWallet.id}/transaction-history`);
    console.log("getTransactions", getTransactions);
    setTransactions(getTransactions.transactions);
  }, [activeWallet.address]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  //create a timer that polls the balance every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getTransactions();
    }, 10000);
    return () => clearInterval(interval);
  }, [getTransactions]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "400px",
        maxHeight: "30vh",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "auto",
          padding: "0 4px",
        }}
      >
        {transactions?.map((txn) => (
          <div
            key={txn.txnHash}
            style={{
              backgroundColor: "white",
              borderRadius: 15,
              padding: "15px",
              width: 280,
              margin: "0 auto 10px auto",
              cursor: "pointer",
            }}
            onClick={() => {
              window.open(
                `https://sepolia.etherscan.io/tx/${txn.txnHash}`,
                "_blank"
              );
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <Image
                  src={"defaultProfiles/txnDefaultImg.svg"}
                  alt="arrow-right"
                  width={40}
                  height={40}
                />
                <div>
                  <p
                    style={{
                      color: "black",
                      margin: 0,
                    }}
                  >
                    {formatWalletAddress(
                      txn.toAddress.toLowerCase() ===
                        activeWallet.address.toLowerCase()
                        ? txn.fromAddress
                        : txn.toAddress
                    )}
                  </p>
                  <p
                    style={{
                      color: "black",
                      fontSize: 12,
                      margin: 0,
                    }}
                  >
                    {formatDate(txn.timestamp)}
                  </p>
                </div>
              </div>

              <p
                style={{
                  margin: 0,
                  color:
                    txn.toAddress.toLowerCase() ===
                    activeWallet.address.toLowerCase()
                      ? "green"
                      : "red",
                }}
              >
                {`${
                  txn.toAddress.toLowerCase() ===
                  activeWallet.address.toLowerCase()
                    ? "+"
                    : "-"
                }${txn.amount} Ξ`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
