echo "Deploying to following: subdomains"
cat ./configs/subdomains-to-build.txt

aws s3 sync subdomain_builds s3://prepseed-preparation-portal-ui/current --exclude "*.gz" --exclude "*.html" --exclude "*.js.map*" --exclude "*.css.map*" --cache-control max-age=31536000

aws s3 sync subdomain_builds s3://prepseed-preparation-portal-ui/current --exclude "*" --include "*.html"

aws cloudfront create-invalidation --distribution-id E3QAOAKE7G773C --paths "/*"

