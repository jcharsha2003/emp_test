### dot env file belongs to server folder MONGO_USERNAME=myusername
### MONGO_PASSWORD=mypassword
### MONGO_DBNAME=mydatabase
### MONGO_CLUSTER=mycluster
### this is private folders for making your job easier i have provided you the details. 
### How to Launch with docker ? 
### in terminal command: git clone repositry-link
### open you system docker daemon or docker desktop to store the container
### Step-by-Step Guide to Deploying a Container and Running it Using Docker

### 1. Build the Docker image:
#### docker-compose build
### This command will build the Docker image based on the instructions specified in your `Dockerfile` and `docker-compose.yaml` files. It will pull the necessary ### dependencies, set up the environment, and package your application into an image.

### 2. Start the container:
#### docker-compose down
#### docker-compose up
### This command will start the container based on the image you built. It will create and run the necessary services defined in your `docker-compose.yaml` file. The output will be displayed in the console, and you should see logs from your running application.

### 3. Access your application:
### Once the container is up and running, you can access your application. If you've exposed ports in your `docker-compose.yaml` file, you can access the application using the specified ports. For example, if you have mapped port `3000` for the client and port `5000` for the server, you can access them as follows:
### - Client application: Open your web browser and navigate to `http://localhost:3000`.
### - Server application: You can interact with the server application through API requests using tools like cURL, Postman, or even a web browser extension like REST Client.

### 4. Stop the container:
### To stop the running container, press `Ctrl + C` in the terminal where the container is running.

### 5. Remove the container:
### If you want to remove the container and clean up resources, run the following command:
#### docker-compose down
### This will stop and remove the containers defined in your `docker-compose.yaml` file.

### These steps should help you deploy and run your containerized MERN application using Docker.





### How to Launch with out docker ? 
### **Step 1** : Change current directory to client folder : cd client 
### **Step 2** : Split the terminal, to access the server current directory folder : cd server 
### **Step 3**: In First half of the terminal the current directory is client folder , install the packages: npm install 
### **Step 4**: Second half of the terminal the current directory is server folder : npm install 
### **Step 5**: In first terminal current directory is in client ,type command : npm start 
### **Step 6**: In second terminal current directory is server, we took http server as app.js ,type command: nodemon app.js 
# 8-)
### admin as default in data base username and password are given below
### **username**:chandu
### **passwword**:chandu
