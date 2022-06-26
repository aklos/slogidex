# Codebook

Gradual automation platform for individuals and businesses. Automating everything is hard, instead write guides and replace steps with scripts gradually.

## Overview

Codebook is a similar tool to Jupyter notebooks for Python, except that it is able to connect to remote servers and run on your local computer.

### Security

Since this is primarily a web app, there is a Rust client that subscribes to a protocol for running scripts locally. Each script is encrypted with the user's signature (PGP, SHA256?).

For remote execution, each organization/user is provisioned a sandboxed server with encryption. The user sets environment variables and has network access to remote servers.

## Setup

1. Install dependencies: `yarn`.
2. Create `.env` file, using `example.env` as a template.
3. Start the app with `yarn dev`.