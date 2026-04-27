# ============================================================
# 🚀 LuxeMarket — Minikube Deployment Guide
# ============================================================

## PREREQUISITES
Make sure these are installed:
  - Docker          → https://docs.docker.com/get-docker/
  - Minikube        → https://minikube.sigs.k8s.io/docs/start/
  - kubectl         → https://kubernetes.io/docs/tasks/tools/

---

## STEP 1 — Start Minikube

    minikube start --driver=docker --memory=2048 --cpus=2

Check it's running:

    minikube status

---

## STEP 2 — Point Docker to Minikube's Registry

This makes your locally built image available inside Minikube
WITHOUT needing to push to Docker Hub.

    eval $(minikube docker-env)

⚠️  Run this in EVERY new terminal session you use.

---

## STEP 3 — Build the Docker Image (inside Minikube)

Make sure you're inside the project root (where Dockerfile is):

    cd /path/to/ecommerce/

Build the image:

    docker build -t luxemarket:latest .

Verify the image exists:

    docker images | grep luxemarket

---

## STEP 4 — Apply Kubernetes Resources

Apply in this exact order:

    # 1. Create namespace first
    kubectl apply -f k8s/namespace.yaml

    # 2. Apply ConfigMap
    kubectl apply -f k8s/configmap.yaml

    # 3. Deploy the app
    kubectl apply -f k8s/deployment.yaml

    # 4. Create the service
    kubectl apply -f k8s/service.yaml

    # 5. (Optional) Enable autoscaling
    minikube addons enable metrics-server
    kubectl apply -f k8s/hpa.yaml

Or apply everything at once (except HPA until metrics-server is ready):

    kubectl apply -f k8s/namespace.yaml
    kubectl apply -f k8s/

---

## STEP 5 — Verify Everything is Running

    # Check namespace
    kubectl get namespace luxemarket

    # Check pods (wait for STATUS = Running)
    kubectl get pods -n luxemarket

    # Check deployment
    kubectl get deployment -n luxemarket

    # Check service
    kubectl get service -n luxemarket

    # Check all resources at once
    kubectl get all -n luxemarket

---

## STEP 6 — Open the Website in Browser

    minikube service luxemarket-service -n luxemarket

This will automatically open the website in your default browser! 🎉

Or get the URL manually:

    minikube service luxemarket-service -n luxemarket --url

Then open that URL in your browser.

---

## USEFUL COMMANDS

### View pod logs:
    kubectl logs -l app=luxemarket -n luxemarket

### Watch pods in real time:
    kubectl get pods -n luxemarket -w

### Describe a pod (for debugging):
    kubectl describe pod -l app=luxemarket -n luxemarket

### SSH into a running pod:
    kubectl exec -it $(kubectl get pod -l app=luxemarket -n luxemarket -o jsonpath='{.items[0].metadata.name}') -n luxemarket -- /bin/sh

### Scale deployment manually:
    kubectl scale deployment luxemarket-deployment --replicas=3 -n luxemarket

### View HPA status:
    kubectl get hpa -n luxemarket

---

## UPDATING THE APP

After making changes to the code:

    # Rebuild image (with Minikube docker env active)
    docker build -t luxemarket:latest .

    # Rollout restart (picks up new image)
    kubectl rollout restart deployment/luxemarket-deployment -n luxemarket

    # Watch rollout progress
    kubectl rollout status deployment/luxemarket-deployment -n luxemarket

---

## CLEANUP

### Delete all LuxeMarket resources:
    kubectl delete namespace luxemarket

### Stop Minikube:
    minikube stop

### Delete Minikube cluster:
    minikube delete

---

## TROUBLESHOOTING

### Pod stuck in "ImagePullBackOff":
  → You forgot to run: eval $(minikube docker-env)
  → Rebuild the image after running that command
  → Make sure imagePullPolicy: Never is set in deployment.yaml

### Pod stuck in "Pending":
  → Minikube may be out of resources
  → Run: minikube status
  → Try: minikube start --memory=2048 --cpus=2

### "Connection refused" when accessing URL:
  → Make sure pods are Running: kubectl get pods -n luxemarket
  → Check service: kubectl get svc -n luxemarket
  → Use: minikube service luxemarket-service -n luxemarket

### Check nginx errors inside pod:
    kubectl exec -it <pod-name> -n luxemarket -- cat /var/log/nginx/error.log
