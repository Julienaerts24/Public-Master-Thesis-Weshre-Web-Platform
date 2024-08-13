# Firebase to Supabase: Auth Migration
# Modification by Julien Aerts

This module automates the process of converting auth users from a Firebase project to a Supabase project.  There are 2 parts to the migration process:

- `firebaseauth2json.ts` exports users from an existing Firebase project to a `.json` file on your local system with hash and salt password
- `import_users` imports users from a saved `.json` file into your Supabase project (inserting those users into the `auth.users` table of your `PostgreSQL` database instance)

### Configuration

#### Download your `firebase-service.json` file from the Firebase Console
* log into your Firebase Console
* open your project
* click the gear icon to the right of `Project Overview` at the top left, then click `Project Settings`
* click `Service Accounts` at the center of the top menu
* select `Firebase Admin SDK` at the left then click the `Generate new private key` button on the right (bottom)
* click `Generate key`
* rename the downloaded file to `firebase-service.json`

#### Set up your `supabase-service.json` file
* copy or rename `supabase-service-sample.json` to `supabase-service.json`
* edit the `supabase-service.json` file:
    * log in to [app.supabase.io](https://app.supabase.io) and open your project
    * click the `settings` (gear) icon at the bottom of the left menu
    * click `Database` from the `Settings Menu`
    * scroll down and find your `Host` string under `Connection info`, copy that to the `host` entry in your `supabase-service.json` file.
    * enter the password you used when you created your Supabase project in the `password` entry in the `supabase-service.json` file
    * save the `supabase-service.json` file

#### Install dependencies
You'll need to install the `firebase-admin` dependency:

```bash
npm install firebase-admin
```

Before being able to use the firebaseauth2json.ts script, you will need to use the command "firebase login", if firebase is not install of your computer you can install it using: 

```bash
npm install -g firebase-tools
firebase login
```

### Command Line Syntax

#### Dump Firestore users to a JSON file
`ts-node firebaseauth2json.ts <project-id> [<filename.json>] [<batch_size>]`
* `project-id`: id of the project you want to export the user from. You can retreive this using the command `firebase projects:list`
* `filename.json`: (optional) output filename (defaults to ./users.json')
* `batchSize`: (optional) number of users to fetch in each batch (defaults to 100)

Example for the private version of Weshre: `ts-node firebaseauth2json.ts weshre-private`

#### Import JSON users file to Supabase Auth (PostgreSQL: auth.users)

`ts-node import_users.ts <path_to_json_file> [<batch_size>]`
* `path_to_json_file`: full local path and filename of .json input file (of users)
* `batch_size`: (optional) number of users to process in a batch (defaults to 100)

Example for the private version of Weshre: `ts-node import_users.ts ./users.json 1`


#### Example of code that need to be integrated to the login page of Supabase:
If login with email-password, email exist but corresponding encrypted_password is null:
Use a code like this with salt = user.rawUserMetaData.salt and hash = user.rawUserMetaData.passwordHash
If isValid => login the user +  compute the new value of encrypted_password

```
const FirebaseScryptLib = require('firebase-scrypt');

const firebaseParameters = {
  memCost: process.env.MEMCOST,
  rounds: process.env.ROUDNS, 
  saltSeparator: process.env.SALTSEPARATOR, 
  signerKey: process.env.SIGNERKEY 
}
const scrypt = new FirebaseScryptLib.FirebaseScrypt(firebaseParameters);

if (salt && password && hash) {
  scrypt.verify(password, salt, hash)
  .then((isValid) => {
    res.statusCode = 200;
    res.send(isValid ? 'valid' : 'invalid');
  }).catch((err) => {
    res.statusCode = 400;
    res.send(JSON.stringify(err));
  });
}
```

#### How to find and save the firebaseParameters
* log into your Firebase Console
* open your project
* select `Authentication` in the menu on the left
* select `Users` at the top bar
* click the 3 dots context menu button at the top right corner of the users list
* click `Password hash parameters` from the context menu
* copy and save your parameters for `base64_signer_key`, `base64_salt_separator`, `rounds`, and `mem_cost`

Sample `Password hash parameters`:
```
hash_config {
  algorithm: SCRYPT,
  base64_signer_key: XXXX/XXX+XXXXXXXXXXXXXXXXX+XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX==,
  base64_salt_separator: Aa==,
  rounds: 8,
  mem_cost: 14,
}
```

#### Set your Hash Parameters
Now that you have your 4 hash parameters, you can set them up in your environment(s):
##### For a local development server (or hosting your own `NodeJS` server):
* copy the file `local.env.sh.sample` to `local.env.sh` (in the middleware/verify-firebase-pw folder)
* edit the `MEMCOST`, `ROUNDS`, `SALTSEPARATOR`, and `SIGNERKEY` environment variables you obtained in the previous step

Sample `local.env.sh` file:
```
export PORT=3000
export MEMCOST=14
export ROUNDS=8
export SALTSEPARATOR=Aa== 
export SIGNERKEY=XXXX/XXX+XXXXXXXXXXXXXXXXX+XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX==
```
##### For hosting globally using [fly.io](https://fly.io):
* copy the `fly.toml.sample` file to `fly.toml`
* edit the `[env]` section of the `fly.toml` to match the values you obtained in the previous step for `MEMCOST`, `ROUNDS`, `SALTSEPARATOR`, and `SIGNERKEY`

Sample `[env]` section for the `fly.toml` file:
```
[env]
  PORT = "8080"
  MEMCOST = 14
  ROUNDS = 8
  SALTSEPARATOR = "Aa==" 
  SIGNERKEY = "XXXX/XXX+XXXXXXXXXXXXXXXXX+XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX=="
```