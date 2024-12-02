import { User, UserWallet } from "@/types/user";
import { Container, Text, AppShell, UnstyledButton, Tabs } from "@mantine/core";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import PayVencuraFooter from "./PayVencuraFooter";
import WalletBalance from "./WalletBalance";
import TransactionHistory from "./TransactionHistory";
import VencuraHeader from "./VencuraHeader";
import WalletMenu from "./WalletMenu";
import { activeWalletAtom } from "@/atoms/walletAtom";
import { useAtom } from "jotai";
import PayModal from "./PayModal";
import useUserWalletBalances from "@/hooks/useUserWallets";

type TabItem = {
  value: string;
  id: "wallet" | "transactions";
  icon?: JSX.Element;
};

const Dashboard = ({ user }: { user: User }) => {
  const [view, setView] = useState<"wallet" | "transactions">("wallet");
  const [openPayModal, setOpenPayModal] = useState<boolean>(false);
  const [activeWallet, setActiveWallet] = useAtom(activeWalletAtom);
  //   useUserWalletBalances();

  useEffect(() => {
    setActiveWallet(user?.wallets[0] || undefined);
  }, [user]);

  const changeActiveTab = useCallback(
    (newView: "wallet" | "transactions") => {
      setView(newView);
    },
    [view]
  );

  const views: TabItem[] = useMemo(
    () => [
      {
        value: "WALLET",
        id: "wallet",
        icon: <></>,
      },
      {
        value: "TRANSACTIONS",
        id: "transactions",
        icon: <></>,
      },
    ],
    []
  );

  return (
    <>
      {activeWallet && (
        <AppShell bg="#7B7FEE">
          <PayModal
            opened={openPayModal}
            setOpened={setOpenPayModal}
            activeWallet={activeWallet}
          />
          <Container fluid h="100vh" bg="#7B7FEE">
            <VencuraHeader />
            <WalletMenu
              activeWallet={activeWallet}
              setActiveWallet={setActiveWallet}
              wallets={user.wallets}
            />
            <div style={{ height: 20 }} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#eceef8",
                borderRadius: 15,
                padding: "8px 10px",
                width: 280,
                margin: "auto",
              }}
            >
              <Tabs
                value={view}
                onClick={() =>
                  changeActiveTab(
                    view === "transactions" ? "wallet" : "transactions"
                  )
                }
                style={{ border: "none" }}
              >
                <Tabs.List mb={"lg"}>
                  {views.map((v) => {
                    const { icon, value, id } = v;
                    return (
                      <Tabs.Tab
                        value={value}
                        disabled={false}
                        style={{
                          fontSize: "lg",
                          color: "black",
                          backgroundColor:
                            view === id ? "white" : "transparent",
                          padding: "8px 10px",
                          border: "none",
                          borderRadius: 10,
                          minWidth: 130,
                          cursor: "pointer",
                        }}
                      >
                        {value}
                      </Tabs.Tab>
                    );
                  })}
                </Tabs.List>
              </Tabs>
            </div>
            <div style={{ height: 20 }} />
            {view === "wallet" ? (
              <WalletBalance activeWallet={activeWallet} user={user} />
            ) : (
              <TransactionHistory activeWallet={activeWallet} />
            )}
          </Container>
          <PayVencuraFooter setOpenPayModal={setOpenPayModal} />
        </AppShell>
      )}
    </>
  );
};

export default Dashboard;
