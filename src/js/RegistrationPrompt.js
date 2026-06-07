const PROMPT_SEEN_KEY = "so-registration-prompt-seen";
const REGISTRATION_KEY = "so-user-registration";

function readStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ignore storage errors so the prompt never blocks page interaction.
  }
}

function buildPromptMarkup() {
  return `
    <section class="registration-prompt" data-registration-prompt>
      <div
        class="registration-prompt__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-prompt-title"
      >
        <p class="registration-prompt__eyebrow">Member Giveaway</p>
        <h2 class="registration-prompt__title" id="registration-prompt-title">
          Register today and enter our Trailhead Giveaway.
        </h2>
        <p class="registration-prompt__text">
          Create a SleepOutside account with your email login to save your
          shipping details, sign in faster, and unlock one automatic giveaway
          entry.
        </p>
        <div class="registration-prompt__giveaway">
          <p class="registration-prompt__detail">
            Prize pack: a $250 SleepOutside gear bundle, a camp lantern, and
            free shipping on your next order.
          </p>
          <p class="registration-prompt__detail">
            One entry per customer. We will contact the winner by email.
          </p>
        </div>
        <div class="registration-prompt__actions">
          <a
            class="button-link registration-prompt__cta"
            href="/register/index.html"
          >
            Register Now
          </a>
          <button
            class="registration-prompt__dismiss"
            type="button"
            aria-label="Dismiss registration prompt"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </section>
  `;
}

export function getRegistrationData() {
  return readStorage(REGISTRATION_KEY);
}

export function saveRegistrationData(registration) {
  writeStorage(REGISTRATION_KEY, registration);
  writeStorage(PROMPT_SEEN_KEY, true);
}

export function initRegistrationPrompt() {
  const hasSeenPrompt = readStorage(PROMPT_SEEN_KEY);
  const registration = getRegistrationData();

  if (
    hasSeenPrompt ||
    registration ||
    document.querySelector("[data-registration-prompt]")
  ) {
    return;
  }

  writeStorage(PROMPT_SEEN_KEY, true);
  document.body.insertAdjacentHTML("beforeend", buildPromptMarkup());

  const prompt = document.querySelector("[data-registration-prompt]");
  const dismissButton = prompt?.querySelector(".registration-prompt__dismiss");
  const ctaLink = prompt?.querySelector(".registration-prompt__cta");

  if (!prompt || !dismissButton || !ctaLink) {
    return;
  }

  const closePrompt = () => {
    document.body.classList.remove("registration-prompt-open");
    document.removeEventListener("keydown", handleKeydown);
    prompt.remove();
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      closePrompt();
    }
  };

  prompt.addEventListener("click", (event) => {
    if (event.target === prompt) {
      closePrompt();
    }
  });

  dismissButton.addEventListener("click", closePrompt);
  document.body.classList.add("registration-prompt-open");
  document.addEventListener("keydown", handleKeydown);
  ctaLink.focus();
}
