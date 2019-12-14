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
          $activityElement = $('.activities'),
          $activityCheckboxes = $('.activities input'),
          $paypalElement = $('.paypal'),
          $bitcoinElement = $('.bitcoin'),
          $paymentElement = $('#payment')
    
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

    $nameElement.on('keyup', ()=>{
        isNameValid() ? $nameElement.removeClass('is-error') : $nameElement.addClass('is-error')
    })

    $emailElement.on('keyup', ()=>{
        isEmailValid() ? $emailElement.removeClass('is-error') : $emailElement.addClass('is-error')
    })

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
        
    }

    const isZipCodeValid = () =>{
        
    }

    const isCVVValid = () =>{
        
    }

    // event handlers

    // I did this event handler before I read the pdf, 
    // but it seems to work correctly and the code doesnt look to wonky
    $designElement.on('change', function(e){

        const punColors = ['cornflowerblue','darkslategrey','gold'],
              heartColors = ['tomato','steelblue','dimgrey'],
              targetValue =  this.value
        // loop through and set selections for each option
        $colorOptions.each(function() {
            const currentValue = $(this).val()
            $(this).prop('hidden', 'hidden');

            if(targetValue === 'js puns'){
                for(let i=0; i<punColors.length; i++){
                   if(punColors[i]===currentValue){
                        $(this).prop('hidden', false); 
                    }
                }  
            }else if(targetValue === 'heart js'){
                for(let i=0; i<heartColors.length; i++){
                    if(heartColors[i]===currentValue){
                         $(this).prop('hidden', false); 
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
        console.log(isActivitiesValid());

        //loop through all activities
        $activityCheckboxes.each((i)=>{
            const $currentElement = $($activityCheckboxes[i])
            // if we match date/time we disable and but we dont disable the event target
            if($currentElement.attr('data-day-and-time') === $(e.target).attr('data-day-and-time')){
                if($(e.target).is(":checked")){
                    $currentElement.prop("disabled", true);
                    $(e.target).prop("disabled", false);
                }else{
                    $currentElement.prop("disabled", false);
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
        const type = e.target.value
        // turn them all off
        $('.credit-card, .bitcoin, .paypal').hide()
        // turn the right one on
        $('.'+type).show();
    })
    // toggle other element
    $titleElement.on('change', (e)=>{
        const role = e.target.value;
        if(role==="other"){
            $otherElement.show()
            $otherLabel.show()
        }else{
            $otherElement.hide()
            $otherLabel.hide()
        }
    })

});