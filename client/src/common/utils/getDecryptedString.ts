const getDecryptedString = (encryptedString: string): string => {
  const shift = 10;
  const emailSeparator = "+";
  const atTheRateReplacor = "=";
  const dotReplacer = "===";
  const encryptedEmails = encryptedString.split(emailSeparator);

  const decryptedEmails = encryptedEmails.map((encryptedEmail) => {
    let decryptedLocalPart = "";

    for (let i = 0; i < encryptedEmail.length; i++) {
      const char = encryptedEmail[i];

      if (char === "@") {
        decryptedLocalPart += encryptedEmail.substring(i);
        break;
      }

      const isUpperCase = char === char.toUpperCase();
      const charCode = char.charCodeAt(0);

      if (
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122)
      ) {
        let originalCharCode = charCode - shift;

        if (
          (isUpperCase && originalCharCode < 65) ||
          (!isUpperCase && originalCharCode < 97)
        ) {
          originalCharCode += 26;
        }

        decryptedLocalPart += String.fromCharCode(originalCharCode);
      } else {
        decryptedLocalPart += char;
      }
    }

    return decryptedLocalPart;
  });

  const decryptedEmailCode = decryptedEmails.join(emailSeparator);

  const decryptedEmailCodeLis = decryptedEmailCode
    .split(emailSeparator)
    .map((email) => {
      return email.replace(atTheRateReplacor, "@").replace(dotReplacer, ".");
    });
  return decryptedEmailCodeLis.join(emailSeparator);
};

export default getDecryptedString;
