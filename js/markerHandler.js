var user_id = null;

AFRAME.registerComponent("markerhandler",{
  init: async function(){

      if (user_id === null) {
          this.askUserId()
      }
    
      //get the dishes collection from firestore database
      var toys = await this.getAllToys();

      this.el.addEventListener("markerFound",()=>{
          console.log("marker is found")
          this.handleMarkerFound();
      })

      this.el.addEventListener("markerLost",()=>{
          console.log("marker is lost");
          this.handleMarkerLost();
      });
  },
  askUserId: function () {
      swal({
        icon: "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png",
        title: "Would You like to see our toys?",
        text: "Choose your user id",
        content: {
          element: "input",
          attributes: {
            placeholder: "Type your user id",
            type: "number",
            min: 1
          }
        },
        closeOnClickOutside: false,
      }).then((userChoice) => {
        user_id = userChoice
      })
    },
  handleMarkerFound: function(){
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var orderButton = document.getElementById("order-button");
    var orderSummaryButton = document.getElementById("order-summary-button");
    var paymentButton = document.getElementById("pay-button")
    var ratingButton = document.getElementById("rating-button");

    if(user_id != null){
        // Handling Click Events
        orderButton.addEventListener("click",()=>{
            swal({
                icon: "https://i.imgur.com/4NZ6uLY.jpg",
                title: "Thanks For Your Order!",
                text: " ",
                timer: 2000,
                buttons: false
            });
        });

        orderSummaryButton.addEventListener("click",()=>{
            swal({
                icon: "warning",
                title: "Order Summary",
                text: "Work in Progress"
            });
            this.handleOrderSummary()
        });
        paymentButton.addEventListener("click", ()=>{
          this.handlePayment()
        })
        ratingButton.addEventListener("click", () => this.handleRatings(toy));
      }
  },
  handleMarkerLost:function(){
      var buttonDiv = document.getElementById("button-div")
      buttonDiv.style.display = "none"
  },
  getAllToys: async function(){
      return await firebase
      .firestore()
      .collection()
      .get()
      .then(snap => {
          return snap.docs.map(doc => doc.data)
      })
  },
  handleOrder: function(uid, toy){
      firebase
      .firestore()
      .collection("tables")
      .doc(uid)
      .get()
      .then(doc => {
        var details = doc.data()

        if(details["current_orders"][toy.id]){
          details["current_orders"][toy.id]["quantity"] +=1

          var currentQuantity =  details["current_orders"][toy.id]["quantity"]

          details["current_orders"][toy.id]["subtotal"] = currentQuantity * toy.price

        }else{
          details["current_orders"][toy.id] = {
            item : toy.name,
            price: toy.price,
            quantity:1,
            sub_total: toy.price*1
          }
        }

        details.total_bill += toy.price;

        // Updating Db
        firebase
        .firestore()
        .collection("users")
        .doc(doc.id)
        .update(details)

      })
    },
    handleOrderSummary: async function () {

      //Getting Table Number
      var userId;
      user_id <= 9 ? (userId = `T0${user_id}`) : `T${user_id}`;

      //Getting Order Summary from database
      var orderSummary = await this.getOrderSummary(userId);

      //Changing modal div visibility
      var modalDiv = document.getElementById("modal-div");
      modalDiv.style.display = "flex";

      //Get the table element
      var tableBodyTag = document.getElementById("bill-table-body");

      //Removing old tr(table row) data
      tableBodyTag.innerHTML = "";

      //Get the cuurent_orders key 
      var currentOrders = Object.keys(orderSummary.current_orders);

      currentOrders.map(i => {

        //Create table row
        var tr = document.createElement("tr");

        //Create table cells/columns for ITEM NAME, PRICE, QUANTITY & TOTAL PRICE
        var item = document.createElement("td");
        var price = document.createElement("td");
        var quantity = document.createElement("td");
        var subtotal = document.createElement("td");

        //Add HTML content 
        item.innerHTML = orderSummary.current_orders[i].item;

        price.innerHTML = "$" + orderSummary.current_orders[i].price;
        price.setAttribute("class", "text-center");

        quantity.innerHTML = orderSummary.current_orders[i].quantity;
        quantity.setAttribute("class", "text-center");

        subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
        subtotal.setAttribute("class", "text-center");

        //Append cells to the row
        tr.appendChild(item);
        tr.appendChild(price);
        tr.appendChild(quantity);
        tr.appendChild(subtotal);

        //Append row to the table
        tableBodyTag.appendChild(tr);
      });
    },
    handlePayment: function () {

      document.getElementById("modal-div").style.display="none"
      //get the tabke num  <9 --> 0
      var userId
      user_id <= 9? (userId = `T0${user_id}`) : (userId = `T${user_id}`)
      firebase.firestore().collection("users").doc(userId).update({
        current_orders:{},total_bill:0
      }).then(()=>{
        swal({
          icon:"success",
          title:"Thanks for your payment",
          text:"We are glad you liked our toy!",
          timer:2500,
          buttons:false
        })
      })
    },
    handleRatings: function(toy){
      // Close Modal
      document.getElementById("rating-modal-div").style.display = "flex";
      document.getElementById("rating-input").value = "0";

      var saveRatingButton = document.getElementById("save-rating-button");
      saveRatingButton.addEventListener("click", ()=>{
        document.getElementById("rating-modal-div").style.display = "none";
        var rating = document.getElementById("rating-input").value;

        firebase
        .firestore()
        .collection()
        .doc()
        .update({
          rating: rating
        })
        .then(()=>{
          swal({
            icon: "success",
            title: "Thanks For Rating!",
            text: "We Hope You Like The Toy !!",
            timer: 2500,
            buttons: false
          });
        });
      });
    }
})