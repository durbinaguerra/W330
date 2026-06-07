import {
  initCartBadge,
  initUserAvatar,
  loadHeaderFooter,
  qs,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import {
  getRegistrationData,
  saveRegistrationData,
} from "./RegistrationPrompt.js";

const MIN_PASSWORD_LENGTH = 8;

function updateRegistrationFeedback(message, isSuccess = true) {
  const feedback = qs(".register-feedback");

  if (!feedback) return;

  feedback.textContent = message;
  feedback.classList.toggle("register-feedback--error", !isSuccess);
}

function getInitials(firstName = "", lastName = "") {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`
    .trim()
    .toUpperCase();

  return initials || "SO";
}

function updateAvatarPreview(form) {
  const avatarPreview = qs(".register-avatar-preview", form);
  const avatarImage = qs(".register-avatar-preview__image", form);
  const avatarInitials = qs(".register-avatar-preview__initials", form);

  if (!avatarPreview || !avatarImage || !avatarInitials) return;

  const firstName = form.elements.fname.value.trim();
  const lastName = form.elements.lname.value.trim();
  const avatarUrl = form.elements.avatar.value.trim();
  const initials = getInitials(firstName, lastName);
  const fullName = `${firstName} ${lastName}`.trim();

  avatarInitials.textContent = initials;
  avatarImage.hidden = true;
  avatarPreview.classList.remove("register-avatar-preview--image");

  if (!avatarUrl) {
    avatarImage.removeAttribute("src");
    avatarImage.alt = "";
    return;
  }

  avatarImage.src = avatarUrl;
  avatarImage.alt = fullName
    ? `Avatar preview for ${fullName}`
    : "Avatar preview";
}

function populateForm(form, registration) {
  form.elements.fname.value = registration.fname || "";
  form.elements.lname.value = registration.lname || "";
  form.elements.email.value = registration.email || "";
  form.elements.street.value = registration.street || "";
  form.elements.street2.value = registration.street2 || "";
  form.elements.city.value = registration.city || "";
  form.elements.state.value = registration.state || "";
  form.elements.zip.value = registration.zip || "";
  form.elements.avatar.value = registration.avatar || "";
  updateAvatarPreview(form);
}

function validatePassword(form) {
  const password = form.elements.password.value;
  const confirmPassword = form.elements.confirmPassword.value;

  form.elements.confirmPassword.setCustomValidity("");

  if (password.length < MIN_PASSWORD_LENGTH) {
    updateRegistrationFeedback(
      `Your password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      false,
    );
    return false;
  }

  if (password !== confirmPassword) {
    form.elements.confirmPassword.setCustomValidity("Passwords do not match.");
    updateRegistrationFeedback(
      "Passwords must match before you continue.",
      false,
    );
    form.elements.confirmPassword.reportValidity();
    return false;
  }

  return true;
}

function buildUserPayload(form) {
  const formData = new FormData(form);

  return {
    firstName: formData.get("fname")?.toString().trim(),
    lastName: formData.get("lname")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString(),
    street: formData.get("street")?.toString().trim(),
    street2: formData.get("street2")?.toString().trim(),
    city: formData.get("city")?.toString().trim(),
    state: formData.get("state")?.toString().trim(),
    zip: formData.get("zip")?.toString().trim(),
    avatar: formData.get("avatar")?.toString().trim(),
  };
}

function buildStoredProfile(payload, response) {
  return {
    id: response?.id || response?._id || response?.userId || null,
    fname: payload.firstName,
    lname: payload.lastName,
    email: payload.email,
    street: payload.street,
    street2: payload.street2,
    city: payload.city,
    state: payload.state,
    zip: payload.zip,
    avatar: payload.avatar,
    createdAt: response?.createdAt || new Date().toISOString(),
  };
}

function setSubmitState(button, isSubmitting) {
  if (!button) return;

  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? "Creating Account..." : "Create Account";
}

function initRegistrationForm() {
  const form = qs("#register-form");
  const submitButton = qs(".checkout-submit", form || document);
  const externalServices = new ExternalServices();

  if (!form) return;

  const existingRegistration = getRegistrationData();

  if (existingRegistration) {
    populateForm(form, existingRegistration);
    updateRegistrationFeedback(
      `Welcome back, ${existingRegistration.fname || "member"}! Your profile is already saved.`,
    );
  }

  const avatarImage = qs(".register-avatar-preview__image", form);

  avatarImage?.addEventListener("load", () => {
    avatarImage.hidden = false;
    avatarImage
      .closest(".register-avatar-preview")
      ?.classList.add("register-avatar-preview--image");
  });

  avatarImage?.addEventListener("error", () => {
    avatarImage.hidden = true;
    avatarImage.removeAttribute("src");
    avatarImage
      .closest(".register-avatar-preview")
      ?.classList.remove("register-avatar-preview--image");
  });

  form.addEventListener("input", () => {
    form.elements.confirmPassword.setCustomValidity("");
    updateRegistrationFeedback("");
    updateAvatarPreview(form);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      updateRegistrationFeedback(
        "Please complete each required field before submitting.",
        false,
      );
      return;
    }

    if (!validatePassword(form)) {
      return;
    }

    const payload = buildUserPayload(form);

    try {
      setSubmitState(submitButton, true);
      updateRegistrationFeedback("Creating your account...");

      const response = await externalServices.createUser(payload);
      const storedProfile = buildStoredProfile(payload, response);

      saveRegistrationData(storedProfile);
      initUserAvatar();
      form.elements.password.value = "";
      form.elements.confirmPassword.value = "";
      populateForm(form, storedProfile);
      updateRegistrationFeedback(
        `Thanks, ${storedProfile.fname}! Your account is ready and your giveaway entry has been created.`,
      );
    } catch (error) {
      updateRegistrationFeedback(
        error instanceof Error
          ? `We couldn't create your account: ${error.message}`
          : "We couldn't create your account. Please try again.",
        false,
      );
    } finally {
      setSubmitState(submitButton, false);
    }
  });

  updateAvatarPreview(form);
}

async function init() {
  await loadHeaderFooter();
  initCartBadge();
  initRegistrationForm();
}

init();
