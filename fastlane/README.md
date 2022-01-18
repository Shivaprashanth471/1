fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios match_certificates

```sh
[bundle exec] fastlane ios match_certificates
```

Generate certificates and provisioning profiles

### ios development

```sh
[bundle exec] fastlane ios development
```

development build (local)

### ios distribute_to_device

```sh
[bundle exec] fastlane ios distribute_to_device
```

local deploy to target device

### ios distribute_staging

```sh
[bundle exec] fastlane ios distribute_staging
```

distribute staging build to app center

### ios distribute_qa

```sh
[bundle exec] fastlane ios distribute_qa
```

distribute test build to app center

### ios distribute_uat

```sh
[bundle exec] fastlane ios distribute_uat
```

distribute uat build to app center

### ios distribute_prod

```sh
[bundle exec] fastlane ios distribute_prod
```

distribute prod build to app center

### ios refresh_profiles

```sh
[bundle exec] fastlane ios refresh_profiles
```

Refresh provisioning Profiles

### ios register_new_device

```sh
[bundle exec] fastlane ios register_new_device
```

Register new device

----


## Android

### android development

```sh
[bundle exec] fastlane android development
```

development build (local)

### android distribute_staging

```sh
[bundle exec] fastlane android distribute_staging
```

development build and deploy to app center

### android distribute_qa

```sh
[bundle exec] fastlane android distribute_qa
```

QA build and deploy to app center

### android distribute_uat

```sh
[bundle exec] fastlane android distribute_uat
```

uat build and deploy to app center

### android distribute_prod

```sh
[bundle exec] fastlane android distribute_prod
```

build and deploy production app to app center

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
