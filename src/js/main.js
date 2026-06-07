import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.js";
import { initRegistrationPrompt } from "./RegistrationPrompt.js";

loadHeaderFooter();
initRegistrationPrompt();

const alert = new Alert();
alert.init();
