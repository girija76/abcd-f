./node_modules/.bin/env-cmd -f ./.env.staging yarn run build

echo "Creating subdomain specific htmls"
$(dirname $0)/create_subdomain_specific_builds.sh
