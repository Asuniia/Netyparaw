import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { Profile } from "~/models/profile";
import { decodeCloudflareEmail } from "~/utils/cloudflare";

export const decodeProfile = (root: HTMLElement): Profile => {
    const fullNameRaw = root.querySelector(".block-toolbar .ellipsis")?.textContent?.trim() ?? "";
    const cleanFullName = fullNameRaw.replace(/^(M\.|Mme)\s*/i, "").trim();
    const [lastName, ...firstNameParts] = cleanFullName.split(/\s+/);
    const firstName = firstNameParts.join(" ");
    const fullName = `${firstName} ${lastName}`.trim();
    const gender = fullNameRaw.includes("Mme") ? "F" : fullNameRaw.includes("M.") ? "M" : "O";

    const addressCard = root.querySelector("div[id^='card-adresse']");

    const addressLines =
        Array.from(addressCard?.querySelectorAll(".block-adresse-ligne") ?? [])
            .filter((el) => el.textContent.includes("Adresse"))
            .map((el) => el.textContent.trim())
            .join("\n")
            .split("\n")
            .map((l) => l.trim())
            .filter((line) => line && line !== "-" && !/\d{5}\s+\S+/.test(line) && !/^[A-Z\s\-]{2,}$/.test(line)) ?? [];

    const address = addressLines.join(", ");

    const rawLines =
        addressCard
            ?.querySelector(".block-body")
            ?.textContent.split("\n")
            .map((l) => l.trim())
            .filter(Boolean) ?? [];

    const postalLine = rawLines.find((line) => /\d{5}\s+\S+/.test(line)) || "";
    const postalCode = postalLine.match(/\d{5}/)?.[0] ?? "";
    const city = postalLine.replace(postalCode, "").trim();
    const country = rawLines.find((line) => /^[A-Z\s\-]{2,}$/.test(line)) || "France";

    const phone = addressCard?.querySelector("a[href^='tel:']")?.textContent.replace(/[\s.]/g, "").trim() ?? "";

    const emailLink = addressCard?.querySelector("a[href^='/cdn-cgi/l/email-protection'], a[href^='mailto:']");
    const emailHref = emailLink?.getAttribute("href");
    const email = emailHref?.startsWith("/cdn-cgi/") ? decodeCloudflareEmail(emailHref.split("#")[1] || "") : emailLink?.textContent.trim() ?? "";

    const birthText = root.querySelector("p")?.textContent.includes("Né") ? root.querySelector("p")?.textContent ?? "" : "";
    const dateMatch = birthText.match(/le (\d{1,2} \w+ \d{4})/)?.[1] || "";
    const dateOfBirth = parse(dateMatch, "d MMMM yyyy", new Date(), { locale: fr });

    const className = root.querySelector(".modal-link-formation")?.textContent.trim() ?? "";
    const groupName = root.querySelector(".lnk-modal-groupe")?.textContent.trim() ?? "";

    const schoolCycleText = root.querySelector(".user-info-label span")?.textContent.trim() ?? "";
    const schoolCycleMatch = schoolCycleText.match(/(\d{4}-\d{4})/);
    const schoolCycle = schoolCycleMatch ? schoolCycleMatch[1] : null;

    return {
        firstName,
        lastName,
        fullName,
        email,
        phone,
        address,
        postalCode,
        city,
        country,
        gender: gender as "M" | "F" | "O",
        dateOfBirth: format(dateOfBirth, "yyyy-MM-dd"),
        className,
        groupName,
        currentSchoolCycle: schoolCycle,
    };
};
