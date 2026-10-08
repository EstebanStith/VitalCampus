# 📑 Resumen de Cumplimiento — Acta de Reunión No. 005

**Proyecto:** VitalCampus V 1.0  
**Fecha de Evaluación:** Octubre 2026  
**Referencia:** Compromisos adquiridos en el Acta de Reunión No. 005 para el cierre del Sprint 2  

---

## 🎯 Tabla de Trazabilidad y Cumplimiento de Compromisos

| No. | Compromiso del Acta No. 005 | Descripción del Entregable / Acción Realizada | Evidencia Concreta Generada | Estado de Cumplimiento |
| :---: | :--- | :--- | :--- | :---: |
| **1** | **Pruebas integrales Frontend — Backend** | Validación de extremo a extremo de la comunicación HTTP REST entre la SPA Angular 18 (`http://localhost:4200`) y la API Express / SQLite (`http://localhost:4000`), incluyendo health check y obtención del resumen de dashboard. | - Matriz de pruebas: [`documentacion/01_Matriz_Pruebas_Sprint2.md`](file:///c:/Users/Asus/Desktop/vitalcampus/documentacion/01_Matriz_Pruebas_Sprint2.md) (Casos TC-001 y TC-002).<br>- Script automatizado de pruebas: [`backend/test-suite.js`](file:///c:/Users/Asus/Desktop/vitalcampus/backend/test-suite.js).<br>- Colección de peticiones: [`backend/requests.http`](file:///c:/Users/Asus/Desktop/vitalcampus/backend/requests.http).<br>- Capturas `E01` y `E02`. | **CUMPLIDO AL 100%** |
| **2** | **Pruebas funcionales y de usabilidad** | Ejecución de pruebas funcionales para los módulos de Sueño (cruce de medianoche, rango 1-5, tendencias), Asignaturas (CRUD completo), Entregas Académicas (estados, fechas), Estudio (horas acumuladas) y diseño responsive en vista móvil y escritorio. | - Casos TC-003 a TC-008 y TC-015 en la matriz de pruebas.<br>- Verificación de formularios reactivos Angular y visualizaciones de Chart.js.<br>- Capturas `E03` a `E08` y `E12`. | **CUMPLIDO AL 100%** |
| **3** | **Auditoría básica de código, arquitectura, base de datos y seguridad** | Inspección rigurosa de la arquitectura desacoplada real (Angular + Express + Prisma + SQLite), verificación de integridad referencial con borrado en cascada (`onDelete: Cascade`), no exposición de hashes de contraseñas, configuración de CORS, variables de entorno y documentación de la limitación del usuario demo. | - Documento de Auditoría: [`documentacion/03_Auditoria_Tecnica.md`](file:///c:/Users/Asus/Desktop/vitalcampus/documentacion/03_Auditoria_Tecnica.md).<br>- Esquema Prisma revisado: [`backend/prisma/schema.prisma`](file:///c:/Users/Asus/Desktop/vitalcampus/backend/prisma/schema.prisma).<br>- Revisión del middleware: [`backend/src/middlewares/auth.middleware.ts`](file:///c:/Users/Asus/Desktop/vitalcampus/backend/src/middlewares/auth.middleware.ts). | **CUMPLIDO AL 100%** |
| **4** | **Registro de errores e implementación de correcciones** | Documentación transparente de incidencias reales identificadas: advertencias de presupuestos en `ng build` (INC-001), limitación del usuario demo temporal (INC-002), y corrección del control de rangos de calidad de sueño y estrés en la API (INC-003). | - Registro formal: [`documentacion/02_Registro_Incidencias.md`](file:///c:/Users/Asus/Desktop/vitalcampus/documentacion/02_Registro_Incidencias.md).<br>- Corrección de código en [`backend/src/controllers/sleep.controller.ts`](file:///c:/Users/Asus/Desktop/vitalcampus/backend/src/controllers/sleep.controller.ts).<br>- Caso de prueba TC-004 validado con respuesta 400 Bad Request. | **CUMPLIDO AL 100%** |
| **5** | **Verificación de cálculos de sueño, carga académica y alertas preventivas** | Validación de fórmulas matemáticas y lógica de negocio: cálculo de 7h de sueño para 23:00 a 06:00, carga del 80% para 32 horas de estudio semanales, disparo de alertas de sobrecarga (>70%), déficit de sueño (<6h), riesgo alto de estrés (nivel 5 + sueño <6h) y recomendación preventiva sin duplicidades. | - Casos TC-009, TC-010, TC-011, TC-012, TC-013 y TC-014 en matriz de pruebas.<br>- Servicio de alertas: [`backend/src/services/alert.service.ts`](file:///c:/Users/Asus/Desktop/vitalcampus/backend/src/services/alert.service.ts).<br>- Utilidad de sueño: [`backend/src/utils/sleep.utils.ts`](file:///c:/Users/Asus/Desktop/vitalcampus/backend/src/utils/sleep.utils.ts).<br>- Capturas `E09`, `E10` y `E11`. | **CUMPLIDO AL 100%** |

---

## 📌 Balance Final del Acta No. 005

- **Compromisos evaluados:** 5 / 5
- **Estado global:** **APROBADO Y COMPLETADO SATISFACTORIAMENTE**
- **Siguiente paso recomendado para Sprint 3:** Desarrollar el módulo de autenticación con JWT y registro de usuarios para superar la limitación del usuario demo documentada en INC-002.
