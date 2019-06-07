# :zap: buck-converter-spring :zap:
An interactive buck converter built with React.js, Bootstrap and Spring Boot.

You can start the application by running `./mvnw spring-boot:run` in the project's folder or downloading and running the packaged .jar-executable file (See [Releases](https://github.com/guitarhero17/buck-converter-spring/releases)).

Once the application is successfully started, navigate to http://localhost:8080 to see it in the browser.

Use the following credentials (username *password*): Han *Solo* and John *Snow*

Once logged-in, the username of the current user is displayed on the right top side inside of the navbar. By clicking on the arrow the user can log out of the application so that another user can log in.

## :bulb: How is it built?

Once `./mvnw spring-boot:run` is executed, the `npm install` command is executed, installing Node.js and NPM locally (independent of other possible installations on the user's system). After that, the specified modules defined in [package.json](./package.json) are installed and finally the `webpack` command is executed which compiles all the JavaScript code according to the instructions in [webpack.config.js](webpack.config.js).

See [pom.xml](pom.xml) for more details.

Server functionality (authentication, controller setup) is achieved using Spring Boot with an internal Tomcat application server.

## :computer: How to navigate the application?

Please click on the **Description** button under the electric circuit to find out more about the application's functionallity.

## :fire: Have fun buck-converting !
