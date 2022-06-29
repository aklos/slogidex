# Codebook

Gradual automation platform for individuals and businesses. Automating everything is hard, instead write guides and replace steps with scripts gradually.

## Overview

Codebook is a similar tool to Jupyter notebooks for Python, except that it is able to connect to remote servers and run on your local computer.

### Security

Since this is primarily a web app, there is a Rust client that subscribes to a protocol for running scripts locally. Each script is encrypted with the user's signature (PGP, SHA256?) and stored in the database. The Rust client creates a local HTTP server for receiving script code and executing it.

For remote execution, users may provide a custom URL for the Rust client HTTP server.

## Setup

1. Install dependencies: `yarn`.
2. Create `.env` file, using `example.env` as a template.
3. Start the app with `yarn dev`.

## Notes

- Use react-hook-form: https://react-hook-form.com/