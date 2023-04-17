# aws s3 cp s3://prepare.staging.prepleaf.com/current s3://prepare.staging.prepleaf.com/last --recursive --profile prepare-staging.frontend

aws s3 sync subdomain_builds s3://prepare.staging.prepleaf.com/current --exclude "*.html" --exclude "*.js.map*" --exclude "*.css.map*" --exclude "*.css.gz" --exclude "*.js.gz" --cache-control max-age=31536000 --profile prepare-staging.frontend

aws s3 sync subdomain_builds s3://prepare.staging.prepleaf.com/current --exclude "*" --include "*.html" --profile prepare-staging.frontend

aws cloudfront create-invalidation --distribution-id ET59QYUGOQW78 --paths "/*" --profile prepare-staging.frontend
