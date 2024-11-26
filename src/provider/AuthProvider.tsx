// // import { openOnboardingModalAtom } from "@/atoms/modalAtoms";
// // import { isFetchingXmtpWalletAtom, xmtpWalletAtom } from "@/atoms/userAtom";
// // import {
// //   isFetchingWarpcastApiKeyAtom,
// //   warpcastApiKeyAtom,
// //   warpcastApiKeyInfoAtom,
// // } from "@/atoms/warpcastDCAtom";
// // import { refreshProcessAtom } from "@/hooks/user/useUser";
// // import login from "@/services/user/login";
// // import logout from "@/services/user/logout";
// // import setSession from "@/services/user/setSession";
// // import { XMTP } from "@/services/xmtp/xmtp";
// // import { useAtom } from "jotai";
// // import isEqual from "lodash.isequal";
// // import getConfig from "next/config";
// import React, { createContext, useCallback, useEffect, useState } from "react";
// // import identifyUser from "../services/amplitude/indentify";
// // import { trackAmplitude } from "../services/amplitude/track";
// // import { User, teamPendingUserTypes } from "../types/User";
// // import {
// //   requestUserData,
// //   updateUser,
// //   userSignInGetInfo,
// // } from "../utils/UserUpdates";

// import { User } from "@/types/user";
// import getConfig from "next/config";

// declare global {
//   interface Window {
//     Intercom: any;
//   }
// }

// const { publicRuntimeConfig } = getConfig();

// type AuthState = {
//   authenticated: undefined | boolean;
//   setAuthenticated: (authenticated: boolean) => void;
//   authStatus: "Pending" | "Authorized" | "Unauthorized";
//   loading: boolean;
//   setAuthStatus: (status: "Pending" | "Authorized" | "Unauthorized") => void;
//   signIn: (
//     authToken: string,
//     logInData: {
//       loginMethodUsed: string;
//       walletProviderName: string;
//       ensAvatar: string;
//     }
//   ) => Promise<void>;
//   signOut: () => Promise<void>;
//   user: undefined | User;
//   setUser: (user: User) => void;
//   refreshUser: () => Promise<void>;
// };

// const authState: AuthState = {
//   authenticated: undefined,
//   setAuthenticated: (authenticated: boolean) => {},
//   authStatus: "Pending",
//   loading: true,
//   setAuthStatus: (status) => {},
//   signIn: (
//     authToken: string,
//     logInData: {
//       loginMethodUsed: string;
//       walletProviderName: string;
//       ensAvatar: string;
//     }
//   ) => Promise.resolve(),
//   signOut: () => Promise.resolve(),
//   user: {
//     id: "",
//     email: "",
//     createdAt: 0,
//     updatedAt: 0,
//     wallets: [],
//   },
//   setUser: (user: User) => {},
//   refreshUser: () => Promise.resolve(),
// };

// export const AuthContext: React.Context<AuthState> = createContext(authState);

// export const AuthProvider = ({ children }: any) => {
//   const [authenticated, setAuthenticated] = useState<boolean | undefined>(
//     undefined
//   );
//   const [user, setUser] = useState<User>();

//   const [authStatus, setAuthStatus] = useState<
//     "Pending" | "Authorized" | "Unauthorized"
//   >("Pending");
//   const [loading, setLoading] = useState(true);

//   const signIn = useCallback(
//     async (authToken?: string): Promise<User | undefined> => {
//       setAuthStatus("Pending");
//       if (authToken) {
//         const authorized = await login(authToken);
//         if (!authorized) {
//           setAuthStatus("Unauthorized");
//           setLoading(false);
//           return;
//         }
//         // if (authorized) {
//         //   setAuthStatus("Authorized");
//         //   setLoading(false);
//         //   const verifiedUserRequest = await requestUserData();
//         //   return verifiedUserRequest;
//         // }
//       }
//     },
//     []
//   );

//   const signOut = useCallback(async () => {
//     console.log("signOut");
//     try {
//       const response = await logout();
//       if (response) {
//         localStorage.removeItem("BelloFirebaseAuth");
//         !!user?.user_address &&
//           localStorage.removeItem(
//             XMTP.buildLocalStorageKey(user?.user_address)
//           );
//         setIsFetchingXmtpWallet(false);
//         setIsFetchingWarpcastApiKey(false);
//         setXmtpWallet(undefined);
//         setAuthenticated(false);
//         setUser(undefined);
//         setWarpcastApiKey("");
//         setWarpcastApiKeyInfo(undefined);
//         const anonSession = await setSession();
//         if (anonSession) {
//           setUser({
//             address: "",
//             user_type: "anonymous",
//           });
//           setRefreshProcesses(Date.now());
//         }
//       }
//     } catch (ex) {
//       console.error("error in signIn", ex);
//     }
//   }, [authenticated, user]);

//   //   useEffect(() => {
//   //     const checkAuth = async () => {
//   //       // console.log("checking auth 2", { user });
//   //       if (!user) {
//   //         const auth = await authenticate("GET");
//   //         if (auth) {
//   //           await getUserInfoAndSetUser(auth);
//   //           await updateUser(auth);
//   //         } else {
//   //           const anonSession = await setSession();
//   //           if (anonSession) {
//   //             if (
//   //               !isEqual(user, {
//   //                 address: "",
//   //                 user_type: "anonymous",
//   //               })
//   //             )
//   //               setUser({
//   //                 address: "",
//   //                 user_type: "anonymous",
//   //               });
//   //           }
//   //         }
//   //       }
//   //     };
//   //     checkAuth();
//   //   }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

//   return (
//     <AuthContext.Provider
//       value={{
//         authenticated,
//         setAuthenticated,
//         signIn,
//         signOut,
//         user,
//         setUser,
//         authStatus,
//         setAuthStatus,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
