import * as cheerio from "cheerio";
import { format, parse } from "date-fns";
import { Profile } from "~/models/profile";
import { decodeCloudflareEmail } from "~/utils/cloudflare";
import { fr } from "date-fns/locale";

export const decodeProfile = ($: cheerio.CheerioAPI): Profile => {
    const fullNameRaw = $(".block-toolbar .ellipsis").first().text().trim();
    const cleanFullName = fullNameRaw.replace(/^(M\.|Mme)\s*/i, "").trim();
    const [lastName, ...firstNameParts] = cleanFullName.split(/\s+/);
    const firstName = firstNameParts.join(" ");
    const fullName = `${firstName} ${lastName}`.trim();
    const gender = fullNameRaw.includes("Mme") ? "F" : fullNameRaw.includes("M.") ? "M" : "O";

    const $addressCard = $("div[id^='card-adresse']").first();

    const addressLines = $addressCard
        .find(".block-adresse-ligne:contains('Adresse')")
        .clone()
        .children("span")
        .remove()
        .end()
        .text()
        .split("\n")
        .map((l) => l.trim())
        .filter((line) => line && line !== "-" && !/\d{5}\s+\S+/.test(line) && !/^[A-Z\s\-]{2,}$/.test(line));

    const address = addressLines.join(", ");

    const rawLines = $addressCard
        .find(".block-body")
        .text()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    const postalLine = rawLines.find((line) => /\d{5}\s+\S+/.test(line)) || "";
    const postalCode = postalLine.match(/\d{5}/)?.[0] ?? "";
    const city = postalLine.replace(postalCode, "").trim();
    const country = rawLines.find((line) => /^[A-Z\s\-]{2,}$/.test(line)) || "France";

    const phone = $addressCard.find("a[href^='tel:']").first().text().replace(/[\s.]/g, "").trim();

    const $emailLink = $addressCard.find("a[href^='/cdn-cgi/l/email-protection'], a[href^='mailto:']").first();
    const emailHref = $emailLink.attr("href");
    const email = emailHref?.startsWith("/cdn-cgi/") ? decodeCloudflareEmail(emailHref.split("#")[1] || "") : $emailLink.text().trim();

    const birthText = $("p:contains('Né')").text();
    const dateMatch = birthText.match(/le (\d{1,2} \w+ \d{4})/)?.[1] || "";
    const dateOfBirth = parse(dateMatch, "d MMMM yyyy", new Date(), { locale: fr });

    const className = $(".modal-link-formation").first().text().trim();
    const groupName = $(".lnk-modal-groupe").first().text().trim();

    const schoolCycleText = $(".user-info-label span").first().text().trim();
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
