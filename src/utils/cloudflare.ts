export const decodeCloudflareEmail = (encodedString: string) => {
    const hex = encodedString.startsWith("#") ? encodedString.slice(1) : encodedString;
    let email = "";
    const key = parseInt(hex.slice(0, 2), 16);
    for (let i = 2; i < hex.length; i += 2) {
        const charCode = parseInt(hex.slice(i, i + 2), 16) ^ key;
        email += String.fromCharCode(charCode);
    }
    return email;
};
