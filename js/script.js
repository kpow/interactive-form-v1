$( document ).ready( () => {
    console.log( "ready!" );

    // line up a bunch of elements as jquery objects can amange here if we change html
    const $nameElement = $('#name'),
          $emailElement = $('#mail'),
          $titleElement = $('#title'),
          $designElement = $('#design')
          $colorElement = $('#color'),
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
          $zipcodeElement = $('#zip')

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

    // initial setup      
    $nameElement.focus()
    $otherElement.hide()
    $paypalElement.hide()
    $bitcoinElement.hide()
    $otherElement.hide()
    $otherLabel.hide()
    $colorOptions.each(function() {$(this).prop('hidden', 'hidden');})
    $colorElement.prepend('<option value="" disabled selected hidden>Please select a T-shirt theme</option>')
    $activityElement.append('<div class="total-price"></div>')

    // validation functions
    const isNameValid = () => /^(?!\s*$).+/.test($nameElement.val())

    const isEmailValid = () =>{
        const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return regEx.test($emailElement.val())
    }

    const isActivitiesValid = () =>{
        let hasActivity = false
        $activityCheckboxes.each((i)=>{
          if($($activityCheckboxes[i]).is(':checked')) hasActivity = true
        })
        return hasActivity
    }

    const isCreditCardValid = () =>{
        const regEx = /^\d{4}([ \-]?)((\d{6}\1?\d{5})|(\d{4}\1?\d{4}\1?\d{4}))$/gm
        return regEx.test($ccElement.val())
    }

    const isZipCodeValid = () =>{
        const regEx = /^\d{5}(?:[-\s]\d{4})?$/
        return regEx.test($zipcodeElement.val())
    }

    const isCVVValid = () =>{
        const regEx = /^\d{3}?/
        return regEx.test($cvvElement.val())
    }

    // this function presednt error messaging
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
            // check to see if error is up already
            if(!$('.'+elementID+'-error').length){
                // if not add element style and presesnt error message
                $element.addClass('is-error')
                $('<div class="error-message '+$element.attr('id')+'-error">'+errorMessage+'</div>')
                 .insertAfter($element)
            }
        }
    }

    // event handlers

    // I did this event handler before I read the pdf, 
    // but it seems to work correctly and the code doesnt look to wonky
    $designElement.on('change', function(e){
        const targetValue =  this.value
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
    });

    // I did this event handler before I read the pdf, 
    // but it seems to work correctly and the code doesnt look to wonky
    $activityElement.on('change', (e)=>{
        // reset price
        totalPrice = 0;
        // run validation and apply error class if false
        isActivitiesValid() ? toggleError($activityElement, 'remove') : toggleError($activityElement, 'add') 

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

    $nameElement.on('keyup', ()=>{
         // run validation and apply error class if false
        isNameValid() ? toggleError($nameElement, 'remove') : toggleError($nameElement, 'add')
    })

    $ccElement.on('keyup', ()=>{
        // run validation and apply error class if false
        isCreditCardValid() ? toggleError($ccElement, 'remove') : toggleError($ccElement, 'add')
    })

    $emailElement.on('keyup', ()=>{
         // run validation and apply error class if false
        isEmailValid() ? toggleError($emailElement, 'remove') : toggleError($emailElement, 'add')
    })

    $zipcodeElement.on('keyup', ()=>{
        // run validation and apply error class if false
        isZipCodeValid() ? toggleError($zipcodeElement, 'remove') : toggleError($zipcodeElement, 'add')
    })

   $cvvElement.on('keyup', ()=>{
        // run validation and apply error class if false
        isCVVValid() ? toggleError($cvvElement, 'remove') : toggleError($cvvElement, 'add')
    })

});