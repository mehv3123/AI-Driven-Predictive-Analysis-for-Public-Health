import React, { useEffect } from 'react';

const GoogleTranslate = () => {
    useEffect(() => {
        window.googleTranslateElementInit = () => {
            if (document.querySelector('.goog-te-combo')) return;

            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,mr,gu',
                },
                'google_translate_element'
            );
        };

        const existingScript = document.getElementById('google-translate-script');
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.type = 'text/javascript';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="mx-2 hidden md:flex items-center">
            <div id="google_translate_element" className="bg-gray-50 rounded-lg p-1"></div>
        </div>
    );
};

export default GoogleTranslate;
