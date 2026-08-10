# Limatoliadi mobile-first con regia protetta

Questa versione parte dalla mobile-first e aggiunge una regia protetta da password.

## Password regia

Password predefinita:

```text
Marotta2026
```

Puoi cambiarla su Vercel aggiungendo una variabile ambiente:

```text
VITE_ADMIN_PASSWORD=NuovaPassword
```

## Cosa cambia

- La classifica è visibile a tutti.
- I comandi punti sono nascosti.
- Per modificarli bisogna cliccare `Accedi alla regia` e inserire la password.
- Dopo il login la regia resta attiva finché il browser resta aperto.
- I punti sono salvati nel browser con localStorage.

## Deploy su Vercel

Nel root della repo devono esserci direttamente:

- `package.json`
- `index.html`
- `src/`
- `vercel.json`
- `vite.config.js`
- `postcss.config.js`

Su Vercel:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Root Directory: vuota, se `package.json` è nel root della repo
