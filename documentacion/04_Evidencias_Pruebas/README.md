# 📸 Guía de Evidencias de Pruebas — Sprint 2

Este documento contiene la lista oficial de capturas de pantalla requeridas para respaldar la ejecución exitosa de las pruebas del Sprint 2 de **VitalCampus V 1.0**.

Guarda los archivos de imagen correspondientes en esta misma carpeta (`documentacion/04_Evidencias_Pruebas/`) con los nombres asignados en la siguiente tabla:

---

## 📋 Lista Oficial de Capturas de Evidencia (`E01` a `E12`)

| Código de Archivo | Nombre de la Captura | Prueba / Módulo Demostrado | Descripción del Contenido a Capturar |
| :---: | :--- | :--- | :--- |
| **`E01`** | `E01_Health_Check.png` | **TC-001** (API Health Check) | Captura de la respuesta HTTP `GET /api/health` desde Postman, REST Client (`requests.http`) o consola del navegador mostrando `{ status: "ok", database: "connected" }`. |
| **`E02`** | `E02_Dashboard_Resumen.png` | **TC-002** (Dashboard Principal) | Vista completa del Dashboard en el frontend (`http://localhost:4200`) con los 4 indicadores clave, próximas entregas y resumen de alertas. |
| **`E03`** | `E03_Registro_Sueno_Medianoche.png` | **TC-003** (Cálculo Sueño Cruzando Medianoche) | Formulario o respuesta de registro de sueño con hora de dormir `23:00` y hora de despertar `06:00`, evidenciando el cálculo automático de **7.0 horas**. |
| **`E04`** | `E04_Validacion_Calidad_Sueno.png` | **TC-004** (Validación Rango 1 a 5) | Petición enviando calidad de sueño fuera de rango (ej. 9) mostrando la respuesta HTTP 400 Bad Request o mensaje de validación reactivo en el formulario. |
| **`E05`** | `E05_Grafica_Tendencia_Sueno.png` | **TC-005** (Tendencia Semanal de Sueño) | Gráfica interactiva de barras en la pestaña de Sueño (Chart.js) mostrando el histórico de los últimos 7 días con barras rojas/azules según el cumplimiento de las 6 horas mínimas. |
| **`E06`** | `E06_CRUD_Asignaturas.png` | **TC-006** (Gestión de Asignaturas) | Vista del módulo de asignaturas con la lista de materias creadas, botón de edición, colores temáticos y confirmación de eliminación. |
| **`E07`** | `E07_CRUD_Entregas.png` | **TC-007** (Gestión de Entregas Académicas) | Lista de entregas académicas con badges de tipo (`PROYECTO`, `TAREA`, `PARCIAL`), estado (`PENDIENTE`, `COMPLETADA`) y fecha límite. |
| **`E08`** | `E08_Registro_Horas_Estudio.png` | **TC-008** (Registro de Sesiones de Estudio) | Formulario de registro de horas de estudio con selección de materia y horas acumuladas. |
| **`E09`** | `E09_Indicador_Carga_80_Porciento.png` | **TC-009** (Cálculo de Carga Semanal 80%) | Tarjeta de indicador de carga académica en el Dashboard o vista de indicadores mostrando el **80%** (32h / 40h) con alerta visual por superar el 70%. |
| **`E10`** | `E10_Alertas_Preventivas_Generadas.png` | **TC-010, TC-011, TC-012, TC-013** (Alertas Preventivas) | Vista del módulo de Alertas con las 4 alertas generadas: `CARGA_ACADEMICA` (>70%), `SUENO` (<6h), `ESTRES` (Prioridad Alta) y `RECOMENDACION`. |
| **`E11`** | `E11_Marcar_Alerta_Leida.png` | **TC-014** (Cambio de Estado de Alerta) | Interfaz mostrando el botón y la acción de "Marcar como leída" en una alerta, con la actualización visual del estado. |
| **`E12`** | `E12_Responsive_Mobile_Desktop.png` | **TC-015** (Diseño Responsive) | Captura comparativa de la aplicación en modo Desktop y en modo Mobile (simulado mediante DevTools a ancho de 375px/390px), mostrando la adaptación de menú y tarjetas. |

---

## 🛠️ Instrucciones para la Toma de Capturas

1. Asegúrate de que tanto el backend (`http://localhost:4000`) como el frontend (`http://localhost:4200`) estén ejecutándose.
2. Si requieres reiniciar los datos base de prueba, ejecuta en la terminal:
   ```bash
   npm --prefix backend run seed
   ```
3. Guarda las imágenes en formato PNG o JPG con la nomenclatura exacta indicada arriba.
