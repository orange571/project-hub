# project-hub
Use this command to start up mongodb
 mongod --bind_ip=$IP --nojournal
 
             <!-- 
         <div class="well">
                <div class="text-right">
                    <a class="btn btn-success" href="/announcements/<%=// announcement._id %>/comments/new">Add New Comment</a>
                </div>
                <hr>
           //     <%// announcement.comments.forEach(function(comment){ %>
               //     <div class="row">
              //          <div class="col-md-12">
               //             <strong><%= //comment.author.username %></strong>
                            <span class="pull-right">10 days ago</span>
                            <p>
               //                 <%=// comment.text %> 
                            </p>
             //           //<% //if(currentUser && comment.author.id.equals(currentUser._id)){ %>
              //              <a class="btn btn-xs btn-warning" 
             //                  href="/announcements/<%=//announcement._id %>/comments/<%=//comment._id %>/edit">Edit</a>
                            <form id="delete-form" action="/announcements/<%=//announcement._id %>/comments/<%=//comment._id %>?_method=DELETE" method="POST">
                                <input type="submit" class="btn btn-xs btn-danger" value="Delete">
                            </form>
                        <% //} %>
                        </div>
                    </div>
                <% //}) %>
            </div>-->