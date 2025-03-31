module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "de", "es"],
    localeDetection: true,
  },
  debug: process.env.NODE_ENV === "development",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
