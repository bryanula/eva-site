# EVA — Equity Virtual Assistant (sitio estático)

Este repo contiene el sitio multipágina de EVA listo para publicar en **Azure Static Web Apps**.

## Estructura
- `index.html`, `servicios.html`, `quienes.html`, `impacto.html`, `planes.html`, `faq.html`, `contacto.html`
- `styles.css`
- `eva-logo.png`
- `staticwebapp.config.json` (404 + headers)
- `404.html`

---

## Cómo publicarlo en Azure Static Web Apps (SWA)

### 1) Crear el repositorio en GitHub
1. Entra a https://github.com y crea una cuenta si no la tienes.
2. Clic **New repository** → Nombre: `eva-site` → **Public** → **Create repository**.
3. Sube los archivos de esta carpeta:
   - Opción A (web): botón **Add file → Upload files** y arrastra TODO el contenido de este repo.
   - Opción B (Git en tu PC):
     ```bash
     git init
     git branch -M main
     git add .
     git commit -m "EVA: primera versión"
     git remote add origin https://github.com/<tu-usuario>/eva-site.git
     git push -u origin main
     ```

### 2) Crear el recurso en Azure
1. En https://portal.azure.com → **Create a resource** → busca **Static Web Apps** → **Create**.
2. **Plan**: Free (o Standard si ya lo usas en producción).
3. **Deployment source**: GitHub.
4. Autoriza a Azure a acceder a tu cuenta, elige **Organization/Repo/Branch**.
5. **Build details**:
   - *Build Presets*: **Custom**
   - *App location*: `/`
   - *Api location*: *(dejar en blanco)*
   - *Output location*: `/`
6. **Review + Create**.

> Azure agregará automáticamente un **workflow de GitHub Actions** al repo. Cada vez que hagas `git push`, se desplegará la nueva versión.

### 3) Ver tu sitio
- En el recurso de Static Web Apps, usa el enlace **URL** para abrir el sitio.
- En GitHub → **Actions**, verifica que el flujo terminó con éxito (verde).

### 4) Dominio personalizado (opcional)
- En Static Web Apps → **Custom domains** → agrega tu dominio y apunta el CNAME.

---

## (Opcional) Formulario con Azure Functions + SendGrid
1. En el repo, crea la carpeta `api/contact` con una Function HTTP (Node.js):
   ```js
   // api/contact/index.js
   module.exports = async function (context, req) {
     const { nombre, email, organizacion, mensaje } = req.body || {};
     if (!nombre || !email || !mensaje) return { status: 400, body: "Faltan campos" };
     // TODO: Enviar con SendGrid o guardar en una Queue/Tabla
     return { status: 200, body: "OK" };
   };
   ```
2. Cambia el `form` de `contacto.html` para hacer `POST` a `/api/contact`.
3. En el portal de SWA, agrega variables de aplicación (por ejemplo `SENDGRID_API_KEY`).

---

## Cómo editar/actualizar
1. Cambia archivos HTML/CSS.
2. `git add . && git commit -m "Cambios" && git push`
3. GitHub Actions publicará la nueva versión automáticamente.

¡Listo! 🎉
