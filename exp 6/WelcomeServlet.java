import java.io.IOException;
import java.io.PrintWriter;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/welcome")
public class WelcomeServlet extends HttpServlet {

protected void doGet(HttpServletRequest request, HttpServletResponse response)
throws ServletException, IOException {

response.setContentType("text/html");

PrintWriter out = response.getWriter();

HttpSession session = request.getSession(false);

String user = (String) session.getAttribute("username");

out.println("<html>");
out.println("<head>");

out.println("<style>");

out.println("body{");
out.println("margin:0;");
out.println("font-family:Arial;");
out.println("background: linear-gradient(135deg,#667eea,#764ba2,#ff9966);");
out.println("height:100vh;");
out.println("display:flex;");
out.println("justify-content:center;");
out.println("align-items:center;");
out.println("}");

out.println(".card{");
out.println("background:white;");
out.println("padding:30px;");
out.println("border-radius:15px;");
out.println("text-align:center;");
out.println("box-shadow:0px 0px 20px rgba(0,0,0,0.3);");
out.println("width:350px;");
out.println("}");

out.println("img{");
out.println("width:200px;");
out.println("border-radius:10px;");
out.println("margin-top:10px;");
out.println("}");

out.println("a{");
out.println("display:inline-block;");
out.println("margin-top:20px;");
out.println("padding:10px 20px;");
out.println("background:#ff4b5c;");
out.println("color:white;");
out.println("text-decoration:none;");
out.println("border-radius:8px;");
out.println("}");

out.println("a:hover{");
out.println("background:#e63946;");
out.println("}");

out.println("</style>");

out.println("</head>");

out.println("<body>");

out.println("<div class='card'>");

out.println("<h1>Welcome " + user + "</h1>");
out.println("<h3>Login Successful</h3>");

out.println("<img src='admin.jpg'>");

out.println("<br>");

out.println("<a href='logout'>Logout</a>");

out.println("</div>");

out.println("</body>");
out.println("</html>");

}
}