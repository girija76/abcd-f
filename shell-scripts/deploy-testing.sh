aws s3 mv s3://prepare.test.prepleaf.com/current s3://prepare.test.prepleaf.com/last --recursive --profile prepare-testing.frontend

aws s3 sync build s3://prepare.test.prepleaf.com/current --exclude "index.html" --cache-control max-age=31536000 --profile prepare-testing.frontend

aws s3 sync build s3://prepare.testing.prepleaf.com/current --exclude "*" --include "*.html" --profile prepare-testing.frontend
#aws s3 cp build/index.html s3://prepare.test.prepleaf.com/current/index.html --profile prepare-testing.frontend

aws cloudfront create-invalidation --distribution-id E5DFEKICN322B --paths "/*" --profile prepare-testing.frontend
