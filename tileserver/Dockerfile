# Network-restricted mirror — keep this if direct Docker Hub access is blocked on your network.
#
# S-C1 — Content-Trust verification (mirror):
#   If the mirror supports Docker Content Trust (Notary v1), set DOCKER_CONTENT_TRUST=1
#   before running `docker build`. For mirrors that do NOT support Notary, verify the
#   pulled digest manually after the first pull and record it here:
#     docker inspect --format='{{index .RepoDigests 0}}' \
#       mirror-docker.runflare.com/maptiler/tileserver-gl:<tag>
#
# S-C2 — Pinned version:
#   Do NOT use 'latest' in production. To find the tag that 'latest' currently resolves to:
#     docker pull mirror-docker.runflare.com/maptiler/tileserver-gl:latest
#     docker inspect --format='{{index .RepoDigests 0}}' \
#       mirror-docker.runflare.com/maptiler/tileserver-gl:latest
#   Then replace the tag below with the exact version (e.g. v4.7.1).
FROM mirror-docker.runflare.com/maptiler/tileserver-gl:v4.7.1
