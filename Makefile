.PHONY: create update upload build

VERSION := 0.0.1
MODULE_NAME := my-module
STAGING_ORG_PUBLIC_NAMESPACE := bashar-org-dev
PROD_ORG_PUBLIC_NAMESPACE := bashar-org
STAGING_BASE_URL := https://app.viam.dev
PROD_BASE_URL := https://app.viam.com

ORG_PUBLIC_NAMESPACE := ${STAGING_ORG_PUBLIC_NAMESPACE}
BASE_URL := ${STAGING_BASE_URL}

create:
	viam --base-url ${BASE_URL} module create --name=${MODULE_NAME} --public-namespace=${ORG_PUBLIC_NAMESPACE}

update:
	viam --base-url ${BASE_URL} module update --module=meta.json

upload: build
	viam --base-url ${BASE_URL} module upload --version=${VERSION} --platform=any --public-namespace=${ORG_PUBLIC_NAMESPACE} module

build:
	cd src/blue && npm run build
	cd src/red && npm run build
