const getEncryptedString = (inputString: string): string => {
  const shift = 10;
  const atTheRateReplacer = "=";
  const dotReplacer = "===";

  const emailRegex = /\S+@\S+/g;

  const emails = inputString.match(emailRegex);

  if (!emails) {
    return inputString;
  }

  const encryptedEmails = emails.map((email) => {
    let encryptedLocalPart = "";

    for (let i = 0; i < email.length; i++) {
      const char = email[i];

      if (char === "@") {
        encryptedLocalPart += atTheRateReplacer;
      } else {
        const isUpperCase = char === char.toUpperCase();
        const charCode = char.charCodeAt(0);

        if (
          (charCode >= 65 && charCode <= 90) ||
          (charCode >= 97 && charCode <= 122)
        ) {
          let newCharCode = charCode + shift;

          if (
            (isUpperCase && newCharCode > 90) ||
            (!isUpperCase && newCharCode > 122)
          ) {
            newCharCode -= 26;
          }

          encryptedLocalPart += String.fromCharCode(newCharCode);
        } else {
          encryptedLocalPart += char;
        }
      }
    }

    return encryptedLocalPart;
  });

  for (let i = 0; i < emails.length; i++) {
    inputString = inputString.replace(emails[i], encryptedEmails[i]);
  }

  inputString = inputString.replace(/\./g, dotReplacer);

  return inputString;
};

export default getEncryptedString;
