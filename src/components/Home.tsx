import { Container, Button, Stack, Text } from "@mantine/core";
import Image from "next/image";

const Home = () => {
  return (
    <Container
      fluid
      //   h="100vh"
      bg="#7B7FEE"
      display="flex"
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack align="center">
        <Image
          //   className={styles.logo}
          src="/VenCura.svg"
          alt="VenCura logo"
          width={180}
          height={38}
          priority
        />
        <Text c="white" size="lg" fw={500} style={{ letterSpacing: "0.05em" }}>
          PAYMENTS MADE EASY
        </Text>
        <Button
          //   onClick={() => navigate("/login")}
          variant="filled"
          color="white"
          c="#7B7FEE"
          size="md"
          radius="xl"
          px={32}
          mt="md"
          style={{ fontWeight: 500 }}
        >
          GET STARTED
        </Button>
      </Stack>
    </Container>
  );
};

export default Home;
