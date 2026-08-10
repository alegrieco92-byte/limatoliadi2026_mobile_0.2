# Limatoliadi - versione stabile con regia protetta

Questa versione usa dipendenze stabili e bloccate per evitare errori di build su Vercel causati da `latest`.

## Password regia

Password predefinita:

```text
Marotta2026
```

Per cambiarla su Vercel:

```text
Project Settings > Environment Variables > VITE_ADMIN_PASSWORD
```

## Upload corretto su GitHub

Carica nel root della repo il contenuto interno della cartella `limatoliadi-stable-admin`.
Nel root devono esserci direttamente:

- package.json
- index.html
- src/
- vercel.json
- vite.config.js
- postcss.config.js
- tailwind.config.js

## Vercel

- Framework preset: Vite
- Build command: npm run build
- Output directory: dist
- Root Directory: vuota se package.json è nel root
