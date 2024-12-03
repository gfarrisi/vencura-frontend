import { userAtom } from "@/atoms/userAtom";
import { transactionsAtom } from "@/atoms/walletAtom";
import { User, UserWallet } from "@/types/user";
import api from "@/utils/api";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Container, Text, UnstyledButton } from "@mantine/core";
import { ethers } from "ethers";
import { useAtom } from "jotai";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export function formatWalletAddress(address: string, length?: number) {
  return (
    address.slice(0, length || 4) + "..." + address.slice(length ? -length : -4)
  );
}

export const getImageUrl = () => {
  const randomNumber = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
  const defaultImage = `/defaultProfiles/${randomNumber}.svg`;
  return defaultImage;
};

const WalletMenu = ({
  activeWallet,
  wallets,
  setActiveWallet,
}: {
  activeWallet: UserWallet;
  wallets: UserWallet[];
  setActiveWallet: (wallet: UserWallet) => void;
}) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [user, setUser] = useAtom(userAtom);
  const [, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [, setTransactions] = useAtom(transactionsAtom);
  const { handleLogOut } = useDynamicContext();

  const getImage = useCallback(async () => {
    //check if dynamic image
    const imageUrl = getImageUrl();
    setImage(imageUrl);
  }, [activeWallet.id]);

  useEffect(() => {
    getImage();
  }, [getImage]);

  const handleChangeActiveWallet = useCallback(async (wallet: UserWallet) => {
    const getBalance = await api.get<{ balance: number }>(
      `wallet/${wallet.id}/balance`
    );
    setActiveWallet({
      ...wallet,
      balance: getBalance.balance,
    });

    setTransactions([]);
  }, []);

  const createNewWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const addWallet = await api.post<{
        updatedUser: User;
      }>("user/new-wallet");
      setUser(addWallet.updatedUser);
      setActiveWallet(addWallet.updatedUser.wallets[0]);
    } catch (error: any) {
      if (error.code === 4001) {
        // User rejected the request
        setError("Please sign the message to create a new wallet");
      } else {
        setError(error.message || "Failed to create wallet");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWalletClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await createNewWallet();
    } catch (error: any) {
      setError(error.message || "Failed to create wallet");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const handleLogOutButtonClick = async () => {
    const logout = await api.post<{ status: "success" | "error"; msg: string }>(
      "user/logout"
    );
    if (logout.status === "success") {
      handleLogOut();
      setUser(undefined);
    }
  };

  return (
    <Container
      fluid
      display="flex"
      style={{
        justifyContent: "center",
      }}
      bg="#7B7FEE"
    >
      <div>
        <Image
          src={image || "/default-user-img.png"}
          alt="VenCura logo"
          width={90}
          height={90}
          priority
          style={{ backgroundColor: "white", borderRadius: "50%", padding: 5 }}
        />
        <div style={{ height: 10 }} />
        <div style={{ position: "relative" }}>
          <UnstyledButton
            onClick={() => setOpenMenu(!openMenu)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              cursor: "pointer",
              "&hover:": {
                color: "red",
              },
              gap: ".2rem",
            }}
          >
            <Image
              src="/triangle.svg"
              alt="chevron-down"
              width={10}
              height={10}
              style={{
                marginLeft: 5,
                marginTop: 2,
                transform: !openMenu ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
            <Text
              c="white"
              size="lg"
              fw={500}
              style={{ letterSpacing: "0.05em", textAlign: "center" }}
            >
              {formatWalletAddress(activeWallet?.address || "farrisi.eth")}
            </Text>

            {openMenu && (
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: -10,
                  right: -50,
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 10,
                  boxShadow: "2px 5px 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                {wallets.map((wallet) => (
                  <UnstyledButton
                    key={wallet.id}
                    onClick={() => handleChangeActiveWallet(wallet)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        // color: "#000",
                        color:
                          user?.wallets &&
                          user?.wallets.length > 1 &&
                          wallet.id === activeWallet.id
                            ? "#7B7FEE"
                            : "#000",
                      }}
                    >
                      {formatWalletAddress(wallet.address, 4)}{" "}
                      {wallet.isprimarywallet ? "(Primary)" : ""}
                    </Text>
                  </UnstyledButton>
                ))}
                <div style={{ height: 5 }} />
                <UnstyledButton
                  onClick={handleAddWalletClick}
                  className="unstyledButton"
                  style={{
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#7B7FEE",
                    padding: 2,
                    paddingLeft: 8,
                    paddingRight: 8,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontWeight: 550, color: "white" }}>
                    Add Wallet
                  </Text>
                </UnstyledButton>
                <div style={{ height: 5 }} />
                <UnstyledButton
                  onClick={handleLogOutButtonClick}
                  className="unstyledButton"
                  style={{
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#00000040",
                    padding: 2,
                    paddingLeft: 8,
                    paddingRight: 8,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontWeight: 550, color: "white" }}>
                    Log out
                  </Text>
                </UnstyledButton>
              </div>
            )}
          </UnstyledButton>
        </div>
      </div>
    </Container>
  );
};

export default WalletMenu;
