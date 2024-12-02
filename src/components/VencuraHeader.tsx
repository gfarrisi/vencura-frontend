import { Anchor, Box } from "@mantine/core";
import Image from "next/image";

const VencuraHeader = () => {
  return (
    <Box style={{ height: 130, marginLeft: 15 }} p={"md"} pl={"xl"}>
      {/* <div style={{ width: 30 }} /> */}
      <Anchor href="/">
        <Image
          src="/VenCura.svg"
          height={80}
          width={180}
          alt="bello logo"
          draggable={false}
        />
      </Anchor>
    </Box>
  );
};

export default VencuraHeader;
