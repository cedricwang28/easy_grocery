var myCart = {};

var myProducts = [];

// caculate the size of shoping cart 
Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


String.prototype.trunc = function (n, useWordBoundary) {
    if (this.length <= n) {
        return this;
    }
    var subString = this.substr(0, n - 1);
    return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + "&hellip;";
};

function get_splash(){
    $('.products').hide();
    $('.splash').show();

}

//get each product
function getProductView(item){
    var description = item.product_description.trunc (60, true);

    var content = ` 
                    <div>
                        <img src="${item.image_path}" alt="${item.product_name}">
                        
                        <h4 class="productName">${item.product_name}</h4>
                        <p class="productDes">${description}<p/>
                       
                        <h3>$${item.avg_price}</h3>
                        <div class="amount">
                            <div class="minus" data-id=${item.id}>-</div>
                            <div data-id=${item.id} class="quantity_${item.id}">1</div>
                            <div class="plus" data-id=${item.id}>+</div>
                        </div>
                        <button class="addToCart" data-id=${item.id}>Add to Cart</button>
                    </div>
    `;
    return content; 
}

//get certain department
function getProductsByDepartments(department_id){
    
    $('.splash').hide();
    
    var getProducts = $.ajax({
        url: "services/get_products_by_department.php",
        type: "POST",
        data:{
            department_id: department_id
        },
        dataType: "json"
    });

    getProducts.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getProducts)" +
            textStatus);
    });

    getProducts.done(function(data){
        // alert(data);
        var content="";
        // in php, it's throwing back a string, the error number
        if (data.error.id=="0") {
            $.each(data.products, function(i,item){
                // getProductView makes the output the same between get product by search and by department
                content+= getProductView(item);
            });
        }else{
            alert("wrong");
        }
        $('.products').show();
        $(".product_list").html(content);
        $('.successAdded').hide();
    });

}


//search
function getProductsBySearch(search){
    $('.splash').hide();
    $('.products').show();
    
    var getProducts = $.ajax({
        url: "services/get_products_by_search.php",
        type: "POST",
        data:{
            search: search
        },
        dataType: "json"
    });

    getProducts.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getProducts-Search)" +
            textStatus);
    });

    getProducts.done(function(data){
        
        var content="";
        // in php, it's throwing back a string, the error number
        if (data.error.id=="0") {
            $.each(data.products, function(i,item){
                // getProductView makes the output the same between get product by search and by department
                content+= getProductView(item);
                
            });
        }
        $(".product_list").html(content);
        $('.successAdded').hide();
    });

}

//get all departments
function get_departments(){
    $(".hide_all").hide();
    // alert("get_departments");

    var getDepartments = $.ajax({
        url: "services/get_departments.php",
        type: "POST",
        dataType: "json"
    });


    getDepartments.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getDepartments)" +
            textStatus);
    });

    getDepartments.done(function(data){
        // alert(data);
        var content="";
        // in php, it's throwing back a string, the error number
        if (data.error.id=="0") {
            $.each(data.departments, function(i,item){
                content+=`<li id="${item.name}" class="getProductsByDepartments cell" data-id="${item.id}"><a href="#">${item.name}</a></li>
                `;
            });
        }else{
            alert("wrong");
        }
        $(".department_list").html(content);
    });

    $("#splash").fadeIn();
}


function buildCart() {

    var sub_total = 0.00;
   
    var mainContent = '';
    var subTotalContent ='';

    

    // loop through cart to get the purchased item data
    $.each(myProducts, function (i, item) {
        console.log(item,'eaeaeaeach');
        var item_number = i + 1;
        var quantity = myCart[item.id];
        var extended_price = parseInt(quantity) * parseFloat(item.avg_price);
        var extendPrice = extended_price.toFixed(2);
        var avg_price = parseFloat(item.avg_price);
        var avgPrice = avg_price.toFixed(2);
        sub_total = sub_total + extended_price;

        mainContent += `<div class=" cartDetail">
                        <div class="cartImg">
                            <img src="${item.image_path}" alt="${item.product_name}">
                            <p class="itemName itemName2">${item.product_name}</p>
                        </div>
                        
                        <div class="numTagWrapper">
                        <div class="numTag">
                            <button class="cart_plus" data-id="${item.id}">+</button>
                            <p class="cart_quantity_${item.id}" data-id="${item.id}">${quantity}</p>
                            <button class="cart_minus" data-id="${item.id}">–</button>
                        </div>
                        <button class="remove cart_delete" data-id="${item.id}">✕ Remove</button>
                        </div>
                        <div class="itemPrice">$${avgPrice}</div>
                        <div class="itemPrice">$${extendPrice}</div>
                    </div>`;
        // $('.cart_wrapper').show();
    })

    // calculate the subtotal price
    var subTotal = sub_total.toFixed(2);
    var hst = subTotal * 0.13;
    var HST = hst.toFixed(2);
    var total = hst + sub_total;
    var TOTAL = total.toFixed(2);

    subTotalContent +=  `<div class="">
                            <div class=""></div>
                            <div class="">
                                Subtotal
                            </div>
                            <div class="alignRight">$${subTotal}</div>
                            
                        </div> 
                        <div class="">
                            <div class=""></div>
                            <div class="">
                                Hst.
                            </div>
                            <div class="alignRight">$${HST}</div>
                            
                        </div> 

                        <div class="totalPrice">
                            <div class=""></div>
                            <div class="total">
                                Total
                            </div>
                            <div class="total alignRight">$${TOTAL}</div>
                            
                        </div> `;
    
    // output content in cart-data section 
    
    $('.cart_data').html(content);
    $('.main-cart').html(mainContent);
    $('.subtotal').html(subTotalContent);

}

