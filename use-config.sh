# get the directory path for this script (__dirname)
if [ -z "$1" ]
    then
        echo "Please specify a config file name (without the js extension)"
else
    DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
    FROM="${DIR}/configs/subdomains/$1.js"
    TO="${DIR}/public/config.js"
    if test -f "$TO"
        then rm $TO
    fi
    ln -s $FROM $TO
fi
