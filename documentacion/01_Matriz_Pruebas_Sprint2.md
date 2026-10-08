# 📋 Matriz de Pruebas — Sprint 2 (VitalCampus V 1.0)

**Proyecto:** VitalCampus V 1.0  
**Versión evaluada:** 1.0.0 (Sprint 2 - API REST, Prisma ORM, SQLite & Frontend Angular)  
**Fecha de ejecución:** Octubre 2026  
**Ambiente de pruebas:** Localhost (`http://localhost:4200` frontend, `http://localhost:4000` backend API)  
**Mecanismo de Autenticación:** Middleware Demo MVP (`estudiante@vitalcampus.com`)  

---

## 📊 Resumen Ejecutivo de Pruebas

| Total de Pruebas | Aprobadas | Fallidas | Pendientes / Limitaciones | Tasa de Éxito |
| :---: | :---: | :---: | :---: | :---: |
| **16** | **15** | **0** | **1** *(Aislamiento multiusuario sin JWT)* | **93.75%** |

---

## 🧪 Matriz Detallada de Casos de Prueba

| ID | Módulo | Tipo | Precondición | Pasos de Ejecución | Resultado Esperado | Resultado Obtenido | Estado | Evidencia Requerida |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-001** | Infraestructura / API | Integración | Servidor Express y SQLite iniciados | Enviar petición `GET /api/health` | Respuesta HTTP 200 con `status: 'ok'`, `database: 'connected'` y timestamp. | HTTP 200 OK, payload `{ status: "ok", service: "VitalCampus Backend API", version: "1.0.0", database: "connected" }`. | **APROBADA** | Captura de respuesta HTTP / terminal `E01` |
| **TC-002** | Dashboard General | Integración / Funcional | Base de datos poblada con seed | Enviar petición `GET /api/dashboard/resumen` | Respuesta HTTP 200 con datos de usuario, indicadores de carga, sueño, estrés, próximas entregas y alertas. | HTTP 200 OK con objeto `data` completo conteniendo `indicadores`, `proximasEntregas`, `alertas` y `resumenEstudio`. | **APROBADA** | Captura pantalla Dashboard Web y JSON `E02` |
| **TC-003** | Sueño / Lógica de Negocio | Funcional | Servidor backend activo | Enviar `POST /api/suenos` con `horaDormir: "23:00"` y `horaDespertar: "06:00"`. | Cálculo automático de `horasSueno = 7` (cruce de medianoche) y código HTTP 201. | HTTP 201 Created con `horasSueno: 7` calculado en el backend. | **APROBADA** | Captura de respuesta POST `E03` |
| **TC-004** | Sueño / Validaciones | Funcional / Validación | Servidor backend activo | Enviar `POST /api/suenos` con `calidadSueno: 9` (fuera del rango 1 a 5). | Rechazo de la solicitud con HTTP 400 y mensaje explicativo sobre rango 1-5. | HTTP 400 Bad Request: `{"success": false, "error": "La calidad del sueño debe ser un número entero entre 1 y 5"}`. | **APROBADA** | Captura de respuesta 400 `E04` |
| **TC-005** | Sueño / Tendencias | Funcional | Registros de sueño de los últimos 7 días en BD | Enviar `GET /api/suenos/semanal` | HTTP 200 con objeto `resumen` (promedioHorasSemanal, promedioCalidadSemanal, cumpleMetaMinima) y lista de registros. | HTTP 200 OK con `promedioHorasSemanal`, `promedioCalidadSemanal` y arreglo de registros ordenados descendente. | **APROBADA** | Gráfico de barras en UI / JSON `E05` |
| **TC-006** | Asignaturas | Funcional / CRUD | Servidor y base de datos activos | 1. `POST /api/asignaturas` para crear.<br>2. `PUT /api/asignaturas/:id` para editar.<br>3. `DELETE /api/asignaturas/:id` para eliminar. | Creación (HTTP 201), actualización de datos (HTTP 200), y eliminación correcta (HTTP 200). | Se creó asignatura (ID asignado), se editó nombre a 'Materia QA Editada' y se eliminó retornando confirmación HTTP 200. | **APROBADA** | Captura tabla de asignaturas y consola `E06` |
| **TC-007** | Entregas Académicas | Funcional / CRUD | Asignatura creada previamente | 1. `POST /api/entregas` con tipo `PROYECTO`.<br>2. `PUT /api/entregas/:id` con `estado: "COMPLETADA"`.<br>3. `DELETE /api/entregas/:id`. | HTTP 201 al crear, HTTP 200 con estado actualizado, HTTP 200 al eliminar con integridad referencial. | Flujo CRUD completado satisfactoriamente; eliminación respeta llaves foráneas. | **APROBADA** | Captura lista de entregas y badges `E07` |
| **TC-008** | Registro de Estudio | Funcional | Asignatura existente | Enviar `POST /api/estudio` con `horasEstudio: 2.5` y `asignaturaId` válido. | Registro insertado correctamente con HTTP 201 y `horasEstudio: 2.5`. | HTTP 201 Created con los datos persistidos y relación a la asignatura asociada. | **APROBADA** | Captura formulario de estudio `E08` |
| **TC-009** | Indicadores / Carga Académica | Funcional / Algoritmo | 32 horas de estudio acumuladas en 7 días (datos del seed) | Enviar `GET /api/indicadores/carga-semanal` | Cálculo `(32 / 40) * 100 = 80%`, `superaUmbralCarga = true` (umbral 70%). | HTTP 200 OK, `totalHorasEstudioUltimos7Dias: 32`, `cargaSemanalPorcentaje: 80`, `superaUmbralCarga: true`. | **APROBADA** | Captura de tarjeta de carga 80% `E09` |
| **TC-010** | Alertas / Carga Académica | Funcional / Alertas | Carga semanal > 70% | Enviar `GET /api/alertas` | Generación o actualización de alerta `CARGA_ACADEMICA`, prioridad MEDIA con mensaje explicativo. | Alerta `CARGA_ACADEMICA` presente con mensaje *"Carga académica semanal del 80%, superando el umbral recomendado del 70%"*. | **APROBADA** | Captura lista de alertas en UI `E10` |
| **TC-011** | Alertas / Déficit Sueño | Funcional / Alertas | Promedio de sueño < 6 horas (ej: 5.9h) | Enviar `GET /api/alertas` | Generación de alerta `SUENO`, prioridad MEDIA informando déficit por debajo de 6 horas. | Alerta `SUENO` generada con mensaje *"Promedio de sueño de los últimos 7 días (5.9h) es inferior al mínimo recomendado de 6 horas"*. | **APROBADA** | Captura card de alerta de sueño `E10` |
| **TC-012** | Alertas / Riesgo Alto (Estrés + Sueño) | Funcional / Alertas | Nivel de estrés >= 4 (ej: 5) Y promedio sueño < 6h | Enviar `GET /api/alertas` | Generación de alerta `ESTRES` con prioridad **ALTA** por alto riesgo de agotamiento. | Alerta `ESTRES` (Prioridad ALTA): *"¡Riesgo alto de agotamiento! Nivel de estrés elevado (5/5) y déficit continuo de sueño (5.9h)"*. | **APROBADA** | Captura badge rojo prioridad ALTA `E10` |
| **TC-013** | Alertas / Recomendación Preventiva | Funcional / Alertas | Nivel de estrés >= 4 Y carga > 70% | Enviar `GET /api/alertas` | Generación de alerta `RECOMENDACION` con sugerencias de pausas activas y priorización. | Alerta `RECOMENDACION` presente: *"Alta presión académica (80%) con estrés nivel 5/5. Te sugerimos realizar pausas activas y priorizar tareas"*. | **APROBADA** | Captura card de recomendación `E10` |
| **TC-014** | Alertas / Marcar Leída | Funcional / Estado | Alerta existente no leída (`leida: false`) | Enviar `PATCH /api/alertas/:id/leida` | Retorno HTTP 200 con `leida: true` y actualización visual en la interfaz. | HTTP 200 OK con `leida: true` persistido en SQLite. | **APROBADA** | Captura antes y después de marcar leída `E11` |
| **TC-015** | Interfaz de Usuario / Responsive | Usabilidad / UI | Aplicación Angular en ejecución | Renderizar vistas en viewport móvil (< 768px) y viewport desktop (> 1024px). | Adaptación fluida del menú lateral/inferior, formularios en columna simple y gráficos responsivos. | La barra lateral colapsa/se adapta, formularios y tablas se ajustan sin scroll horizontal indeseado, Chart.js escala dinámicamente. | **APROBADA** | Capturas comparativas Desktop y Mobile (375px/412px) `E12` |
| **TC-016** | Seguridad / Aislamiento Multiusuario | Seguridad Básica | Dos clientes distintos accediendo a la plataforma | Evaluar si las peticiones aíslan los datos por credencial/token individual. | Cada usuario debe acceder única y exclusivamente a sus registros mediante autenticación real. | **Limitación Identificada:** Todas las peticiones son procesadas bajo el usuario demo global (`estudiante@vitalcampus.com`, ID: 1/2) debido al middleware `usuarioDemoMiddleware`. A nivel de base de datos los queries filtran por `usuarioId`, pero no hay mecanismo de autenticación por tokens JWT individuales. | **PENDIENTE (Limitación Documentada)** | Auditoría de middleware y código de seguridad |

---

## 🔍 Conclusiones de la Matriz

1. **Cumplimiento Funcional:** El 100% de las operaciones de negocio evaluadas (cálculos de horas de sueño, cruces de medianoche, porcentajes de carga, generación de 4 tipos de alertas y operaciones CRUD) funcionan con total exactitud.
2. **Estabilidad Técnica:** El backend y frontend compilan y ejecutan sin fallos críticos en tiempo de ejecución.
3. **Puntos Pendientes para Sprints Futuros:** Reemplazo del middleware demo por autenticación JWT con login/registro real para garantizar aislamiento multiusuario en producción.
