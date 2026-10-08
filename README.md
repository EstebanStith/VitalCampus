# 🌿 VitalCampus V 1.0 — Plataforma de Bienestar Estudiantil (Sprint 2)

VitalCampus es una plataforma monorepo orientada al bienestar de estudiantes universitarios. Permite el seguimiento de sueño, carga académica, entregas pendientes, niveles de estrés, indicadores clave y alertas preventivas.

---

## 📌 Novedades Sprint 2 (Backend API REST & Prisma ORM)

- **Modelo de Datos Relacional:** Entidades `Usuario`, `RegistroEstres`, `RegistroSueno`, `Asignatura`, `EntregaAcademica`, `RegistroEstudio` y `Alerta` en SQLite con Prisma ORM.
- **Autenticación Demo (MVP):** Middleware temporal `usuarioDemoMiddleware` que asocia automáticamente cada petición al usuario demo `estudiante@vitalcampus.com`.
- **Lógica de Negocio Automática:**
  - Cálculo automático de `horasSueno` considerando el cruce de medianoche (ej. 23:00 a 06:00 = 7 horas).
  - Cálculo de la carga académica semanal: `min(100, (totalHorasEstudioUltimos7Dias / 40) * 100)`.
  - Generación de alertas preventivas de salud y rendimiento si la carga supera el 70%, si el sueño promedio es < 6h, o si el estrés es alto (nivel 4-5).
  - Prevención de alertas duplicadas en un mismo día.
- **Pruebas Integradas:** Archivo `backend/requests.http` y suite automatizada `backend/test-suite.js`.

---

## 🛠️ Requisitos del Sistema

- **Node.js:** Versión 18.x o superior instalada.
- **npm:** Versión 9.x o superior.
- **Git:** Para control de versiones.

---

## 🚀 Guía Rápida de Instalación y Ejecución

### 1. Clonar el Repositorio
```bash
git clone https://github.com/EstebanStith/VitalCampus.git
cd VitalCampus
```

### 2. Instalar Dependencias (Monorepo)
```bash
npm run install:all
```
*(Opcionalmente: `cd backend && npm install`, luego `cd ../frontend && npm install`)*.

### 3. Configurar Variables de Entorno
Copia el archivo `.env.example` en `backend/` para generar tu `.env` local:
```bash
# En Windows PowerShell / CMD:
copy backend\.env.example backend\.env

# O en Linux / macOS / Bash:
cp backend/.env.example backend/.env
```

El archivo `backend/.env` contendrá los parámetros base no sensibles:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
CORS_ORIGIN=http://localhost:4200
```

### 4. Sincronizar Base de Datos (SQLite con Prisma)
```bash
npm run prisma:push
```

### 5. Poblar la Base de Datos con Datos de Prueba (Seed)
```bash
npm run prisma:seed
```
*(También disponible como `npm run seed`)*.

*Datos cargados por la semilla de prueba:*
- **Usuario Demo:** `estudiante@vitalcampus.com`
- **3 Asignaturas:** Programación Web Avanzada, Bases de Datos & ORM, Arquitectura de Software.
- **Entregas pendientes:** Proyectos, Tareas y Parciales con fechas límite.
- **7 Días de Sueño:** Promedio < 6 horas (genera alerta de sueño).
- **Último Estrés:** Nivel 5 (estrés elevado).
- **7 Días de Estudio:** 32 horas totales (80% de carga semanal, supera el umbral del 70%).
- **Alertas Preventivas:** CARGA_ACADEMICA, SUENO, ESTRES (Prioridad ALTA) y RECOMENDACION.

### 6. Iniciar los Servidores de Desarrollo

En terminales independientes (o simultáneamente):

```bash
# Terminal 1 — Iniciar Backend (Puerto 4000):
npm run dev:backend

# Terminal 2 — Iniciar Frontend Angular (Puerto 4200):
npm run dev:frontend
```

---

## 🌐 URLs Principales de la Aplicación

| Componente / Servicio | URL Local | Descripción |
| :--- | :--- | :--- |
| **Frontend Web (Angular)** | `http://localhost:4200` | Interfaz interactiva de usuario |
| **API Health Check** | `http://localhost:4000/api/health` | Estado del servidor y conexión SQLite |
| **API Dashboard Resumen** | `http://localhost:4000/api/dashboard/resumen` | Resumen completo de métricas y alertas |
| **API Indicadores Carga** | `http://localhost:4000/api/indicadores/carga-semanal` | Indicadores calculados de carga semanal |

---

## 🔐 Aviso de Autenticación Temporal (Alcance MVP)

