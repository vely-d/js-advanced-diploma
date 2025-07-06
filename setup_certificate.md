Sure! Let’s address your questions one by one:

### 1. Running `http-server` Without SSL Keys

Yes, you can run `http-server` without specifying SSL keys. If you just want to serve your files over HTTP (not HTTPS), you can run:

```bash
http-server ./dist
```

or

```bash
http-server ./src
```

This will serve the files in the specified directory over HTTP, which is suitable for local development.

### 2. Running a Dev Version from `src`

Yes, you can run a development version located in the `src` directory using:

```bash
http-server ./src
```

This command will serve the files in the `src` directory. It's useful for quickly testing your changes without building them first. However, keep in mind that if your project uses Webpack for bundling and you want to see the final output, you should build the project first and then serve from the `dist` directory.

### 3. Creating an SSL Key

To create a self-signed SSL certificate for local development, you can use OpenSSL. Here’s how you can do it:

#### Step 1: Install OpenSSL

- **Linux**: OpenSSL is usually pre-installed. If not, you can install it using your package manager (e.g., `sudo apt install openssl` on Ubuntu).
- **macOS**: OpenSSL is typically available by default. If not, you can install it via Homebrew: `brew install openssl`.
- **Windows**: You can download precompiled binaries from the [OpenSSL website](https://slproweb.com/products/Win32OpenSSL.html) or use a package manager like Chocolatey.

#### Step 2: Generate a Self-Signed Certificate

Run the following commands in your terminal:

```bash
# Generate a private key
openssl genrsa -out key.pem 2048

# Generate a self-signed certificate
openssl req -new -x509 -key key.pem -out cert.pem -days 365
```

During the certificate generation process, you will be prompted to enter information such as country, state, organization, etc. You can fill these in or leave them blank as needed.

#### Step 3: Use the Generated Keys

After running the commands, you will have two files:
- `key.pem`: Your private key.
- `cert.pem`: Your self-signed certificate.

You can use these files when starting your HTTPS server:

```bash
http-server ./dist -S -C cert.pem -K key.pem
```

### Note on Self-Signed Certificates

- **Browser Warnings**: When using self-signed certificates, browsers will typically show a warning indicating that the connection is not secure. This is expected behavior since the certificate is not signed by a recognized Certificate Authority (CA). You can usually proceed past this warning for local development.
- **Production Use**: For production environments, it’s recommended to obtain an SSL certificate from a trusted CA to avoid security warnings and ensure secure connections.

### Summary

- You can serve files without SSL using `http-server` simply by omitting the `-S`, `-C`, and `-K` flags.
- You can run a dev version from the `src` directory.
- Self-signed certificates can be created using OpenSSL for local development, but remember that they will trigger security warnings in browsers.