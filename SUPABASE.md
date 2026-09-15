# Conexión y pruebas

Solo se usa `@supabase/supabase-js` en el cliente, con email/contraseña y una clave **publishable**. No hay service_role, migraciones, endpoints propios ni requisito de login para estudiar.

## Configuración

En `.env.local` (ignorado por Git):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Las variables ya están configuradas localmente. Sus valores no están en este documento. La URL y la clave publishable son públicas en el navegador por diseño; los permisos sobre datos los aplica RLS con el JWT del usuario. Nunca colocar una clave secreta en una variable `NEXT_PUBLIC_*`.

En Supabase, mantener Email habilitado en Authentication. Si se exige confirmación de correo, el registro no inicia sesión hasta confirmar. Configurar Site URL y permitir `http://localhost:3000/login` en Redirect URLs para desarrollo. Añadir el dominio real con `/login` al publicar.

En Vercel, configurar las dos variables públicas para los entornos deseados y volver a desplegar: Next.js las incorpora durante el build. No se ha hecho ningún despliegue desde esta tarea.

## Tabla y unicidad

Se utiliza la tabla existente `user_progress` y las políticas SELECT/INSERT/UPDATE propias. No se crea ni altera la tabla. Los IDs de filas nuevas se generan como UUID en el cliente.

Las filas nuevas requieren un constraint único sobre `(user_id, lesson_id)`. El guardado usa `upsert` con `onConflict: "user_id,lesson_id"` e ignora la inserción si otro dispositivo ya creó esa fila; después vuelve a leer. Para filas existentes, UPDATE se filtra por usuario, lección, ID y revisión `updated_at`, evitando sobrescribir una modificación concurrente. Si falta unicidad, se muestra un aviso y no se utiliza un INSERT inseguro. Las filas duplicadas se detectan y no se sobrescriben.

Si falta el constraint, revisar primero duplicados en el SQL Editor. Resolverlos conservando el progreso válido antes de crear manualmente la restricción:

```sql
select user_id, lesson_id, count(*)
from public.user_progress
group by user_id, lesson_id
having count(*) > 1;

-- Ejecutar solo tras comprobar que no existe ya una restricción equivalente.
alter table public.user_progress
add constraint user_progress_user_lesson_unique unique (user_id, lesson_id);
```

## Progreso y conflictos

- Las claves originales `chino-a1:lesson-1-progress` y `chino-a1:lesson-2-progress` conservan su formato y guardan el estado inmediato. Funcionan sin cuenta o sin red.
- Cada clave añade un metadato separado `:sync` con fecha de modificación y marca de reinicio. Montar o recargar una sesión sin cambios no genera una revisión nueva.
- Con una cuenta activa se sincronizan `lesson-1` y `lesson-2`: `user_id`, `lesson_id`, `progress`, `score`, `completed`, `data` completo y `updated_at`. `data._sync` conserva la revisión y el reinicio.
- Cuando ambas revisiones tienen fecha válida, gana la más reciente (incluye reinicios y repetición de ejercicios). Para datos antiguos sin fecha se prioriza el estado más avanzado: finalización, fase y número de respuestas. Se conserva una instantánea completa, no se mezclan respuestas de intentos distintos. Las fechas dependen del reloj del dispositivo.
- Al reiniciar, el estado vacío se sincroniza como una revisión explícita; no requiere DELETE remoto y no afecta a otra lección.
- Se lee antes de escribir; si el alumno responde durante la petición, se reintenta sin reemplazar su nueva respuesta. Las peticiones tienen un límite de 12 segundos. Se agrupan cambios durante 500 ms y se reintenta al recuperar conexión y cada 30 segundos mientras la app está abierta.
- El progreso invitado se conserva aparte en `chino-a1:progress-guest`. El primer login de una cuenta en este navegador abre un estado vacío y carga su progreso remoto si existe; nunca incorpora respuestas anónimas. Sin progreso remoto empieza en cero y sincroniza únicamente los avances que esa cuenta genere después. Logout archiva el progreso de la cuenta y restaura el del invitado. Al volver a una cuenta se recupera su propio estado local (incluidos avances offline pendientes) y se compara con su estado remoto. Los archivos locales de cuentas usan `chino-a1:progress-account:<user_id>`; `chino-a1:progress-owner` identifica la cuenta del estado visible. Una cuenta ya sincronizada con el comportamiento anterior conserva sus datos: no se borran retrospectivamente.
- Dashboard y Curso siguen usando `useCourseProgress`: reciben los eventos existentes tras importar datos. Las páginas de sesión también reciben el evento de importación y restauran su estado si ya estaban abiertas. Entre pestañas se escucha `storage`.

## Validación reproducible

```sh
node --test tests/progress-sync.test.mjs
npx tsc --noEmit --incremental false
npm run lint -- --no-cache
```

Las pruebas locales usan una tabla simulada: no sustituyen una comprobación autenticada con el proyecto real. Para esa comprobación:

1. Crear una cuenta de prueba en `/register`, confirmar el email si corresponde e iniciar sesión en `/login`.
2. Avanzar en ambas sesiones y esperar a «Progreso sincronizado». En Supabase verificar una sola fila por lección con el `user_id` correcto y los estados completos en `data`.
3. Recargar, cerrar sesión y comprobar que vuelve el progreso invitado y que al iniciar sesión otra vez se recuperan las respuestas de la cuenta.
4. Iniciar sesión con la misma cuenta en otro navegador y comprobar recuperación de respuestas, fases, resultados y Dashboard/Curso.
5. Reiniciar solo Sesión 2 y comprobar 5 %, 1/20 y Sesión 3 bloqueada si Sesión 1 estaba completada. Volver a entrar en otro navegador y verificar que el reinicio se recupera.
6. Interrumpir la conexión y responder: comprobar guardado local y sincronización posterior al reconectar.

No usar cuentas personales ni borrar el progreso real para estas pruebas.