> ⚠️ **Nota de Arquitectura para el MVP:** En cumplimiento con los objetivos del Sprint 2, la plataforma no cuenta aún con autenticación JWT real ni flujo de login/registro. Se utiliza el middleware temporal `usuarioDemoMiddleware` en [`backend/src/middlewares/auth.middleware.ts`](backend/src/middlewares/auth.middleware.ts), el cual asocia automáticamente el usuario demo `estudiante@vitalcampus.com` (ID: 1) a todas las peticiones. La implementación de autenticación JWT y aislamiento multiusuario está planificada para el Sprint 3.

---

## 📁 Estructura del Monorepo

```
vitalcampus/
├── package.json                   # [Root] Scripts globales del monorepo
├── README.md                      # [Root] Documentación y guía de uso
├── .gitignore                     # [Root] Reglas de exclusión de Git
├── documentacion/                 # [Root] Informes formales del Sprint 2 (Acta 5)
│   ├── 01_Matriz_Pruebas_Sprint2.md
│   ├── 02_Registro_Incidencias.md
│   ├── 03_Auditoria_Tecnica.md
│   ├── 04_Evidencias_Pruebas/
│   │   └── README.md
│   └── 05_Resumen_Cumplimiento_Acta5.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── requests.http              # Pruebas HTTP interactivas (REST Client)
│   ├── test-suite.js              # Suite automatizada de pruebas end-to-end
│   ├── prisma/
│   │   ├── schema.prisma          # Esquema relacional Prisma (SQLite)
│   │   └── seed.ts                # Semilla de datos demo
│   └── src/
│       ├── index.ts               # Listener del servidor Express
│       ├── app.ts                 # Configuración de Express y enrutador
│       ├── config/db.ts           # Cliente PrismaClient singleton
│       ├── middlewares/auth.middleware.ts
│       ├── services/alert.service.ts
│       ├── utils/sleep.utils.ts
│       ├── controllers/           # Controladores REST
│       └── routes/                # Rutas de la API
└── frontend/                      # Aplicación SPA Angular 18
    ├── src/
    │   ├── app/
    │   │   ├── components/        # Resumen, Sueño, Asignaturas, Entregas, Estudio, Alertas
    │   │   ├── services/          # VitalCampusService (HTTP client)
    │   │   └── models/            # Interfaces y modelos TypeScript
    │   └── environments/
    └── angular.json
```

---

## 🧪 Endpoints REST Disponibles

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Estado del servidor y conexión SQLite |
| `GET` | `/api/dashboard/resumen` | Resumen consolidado para el Dashboard |
| `GET` | `/api/indicadores/carga-semanal` | Indicadores de carga semanal % y promedios |
| `GET` / `POST` | `/api/suenos` | Listar / Crear registro de sueño (cálculo automático de horas) |
| `GET` | `/api/suenos/semanal` | Resumen y registros de los últimos 7 días |
| `PUT` / `DELETE` | `/api/suenos/:id` | Editar / Eliminar registro de sueño |
| `GET` / `POST` | `/api/asignaturas` | Listar / Crear asignaturas |
| `PUT` / `DELETE` | `/api/asignaturas/:id` | Editar / Eliminar asignatura |
| `GET` / `POST` | `/api/entregas` | Listar / Crear entregas académicas |
| `PUT` / `DELETE` | `/api/entregas/:id` | Editar / Eliminar entregas académicas |
| `GET` / `POST` | `/api/estudio` | Listar / Crear sesiones de estudio |
| `GET` | `/api/alertas` | Listar alertas preventivas evaluadas |
| `PATCH` | `/api/alertas/:id/leida` | Marcar alerta como leída |

---

## 🧪 Pruebas y Aseguramiento de Calidad

### 1. Pruebas Automatizadas End-to-End
```bash
node backend/test-suite.js
```

### 2. Pruebas Interactivas REST Client
Utiliza la extensión **REST Client** de VS Code con el archivo [`backend/requests.http`](backend/requests.http).

---

## 📚 Documentación Formal del Sprint 2 (Acta No. 005)

- 📋 [**01. Matriz de Pruebas Sprint 2**](documentacion/01_Matriz_Pruebas_Sprint2.md)
- 🐛 [**02. Registro de Incidencias**](documentacion/02_Registro_Incidencias.md)
- 🔬 [**03. Auditoría Técnica**](documentacion/03_Auditoria_Tecnica.md)
- 📸 [**04. Guía de Evidencias de Pruebas**](documentacion/04_Evidencias_Pruebas/README.md)
- 📑 [**05. Resumen de Cumplimiento Acta 5**](documentacion/05_Resumen_Cumplimiento_Acta5.md)
