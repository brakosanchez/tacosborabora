'use client';

import { useEffect } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  // Clave del sitio de reCAPTCHA v3 - Reemplaza con tu clave real
  const RECAPTCHA_SITE_KEY = '6LdXk9YpAAAAANjQzJf7QZQZQZQZQZQZQZQZQZQZ';

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={RECAPTCHA_SITE_KEY}
      language="es-419"
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

export default RecaptchaProvider;
