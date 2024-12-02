import { Text, Box, UnstyledButton } from "@mantine/core";
import Image from "next/image";

const PayVencuraFooter = ({
  setOpenPayModal,
}: {
  setOpenPayModal: (value: boolean) => void;
}) => {
  return (
    <div>
      <Box
        style={{
          backgroundColor: "white",
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          height: 90,
        }}
      ></Box>
      <Box
        style={{
          position: "absolute",
          bottom: 15,
          right: 0,
          left: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <UnstyledButton
          onClick={() => setOpenPayModal(true)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 20,
              paddingTop: 25,
              borderRadius: "50%",
              borderColor: "#7B7FEE",
              borderWidth: 10,
              borderStyle: "solid",
            }}
          >
            <Image
              src="/v.png"
              alt="VenCura logo"
              width={70}
              height={70}
              priority
              style={{ borderRadius: "50%" }}
            />
          </div>
          <Text
            c="#7B7FEE"
            size="lg"
            fw={600}
            style={{
              letterSpacing: "0.05em",
              textAlign: "center",
              paddingTop: 10,
            }}
          >
            {"Pay"}
          </Text>
        </UnstyledButton>
      </Box>
    </div>
  );
};

export default PayVencuraFooter;
