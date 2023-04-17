echo "creating subdomain specific builds"
rm -rf subdomain_builds
mkdir subdomain_builds
echo "build will be created for"
cat configs/subdomains-to-build.txt
echo "\nstarting build process...."
for filename in `tr , '\n' <  configs/subdomains-to-build.txt`; do
    configfile="$(node --eval='console.log(process.argv[1].split(".")[0])' $filename)"
    echo $configfile
    cp -R build originalBuild
	echo "creating for file"
	echo $filename
	node $(dirname $0)/create_subdomain_specific_html.js build/index.html configs/subdomains/$filename.js build/index.withConfig.html build/sitemap.txt https://$filename.prepleaf.com
    mv build/index.html build/index.original.html
    mv build/index.withConfig.html build/index.html
    # # running snap for ssr
    yarn snap
    mv build/index.html build/index.non-ssr.html
    mv build/200.html build/index.html
    # # build process with snap ended
    # # move build to subdomain_builds
    mv build subdomain_builds/$configfile
    rm -rf build
    mv originalBuild build
done
echo "successfully created subdomain specific builds"
