$(function(){
    function validateAnnouncement(event) {
        if($(".ui.form.announcement + .ui.message").length) {
            $(".ui.form.announcement + .ui.message").remove();
        }
        var x = $(".ui.form.announcement input[type='text'").val();
        var y = $(".ui.form.announcement textarea").val();
        x = x.replace(/^\s+/, '').replace(/\s+$/, '');
        y = y.replace(/^\s+/, '').replace(/\s+$/, '');
        if(x === "" || y === "") {
            $(".ui.form.announcement").after("<div class='ui red message'>One or more fields are empty</div>");
            event.preventDefault();
            return false;
        } else {
            return true;
        }
    }
    
    function validateComment(event) {
        if($(".ui.form.comment + .ui.message").length) {
            $(".ui.form.comment + .ui.message").remove();
        }
        var y = $(".ui.form.comment textarea").val();
        y = y.replace(/^\s+/, '').replace(/\s+$/, '');
        if(y === "") {
            $(".ui.form.comment").after("<div class='ui red message'>Field is empty</div>");
            event.preventDefault();
            return false;
        } else {
            return true;
        }
    }
    
    $(".ui.form.announcement").on("submit", function(event){
       return validateAnnouncement(event); 
    });
    
    $(".ui.form.comment").on("submit", function(event){
       return validateComment(event); 
    });
});