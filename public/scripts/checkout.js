$(function(){
    var checkoutItemList = [];
    $(".add-to-cart").on("click", function (){
        var itemId = $(this)[0].dataset.itemId;
        var itemName = $(this)[0].dataset.itemName;
        addToCart(itemId, itemName);
    });
    
    function addToCart(itemId, itemName) {
        $("#checkout-alert").text("");
        var itemObject = {name:itemName, id:itemId}
        if(checkIfNotInCart(itemId)) {
            checkoutItemList.push(itemObject);
            printItemList();
            console.log(checkoutItemList);
        }else {
            console.log("item is already in cart");
            console.log(checkoutItemList);
            $("#checkout-alert").text("item is already in cart");
        }
    }
    
    function checkIfNotInCart (itemId) {
        var result = true;
        checkoutItemList.forEach(function(item){
                        console.log("checking");
            console.log(itemId);
            console.log(item.id);
            console.log(typeof itemId);
            console.log(typeof item.id);
            if(item.id === itemId) {
                console.log("They are the same!");
                result = false;
            }

        });
        return result;
    }
    
    function removeFromItemList () {
        $("#checkout-alert").text("");
        var itemId = $(this).closest('.cart-item')[0].dataset.itemId;
        console.log(itemId);
        console.log("test");
        checkoutItemList.forEach(function(item, index){
            if(item.id === itemId){
                checkoutItemList.splice(index, 1);
                printItemList();
            };
        })
        
    }
    
    function printItemList () {
        var msg = "";
        checkoutItemList.forEach(function(item){
           msg +=  "<div class='cart-item' data-item-id="+item.id+">";
           msg += item.name + " - " + item.id ;
           msg += "<button class='ui mini red button remove-from-cart'> Remove From Cart </button>";
           msg += "</div>"
        });
        $("#view-cart").html(msg);
    }
    
    $("#view-cart").on("click", ".remove-from-cart", function(){
        var itemId = $(this).closest('.cart-item')[0].dataset.itemId;
        console.log(itemId);
        console.log("test");
        checkoutItemList.forEach(function(item, index){
            if(item.id === itemId){
                checkoutItemList.splice(index, 1);
                printItemList();
            };
        })
    });
    
    $("#checkout-btn").on("click", function(event){
         event.preventDefault();
        var checkoutListString = JSON.stringify(checkoutItemList);
        $.ajax({
            url: '/library/verifyuser/' + userId, 
            type: 'POST', 
            contentType: 'application/json', 
            data: checkoutListString,
            success: function (data) {
                console.log(data);
                $("#checkout-alert").text(JSON.stringify(data));
            }
        });
    });
    
    $("#manual-add-to-cart").on("submit", function(event){
        event.preventDefault();
        var itemId = $("#manual-input").val();
        console.log(itemId);
        $.ajax({
            url: '/library/finditem', 
            type: 'GET', 
            contentType: 'application/json', 
            data: {
                "itemId": itemId
            },
            success: function(data){
                console.log(data);
                if (data === "No item matched id") {
                    $("#checkout-alert").text(data);
                } else if(data.name !== undefined) {
                    addToCart(data._id, data.name);
                } else {
                    $("#checkout-alert").text(data);
                }

            }
        });
    })
});