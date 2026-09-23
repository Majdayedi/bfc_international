Database dump for first MySQL boot only.

01-bfc.sql
  - Full copy of local bfc_db (structure + data).
  - Runs once when the mysql_data Docker volume is empty.
  - Backend seeds are DISABLED in docker-compose (APP_SEED_ENABLED=false),
    so this dump is the only source of data.

Re-export after local changes:
  mysqldump -u root --single-transaction --routines --triggers --events --databases bfc_db > 01-bfc.sql

Re-import on VPS (wipes container DB volume):
  docker compose down -v && docker compose up -d
