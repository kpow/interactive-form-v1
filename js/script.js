$( document ).ready( () => {
    console.log( "ready!" );

    // line up a bunch of elements as jquery objects can amange here if we change html
    const $nameElement = $('#name'),
          $emailElement = $('#mail'),
          $titleElement = $('#title'),
          $designElement = $('#design')
          $colorElement = $('#color'),
          $colorLabel = $('label[for="color"]'),
          $colorOptions = $('#color > option'),
          $otherElement = $('#other-title'),
          $otherLabel = $('label[for="other"]')
          $activityElement = $('#activities'),
          $activityCheckboxes = $('#activities input'),
          $paypalElement = $('.paypal'),
          $bitcoinElement = $('.bitcoin'),
          $paymentElement = $('#payment'),
          $ccElement = $('#cc_num'),
          $cvvElement = $('#cvv'),
          $zipcodeElement = $('#zip'),
          $submitButton = $('#submit')

    // error messages for validation
    const errorMessages = {
        name:"enter your name",
        mail:"enter your email address",
        activities:"choose an activity",
        cc_num:"enter a valid credit card",
        zip:"enter a valid zip code",
        cvv:"enter a valid cvv number"
    }

    // colors for matching design theme under t-shirt
    const punColors = ['cornflowerblue','darkslategrey','gold'],
          heartColors = ['tomato','steelblue','dimgrey']
    
    // variable for tracking price      
    let totalPrice = 0  
    // tracking cc state
    let ccActive = true;
    // tracking currently selected tshirt design theme
    let currentTheme = ''

    // initial setup      
    $nameElement.focus()
    $otherElement.hide()
    $paypalElement.hide()
    $bitcoinElement.hide()
    $otherElement.hide()
    $otherLabel.hide()
    $colorElement.hide()
    $colorLabel.hide()
    $($paymentElement.children()[1]).prop('selected', 'selected')
    $colorOptions.each(function() { $(this).prop('hidden', 'hidden') })
    $colorElement.prepend('<option value="" disabled selected hidden>Please select a T-shirt theme</option>')
    $activityElement.append('<div class="total-price"></div>')

    // validation functions
    const isNameValid = () =>{
        // quick regex test for any 1 character
        const valid = /^(?!\s*$).+/.test($nameElement.val())
        //conditional to set error state
        valid  ? toggleError($nameElement, 'remove') : toggleError($nameElement, 'add')
        return valid
    } 

    const isEmailValid = () =>{
        const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const valid = regEx.test($emailElement.val())
         //conditional to set error state
        valid ? toggleError($emailElement, 'remove') : toggleError($emailElement, 'add')
        return valid
    }

    const isActivitiesValid = () =>{
        let valid = false
        $activityCheckboxes.each((i)=>{
          if($($activityCheckboxes[i]).is(':checked')) valid = true
        })
         //conditional to set error state
        valid ? toggleError($activityElement, 'remove') : toggleError($activityElement, 'add') 
        return valid
    }

    const isCreditCardValid = () =>{
        // regex from http://emailregex.com/
        const regEx = /^\d{4}([ \-]?)((\d{6}\1?\d{5})|(\d{4}\1?\d{4}\1?\d{4}))$/gm
        const valid = regEx.test($ccElement.val())
         //conditional to set error state
        valid ? toggleError($ccElement, 'remove') : toggleError($ccElement, 'add')
        return valid
    }

    const isZipCodeValid = () =>{
        // checks for 5 and 9 digits zips
        const valid = /^\d{5}(?:[-\s]\d{4})?$/.test($zipcodeElement.val())
        // checking the state of the input and changing error message based on that
        if($zipcodeElement.val().length >= 1 && $zipcodeElement.val() < 5){
            errorMessages.zip = "zip code must be at least 5 characters"
        }else if($zipcodeElement.val().length < 1){
            errorMessages.zip = "enter a valid zip code"
        }
         //conditional to set error state
        valid ? toggleError($zipcodeElement, 'remove') : toggleError($zipcodeElement, 'add')
        return valid
    }

    const isCVVValid = () =>{  
        // test for 3 digits
        const valid = /^\d{3}?/.test($cvvElement.val())
         //conditional to set error state
        valid ? toggleError($cvvElement, 'remove') : toggleError($cvvElement, 'add')
        return valid
    }

    const validateForm = (e) => {
        // couple of vars to hold validation state
        let primary = false
        let payment = false

        // check the global elements
        isNameValid()
        isEmailValid()
        isActivitiesValid()

        // set primary if they return true
       if( isNameValid() &&
           isEmailValid() &&
            isActivitiesValid() ){
            primary = true
        }

        // check these if CC is active
        if(ccActive){
            isCreditCardValid()
            isZipCodeValid()
            isCVVValid()
            // if the validate true set payment state
            if(isCreditCardValid() && 
               isZipCodeValid() && 
               isCVVValid()) payment = true
        }
        // if they dont validate prevent the browser from submitting
        if(!ccActive && !primary) e.preventDefault()
        if(ccActive && !primary || !payment) e.preventDefault()
    }

    // this function present error messaging
    const toggleError = ($element, what) =>{
        // grab the id to create class and access error messages
        const elementID = $element.attr('id')
        // use the id from the element to match a key in error message object
        const errorMessage = errorMessages[elementID]
        // conditional to toggle between add and remove error state
        if(what === "remove"){
            // remove error class to element and remove message
            $element.removeClass('is-error')
            $('.'+elementID+'-error').remove()

        }else if(what === "add"){
            // remove any existing error
            $('.'+elementID+'-error').remove()
            // diplay error
            $element.addClass('is-error')
            $('<div class="error-message '+$element.attr('id')+'-error">'+errorMessage+'</div>')
            .insertAfter($element)
            
        }
    }

    // event handlers
    
    // I did this event handler before I read the pdf, 
    // but it seems to work correctly and the code doesnt look to wonky
    $designElement.on('change', function(e){
        const targetValue =  this.value
        
        // show the color select element
        $colorElement.show()
        $colorLabel.show()

        // loop through and set selections for each option
        $colorOptions.each(function() {
            const currentValue = $(this).val()
            $(this).prop('hidden', 'hidden')

            if(targetValue === 'js puns'){
                for(let i=0; i<punColors.length; i++){
                   if(punColors[i]===currentValue){
                        $(this).prop('hidden', false)
                    }
                }  
            }else if(targetValue === 'heart js'){
                for(let i=0; i<heartColors.length; i++){
                    if(heartColors[i]===currentValue){
                         $(this).prop('hidden', false)
                     }
                 } 
            }
        });
        // toggle the current theme variable which allows us to 
        // reset color option if we change themes
        if(targetValue != currentTheme){
            currentTheme = targetValue
            const whichOne = (currentTheme === 'js puns') ? punColors : heartColors
            $('#color > option[value="'+whichOne[0]+'"]').prop('selected','selected')
        }
    });

    // I did this event handler before I read the pdf, 
    // but it seems to work correctly and the code doesnt look to wonky
    $activityElement.on('change', (e)=>{
        // reset price because we calculate the entire thing each pass
        totalPrice = 0;
        // run validation and apply error class if false
        isActivitiesValid() 

        //loop through all activities
        $activityCheckboxes.each((i)=>{
            const $currentElement = $($activityCheckboxes[i])
            // if we match date/time we disable and but we dont disable the event target
            if($currentElement.attr('data-day-and-time') === $(e.target).attr('data-day-and-time')){
                if($(e.target).is(":checked")){
                    $currentElement.prop("disabled", true)
                    $(e.target).prop("disabled", false)
                }else{
                    $currentElement.prop("disabled", false)
                }
            }
        })
        // loop through and calculate cost
        $activityCheckboxes.each((i)=>{
            if($($activityCheckboxes[i]).is(":checked")){
                totalPrice += parseInt($($activityCheckboxes[i]).attr('data-cost'));
            }
        })
        // display cost
        $('.total-price').html('Total: $'+totalPrice)

    })

    // toggle payment types
    $paymentElement.on('change', (e)=>{
        // turn them all off
        $('.credit-card, .bitcoin, .paypal').hide()
        // toggle ccActive var for validation inclusion
        e.target.value === 'credit-card' ? ccActive = true : ccActive = false
        // turn the right one on
        $('.'+e.target.value).show()
    })

    // toggle other for job role element
    $titleElement.on('change', (e)=>{
        if(e.target.value === "other"){
            $otherElement.show()
            $otherLabel.show()
        }else{
            $otherElement.hide()
            $otherLabel.hide()
        }
    })

    $nameElement.on('keyup', ()=> isNameValid() )
    $ccElement.on('keyup', ()=> isCreditCardValid())
    $emailElement.on('keyup', ()=> isEmailValid())
    $zipcodeElement.on('keyup', ()=> isZipCodeValid())
    $cvvElement.on('keyup', ()=> isCVVValid())
    $submitButton.on('click', (e) => validateForm(e))

});