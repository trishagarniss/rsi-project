#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
docker exec asgard_postgres pg_dump -U asgard asgard > $BACKUP_DIR/asgard_$DATE.sql
echo "Backup completed: asgard_$DATE.sql"