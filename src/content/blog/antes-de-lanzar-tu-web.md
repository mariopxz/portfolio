---
title: 8 cosas que conviene revisar antes de lanzar tu web
date: 2026-10-14
description: Una selección de las comprobaciones que más problemas evitan, repartidas en legal, SEO, contacto y detalles. Sacadas de mi checklist de 30 puntos.
tags: [web, checklist, lanzamiento]
---

Dar una web por terminada cuando «ya funciona» es fácil, y casi siempre se queda algo por revisar. Suele descubrirse tarde: un enlace roto, una vista previa sin imagen al compartirla, un formulario cuyos correos acaban en spam.

Estas son 8 comprobaciones de mi [checklist de lanzamiento](/products), que tiene 30 puntos en 4 bloques. Si solo vas a mirar unas pocas, que sean estas.

## Lo legal

**1. HTTPS en todas las páginas.** Certificado válido y redirección automática de `http` a `https`. Es lo primero, porque sin esto el navegador avisa a tus visitantes antes de que lean nada.

**2. Política de privacidad y cookies que funcionen.** Explica qué datos recoges y para qué. Si usas cookies que no son esenciales (analítica, publicidad), el banner debe bloquearlas hasta que el usuario acepte, y rechazar tiene que ser tan fácil como aceptar. Un banner que solo es decorativo no cumple.

## Que Google te encuentre

**3. Título y descripción únicos en cada página.** Unos 60 caracteres para el título y 155 para la descripción. Si todas las páginas comparten la misma, los buscadores no saben distinguirlas.

**4. Una imagen para cuando compartan tu enlace.** Sin ella, WhatsApp, LinkedIn o X muestran un recuadro vacío. Una imagen Open Graph de 1200 × 630 px lo soluciona:

```html
<title>Mi proyecto — qué hace, en una frase</title>
<meta name="description" content="Una descripción de unos 155 caracteres." />
<meta property="og:title" content="Mi proyecto" />
<meta property="og:image" content="https://tudominio.com/og.png" />
```

## Que te escriban

**5. Un formulario de contacto probado de verdad.** No basta con que muestre «enviado»: comprueba que el correo llega y que no acaba en spam. Para eso hay que configurar SPF y DKIM en el dominio desde el que envías. Añade además un campo trampa (honeypot) o un reCAPTCHA para frenar el spam.

**6. Que cargue en menos de 3 segundos, sobre todo en móvil.** Mídelo en [PageSpeed Insights](https://pagespeed.web.dev). Lo que más suele pesar son las imágenes: en WebP o AVIF, al tamaño en que se muestran y con carga diferida.

## Los detalles

**7. Una página 404 útil.** Con tu diseño y enlaces para volver al inicio. Es lo que verá cualquiera que llegue a una URL antigua o mal escrita.

**8. Textos revisados.** Sin `lorem ipsum`, sin erratas y sin enlaces que apunten a `#`. Es lo más tonto de la lista y lo que más se ve cuando se te pasa.

## Y después

Pasa la checklist también tras cada cambio importante, no solo antes del primer lanzamiento. Tengo el resto de puntos (accesibilidad, redirecciones 301, copias de seguridad, probar en Safari de iPhone…) en un PDF con casillas para marcar, gratis en [productos](/products).
