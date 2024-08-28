$(function () {
    const form = $('#demo-form');
    
    window.Parsley.addValidator('palindrome', {
        validateString: function (value: string): boolean {
            return value.split('').reverse().join('') === value;
        },
        messages: {
            en: 'This string is not a palindrome.'
        }
    });

    window.Parsley.addValidator('cardNumberRequired', {
        validateString: function (value) {
            const selectedCard = $('input[name="card"]:checked').val();
            if (selectedCard) {
                return value.trim() !== '';
            }
            return true; 
        },
    });

    $('input[name="card"]').on('change', function () {
        if ($('#creditCard').is(':checked')) {
            $('#creditCardDetails').show();
            $('#debitCardDetails').hide();
            $('#creditCardNumber').attr('data-parsley-card-number-required', true);
            $('#creditCardNumber').attr('required', true);
            $('#debitCardNumber').removeAttr('data-parsley-card-number-required');
            $('#debitCardNumber').removeAttr('required');
        } else if ($('#debitCard').is(':checked')) {
            $('#debitCardDetails').show();
            $('#creditCardDetails').hide();
            $('#debitCardNumber').attr('data-parsley-card-number-required', true);
            $('#debitCardNumber').attr('required', true);
            $('#creditCardNumber').removeAttr('data-parsley-card-number-required');
            $('#creditCardNumber').removeAttr('required');
        } else {
            $('#creditCardDetails').hide();
            $('#debitCardDetails').hide();
            $('#creditCardNumber').removeAttr('data-parsley-card-number-required');
            $('#creditCardNumber').removeAttr('required');
            $('#debitCardNumber').removeAttr('data-parsley-card-number-required');
            $('#debitCardNumber').removeAttr('required');
        }
    });

    const parsleyFormInstance = form.parsley({
        errorsContainer: function (ParsleyField: any): any {
            const container = ParsleyField.$element.prevAll('.error-container').first();
            console.log('Error container for', ParsleyField.$element.attr('name'), container.length > 0 ? 'found' : 'not found');
            return container;
        }
    });

    parsleyFormInstance.on('form:validate', function (formInstance: any) {
        const errorSummaryDiv = $('#error-summary');
        errorSummaryDiv.empty(); 
       
        if (formInstance.isValid()) {
            $('.bs-callout-warning').addClass('hidden');
            $('.bs-callout-info').removeClass('hidden');
            errorSummaryDiv.hide();
            alert('Everything seems to be ok :)');
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
            errorSummaryDiv.show();

            const errors: string[] = [];
            formInstance.fields.forEach(function (field: any) {
                if (!field.isValid()) {
                    const fieldName = $(field.$element).closest('div').prev().text().replace(':', '');
                    errors.push(`<strong>${fieldName}:</strong> ${field.getErrorsMessages().join('; ')}`);
                }
            });
            errorSummaryDiv.html(errors.join('<br>'));
        }
        return true; 
    });


    const usedEmails = ['test@example.com', 'john.doe@example.com', 'jane.doe@example.com'];

    parsleyFormInstance.on('form:submit', function (formInstance: any) {
        formInstance.submitEvent.preventDefault();

        const emailField = parsleyFormInstance.fields.find(function (field: any) {
            return $(field.$element).attr('name') === 'email';
        });
        const emailValue = emailField.$element.val();

        setTimeout(function () {
            if (usedEmails.includes(emailValue)) {
                emailField.addError('email', { message: 'This email is already in use.' });
                alert('This email is already in use. Please use a different email.');
            } else {
                alert('Form submitted successfully!');
                form[0].reset();
                parsleyFormInstance.reset();
            }
        }, 500);
        return false;
    });
});
