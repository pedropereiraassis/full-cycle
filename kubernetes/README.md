# Commands Used

```
kubectl apply -f <file>.yaml

kubectl config get-contexts
kubectl config use-context

kubectl get pod

kubectl port-forward svc/goserver-service 8080:4000

kubectl exec -it goserver-6b795cfbb9-dzfqz -- bash

kubectl logs goserver-74d58c5476-4j5v7

watch -n1 kubectl get po
```

```
kubectl run -it fortio --rm --image=fortio/fortio -- load -qps 800 -t 120s -c 70 "http://goserver-service:4000/health"
```