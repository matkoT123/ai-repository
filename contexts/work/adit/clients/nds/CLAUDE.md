# NDS - central log collection and monitoring

Central real-time log collection for a large state-owned infrastructure company (NDS): on-prem install of Grafana, Loki and Grafana Alloy, plus a Windows client installer and a customer installation guide. Ordered through Adit (aconsulting). CV: "central log collection project, including setting up the logging servers".

## Status
Active (low volume). Open item since 2026-10-08: moving one appliance server to a second, geo-redundant DC location. Details and estimates in `G:/nogames/nds/CLAUDE.md` (source of truth for ongoing work). Repo last commit 2025-12-28.

## Paths
- `G:/nogames/nds/` (root, has `CLAUDE.md` in Slovak)
- `nds-logging/` - server side, `https://git.adit.sk/aconsulting/nds-logging.git` (never push, 2 commits, Tremko)
- `nds_ver_3/` - current Windows client: `toKarci/` = package handed to the customer, `solution_with_dynamic_paths/` = variant with dynamic SQL/Exchange paths
- `nds-win-server-client/`, `architecture-2-alloy-services/` - older client versions
- `Instalacna prirucka Alloy klienta.docx/.pdf` - customer installation guide (Slovak)

Local materials may lag behind the real server state.

## Architecture
- Server (Linux, Docker Compose, `restart: unless-stopped`): Loki 2.9.4 (port 3100, filesystem storage, 168h retention), Grafana 10.4.2 (port 3000, Loki datasource provisioned), local Alloy for `/var/log`.
- HA: two Loki instances (primary and backup, IPs in the root CLAUDE.md). Clients write every log to both (`loki.write` primary + backup).
- Windows client: Alloy as a Windows service. `install-alloy.ps1` detects roles (DC, SQL, Exchange, Hyper-V), enables audit policies, PowerShell logging and event channels, composes `config-base.alloy` + role configs into `C:\Program Files\GrafanaLabs\Alloy\config.alloy`, restarts the service.
- Collected: System, Application, Security, PowerShell, SMBServer/Operational, WindowsUpdate.log, plus role-specific logs. Loki IPs are hard-coded in `configs/config-base.alloy`.

## People
karci - customer communication and orders. vjurenka and Martin - technical side.

## Worth reusing
Role-detecting PowerShell installer that composes Alloy config fragments; dual-write to two Loki instances for HA without a load balancer.

## Security notes
- secret present in `G:/nogames/nds/nds-logging/compose.yaml` (`GF_SECURITY_ADMIN_PASSWORD` literal, tracked in git).
