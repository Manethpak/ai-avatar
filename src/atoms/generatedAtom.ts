import { atom } from "recoil";

export const generatedAtom = atom({
  key: "generated",
  default: {
    image: "",
    prompt: "",
  },
});
