# Domain Model Configuration

- **Domain Layout**: Single-context
- **Glossary Path**: `GLOSSARY.md` (di root repositori)
- **Architectural Seams**:
  - `src/services/destinationService.ts`: Modul katalog destinasi dan reservasi tiket
  - `src/services/userService.ts`: Modul repositori pengguna dan mutasi hak akses
  - `src/context/AuthContext.tsx`: Adapter autentikasi & RBAC (Role-Based Access Control)
