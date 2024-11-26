import { User } from "@/types/user";
import { atom } from "jotai";

export const userAuthAtom = atom<boolean>(false);
export const userAtom = atom<User | undefined>(undefined);
