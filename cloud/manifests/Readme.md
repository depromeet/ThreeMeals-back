# Thremeals 클라우드 인프라 환경 세팅
stage 와 prod 는 거의 동일한 환경으로 구성

## stage 환경 세팅

aws config 세팅 (~/.aws/credentials)

```
[hush_it_stage]
aws_access_key_id = xxxxxxxxx
aws_secret_access_key = xxxxxxx
```

manifests 폴더(현재폴더) 에서 아래 명령어 실행

```sh
# terraform init
TF_DATA_DIR=../stage/.terraform terraform init -backend-config=../stage/backend.tfvars

# terraform plan
TF_DATA_DIR=../stage/.terraform terraform plan -out=../stage/tfplan -var-file=../stage/stage.auto.tfvars

# terraform apply
TF_DATA_DIR=../stage/.terraform terraform apply ../stage/tfplan

# terraform destory
TF_DATA_DIR=../stage/.terraform terraform destroy -var-file=../stage/stage.auto.tfvars
```

## production 환경 세팅

aws config 세팅 (~/.aws/credentials)

```
[hush_it_prod]
aws_access_key_id = xxxxxxxxx
aws_secret_access_key = xxxxxxx
```

manifests 폴더(현재폴더) 에서 아래 명령어 실행

```sh
# terraform init
TF_DATA_DIR=../prod/.terraform terraform init -backend-config=../prod/backend.tfvars

# terraform plan
TF_DATA_DIR=../prod/.terraform terraform plan -out=../prod/tfplan -var-file=../prod/prod.auto.tfvars

# terraform apply
TF_DATA_DIR=../prod/.terraform terraform apply ../prod/tfplan

# terraform destory
TF_DATA_DIR=../prod/.terraform terraform destroy -var-file=../prod/prod.auto.tfvars
```
