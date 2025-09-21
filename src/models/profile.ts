export type Profile = Readonly<{
    /**
     * First name of the profile.
     */
    firstName: string;
    /**
     * Last name of the profile.
     */
    lastName: string;
    /**
     * Full name of the profile.
     */
    fullName: string;
    /**
     * Email address of the profile.
     */
    email: string;
    /**
     * Phone number of the profile.
     */
    phone: string;
    /**
     * Address of the profile.
     */
    address: string;
    /**
     * Postal code of the profile.
     */
    postalCode: string;
    /**
     * City of the profile.
     */
    city: string;
    /**
     * Country of the profile.
     */
    country: string;
    /**
     * Gender of the profile.
     */
    gender: "M" | "F" | "O";
    /**
     * Date of birth of the profile.
     */
    dateOfBirth: string;
    /**
     * Class Name of the profile.
     */
    className: string;
    /**
     * Group Name of the profile.
     */
    groupName: string;
    /**
     * Current school cycle of the profile.
     */
    currentSchoolCycle: string | null;
}>;
