import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(XHR)
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        fallbackLng: 'en',

        react: {
            wait: true
        },

        ns: ['common', 'menu'],
        defaultNS: 'common',

        debug: false,

        interpolation: {
            escapeValue: false,
            formatSeparator: ',',
            format(value, format) {
                if (format === 'uppercase') {
                    return value.toUpperCase();
                }
                return value;
            }
        }
    });


export default i18n;
