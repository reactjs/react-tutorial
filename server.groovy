// Groovy/Jetty Server Script for React Tutorial
// Implementation analogous to the Ruby version provided
//
// Copyright: 2016, Jochen Eddelbüttel
// MIT License applies
//
@Grab('javax.servlet:javax.servlet-api:3.1.0')
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Grab('org.eclipse.jetty.aggregate:jetty-servlet:8.1.22.v20160922')
import org.eclipse.jetty.server.Server
import org.eclipse.jetty.server.handler.DefaultHandler
import org.eclipse.jetty.server.handler.HandlerList
import org.eclipse.jetty.server.handler.ResourceHandler
import org.eclipse.jetty.servlet.ServletHandler

import groovy.json.JsonSlurper
import groovy.json.JsonOutput

def port = ( System.getenv("PORT") ?: '3000' ) as Integer
def server = new Server(port)

def servletHandler = new ServletHandler()
servletHandler.addServletWithMapping(CommentsServlet.class, "/api/comments")

def handlerList = new HandlerList()
handlerList.addHandler(servletHandler)
handlerList.addHandler(new ResourceHandler([
    directoriesListed:  false,
    welcomeFiles:       [ "index.html" ] as String[],
    resourceBase:       "./public"
]))
handlerList.addHandler(new DefaultHandler())

server.handler = handlerList
server.start()
server.join()

class CommentsServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) {

        def commentsFile = new File("comments.json")
        def comments = new JsonSlurper().parse(commentsFile, "UTF-8")

        if (req.method == "POST") {
            def comment = [ id: new Date().time.toString() ]
            req.parameterMap.each { key, values ->
                if (key != "id" && values) comment[key] = values[0]
            }
            comments << comment
            commentsFile.setText(JsonOutput.prettyPrint(JsonOutput.toJson(comments)), "UTF-8")
        }
        resp.contentType = "application/json;charset=UTF-8"
        resp.addHeader('Cache-Control','no-cache')
        resp.addHeader('Access-Control-Allow-Origin', '*')
        resp.outputStream.withWriter("UTF-8") { it.write(JsonOutput.toJson(comments)) }
    }

}
