#!/bin/bash
# echo "Removing require('crypto') references"
# perl -pi -e 's/require\(.crypto.\)/null/g' app/lib/peerio-icebear/crypto/util/random.js
# perl -pi -e 's/require\(.crypto.\)/null/g' node_modules/sjcl/sjcl.js
# perl -pi -e 's/require\(.crypto.\)/null/g' node_modules/tweetnacl/nacl-fast.js
echo "Removing require('minipdf') references"
perl -pi -e 's/require\(.\.\/minipdf_js.js.\)/null/g' node_modules/pdfform.js/dist/pdfform.minipdf.dist.js
perl -pi -e 's/require\(.\.\/minipdf.js.\)/null/g' node_modules/pdfform.js/dist/pdfform.minipdf.dist.js

