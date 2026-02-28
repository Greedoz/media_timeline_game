# Operations Runbook

## Environments
- `local`
- `staging`
- `production`

## Deploy Checklist
1. Apply new Supabase migrations.
2. Deploy web/API changes.
3. Verify storage bucket policies.
4. Run smoke tests:
   - room create/join/start
   - place/reveal flow
   - private media signed URL access

## Incident Playbooks

### Realtime Desync
1. Check event sequence gaps.
2. Force snapshot resync endpoint call.
3. If repeated, disable affected room and restart game.

### Host Disconnect
1. Promote new host by seat priority.
2. Emit `HOST_CHANGED`.
3. Resume game after acknowledgement.

### Media Access Failure
1. Validate signed URL expiration.
2. Verify bucket path and ownership.
3. Reissue signed URL and retry.

## Monitoring
- API error rate by endpoint.
- Realtime event publish failure count.
- Average match duration and completion rate.
- Storage/transcode failure count.