function getProductsByCart() {

    $('#cart').fadeIn();
    $('.overlay').show();

    var json = JSON.stringify(myCart);
    console.log(json,'jjjjj');

    var getCart = $.ajax({
        url: "services/get_products_by_cart.php",
        type: "POST",
        data: {
            json: json
        },
        dataType: "json"
    });

    

    getCart.done(function (data) {

        myProducts = data.products;

        buildCart();
    });
}











$(document).ready(function(){

    $('.checkout').click(function(){
        alert('Your Order is submitted');
    });

    $(".close").click(function(){
        $('#cart').hide();
        $('.overlay').hide();
    });
    
    get_departments();
    $('.supermarket ul').hide();
    /************************* get department lists on the menu once loaded **************************/
    $('.supermarket').click(function(){
        
        $('.supermarket ul').toggle();

    });
   


    /************************** fill in splash page when click on the logo **************************/
    $('.logo').click(function(){
        get_splash();
    });

    $('.bar').click(function(){
        $('.service').toggle();
    });

    /************************* fill in products page when by departments or by search **************************/

    $(document).on('click',"body .getProductsByDepartments", function(e){
        var department_id = $(this).attr("data-id");
        var catTitle = $(this).attr('id');
        $('.productTitle').text(catTitle);
        $('.catTitle').removeClass('searchResults');
        getProductsByDepartments(department_id);  
    });

    // for return back what we type in, we use keyup function 
    // document.querySelectorAll('.searchText').forEach((search) => {
    //     search.addEventListener('keyup', function(){
    //         var search = $(this).val();
    //         console.log(search);
    //         $('.catTitle').text(`Search Results Ror "${search}"`);
    //         $('.catTitle').addClass('searchResults');
    //         getProductsBySearch(search);
    //     })
    
    // });
    let search;

    document.querySelector('.search').addEventListener('click',function(){
        search = document.querySelector('.searchText').value;
        getProductsBySearch(search);
        $('.productTitle').text(`Search Results for "${search}"`);
        document.querySelector('.searchText').value = '';
    });

    document.querySelector('.searchText').addEventListener('keyup',function(e){
        search = document.querySelector('.searchText').value;

        if(e.keyCode == 13){
            getProductsBySearch(search);
            $('.productTitle').text(`Search Results for "${search}"`); 
            document.querySelector('.searchText').value = '';
        }
    });

    /************************* clicking plus, minus, addtocart on the products page **************************/
    $(document).on('click',"body .plus", function(){
        var product_id = $(this).attr("data-id");
        // alert(product_id);
        var quantity = parseInt($('.quantity_'+ product_id).html());
        ++ quantity;
        $(".quantity_" + product_id).html(quantity);
    });


    $(document).on('click',"body .minus", function(){
        var product_id = $(this).attr("data-id");
        // alert(product_id);
        var quantity = parseInt($('.quantity_'+ product_id).html());
        // minus minus sign should be placed at the beginning 
        -- quantity;
        if (quantity<1) {
            quantity = 1;
        }
        $(".quantity_" + product_id).html(quantity);
    });

    $(document).on('click',"body .addToCart", function(){
        var product_id = $(this).attr("data-id");
        
        var quantity = parseInt($('.quantity_'+ product_id).html());
            
        if (myCart[product_id] != undefined) {
            var currentValue = myCart[product_id];
            myCart[product_id] = parseInt(quantity) + parseInt(currentValue);
        } else {
            myCart[product_id] = quantity;
        }

        console.table(myCart,"cart");

        var size = Object.size(myCart);
        $('.cartCircle').html(size);
        $(`#${product_id}`).show();
    });

    /************************* fill in cart page when clicking on the shopping cart icon **************************/

    $('.shoppingCart, .cartCircle').click(
        function(){
           
            getProductsByCart();
            $('.cart-section').show();
        }
    )

    /************************* clicking plus, minus, addtocart on the cart page **************************/
    $(document).on("click", "body .cart_plus", function () {
        //alert("cart plus");
        var product_id = $(this).attr("data-id");
        var quantity = parseInt(myCart[product_id] + 1);
        myCart[product_id] = quantity;
        //$(".cart_quantity_" + product_id).html(quantity);
        buildCart();
    });

    $(document).on("click", "body .cart_minus", function () {

        var product_id = $(this).attr("data-id");
        var quantity = parseInt(myCart[product_id] - 1);
        if (quantity < 1) {
            quantity = 1;
        }
        myCart[product_id] = quantity;
        buildCart();
    });

    $(document).on("click", "body .cart_delete", function () {
        var product_id = $(this).attr("data-id");
        delete myCart[product_id];
        var size = Object.size(myCart);
        
        $(".cartCircle").html(size);
        var deleteItem;
        $.each(myProducts, function (i, item) {
            if (item.id == product_id) {
                deleteItem = i;
            }
        });
        if (deleteItem != undefined) {
            myProducts.splice(deleteItem, 1);
        }
        if (size === 0) {
            buildCart();
        } else {
            buildCart();
        }
    });

    /************************* clicking checkout button on the cart page **************************/

    $(document).on("click", "body .checkOutBtn", function () {
        // $(".cart-wrapper").removeClass('is-active');
        $(".cart-section").hide();
        $(".login-wrapper").show();
        $('.hideAll').hide();
        $(".login-section").show();
        // $(".hide_all").hide();
        $(".loginOption").fadeIn();
    });

    /************************* on the login section **************************/

    //login an existed account

    $(document).on("click", "body #login", function () {
        $(".hideAll").hide();
        $(".login").show();
    });


    $(document).on("click", "body #loginOK", function () {
        //alert("Please Please More sir!");
        $("#loginForm").submit();
    });


    $("#loginForm").on('submit', function (e) {

        e.preventDefault();

        let validate = false;

        /*
        let message = "";

        if ($("#genre").val() == "") {
            validate = true;
            message = `Please select a Genre
            `;
            $("#genre").focus();
        }

        if ($("#name").val() == "") {
            validate = true;
            message += `Please Enter a Name.
            `;
            $("#name").focus();
        }
        */

        if (validate) {
            alert(message);
        } else {

            $.ajax({
                type: 'POST',
                url: "services/login_account.php",
                data: new FormData(this),
                dataType: "json",
                contentType: false,
                cache: false,
                processData: false,

                beforeSend: function () {
                    //alert("Fading screen");
                    $('#oginOK').attr("disabled", "disabled");
                    $('#loginForm').css("opacity", "0.5");
                },

                success: function (data) {
                    //alert("DONE: "+data);


                    alert("USER ID: " + data.ea_user_id);

                    if (data.error.id == "0" && data.ea_user_id != "-1") {
                        // success
                        $('.login').hide();
                        $("#billing_name_first").val(data.billing_name_first);
                        $("#billing_name_last").val(data.billing_name_last);
                        $('.shippingAndBilling').show();
                    } else {
                        alert(data.error.message);
                    }

                    $('#loginForm').css("opacity", "");
                    $("#loginOK").removeAttr("disabled");
                }
            });

        }
    });

    // signout as guest
    $(document).on("click", "body #guest", function () {
        $(".hideAll").hide();
        $(".shippingAndBilling").show();
    });

    // create account

    $(document).on("click", "body #createAccount", function () {
        $(".hideAll").hide();
        $(".createAccount").show();
    });

    $(document).on("click", "body #ca_loginOK", function () {
        //alert("Please Please More sir!");
        $("#createAccountForm").submit();
    });

    $("#createAccountForm").on('submit', function (e) {

        e.preventDefault();

        let validate = false;

        /*
        let message = "";

        if ($("#genre").val() == "") {
            validate = true;
            message = `Please select a Genre
            `;
            $("#genre").focus();
        }

        if ($("#name").val() == "") {
            validate = true;
            message += `Please Enter a Name.
            `;
            $("#name").focus();
        }
        */
        if (validate) {
            alert(message);
        } else {
            $.ajax({
                type: 'POST',
                url: "services/create_account.php",
                data: new FormData(this),
                dataType: "json",
                contentType: false,
                cache: false,
                processData: false,

                beforeSend: function () {
                    //alert("Fading screen");
                    $('#ca_loginOK').attr("disabled", "disabled");
                    $('#createAccountForm').css("opacity", "0.5");
                },

                success: function (data) {
                    //alert("DONE: "+data);

                    alert(data.error.message);
                    alert("USER ID: " + data.user_id);

                    $('#createAccountForm').css("opacity", "");
                    $("#ca_loginOK").removeAttr("disabled");
                }
            });

        }
    });

});

