first, run:
```
cd ./certificate && openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

then add to keychain:
```
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./certificate/localhost.crt
```
