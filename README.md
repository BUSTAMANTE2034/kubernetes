# Aplicación Web

# INTEGRAR
En tu computadora abre git desde consola
Ejecuta el comando 'git clone "repositorio...."'
Creara una carpeta con el proyecto


## Requisitos

1. Asegúrate de tener instalados los siguientes programas en tu máquina:
   - **Docker**: Para ejecutar contenedores.
   - **Docker Compose**: Para gestionar y ejecutar el contenedor.

---

## Instrucciones

### Paso 1: Construir el Contenedor

1. Abre una terminal y navega al directorio donde se encuentra este proyecto.
2. Ejecuta el siguiente comando para construir la imagen del contenedor:
   docker-compose build

### Paso 2: Ejecutar el Contenedor
1. Una vez construida la imagen, ejecuta el contenedor con el siguiente comando:
    docker-compose up
    Este comando iniciará el servidor que servirá la aplicación estática.

### Paso 3: Abrir la Aplicación
    Abre tu navegador web.
    En la barra de direcciones, escribe la siguiente URL:
    http://localhost:8080
    La aplicación se cargará automáticamente, mostrando el contenido de index.html.

### Paso 4: Detener el Contenedor
    Para detener el servidor, regresa a la terminal donde está corriendo el contenedor.
    Presiona CTRL+C para detener el proceso.


Si deseas eliminar completamente el contenedor, ejecuta el siguiente comando:
    docker-compose down


___________________________________________________________________________________________________
# **Despliegue de API con Kubernetes y Minikube**

Este archivo describe los pasos realizados para desplegar una API en un clúster de Kubernetes utilizando Minikube y Docker como driver. Se incluyen todos los comandos ejecutados, una explicación detallada de cada paso, y cómo verificar que todo funciona correctamente.

---

## **1. Instalación de herramientas necesarias**

### **1.1. Instalación de `kubectl`**
`kubectl` es la herramienta de línea de comandos utilizada para interactuar con clústeres de Kubernetes. Se utiliza para gestionar recursos, realizar despliegues, monitorear el estado del clúster, entre otros.

**Comandos para instalar `kubectl`:**
```bash
# Descargar el binario de kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Dar permisos de ejecución al binario
chmod +x kubectl

# Mover kubectl a /usr/local/bin para que sea accesible desde cualquier directorio
sudo mv kubectl /usr/local/bin/
```

**Verificar la instalación:**
```bash
kubectl version --client
```
Esto muestra la versión instalada de `kubectl`.

---

### **1.2. Instalación de Minikube**
Minikube permite ejecutar un clúster de Kubernetes local. Se utiliza para desarrollo y pruebas.

**Comandos para instalar Minikube:**
```bash
# Descargar el binario de Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Mover Minikube a /usr/local/bin y darle permisos de ejecución
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

**Verificar la instalación:**
```bash
minikube version
```
Esto muestra la versión instalada de Minikube.

---

## **2. Inicio del clúster Kubernetes**

Minikube necesita un driver para gestionar el clúster. En este caso, se utilizó Docker como driver.

**Comando para iniciar el clúster:**
```bash
minikube start --driver=docker
```

**Salida esperada:**
- Minikube descarga las imágenes necesarias para Kubernetes.
- Configura el clúster y habilita los complementos básicos.
- Indica que `kubectl` está configurado para usar el clúster `minikube`.

**Verificar el estado del clúster:**
```bash
minikube status
```

Esto confirma que el clúster y sus componentes están corriendo.

**Verificar los nodos del clúster:**
```bash
kubectl get nodes
```
Esto muestra que el nodo principal (control plane) está en estado `Ready`.

---

## **3. Construcción y subida de imágenes Docker**

Las imágenes Docker contienen el código y las dependencias necesarias para ejecutar la API. Se crearon dos imágenes: `busta2034/api:latest` y `busta2034/static-app:latest`.

### **3.1. Construcción de la imagen**
```bash
docker build -t busta2034/api:latest .
```

### **3.2. Subida de la imagen a Docker Hub**
```bash
docker login
docker push busta2034/api:latest
```

**Verificar en Docker Hub:** Confirma que la imagen `busta2034/api:latest` esté disponible.

---

## **4. Despliegue de la API en Kubernetes**

### **4.1. Crear el archivo `deployment.yaml`**
Este archivo define el despliegue de la API con 5 réplicas.

**Contenido de `deployment.yaml`:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 5
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: busta2034/api:latest
        ports:
        - containerPort: 8080
```

**Aplicar el despliegue:**
```bash
kubectl apply -f deployment.yaml
```

**Verificar que los pods están corriendo:**
```bash
kubectl get pods
```
Esto muestra 5 pods en estado `Running`.

---

### **4.2. Crear el archivo `service.yaml`**
El servicio expone las réplicas para que sean accesibles desde fuera del clúster.

**Contenido de `service.yaml`:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: NodePort
```

**Aplicar el servicio:**
```bash
kubectl apply -f service.yaml
```

**Obtener la URL del servicio:**
```bash
minikube service api-service --url
```

Esto genera una URL (por ejemplo, `http://127.0.0.1:34491`) para acceder a la API.

---

## **5. Verificación del despliegue**

### **5.1. Verificar que las réplicas están corriendo**
```bash
kubectl get deployment
```
Salida esperada:
```
NAME   READY   UP-TO-DATE   AVAILABLE   AGE
api    5/5     5            5           10m
```

### **5.2. Probar la API**
Accede a la URL generada por Minikube:
```bash
http://127.0.0.1:34491
```

Puedes usar herramientas como `curl` o Postman para enviar solicitudes a la API:
```bash
curl http://127.0.0.1:34491/endpoint
```

### **5.3. Verificar los logs de los pods**
```bash
kubectl logs <nombre-del-pod>
```
Esto muestra los logs de un pod específico.

---

## **6. Finalización**

### Detener Minikube:
```bash
minikube stop
```

### Reiniciar Minikube:
```bash
minikube start
```

### Eliminar el clúster (opcional):
```bash
minikube delete
```

---

## **Archivos en el repositorio**

1. `Dockerfile`: Define cómo construir la imagen Docker de la API.
2. `docker-compose.yml`: Define la configuracion del dontenedor
3. `deployment.yaml`: Configura el despliegue de la API con 5 réplicas.
4. `service.yaml`: Expone el servicio para acceder a la API.
5. `README.md`: Documentación del proceso.

---