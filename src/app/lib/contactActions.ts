const CONTACT_SECTION_ID = "contact";
const CONTACT_EMAIL = "inhisnamebiblechurch@gmail.com";

export function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${sectionId}`);
    return;
  }

  window.location.hash = sectionId;
}

export function prefillContactMessage(message: string) {
  window.dispatchEvent(
    new CustomEvent("contact-prefill", {
      detail: { message },
    }),
  );

  scrollToSection(CONTACT_SECTION_ID);
}

export function openMailDraft(name: string, email: string, message: string) {
  const subject = encodeURIComponent(`Website inquiry from ${name}`);
  const body = encodeURIComponent(
    [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
  );

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
