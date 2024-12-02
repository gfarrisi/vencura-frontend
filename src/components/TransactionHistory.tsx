import { User, UserWallet } from "@/types/user";
import { Stack, Text, Group, ScrollArea } from "@mantine/core";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import PayVencuraFooter from "./PayVencuraFooter";
import WalletBalance from "./WalletBalance";
import { activeWalletAtom, transactionsAtom } from "@/atoms/walletAtom";
import { useAtom } from "jotai";
import api from "@/utils/api";
import { formatWalletAddress, getImageUrl } from "./WalletMenu";

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
    <ScrollArea style={{ height: 100 }} scrollbarSize={0.01} type={"always"}>
      <Stack>
        {transactions?.map((txn) => {
          return (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: 15,
                padding: "15px 15px",
                width: 280,
                margin: "auto",
                marginBottom: 10,
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(
                  `https://sepolia.etherscan.io/tx/${txn.txnHash}`,
                  "_blank"
                );
              }}
            >
              <Group
                display="flex"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <Group
                  display="flex"
                  style={{
                    // alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    src={"defaultProfiles/txnDefaultImg.svg"}
                    alt="arrow-right"
                    width={40}
                    height={40}
                  />

                  <div>
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      {`${formatWalletAddress(
                        txn.toAddress.toLowerCase() ===
                          activeWallet.address.toLowerCase()
                          ? txn.fromAddress
                          : txn.toAddress
                      )}`}
                    </Text>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 12,
                      }}
                    >
                      {`${formatDate(txn.timestamp)}`}
                    </Text>
                  </div>
                </Group>

                <Text
                  style={{
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
                </Text>
              </Group>
            </div>
          );
        })}
      </Stack>
    </ScrollArea>
  );
};

export default TransactionHistory;
