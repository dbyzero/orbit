import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
// import Cache from 'i18next-localstorage-cache';
// import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(XHR)
    // .use(Cache)
    // .use(LanguageDetector)
    .init({
        fallbackLng: 'en',
        wait: true, // globally set to wait for loaded translations in translate hoc

        // have a common namespace used around the full app
        ns: [
            'common',
            'menu'
        ],
        defaultNS: 'common',

        debug: false,

        interpolation: {
            escapeValue: false,
            formatSeparator: ',',
            format: function (value, format) {
                if (format === 'uppercase') {
                    return value.toUpperCase();
                }
                return value;
            }
        }
    });


export default i18n;
