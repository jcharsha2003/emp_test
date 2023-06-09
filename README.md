dot env file belongs to server folder DB_STRING=mongodb+srv://admin:admin@cluster0.g9nkiho.mongodb.net/?retryWrites=true&w=majority  this is private folders for making your job easier i have provided you the details. 
How to Launch? Step 1 : Change current directory to client folder : cd client 
Step 2 : Split the terminal to access the server current directory folder : cd server 
Step 3: In First half of the terminal we have to directory client folder , install the packages: npm install 
Step 4: Second half of the terminal should have : npm install 
Step 5: In first terminal where current directory is client you should give : npm start 
Step 6: In second terminal where current directory is server, we took http server as app.js : nodemon app.js 
