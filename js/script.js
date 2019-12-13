$( document ).ready(function() {
    console.log( "ready!" );

    const $nameElement = $('#name'),
          $emailElement = $('#mail'),
          $titleElement = $('#title'),
          $designElement = $('#design')
          $colorElement = $('#color'),
          $colorOptions = $('#color > option'),
          $otherElement = $('#other'),
          $activityElement = $('.activities')
          $activityCheckboxes = $('.activities input');
        
    // initial setup      
    $nameElement.focus();
    $otherElement.hide();

    $colorOptions.each(function() {
        $(this).prop('hidden', 'hidden');
    });
    $colorElement.prepend('  <option value="" disabled selected hidden>Please select a T-shirt theme</option>')

    // event handlers
    $designElement.on('change', function(e){
        const punColors = ['cornflowerblue','darkslategrey','gold'],
              heartColors = ['tomato','steelblue','dimgrey']
        const targetValue =  this.value

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

    $activityElement.on('change', (e)=>{
       
        if($(e.target).attr('name') === 'all'){

            if ($(e.target).is(":checked")){
                $activityCheckboxes.each((i)=>{
                    if(i>0){
                        $($activityCheckboxes[i]).prop("disabled", true);
                    }
                })
            }else{
                $activityCheckboxes.each((i)=>{
                    $($activityCheckboxes[i]).prop("disabled", false);
                })
            }

        }else{

            $activityCheckboxes.each((i)=>{
                const $currentElement = $($activityCheckboxes[i])

                if($currentElement.attr('data-day-and-time') === $(e.target).attr('data-day-and-time')){
                    if($(e.target).is(":checked")){
                        $currentElement.prop("disabled", true);
                        $(e.target) .prop("disabled", false);
                    }else{
                        $currentElement.prop("disabled", false);
                    }
                }
            })

        }
    })

});