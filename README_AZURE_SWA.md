# EVA — Deploy en Azure Static Web Apps (SWA)

Este paquete está listo para publicarse en **Azure Static Web Apps** con PWA (manifest, icons, splash iOS) y **Service Worker** para modo offline.

## Contenidos clave
- Páginas: `index.html`, `servicios.html`, `quienes.html`, `impacto.html`, `planes.html`, `faq.html`, `contacto.html`
- Estilos: `styles.css`
- Logo: `eva-logo.png`
- **PWA**: `site.webmanifest`, carpeta `icons/`, `sw.js`
- SWA config: `staticwebapp.config.json`
- 404: `404.html`

---

## 1) Subir a GitHub
1. Crea un repo nuevo en GitHub (ej. `eva-site`).
2. Sube **todo** el contenido de esta carpeta a la raíz del repo (incluido `staticwebapp.config.json`).  
   - Web: **Add file → Upload files** y arrastra los archivos.  
   - Git CLI:
     ```bash
     git init
     git branch -M main
     git add .
     git commit -m "EVA: primera versión"
     git remote add origin https://github.com/<tu-usuario>/eva-site.git
     git push -u origin main
     ```

## 2) Crear Static Web App en Azure
1. Entra a https://portal.azure.com → **Create a resource** → **Static Web Apps** → **Create**.
2. **Plan**: Free (o Standard si ya lo usas en producción).
3. **Deployment source**: **GitHub** (autoriza si lo pide).
4. Selecciona tu **Organization / Repository / Branch (`main`)**.
5. **Build details**:
   - *Build Presets*: **Custom**
   - *App location*: `/`
   - *Api location*: *(vacío)*
   - *Output location*: `/`
6. **Create**.

> Azure creará un **workflow de GitHub Actions** en tu repo. Cada `git push` a `main` publicará automáticamente.

## 3) Verificar
- En el recurso SWA verás una **URL pública** (ej: `https://yellow-rock-...azurestaticapps.net`).  
- En GitHub → pestaña **Actions**: el flujo debe estar en verde (éxito).

## 4) Dominio personalizado (opcional)
- En SWA → **Custom domains**: agrega tu dominio y crea el CNAME en tu DNS.

## 5) PWA y Offline
- `site.webmanifest` y `icons/` permiten **instalar** el sitio en dispositivos móviles y escritorio.
- `sw.js` implementa caché estática (cache-first con actualización).  
- En `staticwebapp.config.json`:
  - Aumentamos caché para `/icons/*` (1 año, **immutable**).
  - `sw.js` se sirve con `no-cache` para poder actualizar el SW cuando cambies archivos.

## 6) Actualizaciones
1. Edita los HTML/CSS/JS.
2. `git add . && git commit -m "Actualización"`
3. `git push` → GitHub Actions despliega.

## 7) Solución de problemas
- Cambios no reflejados: prueba **Ctrl+F5** o **borrar caché**; el SW puede servir la versión anterior.
- Forzar actualización del Service Worker: haz un pequeño cambio en `sw.js` o incrementa el nombre de `CACHE_NAME`.
- 404 personalizados: ya configurado via `staticwebapp.config.json` → `responseOverrides.404`.

¡Listo! Tu sitio EVA queda con HTTPS, CI/CD y listo para instalar como app.

---

## CI/CD con GitHub Actions (este repo ya lo incluye)
1. En tu **Static Web App** de Azure, copia el **Deployment Token**:  
   Azure Portal → tu SWA → *Manage deployment token* (o *Deployment token*).
2. Ve a tu repo en GitHub → **Settings → Secrets and variables → Actions → New repository secret**.  
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`  
   - **Value**: pega el token de Azure.
3. El workflow en `.github/workflows/azure-static-web-apps.yml` se ejecutará en cada **push a `main`**.
4. Si ya tenías otro workflow generado por Azure, borra o reemplaza el antiguo para evitar duplicidad.

### Matriz de paths del workflow
- `app_location: "/"` (raíz del repo con `index.html`)
- `api_location: ""` (sin API)
- `output_location: "/"` (no hay build step; archivos estáticos)

> Si en el futuro agregas un paso de build (por ejemplo un bundler), ajusta `output_location` a la carpeta de salida.
