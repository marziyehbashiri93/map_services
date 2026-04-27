# Ansible deployment (map_services)

This folder provides a small playbook to start the map stack on a server with **no hostnames, IPs, or secrets hardcoded in YAML**. Set everything via **inventory**, **group_vars**, or **`-e`**.

## What you need on the target

- Docker Engine and `docker compose` (v2 plugin)
- Python 3 (for `publish_hybrid_assets.py` and Ansible’s remote module execution)
- The **map_services** repository (or a copy) at `map_services_deploy_root` (e.g. `/opt/map_services`)

## Variables to set

| Variable | Purpose |
|----------|---------|
| `map_services_deploy_root` | Absolute path to the repo on the server |
| `ansible_host`, `ansible_user`, `ansible_port` | SSH connection (inventory or `group_vars`) |
| `map_services_ensure_fleet_net` | Create `fleet-net` if you use GeoServer/GraphHopper compose files |
| `map_services_start_*` | Toggle `tileserver` / `map_gateway` / `geoserver` / `graphhopper` |
| `map_services_compose_build` | Pass `--build` to `docker compose up` or not |
| `map_services_run_publish_hybrid_assets` | Run the hybrid asset publisher before gateway |
| `map_services_healthcheck_style` | Style basename for the optional GET check (default `day_1_public`) |

Copy `group_vars/all/example.yml` to `group_vars/all/vars.yml` and adjust. `inventory/hosts.yml` and `group_vars/all/vars.yml` are listed in `deploy/ansible/.gitignore` so local values are not committed by mistake. See comments in that file and in `inventory/hosts.example.yml`.

## Secrets and Ansible Vault

This playbook does not store database passwords, API keys, or TLS private keys. If you must keep sensitive strings in git, use **Ansible Vault** to encrypt a vars file, e.g. `group_vars/all/vault.yml`, and load it from `vars_files` or an `include_vars` task. Otherwise prefer your organization’s secret store and **template files on the host** with a separate, audited process.

## Example commands

```bash
cd deploy/ansible
cp inventory/hosts.example.yml inventory/hosts.yml
# Edit inventory: ansible_host, ansible_user, etc.

cp group_vars/all/example.yml group_vars/all/vars.yml
# Set map_services_deploy_root and optional toggles

ansible-playbook playbooks/site.yml -i inventory/hosts.yml
```

Override paths or toggles without editing files:

```bash
ansible-playbook playbooks/site.yml -i inventory/hosts.yml \
  -e "map_services_deploy_root=/opt/map_services" \
  -e "map_services_start_geoserver=true"
```

## Role layout

- `roles/map_services` — create Docker networks, optional publish step, `docker compose up` per stack, optional health checks on localhost.

**TODO (operator):** add your own play or tasks to `rsync` / `git pull` the repo, or to install Docker on bare metal, if those steps are not already handled by your image or bootstrap process.
