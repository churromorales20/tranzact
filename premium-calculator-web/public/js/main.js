
class PremiumCalculator {
  constructor() {
    this.init();
  }

  init() {
    $(document).ready(() => {
      this.attachEventHandlers();
    });
  }

  attachEventHandlers() {
    const today = new Date().toISOString().split('T')[0];
    $('#dob').attr('max', today);
    $('#dob').on('change', (event) => {
      const age = this.calculateAge($(event.target).val());
      $('#age_container').text(age)
    });

    $('#_premium_form_').on('submit', (event) => {
      event.preventDefault();

      if (this.validateForm()) {
        this.sendForm();
      }
    });
  }

  validateForm () {
    const dobField = $('#dob');
    const stateField = $('#state');
    const planField = $('#plan_selector');
    let valid = true;

    if (!this.isValidDate(dobField.val())) {
      dobField.addClass('error-field');
      valid = false;
    } else {
      dobField.removeClass('error-field');
    }
    
    if (!stateField.val()) {
      stateField.addClass('error-field');
      valid = false
    } else {
      stateField.removeClass('error-field');
    }

    if (!planField.val()) {
      planField.addClass('error-field')
      valid = false;
    } else {
      planField.removeClass('error-field');
    }

    return valid;
  }

  sendForm () {
    $('#_caculate_btn_').prop('disabled', true);
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'http://localhost:3000/calculate/premium', // URL del servidor que procesará la solicitud
      data: JSON.stringify({
        dateOfBirth: $('#dob').val(),
        state: $('#state').val(),
        age: parseInt($('#age_container').text()),
        plan: $('#plan_selector').val()
      }),
      success: function (response) {
        if (response.options.length > 0) {
          $('#_premiun_prices_results_').text(JSON.stringify(response.options));
          $('#_premiun_prices_results_').show();
          $('#_premiun_prices_no_results_').hide();
        } else {
          $('#_premiun_prices_results_').hide();
          $('#_premiun_prices_no_results_').show();
        }

        $('#_premiun_prices_container_').fadeIn('fast');
      },
      error: function (xhr, status, error) {
        // Manejar errores de la solicitud
        console.error(xhr, status, error);
        $('#result').html('Error: ' + error);
      },
      complete: function (xhr, status) {
        $('#_caculate_btn_').prop('disabled', false);
      }

    });
  }

  isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;
    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false;

    return d.toISOString().slice(0, 10) === dateString;
  }

  calculateAge(dateOfBirth){
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    try {
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      const dayDifference = today.getDate() - birthDate.getDate();

      // Check if the birth date has not occurred yet this year
      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
      }
      
      return `${age} years`;
    } catch (error) {
      console.log(error);
      return 'Select your date of birth'; 
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PremiumCalculator();
});
