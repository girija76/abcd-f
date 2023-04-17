echo "Build will be deployed for following subdomains:"
ls subdomain_builds
read -p "Are you sure you want to deploy(Y/y)? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # aws s3 cp s3://prepare.production.prepleaf.com/current s3://prepare.production.prepleaf.com/last --recursive --profile prepare-production.frontend

    aws s3 sync subdomain_builds s3://prepare.production.prepleaf.com/current --exclude "*.gz" --exclude "*.html" --exclude "*.js.map*" --exclude "*.css.map*" --cache-control max-age=31536000 --profile prepare-production.frontend

	aws s3 sync subdomain_builds s3://prepare.production.prepleaf.com/current --exclude "*" --include "*.html" --profile prepare-production.frontend
    #aws s3 cp build/index.html s3://prepare.production.prepleaf.com/current/index.html --profile prepare-production.frontend

    aws cloudfront create-invalidation --distribution-id E16JIU72I0AOEC --paths "/*" --profile prepare-production.frontend
fi
