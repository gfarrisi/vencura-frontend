import Head from "next/head";
import Image from "next/image";
import { Button, Container, Stack, Text, AppShell } from "@mantine/core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useCallback, useEffect } from "react";
import { userAuthAtom, userAtom } from "@/atoms/userAtom";
import { useAtom } from "jotai";
import api from "@/utils/api";
import { User } from "@/types/user";
import Dashboard from "@/components/Dashboard";

export default function HomePage() {
  const [userAuth, setUserAuth] = useAtom(userAuthAtom);
  const [user, setUser] = useAtom(userAtom);
  const { setShowAuthFlow, authToken, handleLogOut } = useDynamicContext();

  const handleGetStartedButtonClick = useCallback(() => {
    setShowAuthFlow(true);
  }, [setShowAuthFlow]);

  useEffect(() => {
    const getUser = async () => {
      if (authToken && !user && !userAuth) {
        console.log("USER LOGGED IN", { authToken, user, userAuth });
        //send user to backend to get user info
        const loggedIn = await api.post<{
          status: "Authorized" | string;
          user: User;
        }>("user/login", {
          body: JSON.stringify({
            authToken: authToken,
          }),
        });

        if (loggedIn.status === "Authorized" && loggedIn.user) {
          setUserAuth(true);
          setUser(loggedIn.user);
        }
      }
    };
    getUser();
  }, [authToken]);

  const handleLogOutButtonClick = useCallback(() => {
    setUserAuth(false);
    setUser(undefined);
    handleLogOut();
  }, [setUserAuth, setUser, handleLogOut]);

  return (
    <>
      <Head>
        <title>VenCura</title>
        <meta name="description" content="Payments made easy." />
      </Head>
      {/* //todo: add user as conditional check */}
      {userAuth && user ? (
        <>
          <Dashboard user={user} />
        </>
      ) : (
        <AppShell header={{ height: 60 }} bg="#7B7FEE">
          <Container
            fluid
            h="100vh"
            display="flex"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack align="center" justify="center">
              <Image
                src="/VenCura.svg"
                alt="VenCura logo"
                width={540}
                height={100}
                priority
              />
              <Text
                c="white"
                size="lg"
                fw={500}
                ta="center"
                style={{ letterSpacing: "0.05em" }}
              >
                PAYMENTS MADE EASY
              </Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "40px",
                }}
              >
                <Button
                  onClick={handleGetStartedButtonClick}
                  styles={{
                    root: {
                      boxShadow: `0px 1px 1px 0px rgba(0, 0, 0, 0.12), 0px 2px 5px 0px rgba(60, 66, 87, 0.08), 0px 3px 9px 0px rgba(60, 66, 87, 0.08)`,
                      backgroundColor: "white",
                      color: "#7B7FEE",
                      fontSize: "14px",
                      fontWeight: 400,
                      borderRadius: "10px",
                      padding: "10px 20px",
                      width: "200px",
                      height: "40px",
                      border: "none",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "green",
                        color: "#7B7FEE",
                      },
                    },
                  }}
                >
                  GET STARTED
                </Button>
              </div>
            </Stack>
          </Container>
        </AppShell>
      )}
    </>
  );
}
