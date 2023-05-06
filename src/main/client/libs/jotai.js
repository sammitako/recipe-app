import { atom } from "jotai";

export const navbarTitleJotai = atom("JUBANG");
export const navbarIsLoggedInJotai = atom(false);
export const postListJotai = atom([]);
export const currentUserJotai = atom({
  userId: null,
  firstName: null,
  lastName: null,
  profileImgUrl: null,
});
