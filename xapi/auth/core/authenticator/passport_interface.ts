import UserInterface from "../credentials/user_interface.ts";

interface PassportInterface {
  user: UserInterface | (() => UserInterface);
  badges: [];
}
