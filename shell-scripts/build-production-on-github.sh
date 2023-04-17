echo $1 > configs/subdomains-to-build.txt
echo "Building for subdomains: "
./node_modules/.bin/env-cmd -f ./.env.production yarn build
echo "Creating subdomain specific htmls"
$(dirname $0)/create_subdomain_specific_builds.sh
