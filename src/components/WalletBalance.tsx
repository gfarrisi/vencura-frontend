import { User, UserWallet } from "@/types/user";
import { Button, Text } from "@mantine/core";
import { useState } from "react";
import AddMoneyModal from "./AddMoneyModal";

export function formatBalanceEth(balance: number | string) {
  return `${Number(balance).toFixed(4)} ETH`;
}

const WalletBalance = ({
  activeWallet,
  user,
}: {
  activeWallet: UserWallet;
  user: User;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        style={{
          backgroundColor: "#eceef8",
          borderRadius: 15,
          padding: "15px 20px",
          width: 280,
          margin: "auto",
        }}
      >
        <Text
          style={{
            color: "black",
          }}
        >
          Amount
        </Text>
        <Text
          style={{
            color: "black",
            fontSize: 40,
            fontWeight: 600,
            marginTop: 10,
          }}
        >
          {activeWallet.balance
            ? formatBalanceEth(activeWallet.balance || 0)
            : "--"}
          {/* ${formatBalance(activeWallet.balance || 0, ethPrice)} */}
        </Text>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => setIsModalOpen(true)}
            styles={{
              root: {
                backgroundColor: "#f499c1",
                border: "none",
                padding: "5px 10px",
                borderRadius: 10,
                marginTop: 15,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#e488b0",
                },
              },
            }}
          >
            Add Money
          </Button>
        </div>
      </div>
      <AddMoneyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallet={activeWallet}
        userWallets={user.wallets}
      />
    </>
  );
};

export default WalletBalance;
