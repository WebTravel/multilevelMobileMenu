//version 0.1 - рефакторинг, изменение стилей, сброс ненужных классов ul, li, a
//version 0.1.1 - рефакторинг, изменение стилей, сброс ненужных классов em
//version 0.1.2 - отображение текста названия раздела вместо кнопки "Назад"
//version 0.1.3 - сброс всех аттрибутов, кроме class="multilevelMenu" при ширине менее 1024px
//version 1.0 - преобразование всего меню в плагин
//version 1.0.1 - добавление стрелки (arrow) и кнопки "Назад" (back) только после перехода на необходимую ширину
//version 1.1 - добавление touch событий. На swipe меню выдвигается
//version 1.1.1 - глобальное изменение стилей
//version 1.2 - рефакторинг, приведение к ООП стилю.

; (function ($, window, document) {

  //defaults value
  var defaults = {
    'width' : 1024,
    'next' : '<span class="arrow">&rsaquo;</span>',
    'prev' : '<span class="back-arrow">&lsaquo;</span>'
  };

  function MultiMenu (element, options) {
    //vars block
    this.options = $.extend({}, defaults, options);
    this.element = element;
    this.init();
  }

  //call init function
  MultiMenu.prototype.init = function () {

        var self = this,
          element = this.element,
          attrId = element.attr('id'),
          attrClass = element.attr('class'),
          menuEnabled = false;


        //add Overlay
        $('body').append('<div class="multilevelOverlay js-overlay"></div>');

        //create animate-menu function
        function openMenu() {
          $('body').toggleClass('bodyFixed');
          setTimeout(function() {
            $('.multilevelMenu ul').attr('class', '');
          }, 400);
        }


        //swipe function for open menu
        function SwipeOpenMenu() {
          //create swipe-selector
          if ($('.multilevelMenu').length > 0) {
            $('body').append('<span class="js-swipe"></span>');
            var touchstartX = 0,
                touchendX = 0;
            // open menu on tap swipe
            $('.js-swipe, .multilevelMenu').on('touchstart', function(e) {
              touchstartX = e.originalEvent.changedTouches[0].pageX;
            });

            $('.js-swipe').on('touchend', function (e) {
              touchendX = e.originalEvent.changedTouches[0].pageX;
              if (touchendX > touchstartX) {
                //call animate-menu function
                openMenu();
              }
            });

            //close menu left-swipe
            $('.multilevelMenu').on('touchend', function (e) {
              touchendX = e.originalEvent.changedTouches[0].pageX;
              if (touchendX < (touchstartX - 20)) {
                $('body').removeClass('bodyFixed');
                setTimeout(function () {
                  $('.multilevelMenu ul').attr('class', '');
                }, 400);
              }
            });

          } else {
            return false;
          }

        }


        //create work-menu function
        function mobileMenu() {

          var w = window.innerWidth ? window.innerWidth : $(window).width();

          if (w < self.options.width) {
            //remove attr
             if (!menuEnabled) {
                  menuEnabled = true;

                  element.removeAttr('id');
                  element.removeClass();
                  element.addClass('multilevelMenu');
                  //call swipe function
                  SwipeOpenMenu();
                  //add switch-button for children ul
                  var link = element.find('a');
                  link.append(function(indx, val) {
                    var out = '';
                    if($(this).parent('li').find('ul').length > 0) {
                      out = self.options.next;
                    }
                    return $(out).addClass('js-arrow');
                  });
                  //add back-button function
                  element.find('li').find('ul').prepend('<li class="back js-back"></li>');

                  //view next level menu
                  $(link).on("click", ".js-arrow", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).parents('ul').addClass('close-list');
                    $(this).closest('li').children('ul').addClass('active-menu');

                    var str = $(this).parents('a').text();
                    if (str.length > 0) {
                      str = str.substring(0, str.length - 1);
                    }
                    $(this).closest('li').find('li.back').text(str);
                    $('.js-back').append(self.options.prev);
                  });

                  //view prev level menu to click "back"
                  $('.js-back').click(function () {
                    $(this).closest('ul.close-list').removeClass('close-list');
                    $(this).closest('ul').addClass('hidden-menu');
                    var that = this;
                    setTimeout(function () {
                      $(that).closest('ul').removeClass('active-menu hidden-menu');
                    }, 400);
                  });

              }
          } else  {
             if (menuEnabled) {
                //return attr
                menuEnabled = false;
                element.attr('id', attrId);
                element.attr('class', attrClass);
                $('.js-arrow, .js-back, .js-swipe').detach();
              }

              $('body').removeClass('bodyFixed'); //remove fixedClass to body
              element.find('ul').removeClass();
            }
        }

        //call work-menu function
        mobileMenu();

        //remove attr resize
        $(window).resize(function () {
          //call work-menu function
          mobileMenu();
        });

        //animate menu function Call
        $('.js-toggle').add($('.js-overlay')).on("click", function () {
            //call animate-menu function
            openMenu();
        });

  };


  $.fn.mobileMenu = function (options) {
    new MultiMenu(this.first(), options);
    return this.first();
  };

})(jQuery, window, document);
