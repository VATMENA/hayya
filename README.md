# VATMENA HQ

All-in-one division management system built with Vercel, Rust and Svelte for VATSIM Middle East and North Africa.

## Running

You'll need a Vercel account and the following environment variables set:

- `MENAHQ_API_POSTGRES_URL` set to your postgres connection url
- `MENAHQ_API_ED25519_KEYPAIR` set to your Ed25519 keypair (generate with `cargo run --bin generate_keypair` and copy the output)
- `MENAHQ_API_VATSIM_OAUTH_CLIENT_SECRET` set to your VATSIM Connect client secret
- `MENAHQ_API_VATSIM_OAUTH_CLIENT_ID` set to your VATSIM Connect client ID
- `MENAHQ_API_VATSIM_OAUTH_ENDPOINT` set to the VATSIM connect base url (https://auth.vatsim.net or https://auth-dev.vatsim.net)