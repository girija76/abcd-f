./node_modules/.bin/env-cmd -f ./.env.testing yarn build

echo "Creating subdomain specific htmls"
$(dirname $0)/create_subdomain_specific_build.sh
