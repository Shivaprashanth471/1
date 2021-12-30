fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## iOS
### ios match_certificates
```
fastlane ios match_certificates
```
Generate certificates and provisioning profiles
### ios development
```
fastlane ios development
```
development build (local)
### ios distribute_to_device
```
fastlane ios distribute_to_device
```
local deploy to target device
### ios distribute_qa
```
fastlane ios distribute_qa
```
distribute test build to app center
### ios distribute_uat
```
fastlane ios distribute_uat
```
distribute uat build to app center
### ios distribute_prod
```
fastlane ios distribute_prod
```
distribute prod build to app center
### ios refresh_profiles
```
fastlane ios refresh_profiles
```
Refresh provisioning Profiles
### ios register_new_device
```
fastlane ios register_new_device
```
Register new device

----

## Android
### android development
```
fastlane android development
```
development build (local)
### android distribute_staging
```
fastlane android distribute_staging
```
development build and deploy to app center
### android distribute_qa
```
fastlane android distribute_qa
```
QA build and deploy to app center
### android distribute_uat
```
fastlane android distribute_uat
```
uat build and deploy to app center
### android distribute_prod
```
fastlane android distribute_prod
```
build and deploy production app to app center

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
