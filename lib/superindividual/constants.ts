const defaultSuperindividualWhatsAppLink =
  "https://chat.whatsapp.com/GZ4XD0gZimeJQei4ilFBVn?mode=gi_t"

const configuredSuperindividualWhatsAppLink =
  process.env.NEXT_PUBLIC_WHATSAPP_LINK?.trim()

export const superindividualWhatsAppLink =
  configuredSuperindividualWhatsAppLink &&
  configuredSuperindividualWhatsAppLink !== "WHATSAPP_LINK placeholder"
    ? configuredSuperindividualWhatsAppLink
    : defaultSuperindividualWhatsAppLink
