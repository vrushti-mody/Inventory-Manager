$(document).ready(function () {
    var addButton = $('.add_button') //Add button selector
    var wrapper = $('.field_wrapper') //Input field wrapper
  
    //Once add button is clicked
    $(addButton).click(function (e) {
      //Check maximum number of input fields
      e.preventDefault()
  
      $(wrapper).append(
        `<div>
          <a href="#" class="remove_field" style="text-decoration:none;">❌</a>
			<div class="form-group col-md-6">
				<label for="inputState">Item</label>
					<select id="item" name="item=[]" class="form-control">
          <option >Choose...</option>
          <% for (i=0;i<items.length; i++){%>
            <option ><%- items[i].itemname %></option>
          <% } %>
          </select>
			</div>
		    <div class="form-group col-md-6">
				<label for="inputZip">Quantity</label>
				<input type="number" class="form-control" name="quantity[]" id="quantity">
            </div>
        </div>`
      )
    })
  
    //Once remove button is clicked
    $(wrapper).on('click', '.remove_field', function (e) {
      e.preventDefault()
      $(this).parent('div').remove() //Remove field html
    })

})