#!/bin/bash

docker build -t skillsly-wa .
docker tag skillsly-wa jonatlop07/skillsly-wa
docker push jonatlop07/skillsly-wa

kubectl apply -f deployment.yaml
