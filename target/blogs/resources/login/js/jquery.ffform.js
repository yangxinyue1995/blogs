﻿/***************************************************************************************************************/

/* Plugin: jQuery Contact Form FFForm
/* Author: Muhammad Shahbaz Saleem
/* URL: http://www.egrappler.com/ffform-free-jquery-contact-form-plugin-with-validations-amazing-css3-animation
/* License: http://www.egrappler.com/license

/****************************************************************************************************************/
(function ($) {
    $.fn.extend({ ffform: function (options) {

        /**********************************************
        field definition:
        {
            id: 'id of form element', 
            required: true/false,
            requiredMsg:'message for required field',
            type: 'email/text/alpha/custom',
            validate: true/false,
            msg: 'invalid input message',
            regExp: regular express for custom field validation
        }

        /**********************************************/
        var settings = $.extend({ 'fields': [], onSuccess: null, onFail: null, onValidate: null, submitButton: '', sendingText: 'Sending Messgage...', animation: 'flip', validationIndicator: '', successIndicator: '', errorIndicator: '' }, options); return this.each(function () {
            var form = $(this);
            var isValid = true;
            var validationResult;
            var successIndicator;
            var errorIndicator;
            var validationIndicator;
            init();
            function init() {
                if (!form.is('form')) { alert('No suitable element selected, formify can only be invoked with form element'); return; }
                if (settings.submitButton == '') { alert('No submit button specified'); return; }
                var serverFields = $('<input type="hidden" name="hid_dynamic"/>');
                var strFields = '';
                $(settings.fields).each(function () {
                    if (strFields == '')
                        strFields = $('#' + this.id).attr('name');
                    else
                        strFields += ',' + $('#' + this.id).attr('name');
                });
                serverFields.val(strFields);
                form.prepend(serverFields);
                successIndicator = $(settings.successIndicator).css({ display: 'none' });
                errorIndicator = $(settings.errorIndicator).css({ display: 'none' });
                validationIndicator = $(settings.validationIndicator).css({ display: 'none' });

                if (settings.animation == 'flip') {
                    var flipper = $('<div class="flip-container"><div class="flipper"><div class="front"></div><div class="back"></div></div></div>');
                    form.after(flipper);
                    form.appendTo(flipper.find('.front'));
                    flipper.find('.back').append('<span id="msg-close">Close</span>').append(validationIndicator).append(successIndicator).append(errorIndicator);
                }
                else {
                    form.after($('<div class="form-front"></div><div class="form-back"></div>'));
                    form.appendTo($('.form-front'));
                    $('.form-back').append('<span id="msg-close">Close</span>').append(validationIndicator).append(successIndicator).append(errorIndicator);

                    var front = $('.form-front');
                    var back = $('.form-back');

                    front.css({ position: 'relative', top: '0px', left: '0px', zIndex: 1 });
                    back.css({ position: 'relative', top: '0px', left: '0px', zIndex: 0, display: 'none' });
                }
                //shake effect for invalid fields 
                $('#msg-close').bind('click', function () {
                    setTimeout(function () {
                        $('.invalid').effect('shake');
                    }, 300);
                });

                $(settings.submitButton).click(function (e) {

                    successIndicator.css({ display: 'none' });
                    errorIndicator.css({ display: 'none' });
                    validationIndicator.css({ display: 'none' });

                    e.preventDefault();
                    e.stopImmediatePropagation();
                    validationResult = '<ul id="validation-list">';
                    validate();
                    if (!isValid) {
                        validationResult += '</ul>';
                        if (settings.onValidate != null) {
                            settings.onValidate(validationResult);
                        }
                        if (settings.animation == 'flip') {
                            $('.flip-container').addClass('flip');
                            $('#msg-close').click(function () {
                                $('.flip-container').removeClass('flip');
                            });
                        }
                        else if (settings.animation == 'fade') {
                            $('.form-front').css({ zIndex: 0 }).fadeOut('slow');
                            $('.form-back').css({ zIndex: 1 }).fadeIn('slow');
                            $('#msg-close').click(function () {
                                $('.form-front').css({ zIndex: 1 }).fadeIn('slow');
                                $('.form-back').css({ zIndex: 0 }).fadeOut('slow');
                            });
                        }
                        if (validationIndicator != null)
                            validationIndicator.html(validationResult).css({ display: 'block' });
                        else {
                            alert(validationResult);
                        }
                        setTimeout(function () {
                            $('#validation-list li').each(function () {
                                var controlId = $(this).attr('id').replace('v-', '');
                                $('#' + controlId).addClass('invalid');
                                //$('#' + controlId).val($(this).html());
                            })
                        }, 500);
                        $('#validation-list li').bind('click', function () {
                            $('#msg-close').click();
                        });
                        return false;
                    }
                    else {
                        //add animate classe
                        var w = parseFloat($(this).outerWidth());
                        $(this).addClass('animate');
                        $(this).data('text', $(this).val());
                        $(this).val(settings.sendingText);
                    }
                    return false;
                });
            }
            function validate() {
                $(settings.fields).each(function () {
                    var control = $('#' + this.id);
                    control.removeClass('invalid');
                    if (this.required != undefined && this.required) {
                        if (control.val() == '' || control.val() == control.attr('placeholder')) {
                            isValid = false;
                            if (this.requiredMsg != undefined)
                                validationResult += '<li id="v-' + this.id + '">' + this.requiredMsg + '</li>';
                        }
                    }
                    if (this.validate != undefined && this.validate) {
                        isValid = validatePassWord(this, control);
                        if (!isValid && this.msg != undefined)
                            validationResult += '<li id="v-' + this.id + '">' + this.msg + '</li>';
                    }
                    if (this.validate != undefined && this.validate) {
                        isValid = validateUserName(this, control);
                        if (!isValid && this.msg != undefined)
                            validationResult += '<li id="v-' + this.id + '">' + this.msg + '</li>';
                    }
                });
            }
            function validatePassWord(password) {
                var regExp = /^(\w){6,20}$/; if (!regExp.test(password)) { return false; }
                return true;
            }
            function validateUserName(username) {
                var regExp = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/; if (!regExp.test(username)) { return false; }
                return true;
            }
        });
    }
    });
})(jQuery);